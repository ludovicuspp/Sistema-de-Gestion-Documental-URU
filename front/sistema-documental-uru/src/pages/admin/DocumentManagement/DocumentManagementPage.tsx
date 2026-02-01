import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { VerificationInbox } from "@/components/organisms/VerificationInbox";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { DocumentTypesCard } from "@/components/organisms/DocumentTypesCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import type { VerificationInboxItem } from "@/components/organisms/VerificationInbox";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { DocumentTypeItem } from "@/components/organisms/DocumentTypesCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import "./DocumentManagementPage.css";

const MOCK_VERIFICATION_ITEMS: VerificationInboxItem[] = [
  {
    id: "1",
    name: "Ludovicus Van Vargas",
    details: "V-0113 - Pregrado - Asistente A",
    date: "2025-11-12",
    missingCount: 1,
  },
  {
    id: "2",
    name: "María Pérez",
    details: "V-9876 - Postgrado - Asistente B",
    date: "2025-11-10",
    missingCount: 0,
  },
  {
    id: "3",
    name: "Carlos Gómez",
    details: "V-2233 - Pregrado - Asistente A",
    date: "2025-11-11",
    missingCount: 2,
    urgent: true,
  },
];

const MOCK_DOCUMENT_TYPES: DocumentTypeItem[] = [
  { id: "1", name: "Partida de Nacimiento", description: "Obligatorio - Pregrado" },
  { id: "2", name: "Cédula de Identidad", description: "Obligatorio - Todos los niveles" },
  { id: "3", name: "Notas Certificadas", description: "Opcional - Pregrado" },
  { id: "4", name: "Veredicto", description: "Opcional - Pregrado" },
];

const MOCK_DOCUMENTS: ExpedientDocumentItem[] = [
  {
    id: "d1",
    type: "Partida de Nacimiento",
    fileName: "partida.pdf",
    uploadedBy: "Asistente B",
    date: "2025-11-10",
    validationStatus: "pending",
  },
  {
    id: "d2",
    type: "Cédula de Identidad",
    fileName: "cedula.pdf",
    uploadedBy: "Asistente B",
    date: "2025-11-09",
    validationStatus: "validated",
  },
  {
    id: "d3",
    type: "Notas Certificadas",
    fileName: "notas.pdf",
    uploadedBy: "Asistente B",
    date: "2025-11-08",
    validationStatus: "pending",
  },
];

const QUICK_RULES = [
  "Todo documento debe asociarse a un expediente existente.",
  "Formatos permitidos: PDF; tamaño ≤ 5 MB.",
  "Documento duplicado solicita confirmación para reemplazo.",
];

/**
 * DocumentManagementPage - Page
 *
 * Document management view: verification inbox, expedient selection, document types, documents list and upload.
 */
export const DocumentManagementPage = () => {
  const navigate = useNavigate();
  const [verificationItems] = useState<VerificationInboxItem[]>(MOCK_VERIFICATION_ITEMS);
  const [selectedExpedientId, setSelectedExpedientId] = useState<string | null>("1");
  const [expedientData, setExpedientData] = useState<ExpedientSelectCardData | null>({
    ci: "0113",
    tipo: "Pregrado",
    cargado: "2025-11-12",
    ubicacion: "Estante 3 / Caja 12",
  });
  const [documentTypes] = useState<DocumentTypeItem[]>(MOCK_DOCUMENT_TYPES);
  const [documents, setDocuments] = useState<ExpedientDocumentItem[]>(MOCK_DOCUMENTS);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [verificationSearch, setVerificationSearch] = useState("");

  const filteredVerificationItems = useMemo(() => {
    if (!verificationSearch.trim()) return verificationItems;
    const q = verificationSearch.toLowerCase();
    return verificationItems.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.details.toLowerCase().includes(q)
    );
  }, [verificationItems, verificationSearch]);

  const documentTypesForSelect = useMemo(
    () => documentTypes.map((t) => ({ value: t.id, label: t.name })),
    [documentTypes]
  );

  const selectedExpedientLabel =
    selectedExpedientId && expedientData?.ci
      ? `Pregrado - Ludovicus Van Vargas`
      : undefined;

  const handleOpenVerification = useCallback((id: string) => {
    setSelectedExpedientId(id);
    setExpedientData({
      ci: "0113",
      tipo: "Pregrado",
      cargado: "2025-11-12",
      ubicacion: "Estante 3 / Caja 12",
    });
  }, []);

  const handleLogout = () => navigate("/");

  return (
    <DashboardTemplate
      currentView="Gestión de documentos"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarContent={
        <VerificationInbox
          title="Bandeja de verificación"
          pendingCount={2}
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
      }
    >
      <div className="document-management-page">
        <div className="document-management-page__left">
          <ExpedientSelectCard
            title="Seleccione un expediente"
            expedient={expedientData}
            onMarkUrgent={() => {}}
          />
          <ExpedientDocumentsCard
            title="Documentos del expediente"
            generalStatus="pending"
            documents={documents}
            onViewDocument={(id) => console.log("Ver documento", id)}
            onObservation={(id) => console.log("Observación", id)}
            onDeleteDocument={(id) =>
              setDocuments((prev) => prev.filter((d) => d.id !== id))
            }
          />
        </div>
        <div className="document-management-page__right">
          <DocumentTypesCard
            title="Tipos de documento"
            types={documentTypes}
            onNewType={() => {}}
            onEdit={(id) => console.log("Editar tipo", id)}
            onDelete={(id) => console.log("Eliminar tipo", id)}
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
            onUpload={(_file, typeId) => {
              setUploadTypeError(typeId === "");
            }}
            onTypeChange={(id) => {
              setSelectedTypeId(id);
              setUploadTypeError(false);
            }}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
