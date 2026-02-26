import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Modal } from "@/components/molecules/Modal";
import { RecordFormModal } from "@/components/molecules/RecordFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { CargarExpedientForm } from "@/components/molecules/CargarExpedientForm";
import type { CargarExpedientFormData } from "@/components/molecules/CargarExpedientForm";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordList } from "@/components/organisms/RecordList";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import { RecordDocumentsList } from "@/components/organisms/RecordDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { RecordDocumentListItem } from "@/components/organisms/RecordDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantRecordManagementPage.css";

/** Record with id and optional flag for "sin documentos" filter. */
type RecordWithId = RecordDetailData & { id: string; withoutDocuments?: boolean };

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const MOCK_RECORDS: RecordWithId[] = [
  { id: "1", studentId: "1", studentName: "Ludovicus Van Vargas", studentCI: "V-0113", studentBirthDate: "01/09/2003", studentEmail: "luis@brainv.com", recordType: "Pregrado", recordCreatedDate: "2025-08-01", recordLocation: "Estante 3 / Caja 12 / Fila B", recordStatus: "pending" },
  { id: "2", studentId: "2", studentName: "María Pérez González", studentCI: "V-98765432", studentBirthDate: "15/03/1998", studentEmail: "maria@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-09-10", recordLocation: "Estante 1 / Caja 5", recordStatus: "pending" },
  { id: "3", studentId: "3", studentName: "Carlos Andrés Rojas", studentCI: "V-11223344", studentBirthDate: "22/07/2001", studentEmail: "carlos@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-10-02", recordLocation: "Estante 2 / Caja 8 / Fila A", recordStatus: "pending" },
  { id: "4", studentId: "4", studentName: "Ana Lucía Fernández", studentCI: "V-55667788", studentBirthDate: "10/11/2000", studentEmail: "ana@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-10-15", recordLocation: "Estante 4 / Caja 15", recordStatus: "pending" },
  { id: "5", studentId: "5", studentName: "José Luis Martínez", studentCI: "V-99887766", studentBirthDate: "05/04/1999", studentEmail: "jose@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-08-20", recordLocation: "Estante 1 / Caja 3", recordStatus: "approved" },
  { id: "6", studentId: "6", studentName: "Carmen Elena Díaz", studentCI: "V-44332211", studentBirthDate: "18/12/2002", studentEmail: "carmen@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-07-12", recordLocation: "Estante 3 / Caja 10", recordStatus: "approved" },
  { id: "7", studentId: "7", studentName: "Roberto Sánchez Mora", studentCI: "V-22334455", studentBirthDate: "30/01/1997", studentEmail: "roberto@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-09-05", recordLocation: "Estante 2 / Caja 7", recordStatus: "approved" },
  { id: "8", studentId: "8", studentName: "Laura Patricia Vega", studentCI: "V-66778899", studentBirthDate: "14/06/2000", studentEmail: "laura@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-11-01", recordLocation: "Estante 5 / Caja 20", recordStatus: "approved" },
  { id: "9", studentId: "9", studentName: "Miguel Ángel Torres", studentCI: "V-10101010", studentBirthDate: "08/08/2001", studentEmail: "miguel@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-10-20", recordLocation: "Estante 2 / Caja 9", recordStatus: "rejected" },
  { id: "10", studentId: "10", studentName: "Sandra Milena López", studentCI: "V-20202020", studentBirthDate: "25/02/1998", studentEmail: "sandra@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-09-18", recordLocation: "Estante 1 / Caja 4", recordStatus: "rejected" },
  { id: "11", studentId: "11", studentName: "Daniel Eduardo Castro", studentCI: "V-30303030", studentBirthDate: "12/11/2002", studentEmail: "daniel@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-11-05", recordLocation: "—", recordStatus: "pending", withoutDocuments: true },
  { id: "12", studentId: "12", studentName: "Patricia Isabel Ruiz", studentCI: "V-40404040", studentBirthDate: "03/05/1999", studentEmail: "patricia@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-11-08", recordLocation: "—", recordStatus: "pending", withoutDocuments: true },
  { id: "13", studentId: "13", studentName: "Fernando José Herrera", studentCI: "V-50505050", studentBirthDate: "19/07/2000", studentEmail: "fernando@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-11-10", recordLocation: "—", recordStatus: "pending", withoutDocuments: true },
  { id: "14", studentId: "14", studentName: "Gabriela Morales", studentCI: "V-60606060", studentBirthDate: "28/09/2001", studentEmail: "gabriela@mail.com", recordType: "Pregrado", recordCreatedDate: "2025-11-12", recordLocation: "—", recordStatus: "pending", withoutDocuments: true },
  { id: "15", studentId: "15", studentName: "Ricardo Alfonso Núñez", studentCI: "V-70707070", studentBirthDate: "15/04/1997", studentEmail: "ricardo@mail.com", recordType: "Postgrado", recordCreatedDate: "2025-10-25", recordLocation: "—", recordStatus: "pending", withoutDocuments: true },
];

