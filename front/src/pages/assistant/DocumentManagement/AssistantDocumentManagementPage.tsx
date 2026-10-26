import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { ApiError, clearSession } from "@/services/api/http";
import { recordsService, type DocumentDto, type FolderDto } from "@/services/api/recordsService";
import { catalogService, type DocumentTypeDto } from "@/services/api/catalogService";
import "./AssistantDocumentManagementPage.css";

const QUICK_RULES = [
  "Todo documento debe asociarse a un expediente existente.",
  "Formatos permitidos: PDF; tamaño ≤ 5 MB.",
  "Documento duplicado solicita confirmación para reemplazo.",
];

const MAX_OBSERVATION_CHARS = 200;

const toExpedientData = (folder: FolderDto): ExpedientSelectCardData => ({
  ci: folder.studentCi,
  tipo: folder.folderType,
  cargado: (folder.createdAt ?? "").slice(0, 10) || "—",
  ubicacion:
    [folder.shelf, folder.box, folder.rowNumber].filter((v): v is string => Boolean(v)).join(" / ") ||
    "—",
});

/**
 * AssistantDocumentManagementPage - Page
 *
 * Document management view for Asistente: expedient selection, upload document, documents table, and quick rules.
 * Layout matches design: upload section on top, document table in middle, reglas rápidas at bottom.
 * Datos reales: records-service (carpetas/documentos) y catalog-service (tipos de documento, solo lectura).
 */
