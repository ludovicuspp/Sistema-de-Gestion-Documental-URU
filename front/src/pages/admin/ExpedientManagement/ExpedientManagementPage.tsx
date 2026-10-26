import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Modal } from "@/components/molecules/Modal";
import { NewExpedientForm } from "@/components/molecules/NewExpedientForm";
import type { NewExpedientFormData } from "@/components/molecules/NewExpedientForm";
import { Button } from "@/components/atoms/Button";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ExpedientSearchCard } from "@/components/organisms/ExpedientSearchCard";
import { ExpedientDetailCard } from "@/components/organisms/ExpedientDetailCard";
import { ExpedientDocumentsList } from "@/components/organisms/ExpedientDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { recordsService } from "@/services/api/recordsService";
import type {
  DocumentDto,
  FolderDto,
  HistoryDto,
  ObservationDto,
} from "@/services/api/recordsService";
import { ApiError, clearSession } from "@/services/api/http";
import type { ExpedientStatusFilter } from "@/components/organisms/ExpedientSearchCard";
import type { ExpedientDetailData } from "@/components/organisms/ExpedientDetailCard";
import type { ExpedientDocumentListItem } from "@/components/organisms/ExpedientDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import "./ExpedientManagementPage.css";

const FRONT_TO_BACK: Record<ExpedientStatusFilter, string | undefined> = {
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

const docToItem = (doc: DocumentDto): ExpedientDocumentListItem => ({
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

const toDetail = (folder: FolderDto): ExpedientDetailData => ({
  studentId: String(folder.id),
  studentName: folder.studentName,
  studentCI: folder.studentCi,
  expedientType: folder.folderType,
  expedientCreatedDate: folder.createdAt.slice(0, 10),
  expedientLocation: locationOf(folder),
  expedientStatus: toFrontStatus(folder.status),
});

/**
 * ExpedientManagementPage - Page
 *
 * Expedient management view: search students, view expedient details, documents, and observations.
 * Based on StudentManagementPage layout.
 */
export const ExpedientManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ExpedientStatusFilter>("pending");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [folder, setFolder] = useState<FolderDto | null>(null);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
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
      setSelectedId((prev) => (list.some((f) => f.id === prev) ? prev : (list[0]?.id ?? null)));
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

  const selectedExpedient = folder ? toDetail(folder) : null;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((filter: ExpedientStatusFilter) => {
    setActiveFilter(filter);
  }, []);

  const handleNewExpedient = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCreateSubmit = useCallback(
    async (data: NewExpedientFormData) => {
      try {
        const created = await recordsService.create({
          studentCi: data.studentCI,
          folderType: data.recordType,
          ...parseLocation(data.recordLocation),
        });
        setCreateModalOpen(false);
        await fetchList();
        setSelectedId(created.id);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [fetchList, navigate]
  );

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedId(null);
  }, []);

  const handleUpdateDocuments = useCallback(() => {
    if (selectedId != null) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const handleUploadExpedient = useCallback(() => {
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
    if (selectedId == null || !folder) return;
    setEditModalOpen(true);
  }, [selectedId, folder]);

  const handleEditSubmit = useCallback(
    async (data: NewExpedientFormData) => {
      if (selectedId == null) return;
      try {
        await recordsService.update(selectedId, {
          description: folder?.description ?? undefined,
          ...parseLocation(data.recordLocation),
        });
        setEditModalOpen(false);
        await loadDetail(selectedId);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, folder, loadDetail, navigate]
  );

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

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      onCreateUser={handleNewExpedient}
      onRefresh={handleRefresh}
    >
      <div className="expedient-management-page">
        <div className="expedient-management-page__top">
          <ExpedientSearchCard
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onNewExpedient={handleNewExpedient}
          />
        </div>
        <div className="expedient-management-page__content">
          <div className="expedient-management-page__left">
            <div className="expedient-management-page__detail">
              <ExpedientDetailCard
                expedient={selectedExpedient}
                onUpdateDocuments={handleUpdateDocuments}
                onUploadExpedient={handleUploadExpedient}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="expedient-management-page__documents">
              <ExpedientDocumentsList
                title="Documentos"
                documents={selectedExpedient ? documents.map(docToItem) : []}
                onViewDocument={handleViewDocument}
                onObservation={handleDocumentObservation}
              />
            </div>
          </div>
          <div className="expedient-management-page__right">
            <RecentActivity
              title="Observaciones"
              linkText="Ver historial"
              entries={selectedExpedient ? entries : []}
              onViewAll={handleViewHistory}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        label="Eliminar"
        message="¿Seguro que desea eliminar el expediente?"
        onConfirm={handleConfirmDelete}
      />
      <AlertModal
        open={error !== null}
        type="error"
        title="Error"
        message={error ?? ""}
        buttonLabel="Cerrar"
        onClose={() => setError(null)}
      />
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        variant="form"
        label="Nuevo expediente"
        size="md"
      >
        <NewExpedientForm
          onSubmit={(data) => void handleCreateSubmit(data)}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>
      {folder && (
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          variant="form"
          label="Editar ubicación"
          size="md"
        >
          <NewExpedientForm
            key={folder.id}
            initial={{
              studentCI: folder.studentCi,
              studentName: folder.studentName,
              recordType: folder.folderType,
              recordLocation: locationOf(folder),
            }}
            onSubmit={(data) => void handleEditSubmit(data)}
            onCancel={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
      <Modal
        open={observationModalOpen}
        onClose={() => setObservationModalOpen(false)}
        variant="form"
        label="Agregar observación"
        size="md"
      >
        <div className="expedient-management-page__observation">
          <textarea
            className="expedient-management-page__observation-input"
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
