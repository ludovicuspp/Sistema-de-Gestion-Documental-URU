import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { VerificationInbox } from "@/components/organisms/VerificationInbox";
import { ExpedientSelectCard } from "@/components/organisms/ExpedientSelectCard";
import { ExpedientDocumentsCard } from "@/components/organisms/ExpedientDocumentsCard";
import { UploadDocumentCard } from "@/components/organisms/UploadDocumentCard";
import type { VerificationInboxItem } from "@/components/organisms/VerificationInbox";
import type { ExpedientSelectCardData } from "@/components/organisms/ExpedientSelectCard";
import type { ExpedientDocumentItem } from "@/components/organisms/ExpedientDocumentsCard";
import { VERIFICADOR_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierDocumentManagementPage.css";

const MOCK_VERIFICATION_ITEMS: VerificationInboxItem[] = [
  {
    id: "1",
    name: "Ludovicus Van Vargas",
    details: "V-0113 · Pregrado · Asistente A",
    date: "2025-11-12",
    missingCount: 1,
  },
  {
    id: "2",
    name: "María Pérez",
    details: "V-9876 · Postgrado · Asistente B",
    date: "2025-11-10",
    missingCount: 0,
  },
  {
    id: "3",
    name: "Carlos Gómez",
    details: "V-2233 · Pregrado · Asistente A",
    date: "2025-11",
    missingCount: 2,
    urgent: true,
  },
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
 * VerifierDocumentManagementPage - Page (Verifier)
 *
 * Document management view for Verifier role: verification inbox, expedient selection,
 * documents list with viewer, and document upload. Same structure as admin but without
 * DocumentTypesCard (types management is admin-only).
 */
export const VerifierDocumentManagementPage = () => {
  const navigate = useNavigate();
  const [verificationItems] = useState<VerificationInboxItem[]>(MOCK_VERIFICATION_ITEMS);
  const [selectedExpedientId, setSelectedExpedientId] = useState<string | null>("1");
  const [expedientData, setExpedientData] = useState<ExpedientSelectCardData | null>({
    ci: "0113",
    tipo: "Pregrado",
    cargado: "2025-11-12",
    ubicacion: "Estante 3 / Caja 12",
  });
  const [documents, setDocuments] = useState<ExpedientDocumentItem[]>(MOCK_DOCUMENTS);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [verificationSearch, setVerificationSearch] = useState("");

  // Mock document types for upload (in real app, these would come from API)
  const documentTypesForSelect = useMemo(
    () => [
      { value: "1", label: "Partida de Nacimiento" },
      { value: "2", label: "Cédula de Identidad" },
      { value: "3", label: "Notas Certificadas" },
      { value: "4", label: "Veredicto" },
    ],
    []
  );

  const filteredVerificationItems = useMemo(() => {
    if (!verificationSearch.trim()) return verificationItems;
    const q = verificationSearch.toLowerCase();
    return verificationItems.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.details.toLowerCase().includes(q)
    );
  }, [verificationItems, verificationSearch]);

  const selectedExpedientLabel =
    selectedExpedientId && expedientData?.ci
      ? `${expedientData.tipo} · Ludovicus Van Vargas`
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

  const handleLogout = useCallback(() => navigate("/"), [navigate]);

  const handleViewDocument = useCallback((id: string) => {
    console.log("Ver documento", id);
  }, []);

  const handleObservation = useCallback((id: string) => {
    console.log("Observación", id);
  }, []);

  const handleDeleteDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    },
    []
  );

  return (
    <DashboardTemplate
      currentView="Gestión de documentos"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFICADOR_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
      sidebarContent={
        <VerificationInbox
          title="Bandeja de verificación"
          pendingCount={2}
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
      }
    >
      <div className="verifier-document-management-page">
        <div className="verifier-document-management-page__left">
          <ExpedientSelectCard
            title="Seleccione un expediente"
            expedient={expedientData}
            onMarkUrgent={() => {}}
          />
          <ExpedientDocumentsCard
            title="Documentos del expediente"
            generalStatus="pending"
            documents={documents}
            onViewDocument={handleViewDocument}
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