export const AssistantDocumentManagementPage = () => {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<FolderDto | null>(null);
  const [rawDocs, setRawDocs] = useState<DocumentDto[]>([]);
  const [docTypes, setDocTypes] = useState<DocumentTypeDto[]>([]);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [confirmDeleteDocOpen, setConfirmDeleteDocOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [viewingDocument, setViewingDocument] = useState<{ id: string; fileName: string } | null>(null);
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [observationDoc, setObservationDoc] = useState<{ id: string; fileName: string } | null>(null);
  const [observationText, setObservationText] = useState("");
  const [documentObservations, setDocumentObservations] = useState<Record<string, string>>({});
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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [folders, types] = await Promise.all([
          recordsService.list(),
          catalogService.documentTypes(),
        ]);
        if (cancelled) return;
        setDocTypes(types);
        if (folders.length > 0) {
          setSelectedFolder(folders[0]);
          const docs = await recordsService.listDocuments(folders[0].id);
          if (!cancelled) setRawDocs(docs);
        }
      } catch (err) {
        if (!cancelled) showApiError(err, "No se pudieron cargar los datos.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showApiError]);

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

  const expedientData: ExpedientSelectCardData | null = useMemo(
    () => (selectedFolder ? toExpedientData(selectedFolder) : null),
    [selectedFolder],
  );

  const documentTypesForSelect = useMemo(
    () => docTypes.map((t) => ({ value: String(t.id), label: t.name })),
    [docTypes],
  );

  const selectedExpedientLabel =
    selectedFolder ? `${selectedFolder.folderType} - ${selectedFolder.studentName}` : undefined;

  const generalStatus = selectedFolder && /APROB|VALID/i.test(selectedFolder.status ?? "")
    ? ("validated" as const)
    : ("pending" as const);

  const handleLogout = useCallback(() => {
    clearSession();
    navigate("/");
  }, [navigate]);

  const handleViewDocument = useCallback(
    async (id: string) => {
      const doc = rawDocs.find((d) => d.id === Number(id));
      if (doc) setViewingDocument({ id, fileName: doc.name });
      try {
        const blob = await recordsService.downloadDocument(Number(id));
        const url = URL.createObjectURL(blob);
        globalThis.open(url, "_blank", "noopener");
        globalThis.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch (err) {
        showApiError(err, "El documento seleccionado no está disponible.");
      }
    },
    [rawDocs, showApiError],
  );

  const handleObservation = useCallback((id: string) => {
    const doc = rawDocs.find((d) => d.id === Number(id));
    if (doc) {
      setObservationDoc({ id, fileName: doc.name });
      const saved = documentObservations[id] ?? "";
      setObservationText(saved.length > MAX_OBSERVATION_CHARS ? saved.slice(0, MAX_OBSERVATION_CHARS) : saved);
      setObservationModalOpen(true);
    }
  }, [rawDocs, documentObservations]);

  const handleObservationTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_OBSERVATION_CHARS) setObservationText(value);
  }, []);

  const handleSaveObservation = useCallback(() => {
    if (!observationDoc) return;
    if (observationText.length >= MAX_OBSERVATION_CHARS) {
      alert(`Ha superado el límite de caracteres permitidos (${MAX_OBSERVATION_CHARS}). Por favor, reduzca el texto antes de guardar.`);
      return;
    }
    setDocumentObservations((prev) => ({ ...prev, [observationDoc.id]: observationText }));
    setObservationModalOpen(false);
    setObservationDoc(null);
    setObservationText("");
  }, [observationDoc, observationText]);

  const handleCloseObservationModal = useCallback(() => {
    setObservationModalOpen(false);
    setObservationDoc(null);
    setObservationText("");
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
      userRole="Asistente"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-document-management-page">
        <div className="assistant-document-management-page__main">
          <div className="assistant-document-management-page__expedient">
            <ExpedientSelectCard
              title="Seleccione un expediente"
              expedient={expedientData}
              onMarkUrgent={() => {}}
            />
          </div>

          <div className="assistant-document-management-page__upload">
            <UploadDocumentCard
              title="Subir documento"
              context="Asociar archivos a un expediente"
              selectedExpedientLabel={selectedExpedientLabel}
              documentTypes={documentTypesForSelect}
              selectedTypeId={selectedTypeId}
              selectedTypeError={uploadTypeError}
              onUpload={(file, typeId) => void handleUpload(file, typeId)}
              onTypeChange={(id) => {
                setSelectedTypeId(id);
                setUploadTypeError(false);
              }}
            />
          </div>

          <div className="assistant-document-management-page__documents">
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

          <div className="assistant-document-management-page__rules">
            <Card variant="elevated" className="assistant-document-management-page__rules-card">
              <h4 className="assistant-document-management-page__rules-title">Reglas rápidas</h4>
              <ul className="assistant-document-management-page__rules-list">
                {QUICK_RULES.map((rule) => (
                  <li key={rule} className="assistant-document-management-page__rules-item">
                    {rule}
                  </li>
                ))}
              </ul>
            </Card>
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
      <Modal
        open={observationModalOpen}
        onClose={handleCloseObservationModal}
        title={observationDoc ? `Observación — ${observationDoc.fileName}` : "Observación del documento"}
        size="md"
      >
        <div className="assistant-document-management-page__observation-form">
          <label className="assistant-document-management-page__observation-label">
            Escribe tu observación para este documento
          </label>
          <div className="assistant-document-management-page__observation-textarea-wrapper">
            <textarea
              className="assistant-document-management-page__observation-textarea"
              value={observationText}
              onChange={handleObservationTextChange}
              maxLength={MAX_OBSERVATION_CHARS}
              placeholder="Ej: Documento ilegible, solicitar reescan..."
              rows={4}
            />
            <span
              className={`assistant-document-management-page__observation-counter ${
                observationText.length >= MAX_OBSERVATION_CHARS
                  ? "assistant-document-management-page__observation-counter--error"
                  : observationText.length >= MAX_OBSERVATION_CHARS * 0.8
                    ? "assistant-document-management-page__observation-counter--warning"
                    : ""
              }`}
            >
              {observationText.length}/{MAX_OBSERVATION_CHARS}
            </span>
          </div>
          <div className="assistant-document-management-page__observation-actions">
            <Button variant="outline" size="medium" onClick={handleCloseObservationModal}>
              Cancelar
            </Button>
            <Button variant="primary" size="medium" onClick={handleSaveObservation}>
              Guardar observación
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardTemplate>
  );
};
