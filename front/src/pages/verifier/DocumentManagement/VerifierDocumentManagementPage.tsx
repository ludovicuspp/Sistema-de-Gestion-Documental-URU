import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { VerificationInbox } from "@/components/organisms/VerificationInbox";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import type { VerificationInboxItem } from "@/components/organisms/VerificationInbox";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { ApiError, clearSession } from "@/services/api/http";
import { recordsService, type DocumentDto, type FolderDto } from "@/services/api/recordsService";
import { catalogService, type DocumentTypeDto } from "@/services/api/catalogService";
import "./VerifierDocumentManagementPage.css";

const QUICK_RULES = [
  "Todo documento debe asociarse a un expediente existente.",
  "Formatos permitidos: PDF; tamaño ≤ 5 MB.",
  "Documento duplicado solicita confirmación para reemplazo.",
];

const toInboxItem = (folder: FolderDto): VerificationInboxItem => ({
  id: String(folder.id),
  name: folder.studentName,
  details: `${folder.studentCi} · ${folder.folderType} · ${folder.status}`,
  date: (folder.createdAt ?? "").slice(0, 10) || "—",
  missingCount: 0,
});

const toExpedientData = (folder: FolderDto): ExpedientSelectCardData => ({
  ci: folder.studentCi,
  tipo: folder.folderType,
  cargado: (folder.createdAt ?? "").slice(0, 10) || "—",
  ubicacion:
    [folder.shelf, folder.box, folder.rowNumber].filter((v): v is string => Boolean(v)).join(" / ") ||
    "—",
});

/**
 * VerifierDocumentManagementPage - Page (Verifier)
 *
 * Document management view for Verifier role: verification inbox, expedient selection,
 * documents list with viewer, and document upload. Same structure as admin but without
 * DocumentTypesCard (types management is admin-only; types are read-only here).
 * Datos reales: records-service (carpetas/documentos) y catalog-service (tipos de documento).
 */
