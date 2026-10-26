import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Modal } from "@/components/molecules/Modal";
import { RecordFormModal } from "@/components/molecules/RecordFormModal";
import type { RecordFormData } from "@/components/molecules/RecordFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { CargarExpedientForm } from "@/components/molecules/CargarExpedientForm";
import type { CargarExpedientFormData } from "@/components/molecules/CargarExpedientForm";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordList } from "@/components/organisms/RecordList";
import type { RecordListItem } from "@/components/organisms/RecordList";
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
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantRecordManagementPage.css";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

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

export const AssistantRecordManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RecordStatusFilter>("pending");
  const [folders, setFolders] = useState<FolderDto[]>([]);
  const [docCounts, setDocCounts] = useState<Record<number, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [folder, setFolder] = useState<FolderDto | null>(null);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expedientModalOpen, setExpedientModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordDetailData | null>(null);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [studentNotFoundAlert, setStudentNotFoundAlert] = useState(false);
  const [showCargarExpedientModal, setShowCargarExpedientModal] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const params: { ci?: string; status?: string } = {};
      const ci = searchQuery.trim();
      if (ci) params.ci = ci;
      const status = FRONT_TO_BACK[activeFilter];
      if (status) params.status = status;
      const list = await recordsService.list(params);
      let counts: Record<number, number> = {};
      if (activeFilter === "without-documents") {
        const pairs = await Promise.all(
          list.map(async (f) => ({
            id: f.id,
            count: (await recordsService.listDocuments(f.id)).length,
          }))
        );
        counts = Object.fromEntries(pairs.map((p) => [p.id, p.count]));
        setFolders(list.filter((f) => (counts[f.id] ?? 0) === 0));
      } else {
        setFolders(list);
      }
      setDocCounts(counts);
      setSelectedId((prev) => {
        const visible = activeFilter === "without-documents"
          ? list.filter((f) => (counts[f.id] ?? 0) === 0)
          : list;
        const next = visible.some((f) => String(f.id) === prev) ? prev : (visible[0] ? String(visible[0].id) : null);
        if (visible.length === 0 && ci) setStudentNotFoundAlert(true);
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
    void loadDetail(Number(selectedId));
  }, [selectedId, loadDetail]);

  const recordListItems: RecordListItem[] = useMemo(
    () =>
      folders.map((f) => {
        const withoutDocs = activeFilter === "without-documents" || (docCounts[f.id] ?? -1) === 0;
        const frontStatus = toFrontStatus(f.status);
        return {
          id: String(f.id),
          name: f.studentName,
          ci: f.studentCi,
          recordType: f.folderType ?? "—",
          statusLabel: withoutDocs ? "Sin documentos" : (STATUS_LABELS[frontStatus] ?? "—"),
          statusType: (withoutDocs ? "without-documents" : frontStatus) as RecordListItem["statusType"],
        };
      }),
    [folders, activeFilter, docCounts]
  );

  const selectedRecord = folder ? toDetail(folder) : null;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);
  const handleFilterChange = useCallback((filter: RecordStatusFilter) => setActiveFilter(filter), []);
  const handleNewRecord = useCallback(() => setConfirmCreateOpen(true), []);

  const handleConfirmCreate = useCallback(() => {
    setConfirmCreateOpen(false);
    setEditingRecord(null);
    setExpedientModalOpen(true);
  }, []);

  const handleExpedientSubmit = useCallback(
    async (data: RecordFormData) => {
      try {
        if (editingRecord && selectedId != null) {
          await recordsService.update(Number(selectedId), parseLocation(data.recordLocation));
          setEditingRecord(null);
          await loadDetail(Number(selectedId));
        } else {
          const created = await recordsService.create({
            studentCi: data.studentCI.trim(),
            folderType: data.recordType,
            ...parseLocation(data.recordLocation),
          });
          await fetchList();
          setSelectedId(String(created.id));
        }
      } catch (err) {
        setEditingRecord(null);
        setError(errorMessage(err, navigate));
      }
    },
    [editingRecord, selectedId, fetchList, loadDetail, navigate]
  );
  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedId(null);
  }, []);
  const handleUpdateDocuments = useCallback(() => {
    if (selectedId != null) void loadDetail(Number(selectedId));
  }, [selectedId, loadDetail]);
  const handleUploadRecord = useCallback(() => setShowCargarExpedientModal(true), []);

  const handleCargarExpedientSubmit = useCallback(
    async (data: CargarExpedientFormData) => {
      if (selectedId == null) {
        setShowCargarExpedientModal(false);
        return;
      }
      try {
        if (data.file) {
          await recordsService.uploadDocument(Number(selectedId), data.file);
        }
        if (data.recordLocation) {
          await recordsService.update(Number(selectedId), parseLocation(data.recordLocation));
        }
        setShowCargarExpedientModal(false);
        await loadDetail(Number(selectedId));
      } catch (err) {
        setShowCargarExpedientModal(false);
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, loadDetail, navigate]
  );
  const handleCargarExpedientCancel = useCallback(() => setShowCargarExpedientModal(false), []);
  const handleEdit = useCallback(() => {
    if (selectedRecord) {
      setEditingRecord(selectedRecord);
      setExpedientModalOpen(true);
    }
  }, [selectedRecord]);
  const handleDelete = useCallback(() => setConfirmDeleteOpen(true), []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedId == null) {
      setConfirmDeleteOpen(false);
      return;
    }
    try {
      await recordsService.remove(Number(selectedId));
      setConfirmDeleteOpen(false);
      setSelectedId(null);
      await fetchList();
    } catch (err) {
      setConfirmDeleteOpen(false);
      setError(errorMessage(err, navigate));
    }
  }, [selectedId, fetchList, navigate]);
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
        await recordsService.addObservation(Number(selectedId), content.trim(), Number(id));
        await loadDetail(Number(selectedId));
      } catch (err) {
        setError(errorMessage(err, navigate));
      }
    },
    [selectedId, loadDetail, navigate]
  );
  const handleViewHistory = useCallback(() => {
    if (selectedId != null) void loadDetail(Number(selectedId));
  }, [selectedId, loadDetail]);

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      userRole="Asistente"
      userEmail="username@mail.co"
      headerHomePath="/assistant"
      onLogout={() => navigate("/")}
      onRefresh={handleRefresh}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-record-management-page">
        <div className="assistant-record-management-page__content">
          <div className="assistant-record-management-page__left">
            <div className="assistant-record-management-page__search">
              <RecordSearchCard
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onNewRecord={handleNewRecord}
              />
            </div>
            <div className="assistant-record-management-page__list">
              <RecordList
                title="Expedientes"
                records={recordListItems}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div className="assistant-record-management-page__detail">
              <RecordDetailCard
                record={selectedRecord}
                onUploadRecord={handleUploadRecord}
                onUpdateDocuments={handleUpdateDocuments}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showUpdateDocuments={false}
                showEditDelete={false}
              />
            </div>
            <div className="assistant-record-management-page__documents">
              <RecordDocumentsList
                title="Documentos"
                documents={selectedRecord ? documents.map(docToItem) : []}
                onViewDocument={handleViewDocument}
                onObservation={handleDocumentObservation}
                showObservation={false}
              />
            </div>
          </div>
          <div className="assistant-record-management-page__right">
            <div className="assistant-record-management-page__observations">
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
          setEditingRecord(null);
        }}
        record={editingRecord}
        onSubmit={handleExpedientSubmit}
      />
      <ConfirmModal
        open={confirmCreateOpen}
        onCancel={() => setConfirmCreateOpen(false)}
        label="Crear expediente"
        message="¿Desea crear un expediente?"
        onConfirm={handleConfirmCreate}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        label="Eliminar"
        message="¿Seguro que desea eliminar el expediente?"
        onConfirm={handleConfirmDelete}
      />
      <AlertModal
        open={studentNotFoundAlert}
        type="warning"
        title="Estudiante no registrado"
        message="No se encontró el estudiante al procesar la solicitud."
        buttonLabel="Cerrar"
        onClose={() => setStudentNotFoundAlert(false)}
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