const MOCK_DOCUMENTS: RecordDocumentListItem[] = [
  { id: "1", type: "Cédula de Identidad", fileName: "cedula.pdf", fileSize: "220 KB" },
  { id: "2", type: "Partida de Nacimiento", fileName: "partida.pdf", fileSize: "180 KB" },
  { id: "3", type: "Notas Certificadas", fileName: "notas.pdf", fileSize: "1.2 MB" },
];

const MOCK_OBSERVATIONS: ActivityEntry[] = [
  { text: 'Documento "Partida de Nacimiento" ilegible — solicitar reescan.', datetime: "2025-11-12 · Verificador A" },
  { text: "Cédula cargada y vinculada correctamente.", datetime: "2025-11-10 · Asistente B" },
];

export const AssistantRecordManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RecordStatusFilter>("pending");
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [expedientModalOpen, setExpedientModalOpen] = useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [showCargarExpedientModal, setShowCargarExpedientModal] = useState(false);

  const filteredRecords = useMemo(() => {
    let list = MOCK_RECORDS;
    if (activeFilter === "pending") list = list.filter((r) => r.recordStatus === "pending" && !r.withoutDocuments);
    else if (activeFilter === "approved") list = list.filter((r) => r.recordStatus === "approved");
    else if (activeFilter === "rejected") list = list.filter((r) => r.recordStatus === "rejected");
    else if (activeFilter === "without-documents") list = list.filter((r) => r.withoutDocuments === true);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((r) => r.studentName.toLowerCase().includes(q) || r.studentCI.toLowerCase().includes(q));
    }
    return list;
  }, [activeFilter, searchQuery]);

  const recordListItems = useMemo(
    () =>
      filteredRecords.map((r) => ({
        id: r.id,
        name: r.studentName,
        ci: r.studentCI,
        recordType: r.recordType ?? "—",
        statusLabel: r.withoutDocuments ? "Sin documentos" : (r.recordStatus ? STATUS_LABELS[r.recordStatus] : "—"),
        statusType: (r.withoutDocuments ? "without-documents" : r.recordStatus ?? "pending") as "pending" | "approved" | "rejected" | "without-documents",
      })),
    [filteredRecords]
  );

  const selectedRecord = useMemo(() => {
    if (!selectedId) return null;
    const r = MOCK_RECORDS.find((x) => x.id === selectedId);
    if (!r) return null;
    const { id: _id, withoutDocuments: _w, ...detail } = r;
    return detail as RecordDetailData;
  }, [selectedId]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleFilterChange = useCallback((filter: RecordStatusFilter) => setActiveFilter(filter), []);
  const handleNewRecord = useCallback(() => setConfirmCreateOpen(true), []);

  const handleConfirmCreate = useCallback(() => {
    setConfirmCreateOpen(false);
    setExpedientModalOpen(true);
  }, []);

  const handleExpedientSubmit = useCallback(
    (data: { studentCI: string; studentName: string; recordType: string; studentEmail?: string; studentBirthDate?: string; recordLocation?: string }) => {
      console.log("Nuevo expediente creado", data);
      setSelectedId("1");
    },
    []
  );
  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedId(null);
    console.log("Refrescar");
  }, []);
  const handleUpdateDocuments = useCallback(() => console.log("Actualizar documentos"), []);
  const handleUploadRecord = useCallback(() => setShowCargarExpedientModal(true), []);

  const handleCargarExpedientSubmit = useCallback((data: CargarExpedientFormData) => {
    console.log("Cargar expediente", data);
    setShowCargarExpedientModal(false);
  }, []);
  const handleCargarExpedientCancel = useCallback(() => setShowCargarExpedientModal(false), []);
  const handleEdit = useCallback(() => console.log("Editar expediente"), []);
  const handleDelete = useCallback(() => setConfirmDeleteOpen(true), []);

  const handleConfirmDelete = useCallback(() => {
    setSelectedId(null);
    setConfirmDeleteOpen(false);
  }, []);
  const handleViewDocument = useCallback((id: string) => console.log("Ver documento", id), []);
  const handleDocumentObservation = useCallback((id: string) => console.log("Observación documento", id), []);
  const handleViewHistory = useCallback(() => console.log("Ver historial"), []);

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
                documents={selectedRecord ? MOCK_DOCUMENTS : []}
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
        record={null}
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
