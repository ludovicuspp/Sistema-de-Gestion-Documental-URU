import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Modal } from "@/components/molecules/Modal";
import { RecordFormModal } from "@/components/molecules/RecordFormModal";
import type { RecordFormData } from "@/components/molecules/RecordFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { CargarExpedientForm } from "@/components/molecules/CargarExpedientForm";
import type { CargarExpedientFormData } from "@/components/molecules/CargarExpedientForm";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
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
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierRecordManagementPage.css";

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
 * VerifierRecordManagementPage - Page (Verifier)
 *
 * Gestión de expedientes para el rol Verificador: buscar estudiante, ver detalle
 * del record, documentos y observaciones. Misma estructura que la vista de admin.
 */
export const VerifierRecordManagementPage = () => {
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
  const [showCargarExpedientModal, setShowCargarExpedientModal] = useState(false);
  const [verifyObservations, setVerifyObservations] = useState("");

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

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedId(null);
  }, []);

  const handleUpdateDocuments = useCallback(() => {
    if (selectedId != null) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const handleUploadRecord = useCallback(() => {
    setShowCargarExpedientModal(true);
  }, []);

  const handleCargarExpedientSubmit = useCallback(
    async (data: CargarExpedientFormData) => {
      if (selectedId == null) {
        setShowCargarExpedientModal(false);
        return;
      }
      try {
        if (data.file) {
          await recordsService.uploadDocument(selectedId, data.file);
        }
        if (data.recordLocation) {
          await recordsService.update(selectedId, parseLocation(data.recordLocation));
        }
        setShowCargarExpedientModal(false);
        await loadDetail(selectedId);
      } catch (err) {
        setShowCargarExpedientModal(false);
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, loadDetail, navigate]
  );

  const handleCargarExpedientCancel = useCallback(() => {
    setShowCargarExpedientModal(false);
  }, []);

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

  const handleVerify = useCallback(
    async (approved: boolean) => {
      if (selectedId == null) return;
      const observations = verifyObservations.trim();
      if (!approved && !observations) {
        setError("Las observaciones son obligatorias para rechazar el expediente.");
        return;
      }
      if (approved && documents.length === 0) {
        setError("El expediente debe tener al menos 1 documento para ser aprobado.");
        return;
      }
      try {
        await recordsService.verify(selectedId, approved, observations || undefined);
        setVerifyObservations("");
        await loadDetail(selectedId);
        await fetchList();
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, verifyObservations, documents.length, loadDetail, fetchList, navigate]
  );

  const handleAddObservation = useCallback(async () => {
    if (selectedId == null) return;
    const content = verifyObservations.trim();
    if (!content) {
      setError("Escriba el contenido de la observación antes de agregarla.");
      return;
    }
    try {
      await recordsService.addObservation(selectedId, content);
      setVerifyObservations("");
      await loadDetail(selectedId);
    } catch (err) {
      setError(errorMessage(err, navigate));
    }
  }, [selectedId, verifyObservations, loadDetail, navigate]);

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

  const handleDocumentObservation = useCallback(
    async (id: string) => {
      if (selectedId == null) return;
      const content = window.prompt("Observación del documento:");
      if (!content || !content.trim()) return;
      try {
        await recordsService.addObservation(selectedId, content.trim(), Number(id));
        await loadDetail(selectedId);
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, loadDetail, navigate]
  );

  const handleViewHistory = useCallback(() => {
    if (selectedId != null) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={handleRefresh}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFIER_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-record-management-page">
        <div className="verifier-record-management-page__content">
          <div className="verifier-record-management-page__left">
            <div className="verifier-record-management-page__search">
              <RecordSearchCard
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onNewRecord={handleNewRecord}
              />
            </div>
            <div className="verifier-record-management-page__detail">
              <RecordDetailCard
                record={selectedRecord}
                onUpdateDocuments={handleUpdateDocuments}
                onUploadRecord={handleUploadRecord}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            {selectedRecord && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Input
                  placeholder="Observaciones de verificación (obligatorias para rechazar)"
                  value={verifyObservations}
                  onChange={(e) => setVerifyObservations(e.target.value)}
                  fullWidth
                />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button variant="primary" size="small" onClick={() => void handleVerify(true)}>
                    Aprobar
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => void handleVerify(false)}>
                    Rechazar
                  </Button>
                  <Button variant="outline" size="small" onClick={() => void handleAddObservation()}>
                    Agregar observación
                  </Button>
                </div>
              </div>
            )}
            <div className="verifier-record-management-page__documents">
              <RecordDocumentsList
                title="Documentos"
                documents={selectedRecord ? documents.map(docToItem) : []}
                onViewDocument={handleViewDocument}
                onObservation={handleDocumentObservation}
              />
            </div>
          </div>
          <div className="verifier-record-management-page__right">
            <div className="verifier-record-management-page__observations">
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
        open={error !== null}
        type="error"
        title="Error"
        message={error ?? ""}
        buttonLabel="Cerrar"
        onClose={() => setError(null)}
      />
      <Modal
        open={showCargarExpedientModal}
        onClose={handleCargarExpedientCancel}
        title="Cargar expediente"
        size="md"
      >
        <CargarExpedientForm
          onSubmit={handleCargarExpedientSubmit}
          onCancel={handleCargarExpedientCancel}
        />
      </Modal>
    </DashboardTemplate>
  );
};
