import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { Modal } from "@/components/molecules/Modal";
import { RecordFormModal } from "@/components/molecules/RecordFormModal";
import type { RecordFormData } from "@/components/molecules/RecordFormModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
import { RecordDocumentsList } from "@/components/organisms/RecordDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { recordsService } from "@/services/api/recordsService";
import type {
  DocumentDto,
  FolderDto,
  HistoryDto,
  ObservationDto,
} from "@/services/api/recordsService";
import { ApiError, clearSession } from "@/services/api/http";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { RecordDocumentListItem } from "@/components/organisms/RecordDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import "./RecordManagementPage.css";

const FRONT_TO_BACK: Record<RecordStatusFilter, string | undefined> = {
  pending: "PENDIENTE",
  approved: "APROBADO",
  rejected: "RECHAZADO",
  "without-documents": undefined,
};

const toFrontStatus = (status: string): "pending" | "approved" | "rejected" =>
  status === "APROBADO" ? "approved" : status === "RECHAZADO" ? "rejected" : "pending";

const errorMessage = (err: unknown, navigate: (path: string) => void): string => {
  if (err instanceof ApiError && err.status === 401) {
    clearSession();
    navigate("/");
  }
  return err instanceof Error ? err.message : "Error inesperado";
};

const locationOf = (folder: FolderDto): string | undefined => {
  const location = [folder.shelf, folder.box, folder.rowNumber].filter(Boolean).join(" / ");
  return location || undefined;
};

const parseLocation = (location?: string): { shelf?: string; box?: string; rowNumber?: string } => {
  if (!location) return {};
  const parts = location
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
  return { shelf: parts[0], box: parts[1], rowNumber: parts[2] };
};

