import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import { Card } from "@/components/molecules/Card";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantDocumentManagementPage.css";

const MOCK_DOCUMENTS: ExpedientDocumentItem[] = [
  { id: "d1", type: "Partida de Nacimiento", fileName: "partida.pdf", uploadedBy: "Asistente B", date: "2025-11-10", validationStatus: "pending" },
  { id: "d2", type: "Cédula de Identidad", fileName: "cedula.pdf", uploadedBy: "Asistente B", date: "2025-11-09", validationStatus: "validated" },
  { id: "d3", type: "Notas Certificadas", fileName: "notas.pdf", uploadedBy: "Asistente B", date: "2025-11-08", validationStatus: "pending" },
];

const QUICK_RULES = [
  "Todo documento debe asociarse a un expediente existente.",
  "Formatos permitidos: PDF; tamaño ≤ 5 MB.",
  "Documento duplicado solicita confirmación para reemplazo.",
];

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

  const handleViewDocument = useCallback((id: string) => console.log("Ver documento", id), []);
  const handleObservation = useCallback((id: string) => console.log("Observación", id), []);
  const handleDeleteDocument = useCallback((id: string) => {
    setDeletingDocId(id);
    setConfirmDeleteDocOpen(true);
  }, []);

  const handleConfirmDeleteDocument = useCallback(() => {
    if (deletingDocId) {
      setDocuments((prev) => prev.filter((d) => d.id !== deletingDocId));
      setConfirmDeleteDocOpen(false);
      setDeletingDocId(null);
    }
  }, [deletingDocId]);

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
    </DashboardTemplate>
  );
};
