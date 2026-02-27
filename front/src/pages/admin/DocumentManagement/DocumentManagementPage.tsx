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
import { DocumentTypeFormModal } from "@/components/molecules/DocumentTypeFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
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
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeItem[]>(MOCK_DOCUMENT_TYPES);
  const [documents, setDocuments] = useState<ExpedientDocumentItem[]>(MOCK_DOCUMENTS);
  const [uploadTypeError, setUploadTypeError] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [verificationSearch, setVerificationSearch] = useState("");
  const [documentTypeModalOpen, setDocumentTypeModalOpen] = useState(false);
  const [editingDocumentType, setEditingDocumentType] = useState<DocumentTypeItem | null>(null);
  const [confirmDeleteTypeOpen, setConfirmDeleteTypeOpen] = useState(false);
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null);
  const [confirmDeleteDocOpen, setConfirmDeleteDocOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [documentNotAvailableAlert, setDocumentNotAvailableAlert] = useState(false);

  // TEMPORAL: Función para probar alert - ELIMINAR después
  const handleTestDocumentNotAvailable = useCallback(() => {
    setDocumentNotAvailableAlert(true);
  }, []);

  const [saveErrorAlert, setSaveErrorAlert] = useState(false);
  const [cannotApproveAlert, setCannotApproveAlert] = useState(false);
  const [incompleteDataAlert2, setIncompleteDataAlert2] = useState(false);
  const [duplicateDocTypeAlert, setDuplicateDocTypeAlert] = useState(false);
  const [recordNotFoundAlert2, setRecordNotFoundAlert2] = useState(false);
  const [formatNotAllowedAlert, setFormatNotAllowedAlert] = useState(false);
  const [fileSizeExceededAlert, setFileSizeExceededAlert] = useState(false);
  const [duplicateDocumentAlert, setDuplicateDocumentAlert] = useState(false);

  const handleTestSaveError = useCallback(() => {
    setSaveErrorAlert(true);
  }, []);

  const handleTestCannotApprove = useCallback(() => {
    setCannotApproveAlert(true);
  }, []);

  const handleTestIncompleteData2 = useCallback(() => {
    setIncompleteDataAlert2(true);
  }, []);

  const handleTestDuplicateDocType = useCallback(() => {
    setDuplicateDocTypeAlert(true);
  }, []);

  const handleTestRecordNotFound2 = useCallback(() => {
    setRecordNotFoundAlert2(true);
  }, []);

  const handleTestFormatNotAllowed = useCallback(() => {
    setFormatNotAllowedAlert(true);
  }, []);

  const handleTestFileSizeExceeded = useCallback(() => {
    setFileSizeExceededAlert(true);
  }, []);

  const handleTestDuplicateDocument = useCallback(() => {
    setDuplicateDocumentAlert(true);
  }, []);

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

  const handleNewType = useCallback(() => {
    setEditingDocumentType(null);
    setDocumentTypeModalOpen(true);
  }, []);

  const handleEditType = useCallback((id: string) => {
    const type = documentTypes.find((t) => t.id === id) ?? null;
    setEditingDocumentType(type);
    setDocumentTypeModalOpen(true);
  }, [documentTypes]);

  const handleDocumentTypeSubmit = useCallback(
    (data: { name: string; nivel: string; obligatoriedad: string; description: string }) => {
      const desc = data.obligatoriedad
        ? `${data.obligatoriedad === "obligatorio" ? "Obligatorio" : "Opcional"} - ${
            data.nivel === "todos" ? "Todos" : data.nivel === "pregrado" ? "Pregrado" : "Postgrado"
          }`
        : data.description;
      if (editingDocumentType) {
        setDocumentTypes((prev) =>
          prev.map((t) =>
            t.id === editingDocumentType.id
              ? { ...t, name: data.name, description: desc }
              : t
          )
        );
      } else {
        const newId = String(Math.max(...documentTypes.map((t) => parseInt(t.id, 10)), 0) + 1);
        setDocumentTypes((prev) => [
          ...prev,
          { id: newId, name: data.name, description: desc },
        ]);
      }
    },
    [editingDocumentType, documentTypes]
  );

  const handleDeleteType = useCallback((id: string) => {
    setDeletingTypeId(id);
    setConfirmDeleteTypeOpen(true);
  }, []);

  const handleConfirmDeleteType = useCallback(() => {
    if (deletingTypeId) {
      setDocumentTypes((prev) => prev.filter((t) => t.id !== deletingTypeId));
      setConfirmDeleteTypeOpen(false);
      setDeletingTypeId(null);
    }
  }, [deletingTypeId]);

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
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
    >
      <div className="document-management-page">
        {/* TEMPORAL: Botón de prueba - ELIMINAR después */}
        <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 1000, background: "#fff3cd", padding: "1rem", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <strong>🧪 Prueba:</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            <Button variant="secondary" size="small" onClick={handleTestDocumentNotAvailable}>
              3. Documento no disponible
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSaveError}>
              7. Error al guardar
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotApprove}>
              8. No se puede aprobar
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteData2}>
              17. Datos incompletos (v2)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDuplicateDocType}>
              18. Tipo documento duplicado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordNotFound2}>
              19. Expediente no encontrado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestFormatNotAllowed}>
              20. Formato no permitido
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestFileSizeExceeded}>
              21. Tamaño excedido
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDuplicateDocument}>
              22. Documento duplicado
            </Button>
          </div>
        </div>
        
        <aside className="document-management-page__bandeja">
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
        </aside>
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
            onViewDocument={(id) => {
              const doc = documents.find((d) => d.id === id);
              if (!doc || doc.validationStatus === "pending") {
                setDocumentNotAvailableAlert(true);
              } else {
                console.log("Ver documento", id);
              }
            }}
            onObservation={(id) => console.log("Observación", id)}
            onDeleteDocument={handleDeleteDocument}
          />
        </div>
        <div className="document-management-page__right">
          <DocumentTypesCard
            title="Tipos de documento"
            types={documentTypes}
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
      <DocumentTypeFormModal
        open={documentTypeModalOpen}
        onClose={() => setDocumentTypeModalOpen(false)}
        documentType={editingDocumentType}
        onSubmit={handleDocumentTypeSubmit}
      />
      <ConfirmModal
        open={confirmDeleteTypeOpen}
        onCancel={() => { setConfirmDeleteTypeOpen(false); setDeletingTypeId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={handleConfirmDeleteType}
      />
      <ConfirmModal
        open={confirmDeleteDocOpen}
        onCancel={() => { setConfirmDeleteDocOpen(false); setDeletingDocId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar el documento?"
        onConfirm={handleConfirmDeleteDocument}
      />
      <AlertModal
        open={documentNotAvailableAlert}
        type="warning"
        title="Documento no disponible"
        message="El documento seleccionado no esta disponible"
        buttonLabel="Cerrar"
        onClose={() => setDocumentNotAvailableAlert(false)}
      />
      <AlertModal
        open={saveErrorAlert}
        type="error"
        title="Error al guardar expediente"
        message="Ocurrió un error al guardar en la base de datos."
        buttonLabel="Cerrar"
        onClose={() => setSaveErrorAlert(false)}
      />
      <AlertModal
        open={cannotApproveAlert}
        type="warning"
        title="No se puede aprobar"
        message="Faltan documentos obligatorios para el expediente."
        buttonLabel="Cerrar"
        onClose={() => setCannotApproveAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setCannotApproveAlert(false);
              console.log("Ver documentos faltantes");
            }}
          >
            Ver faltantes
          </Button>
        }
      />
      <AlertModal
        open={incompleteDataAlert2}
        type="warning"
        title="Datos incompletos o inválidos"
        message="Rellena toda la información requerida"
        buttonLabel="Corregir"
        onClose={() => setIncompleteDataAlert2(false)}
      />
      <AlertModal
        open={duplicateDocTypeAlert}
        type="warning"
        title="Tipo de documento duplicado"
        message="Se encontró un tipo de documento con el mismo nombre"
        buttonLabel="Cancelar"
        onClose={() => setDuplicateDocTypeAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setDuplicateDocTypeAlert(false);
              console.log("Corregir nombre");
            }}
          >
            Corregir
          </Button>
        }
      />
      <AlertModal
        open={recordNotFoundAlert2}
        type="warning"
        title="Expediente no encontrado"
        message="No existe el expediente indicado."
        buttonLabel="Cerrar"
        onClose={() => setRecordNotFoundAlert2(false)}
      />
      <AlertModal
        open={formatNotAllowedAlert}
        type="error"
        title="Formato no permitido"
        message="Solo se permiten PDF, JPG y PNG."
        buttonLabel="Cerrar"
        onClose={() => setFormatNotAllowedAlert(false)}
      />
      <AlertModal
        open={fileSizeExceededAlert}
        type="error"
        title="Tamaño excedido"
        message="El archivo supera el límite permitido. Ejemplo: límite 10 MB por archivo."
        buttonLabel="Cerrar"
        onClose={() => setFileSizeExceededAlert(false)}
      />
      <AlertModal
        open={duplicateDocumentAlert}
        type="warning"
        title="Documento duplicado"
        message="Se encontró un documento del mismo tipo. ¿Deseas reemplazarlo?"
        buttonLabel="Cancelar"
        onClose={() => setDuplicateDocumentAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setDuplicateDocumentAlert(false);
              console.log("Reemplazar documento");
            }}
          >
            Reemplazar
          </Button>
        }
      />
    </DashboardTemplate>
  );
};
