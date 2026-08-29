import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Modal } from "@/components/molecules/Modal";
import { RecordFormModal } from "@/components/molecules/RecordFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { CargarExpedientForm } from "@/components/molecules/CargarExpedientForm";
import type { CargarExpedientFormData } from "@/components/molecules/CargarExpedientForm";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import { RecordDocumentsList } from "@/components/organisms/RecordDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { RecordDocumentListItem } from "@/components/organisms/RecordDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierRecordManagementPage.css";

const MOCK_RECORD: RecordDetailData = {
  studentId: "1",
  studentName: "Ludovicus Van Vargas",
  studentCI: "0113",
  studentBirthDate: "01/09/2003",
  studentEmail: "luis@brainv.com",
  recordType: "Pregrado",
  recordCreatedDate: "2025-08-01",
  recordLocation: "Estante 3 / Caja 12 / Fila B",
  recordStatus: "pending",
};

const MOCK_DOCUMENTS: RecordDocumentListItem[] = [
  {
    id: "1",
    type: "Cédula de Identidad",
    fileName: "cedula.pdf",
    fileSize: "220 KB",
  },
  {
    id: "2",
    type: "Partida de Nacimiento",
    fileName: "partida.pdf",
    fileSize: "180 KB",
  },
  {
    id: "3",
    type: "Notas Certificadas",
    fileName: "notas.pdf",
    fileSize: "1.2 MB",
  },
];

const MOCK_OBSERVATIONS: ActivityEntry[] = [
  {
    text: 'Documento "Partida de Nacimiento" ilegible — solicitar reescan.',
    datetime: "2025-11-12 · Verificador A",
  },
  {
    text: "Cédula cargada y vinculada correctamente.",
    datetime: "2025-11-10 · Asistente B",
  },
];

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
  const [selectedRecord, setSelectedRecord] = useState<RecordDetailData | null>(MOCK_RECORD);
  const [expedientModalOpen, setExpedientModalOpen] = useState(false);
  const [editingExpedient, setEditingExpedient] = useState<RecordDetailData | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [showCargarExpedientModal, setShowCargarExpedientModal] = useState(false);

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
    setEditingExpedient(null);
    setConfirmCreateOpen(false);
    setExpedientModalOpen(true);
  }, []);

  const handleExpedientSubmit = useCallback(
    (data: { studentCI: string; studentName: string; recordType: string; studentEmail?: string; studentBirthDate?: string; recordLocation?: string }) => {
      if (editingExpedient) {
        setSelectedRecord((prev) =>
          prev
            ? {
                ...prev,
                studentCI: data.studentCI,
                studentName: data.studentName,
                recordType: data.recordType,
                studentEmail: data.studentEmail,
                studentBirthDate: data.studentBirthDate,
                recordLocation: data.recordLocation,
              }
            : null
        );
      } else {
        setSelectedRecord({
          studentId: "",
          studentName: data.studentName,
          studentCI: data.studentCI,
          studentBirthDate: data.studentBirthDate,
          studentEmail: data.studentEmail,
          recordType: data.recordType,
          recordCreatedDate: new Date().toISOString().slice(0, 10),
          recordLocation: data.recordLocation ?? "",
          recordStatus: "pending",
        });
      }
    },
    [editingExpedient]
  );

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedRecord(null);
    console.log("Refrescar");
  }, []);

  const handleUpdateDocuments = useCallback(() => {
    console.log("Actualizar documentos");
  }, []);

  const handleUploadRecord = useCallback(() => {
    setShowCargarExpedientModal(true);
  }, []);

  const handleCargarExpedientSubmit = useCallback((data: CargarExpedientFormData) => {
    console.log("Cargar expediente", data);
    setShowCargarExpedientModal(false);
  }, []);

  const handleCargarExpedientCancel = useCallback(() => {
    setShowCargarExpedientModal(false);
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedRecord) {
      setEditingExpedient(selectedRecord);
      setExpedientModalOpen(true);
    }
  }, [selectedRecord]);

  const handleDelete = useCallback(() => {
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setSelectedRecord(null);
    setConfirmDeleteOpen(false);
  }, []);

  const handleViewDocument = useCallback((id: string) => {
    console.log("Ver documento", id);
  }, []);

  const handleDocumentObservation = useCallback((id: string) => {
    console.log("Observación documento", id);
  }, []);

  const handleViewHistory = useCallback(() => {
    console.log("Ver historial");
  }, []);

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
            <div className="verifier-record-management-page__documents">
              <RecordDocumentsList
                title="Documentos"
                documents={selectedRecord ? MOCK_DOCUMENTS : []}
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
                entries={selectedRecord ? MOCK_OBSERVATIONS : []}
                onViewAll={handleViewHistory}
              />
            </div>
          </div>
        </div>
      </div>
      <RecordFormModal
        open={expedientModalOpen}
        onClose={() => setExpedientModalOpen(false)}
        record={editingExpedient}
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
