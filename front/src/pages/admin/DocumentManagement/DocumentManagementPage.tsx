import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { VerificationInbox } from "@/components/organisms/VerificationInbox";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { DocumentTypesCard } from "@/components/organisms/DocumentTypesCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import type { VerificationInboxItem } from "@/components/organisms/VerificationInbox";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import { DocumentTypeFormModal } from "@/components/molecules/DocumentTypeFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Pagination } from "@/components/molecules/Pagination";
import { Button } from "@/components/atoms/Button";
import type { DocumentTypeItem } from "@/components/organisms/DocumentTypesCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { ApiError, clearSession } from "@/services/api/http";
import { usePagedList } from "@/hooks/usePagedList";
import { recordsService, type DocumentDto, type FolderDto } from "@/services/api/recordsService";
import { catalogService, type DocumentTypeDto, type OptionDto } from "@/services/api/catalogService";
import "./DocumentManagementPage.css";

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
 * DocumentManagementPage - Page
 *
 * Document management view: verification inbox, expedient selection, document types, documents list and upload.
 * Datos reales: records-service (carpetas/documentos) y catalog-service (tipos de documento).
 */
export const DocumentManagementPage = () => {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<FolderDto | null>(null);
  const [rawDocs, setRawDocs] = useState<DocumentDto[]>([]);
  const [docTypes, setDocTypes] = useState<DocumentTypeDto[]>([]);
  const [academicLevels, setAcademicLevels] = useState<OptionDto[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{ id: string; fileName: string } | null>(null);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [verificationSearch, setVerificationSearch] = useState("");
  const [ciResults, setCiResults] = useState<FolderDto[]>([]);
  const [documentTypeModalOpen, setDocumentTypeModalOpen] = useState(false);
  const [editingDocumentType, setEditingDocumentType] = useState<DocumentTypeItem | null>(null);
  const [confirmDeleteTypeOpen, setConfirmDeleteTypeOpen] = useState(false);
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null);
  const [confirmDeleteDocOpen, setConfirmDeleteDocOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [documentNotAvailableAlert, setDocumentNotAvailableAlert] = useState(false);
  const [documentNotAvailableMessage, setDocumentNotAvailableMessage] = useState(
    "El documento seleccionado no esta disponible",
  );

  const [saveErrorAlert, setSaveErrorAlert] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState(
    "Ocurrió un error al guardar en la base de datos.",
  );
  const [incompleteDataAlert2, setIncompleteDataAlert2] = useState(false);
  const [incompleteDataMessage, setIncompleteDataMessage] = useState(
    "Rellena toda la información requerida",
  );
  const [duplicateDocTypeAlert, setDuplicateDocTypeAlert] = useState(false);
  const [duplicateDocTypeMessage, setDuplicateDocTypeMessage] = useState(
    "Se encontró un tipo de documento con el mismo nombre",
  );
  const [recordNotFoundAlert2, setRecordNotFoundAlert2] = useState(false);
  const [recordNotFoundMessage, setRecordNotFoundMessage] = useState("No existe el expediente indicado.");
  const [formatNotAllowedAlert, setFormatNotAllowedAlert] = useState(false);
  const [formatNotAllowedMessage, setFormatNotAllowedMessage] = useState(
    "Solo se permiten PDF, JPG y PNG.",
  );
  const [fileSizeExceededAlert, setFileSizeExceededAlert] = useState(false);
  const [fileSizeExceededMessage, setFileSizeExceededMessage] = useState(
    "El archivo supera el límite permitido. Ejemplo: límite 10 MB por archivo.",
  );
  const [duplicateDocumentAlert, setDuplicateDocumentAlert] = useState(false);
  const [duplicateDocumentMessage, setDuplicateDocumentMessage] = useState(
    "Se encontró un documento del mismo tipo. ¿Deseas reemplazarlo?",
  );

  const unauthorized = useCallback(() => {
    clearSession();
    navigate("/");
  }, [navigate]);

  const showSaveError = useCallback((message: string) => {
    setSaveErrorMessage(message);
    setSaveErrorAlert(true);
  }, []);
  const showIncomplete = useCallback((message: string) => {
    setIncompleteDataMessage(message);
    setIncompleteDataAlert2(true);
  }, []);
  const showDuplicateType = useCallback((message: string) => {
    setDuplicateDocTypeMessage(message);
    setDuplicateDocTypeAlert(true);
  }, []);
  const showRecordNotFound = useCallback((message: string) => {
    setRecordNotFoundMessage(message);
    setRecordNotFoundAlert2(true);
  }, []);
  const showFormatError = useCallback((message: string) => {
    setFormatNotAllowedMessage(message);
    setFormatNotAllowedAlert(true);
  }, []);
  const showFileSizeError = useCallback((message: string) => {
    setFileSizeExceededMessage(message);
    setFileSizeExceededAlert(true);
  }, []);
  const showDuplicateDoc = useCallback((message: string) => {
    setDuplicateDocumentMessage(message);
    setDuplicateDocumentAlert(true);
  }, []);
  const showDocNotAvailable = useCallback((message: string) => {
    setDocumentNotAvailableMessage(message);
    setDocumentNotAvailableAlert(true);
  }, []);

  const showApiError = useCallback(
    (err: unknown, show: (message: string) => void, fallback: string) => {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          unauthorized();
          return;
        }
        show(err.message);
      } else {
        show(fallback);
      }
    },
    [unauthorized],
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
        if (err instanceof ApiError && err.status === 404) {
          showRecordNotFound(err.message);
          return;
        }
        showApiError(err, showSaveError, "No se pudo cargar el expediente.");
      }
    },
    [showApiError, showRecordNotFound, showSaveError],
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

  const handleInboxError = useCallback(
    (err: unknown) => {
      showApiError(err, showSaveError, "No se pudo cargar la bandeja.");
    },
    [showApiError, showSaveError]
  );

  const loadInboxPage = useCallback(
    (page: number, size: number) => recordsService.list({ status: "PENDIENTE" }, page, size),
    []
  );

  const pagedInbox = usePagedList(loadInboxPage, 20, handleInboxError);
  const inboxFolders = pagedInbox.items;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [typesPage, levels] = await Promise.all([
          catalogService.documentTypes(0, 100),
          catalogService.academicLevels(),
        ]);
        if (cancelled) return;
        setDocTypes(typesPage.content);
        setAcademicLevels(levels);
      } catch (err) {
        if (!cancelled) showApiError(err, showSaveError, "No se pudieron cargar los datos.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showApiError, showSaveError]);

  useEffect(() => {
    if (inboxFolders.length > 0) selectFolder(inboxFolders[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagedInbox.items]);

  useEffect(() => {
    const q = verificationSearch.trim();
    if (!q) {
      setCiResults([]);
      return;
    }
    let cancelled = false;
    const timer = globalThis.setTimeout(() => {
      void recordsService
        .list({ ci: q }, 0, 20)
        .then((found) => {
          if (!cancelled) setCiResults(found.content);
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

  const documentTypeItems = useMemo<DocumentTypeItem[]>(
    () =>
      docTypes.map((t) => {
        const level = academicLevels.find((l) => l.id === t.academicLevelId)?.name;
        return {
          id: String(t.id),
          name: t.name,
          description: `${t.required ? "Obligatorio" : "Opcional"} - ${level ?? "Todos"}`,
        };
      }),
    [docTypes, academicLevels],
  );

  const documentTypesForSelect = useMemo(
    () => docTypes.map((t) => ({ value: String(t.id), label: t.name })),
    [docTypes],
  );

  const expedientData: ExpedientSelectCardData | null = useMemo(
    () => (selectedFolder ? toExpedientData(selectedFolder) : null),
    [selectedFolder],
  );

  const selectedExpedientLabel = selectedFolder
    ? `${selectedFolder.folderType} - ${selectedFolder.studentName}`
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

  const handleNewType = useCallback(() => {
    setEditingDocumentType(null);
    setDocumentTypeModalOpen(true);
  }, []);

  const handleEditType = useCallback(
    (id: string) => {
      const type = documentTypeItems.find((t) => t.id === id) ?? null;
      setEditingDocumentType(type);
      setDocumentTypeModalOpen(true);
    },
    [documentTypeItems],
  );

  const handleDocumentTypeSubmit = useCallback(
    async (data: { name: string; nivel: string; obligatoriedad: string; description: string }) => {
      const name = data.name.trim();
      if (!name) {
        showIncomplete("El nombre del tipo de documento es obligatorio.");
        return;
      }
      const required = data.obligatoriedad === "obligatorio";
      const academicLevelId =
        data.nivel === "todos"
          ? undefined
          : academicLevels.find((l) => l.name.toLowerCase() === data.nivel)?.id;
      try {
        if (editingDocumentType) {
          await catalogService.updateDocumentType(
            Number(editingDocumentType.id),
            name,
            required,
            academicLevelId,
          );
        } else {
          await catalogService.createDocumentType(name, required, academicLevelId);
        }
        setDocTypes((await catalogService.documentTypes(0, 100)).content);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            unauthorized();
            return;
          }
          if (err.status === 409 || /duplic|existe|mismo nombre/i.test(err.message)) {
            showDuplicateType(err.message);
            return;
          }
        }
        showApiError(err, showSaveError, "No se pudo guardar el tipo de documento.");
      }
    },
    [editingDocumentType, academicLevels, unauthorized, showApiError, showSaveError, showDuplicateType, showIncomplete],
  );

  const handleDeleteType = useCallback((id: string) => {
    setDeletingTypeId(id);
    setConfirmDeleteTypeOpen(true);
  }, []);

  const handleConfirmDeleteType = useCallback(async () => {
    if (!deletingTypeId) return;
    try {
      await catalogService.deleteDocumentType(Number(deletingTypeId));
      setDocTypes((await catalogService.documentTypes(0, 100)).content);
      setConfirmDeleteTypeOpen(false);
      setDeletingTypeId(null);
    } catch (err) {
      showApiError(err, showSaveError, "No se pudo eliminar el tipo de documento.");
    }
  }, [deletingTypeId, showApiError, showSaveError]);

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
        showApiError(err, showDocNotAvailable, "El documento seleccionado no esta disponible");
      }
    },
    [rawDocs, showApiError, showDocNotAvailable],
  );

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
      showApiError(err, showSaveError, "No se pudo eliminar el documento.");
    }
  }, [deletingDocId, selectedFolder, viewingDocument, showApiError, showSaveError]);

  const handleUpload = useCallback(
    async (file: File | null, typeId: string) => {
      if (!selectedFolder) {
        showRecordNotFound("Seleccione un expediente antes de subir documentos.");
        return;
      }
      if (!file) {
        showIncomplete("Seleccione un archivo antes de subir.");
        return;
      }
      if (typeId === "") {
        setUploadTypeError(true);
        showIncomplete("Seleccione el tipo de documento.");
        return;
      }
      try {
        await recordsService.uploadDocument(selectedFolder.id, file, Number(typeId));
        setRawDocs(await recordsService.listDocuments(selectedFolder.id));
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            unauthorized();
            return;
          }
          if (
            err.status === 413 ||
            err.code === "FILE_SIZE_EXCEEDED" ||
            /tamaño|size/i.test(err.message)
          ) {
            showFileSizeError(err.message);
            return;
          }
          if (err.code === "INVALID_FORMAT" || /formato|format/i.test(err.message)) {
            showFormatError(err.message);
            return;
          }
          if (err.code === "DUPLICATE_DOCUMENT" || /duplic/i.test(err.message)) {
            showDuplicateDoc(err.message);
            return;
          }
        }
        showApiError(err, showSaveError, "No se pudo subir el documento.");
      }
    },
    [
      selectedFolder,
      unauthorized,
      showApiError,
      showSaveError,
      showRecordNotFound,
      showIncomplete,
      showFileSizeError,
      showFormatError,
      showDuplicateDoc,
    ],
  );

  return (
    <DashboardTemplate
      currentView="Gestión de documentos"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
    >
      <div className="document-management-page">
        <aside className="document-management-page__bandeja">
          <VerificationInbox
            title="Bandeja de verificación"
            pendingCount={pagedInbox.totalElements}
            approvedToday="0"
            avgValidationTime="—"
            items={filteredVerificationItems}
            onBack={() => {}}
            onSearch={setVerificationSearch}
            onFilterType={() => {}}
            onFilterUploader={() => {}}
            onExport={() => {}}
            onOpen={handleOpenVerification}
          />
          <Pagination
            page={pagedInbox.page}
            totalPages={pagedInbox.totalPages}
            totalElements={pagedInbox.totalElements}
            onPageChange={pagedInbox.setPage}
          />
        </aside>
        <div className="document-management-page__left">
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
            onObservation={(id) => console.log("Observación", id)}
            onDeleteDocument={handleDeleteDocument}
          />
        </div>
        <div className="document-management-page__right">
          <DocumentTypesCard
            title="Tipos de documento"
            types={documentTypeItems}
            onNewType={handleNewType}
            onEdit={handleEditType}
            onDelete={handleDeleteType}
          />
        </div>
        <div className="document-management-page__full">
          <UploadDocumentCard
            title="Subir documento"
            context="Asociar archivos a un expediente."
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
      <DocumentTypeFormModal
        open={documentTypeModalOpen}
        onClose={() => setDocumentTypeModalOpen(false)}
        documentType={editingDocumentType}
        onSubmit={(data) => void handleDocumentTypeSubmit(data)}
      />
      <ConfirmModal
        open={confirmDeleteTypeOpen}
        onCancel={() => { setConfirmDeleteTypeOpen(false); setDeletingTypeId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={() => void handleConfirmDeleteType()}
      />
      <ConfirmModal
        open={confirmDeleteDocOpen}
        onCancel={() => { setConfirmDeleteDocOpen(false); setDeletingDocId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar el documento?"
        onConfirm={() => void handleConfirmDeleteDocument()}
      />
      <AlertModal
        open={documentNotAvailableAlert}
        type="warning"
        title="Documento no disponible"
        message={documentNotAvailableMessage}
        buttonLabel="Cerrar"
        onClose={() => setDocumentNotAvailableAlert(false)}
      />
      <AlertModal
        open={saveErrorAlert}
        type="error"
        title="Error al guardar expediente"
        message={saveErrorMessage}
        buttonLabel="Cerrar"
        onClose={() => setSaveErrorAlert(false)}
      />
      <AlertModal
        open={incompleteDataAlert2}
        type="warning"
        title="Datos incompletos o inválidos"
        message={incompleteDataMessage}
        buttonLabel="Corregir"
        onClose={() => setIncompleteDataAlert2(false)}
      />
      <AlertModal
        open={duplicateDocTypeAlert}
        type="warning"
        title="Tipo de documento duplicado"
        message={duplicateDocTypeMessage}
        buttonLabel="Cancelar"
        onClose={() => setDuplicateDocTypeAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setDuplicateDocTypeAlert(false)}
          >
            Corregir
          </Button>
        }
      />
      <AlertModal
        open={recordNotFoundAlert2}
        type="warning"
        title="Expediente no encontrado"
        message={recordNotFoundMessage}
        buttonLabel="Cerrar"
        onClose={() => setRecordNotFoundAlert2(false)}
      />
      <AlertModal
        open={formatNotAllowedAlert}
        type="error"
        title="Formato no permitido"
        message={formatNotAllowedMessage}
        buttonLabel="Cerrar"
        onClose={() => setFormatNotAllowedAlert(false)}
      />
      <AlertModal
        open={fileSizeExceededAlert}
        type="error"
        title="Tamaño excedido"
        message={fileSizeExceededMessage}
        buttonLabel="Cerrar"
        onClose={() => setFileSizeExceededAlert(false)}
      />
      <AlertModal
        open={duplicateDocumentAlert}
        type="warning"
        title="Documento duplicado"
        message={duplicateDocumentMessage}
        buttonLabel="Cancelar"
        onClose={() => setDuplicateDocumentAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setDuplicateDocumentAlert(false)}
          >
            Reemplazar
          </Button>
        }
      />
    </DashboardTemplate>
  );
};
