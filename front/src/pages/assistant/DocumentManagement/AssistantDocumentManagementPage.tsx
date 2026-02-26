import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantDocumentManagementPage.css";

const MOCK_DOCUMENTS: ExpedientDocumentItem[] = [
  { id: "d1", type: "Partida de Nacimiento", fileName: "partida.pdf", uploadedBy: "Asistente B", date: "2025-11-10", validationStatus: "pending" },
  { id: "d2", type: "Cédula de Identidad", fileName: "cedula.pdf", uploadedBy: "Asistente B", date: "2025-11-09", validationStatus: "validated" },
  { id: "d3", type: "Notas Certificadas", fileName: "notas.pdf", uploadedBy: "Asistente B", date: "2025-11-08", validationStatus: "pending" },
  { id: "d4", type: "Veredicto", fileName: "veredicto_2025.pdf", uploadedBy: "Asistente A", date: "2025-11-07", validationStatus: "validated" },
  { id: "d5", type: "Título de Bachiller", fileName: "titulo_bachiller.pdf", uploadedBy: "Asistente B", date: "2025-11-06", validationStatus: "pending" },
  { id: "d6", type: "Cédula de Identidad", fileName: "cedula_actualizada.pdf", uploadedBy: "Asistente A", date: "2025-11-05", validationStatus: "validated" },
  { id: "d7", type: "Notas Certificadas", fileName: "notas_semestre1.pdf", uploadedBy: "Asistente B", date: "2025-11-04", validationStatus: "pending" },
  { id: "d8", type: "Partida de Nacimiento", fileName: "partida_nacimiento.pdf", uploadedBy: "Asistente A", date: "2025-11-03", validationStatus: "validated" },
  { id: "d9", type: "Certificado de Calificaciones", fileName: "certificado_calificaciones.pdf", uploadedBy: "Asistente B", date: "2025-11-02", validationStatus: "pending" },
  { id: "d10", type: "Veredicto", fileName: "veredicto.pdf", uploadedBy: "Asistente A", date: "2025-11-01", validationStatus: "validated" },
];

const QUICK_RULES = [
  "Todo documento debe asociarse a un expediente existente.",
  "Formatos permitidos: PDF; tamaño ≤ 5 MB.",
  "Documento duplicado solicita confirmación para reemplazo.",
];

const MAX_OBSERVATION_CHARS = 200;

/**
 * AssistantDocumentManagementPage - Page
 *
 * Document management view for Asistente: expedient selection, upload document, documents table, and quick rules.
 * Layout matches design: upload section on top, document table in middle, reglas rápidas at bottom.
 */
export const AssistantDocumentManagementPage = () => {
  const navigate = useNavigate();
  const [expedientData] = useState<ExpedientSelectCardData | null>({
    ci: "0113",
    tipo: "Pregrado",
    cargado: "2025-11-12",
    ubicacion: "Estante 3 / Caja 12",
  });
  const [documents, setDocuments] = useState<ExpedientDocumentItem[]>(MOCK_DOCUMENTS);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [confirmDeleteDocOpen, setConfirmDeleteDocOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [viewingDocument, setViewingDocument] = useState<{ id: string; fileName: string } | null>(null);
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [observationDoc, setObservationDoc] = useState<{ id: string; fileName: string } | null>(null);
  const [observationText, setObservationText] = useState("");
  const [documentObservations, setDocumentObservations] = useState<Record<string, string>>({});

  const documentTypesForSelect = useMemo(
    () => [
      { value: "1", label: "Partida de Nacimiento" },
      { value: "2", label: "Cédula de Identidad" },
      { value: "3", label: "Notas Certificadas" },
      { value: "4", label: "Veredicto" },
    ],
    []
  );

  const selectedExpedientLabel =
    expedientData?.ci && expedientData?.tipo ? `${expedientData.tipo} - Ludovicus Van Vargas` : undefined;

  const handleViewDocument = useCallback((id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) setViewingDocument({ id: doc.id, fileName: doc.fileName });
  }, [documents]);

  const handleObservation = useCallback((id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setObservationDoc({ id: doc.id, fileName: doc.fileName });
      const saved = documentObservations[doc.id] ?? "";
      setObservationText(saved.length > MAX_OBSERVATION_CHARS ? saved.slice(0, MAX_OBSERVATION_CHARS) : saved);
      setObservationModalOpen(true);
    }
  }, [documents, documentObservations]);

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

  const handleConfirmDeleteDocument = useCallback(() => {
    if (deletingDocId) {
      setDocuments((prev) => prev.filter((d) => d.id !== deletingDocId));
      if (viewingDocument?.id === deletingDocId) setViewingDocument(null);
      setConfirmDeleteDocOpen(false);
      setDeletingDocId(null);
    }
  }, [deletingDocId, viewingDocument]);

  return (
    <DashboardTemplate
      currentView="Gestión de documentos"
      userRole="Asistente"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
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
              onUpload={(_file, typeId) => setUploadTypeError(typeId === "")}
              onTypeChange={(id) => {
                setSelectedTypeId(id);
                setUploadTypeError(false);
              }}
            />
          </div>

          <div className="assistant-document-management-page__documents">
            <ExpedientDocumentsCard
              title="Documentos del expediente"
              generalStatus="pending"
              documents={documents}
              viewingDocument={viewingDocument}
              onViewDocument={handleViewDocument}
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
        onConfirm={handleConfirmDeleteDocument}
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