export const VerifierDocumentManagementPage = () => {
  const navigate = useNavigate();
  const [inboxFolders, setInboxFolders] = useState<FolderDto[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderDto | null>(null);
  const [rawDocs, setRawDocs] = useState<DocumentDto[]>([]);
  const [docTypes, setDocTypes] = useState<DocumentTypeDto[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{ id: string; fileName: string } | null>(null);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [confirmDeleteDocOpen, setConfirmDeleteDocOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [verificationSearch, setVerificationSearch] = useState("");
  const [ciResults, setCiResults] = useState<FolderDto[]>([]);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const unauthorized = useCallback(() => {
    clearSession();
    navigate("/");
  }, [navigate]);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
  }, []);

  const showApiError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          unauthorized();
          return;
        }
        showError(err.message);
      } else {
        showError(fallback);
      }
    },
    [unauthorized, showError],
  );

  const refreshFolderDetail = useCallback(
    async (id: number) => {
      try {
        const [detail, docs] = await Promise.all([
          recordsService.get(id),
          recordsService.listDocuments(id),
        ]);
        setSelectedFolder(detail);
        setRawDocs(docs);
      } catch (err) {
        showApiError(err, "No se pudo cargar el expediente.");
      }
    },
    [showApiError],
  );

  const selectFolder = useCallback(
    (folder: FolderDto) => {
      setSelectedFolder(folder);
      setRawDocs([]);
      setViewingDocument(null);
      void refreshFolderDetail(folder.id);
    },
    [refreshFolderDetail],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [folders, types] = await Promise.all([
          recordsService.list({ status: "PENDIENTE" }),
          catalogService.documentTypes(),
        ]);
        if (cancelled) return;
        setInboxFolders(folders);
        setDocTypes(types);
        if (folders.length > 0) selectFolder(folders[0]);
      } catch (err) {
        if (!cancelled) showApiError(err, "No se pudieron cargar los datos.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectFolder, showApiError]);

  useEffect(() => {
    const q = verificationSearch.trim();
    if (!q) {
      setCiResults([]);
      return;
    }
    let cancelled = false;
    const timer = globalThis.setTimeout(() => {
      void recordsService
        .list({ ci: q })
        .then((found) => {
          if (!cancelled) setCiResults(found);
        })
        .catch((err: unknown) => {
          if (!cancelled && err instanceof ApiError && err.status === 401) unauthorized();
        });
    }, 300);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timer);
    };
  }, [verificationSearch, unauthorized]);

  const docTypeById = useMemo(() => new Map(docTypes.map((t) => [t.id, t])), [docTypes]);

  const documents: ExpedientDocumentItem[] = useMemo(
    () =>
      rawDocs.map((d) => ({
        id: String(d.id),
        type: docTypeById.get(d.documentTypeId ?? -1)?.name ?? "Documento",
        fileName: d.name,
        uploadedBy: "—",
        date: (d.createdAt ?? "").slice(0, 10) || "—",
        validationStatus: "pending" as const,
      })),
    [rawDocs, docTypeById],
  );

  const verificationItems = useMemo<VerificationInboxItem[]>(
    () => inboxFolders.map(toInboxItem),
    [inboxFolders],
  );

  const filteredVerificationItems = useMemo(() => {
    const q = verificationSearch.trim().toLowerCase();
    if (!q) return verificationItems;
    const base = verificationItems.filter(
      (v) => v.name.toLowerCase().includes(q) || v.details.toLowerCase().includes(q),
    );
    const seen = new Set(base.map((v) => v.id));
    const extra = ciResults.filter((f) => !seen.has(String(f.id))).map(toInboxItem);
    return [...base, ...extra];
  }, [verificationItems, verificationSearch, ciResults]);

  const documentTypesForSelect = useMemo(
    () => docTypes.map((t) => ({ value: String(t.id), label: t.name })),
    [docTypes],
  );

  const expedientData: ExpedientSelectCardData | null = useMemo(
    () => (selectedFolder ? toExpedientData(selectedFolder) : null),
    [selectedFolder],
  );

  const selectedExpedientLabel = selectedFolder
    ? `${selectedFolder.folderType} · ${selectedFolder.studentName}`
    : undefined;

  const generalStatus = selectedFolder && /APROB|VALID/i.test(selectedFolder.status ?? "")
    ? ("validated" as const)
    : ("pending" as const);

  const handleOpenVerification = useCallback(
    (id: string) => {
      const folder =
        inboxFolders.find((f) => String(f.id) === id) ??
        ciResults.find((f) => String(f.id) === id);
      if (folder) {
        selectFolder(folder);
        return;
      }
      const numeric = Number(id);
      if (Number.isFinite(numeric)) void refreshFolderDetail(numeric);
    },
    [inboxFolders, ciResults, selectFolder, refreshFolderDetail],
  );

  const handleLogout = useCallback(() => {
    clearSession();
    navigate("/");
  }, [navigate]);

  const handleViewDocument = useCallback(
    async (id: string) => {
      const doc = rawDocs.find((d) => d.id === Number(id));
      try {
        const blob = await recordsService.downloadDocument(Number(id));
        const url = URL.createObjectURL(blob);
        if (doc) setViewingDocument({ id, fileName: doc.name });
        globalThis.open(url, "_blank", "noopener");
        globalThis.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch (err) {
        showApiError(err, "El documento seleccionado no está disponible.");
      }
    },
    [rawDocs, showApiError],
  );

  const handleObservation = useCallback((id: string) => {
    console.log("Observación", id);
  }, []);

  const handleDeleteDocument = useCallback((id: string) => {
    setDeletingDocId(id);
    setConfirmDeleteDocOpen(true);
  }, []);

  const handleConfirmDeleteDocument = useCallback(async () => {
    if (!deletingDocId || !selectedFolder) {
      setConfirmDeleteDocOpen(false);
      setDeletingDocId(null);
      return;
    }
    try {
      await recordsService.deleteDocument(Number(deletingDocId));
      setRawDocs(await recordsService.listDocuments(selectedFolder.id));
      if (viewingDocument?.id === deletingDocId) setViewingDocument(null);
      setConfirmDeleteDocOpen(false);
      setDeletingDocId(null);
    } catch (err) {
      showApiError(err, "No se pudo eliminar el documento.");
    }
  }, [deletingDocId, selectedFolder, viewingDocument, showApiError]);

  const handleUpload = useCallback(
    async (file: File | null, typeId: string) => {
      if (!selectedFolder) {
        showError("Seleccione un expediente antes de subir documentos.");
        return;
      }
      if (!file) {
        showError("Seleccione un archivo antes de subir.");
        return;
      }
      if (typeId === "") {
        setUploadTypeError(true);
        showError("Seleccione el tipo de documento.");
        return;
      }
      try {
        await recordsService.uploadDocument(selectedFolder.id, file, Number(typeId));
        setRawDocs(await recordsService.listDocuments(selectedFolder.id));
      } catch (err) {
        showApiError(err, "No se pudo subir el documento.");
      }
    },
    [selectedFolder, showApiError, showError],
  );

  return (
    <DashboardTemplate
      currentView="Gestión de documentos"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFIER_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-document-management-page">
        <aside className="verifier-document-management-page__bandeja">
          <VerificationInbox
            title="Bandeja de verificación"
            pendingCount={verificationItems.length}
            approvedToday="—"
            avgValidationTime="—"
            items={filteredVerificationItems}
            onBack={() => {}}
            onSearch={setVerificationSearch}
            onFilterType={() => {}}
            onFilterUploader={() => {}}
            onExport={() => {}}
            onOpen={handleOpenVerification}
          />
        </aside>
        <div className="verifier-document-management-page__content">
          <div className="verifier-document-management-page__left">
          <ExpedientSelectCard
            title="Seleccione un expediente"
            expedient={expedientData}
            onMarkUrgent={() => {}}
          />
          <ExpedientDocumentsCard
            title="Documentos del expediente"
            generalStatus={generalStatus}
            documents={documents}
            viewingDocument={viewingDocument}
            onViewDocument={(id) => void handleViewDocument(id)}
            onObservation={handleObservation}
            onDeleteDocument={handleDeleteDocument}
          />
          </div>
          <div className="verifier-document-management-page__full">
            <UploadDocumentCard
            title="Subir documento"
            context="Asociar archivos a un expediente"
            selectedExpedientLabel={selectedExpedientLabel}
            documentTypes={documentTypesForSelect}
            selectedTypeId={selectedTypeId}
            selectedTypeError={uploadTypeError}
            quickRules={QUICK_RULES}
            quickRulesTitle="Reglas rápidas"
            onUpload={(file, typeId) => void handleUpload(file, typeId)}
            onTypeChange={(id) => {
              setSelectedTypeId(id);
              setUploadTypeError(false);
            }}
          />
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmDeleteDocOpen}
        onCancel={() => { setConfirmDeleteDocOpen(false); setDeletingDocId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar el documento?"
        onConfirm={() => void handleConfirmDeleteDocument()}
      />
      <AlertModal
        open={errorAlertOpen}
        type="error"
        title="Error"
        message={errorMessage}
        buttonLabel="Cerrar"
        onClose={() => setErrorAlertOpen(false)}
      />
    </DashboardTemplate>
  );
};