const formatSize = (size?: number | null): string => {
  if (size == null) return "—";
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const docToItem = (doc: DocumentDto): RecordDocumentListItem => ({
  id: String(doc.id),
  type: doc.name,
  fileName: doc.name,
  fileSize: formatSize(doc.size),
});

const observationToEntry = (obs: ObservationDto): ActivityEntry => ({
  text: obs.content,
  datetime: [obs.createdAt, obs.authorName].filter(Boolean).join(" · "),
});

const historyToEntry = (h: HistoryDto): ActivityEntry => ({
  text: h.detail ? `${h.action} — ${h.detail}` : h.action,
  datetime: [h.createdAt, h.userName].filter(Boolean).join(" · "),
});

const toDetail = (folder: FolderDto): RecordDetailData => ({
  studentId: String(folder.id),
  studentName: folder.studentName,
  studentCI: folder.studentCi,
  recordType: folder.folderType,
  recordCreatedDate: folder.createdAt.slice(0, 10),
  recordLocation: locationOf(folder),
  recordStatus: toFrontStatus(folder.status),
});

/**
 * RecordManagementPage - Page
 *
 * Record management view: search students, view record details, documents, and observations.
 * Based on StudentManagementPage layout.
 */
export const RecordManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RecordStatusFilter>("pending");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [folder, setFolder] = useState<FolderDto | null>(null);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expedientModalOpen, setExpedientModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [noRecordAlert, setNoRecordAlert] = useState(false);
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [observationDocumentId, setObservationDocumentId] = useState<number | null>(null);
  const [observationText, setObservationText] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const params: { ci?: string; status?: string } = {};
      const ci = searchQuery.trim();
      if (ci) params.ci = ci;
      const status = FRONT_TO_BACK[activeFilter];
      if (status) params.status = status;
      let list = await recordsService.list(params);
      if (activeFilter === "without-documents") {
        const counts = await Promise.all(
          list.map(async (f) => ({
            id: f.id,
            count: (await recordsService.listDocuments(f.id)).length,
          }))
        );
        const empty = new Set(counts.filter((c) => c.count === 0).map((c) => c.id));
        list = list.filter((f) => empty.has(f.id));
      }
      setSelectedId((prev) => {
        const next = list.some((f) => f.id === prev) ? prev : (list[0]?.id ?? null);
        if (list.length === 0 && ci) setNoRecordAlert(true);
        return next;
      });
    } catch (err) {
      setError(errorMessage(err, navigate));
    }
  }, [searchQuery, activeFilter, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchList();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [fetchList]);

  const loadDetail = useCallback(
    async (folderId: number) => {
      try {
        const [detail, docs, observations, history] = await Promise.all([
          recordsService.get(folderId),
          recordsService.listDocuments(folderId),
          recordsService.listObservations(folderId),
          recordsService.listHistory(folderId),
        ]);
        setFolder(detail);
        setDocuments(docs);
        setEntries([...observations.map(observationToEntry), ...history.map(historyToEntry)]);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (selectedId == null) {
      setFolder(null);
      setDocuments([]);
      setEntries([]);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const selectedRecord = folder ? toDetail(folder) : null;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((filter: RecordStatusFilter) => {
    setActiveFilter(filter);
  }, []);

  const handleNewRecord = useCallback(() => {
    setConfirmCreateOpen(true);
  }, []);

  const handleConfirmCreate = useCallback(() => {
    setEditingId(null);
    setConfirmCreateOpen(false);
    setExpedientModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedId(null);
  }, []);

  const handleUpdateDocuments = useCallback(() => {
    if (selectedId != null) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const handleUploadRecord = useCallback(() => {
    if (selectedId == null) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,application/pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await recordsService.uploadDocument(selectedId, file);
        await loadDetail(selectedId);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    };
    input.click();
  }, [selectedId, loadDetail, navigate]);

  const handleEdit = useCallback(() => {
    if (selectedId != null) {
      setEditingId(selectedId);
      setExpedientModalOpen(true);
    }
  }, [selectedId]);

  const handleDelete = useCallback(() => {
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedId == null) {
      setConfirmDeleteOpen(false);
      return;
    }
    try {
      await recordsService.remove(selectedId);
      setConfirmDeleteOpen(false);
      setSelectedId(null);
    } catch (err) {
      setConfirmDeleteOpen(false);
      setError(errorMessage(err, navigate));
    }
  }, [selectedId, navigate]);

  const handleViewDocument = useCallback(
    async (id: string) => {
      try {
        const blob = await recordsService.downloadDocument(Number(id));
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [navigate]
  );

  const handleDocumentObservation = useCallback((id: string) => {
    if (selectedId == null) return;
    setObservationDocumentId(Number(id));
    setObservationText("");
    setObservationModalOpen(true);
  }, [selectedId]);

  const handleObservationSubmit = useCallback(async () => {
    if (selectedId == null || observationDocumentId == null) return;
    if (!observationText.trim()) return;
    try {
      await recordsService.addObservation(selectedId, observationText.trim(), observationDocumentId);
      setObservationModalOpen(false);
      setObservationDocumentId(null);
      setObservationText("");
      await loadDetail(selectedId);
    } catch (err) {
      setError(errorMessage(err, navigate));
    }
  }, [selectedId, observationDocumentId, observationText, loadDetail, navigate]);

  const handleViewHistory = useCallback(() => {
    if (selectedId != null) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const handleExpedientSubmit = useCallback(
    async (data: RecordFormData) => {
      try {
        if (editingId != null) {
          await recordsService.update(editingId, parseLocation(data.recordLocation));
          setEditingId(null);
          await loadDetail(editingId);
        } else {
          const created = await recordsService.create({
            studentCi: data.studentCI.trim(),
            folderType: data.recordType,
            ...parseLocation(data.recordLocation),
          });
          await fetchList();
          setSelectedId(created.id);
        }
      } catch (err) {
        setEditingId(null);
        setError(errorMessage(err, navigate));
      }
    },
    [editingId, fetchList, loadDetail, navigate]
  );

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      userRole="Administrador"
      userEmail="username@mail.co"
      headerHomePath="/admin"
      onLogout={() => navigate("/")}
      onCreateUser={handleNewRecord}
      onRefresh={handleRefresh}
      onPrivacyClick={() => {}}
    >
      <div className="record-management-page">
        <div className="record-management-page__content">
          <div className="record-management-page__left">
            <div className="record-management-page__search">
              <RecordSearchCard
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onNewRecord={handleNewRecord}
              />
            </div>
            <div className="record-management-page__detail">
              <RecordDetailCard
                record={selectedRecord}
                onUpdateDocuments={handleUpdateDocuments}
                onUploadRecord={handleUploadRecord}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="record-management-page__documents">
              <RecordDocumentsList
                title="Documentos"
                documents={selectedRecord ? documents.map(docToItem) : []}
                onViewDocument={handleViewDocument}
                onObservation={handleDocumentObservation}
              />
            </div>
          </div>
          <div className="record-management-page__right">
            <div className="record-management-page__observations">
              <RecentActivity
                title="Observaciones"
                linkText="Ver historial"
                entries={selectedRecord ? entries : []}
                onViewAll={handleViewHistory}
              />
            </div>
          </div>
        </div>
      </div>
      <RecordFormModal
        open={expedientModalOpen}
        onClose={() => {
          setExpedientModalOpen(false);
          setEditingId(null);
        }}
        record={editingId != null ? selectedRecord : null}
        onSubmit={handleExpedientSubmit}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={handleConfirmDelete}
      />
      <ConfirmModal
        open={confirmCreateOpen}
        onCancel={() => setConfirmCreateOpen(false)}
        label="Crear expediente"
        message="¿Desea crear un expediente?"
        onConfirm={handleConfirmCreate}
      />
      <AlertModal
        open={noRecordAlert}
        type="warning"
        title="Sin expediente asociado"
        message="El estudiante no posee expedientes en el sistema."
        buttonLabel="Cerrar"
        onClose={() => setNoRecordAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setNoRecordAlert(false);
              handleNewRecord();
            }}
          >
            Crear expediente
          </Button>
        }
      >
        <p style={{ marginTop: "0.75rem", marginBottom: "0.25rem", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
          Opciones disponibles:
        </p>
        <ul className="alert-modal__list">
          <li>Crear expediente nuevo</li>
          <li>Buscar por otro identificador</li>
        </ul>
      </AlertModal>
      <AlertModal
        open={error !== null}
        type="error"
        title="Error"
        message={error ?? ""}
        buttonLabel="Cerrar"
        onClose={() => setError(null)}
      />
      <Modal
        open={observationModalOpen}
        onClose={() => setObservationModalOpen(false)}
        variant="form"
        label="Agregar observación"
        size="md"
      >
        <div className="record-management-page__observation">
          <textarea
            className="record-management-page__observation-input"
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            placeholder="Escriba la observación del documento"
            rows={4}
          />
          <Button
            variant="primary"
            size="medium"
            onClick={() => void handleObservationSubmit()}
          >
            Guardar observación
          </Button>
        </div>
      </Modal>
    </DashboardTemplate>
  );
};
