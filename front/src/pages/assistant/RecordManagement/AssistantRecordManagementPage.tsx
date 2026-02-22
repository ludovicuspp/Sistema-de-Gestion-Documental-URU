import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import { RecordDocumentsList } from "@/components/organisms/RecordDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { RecordDocumentListItem } from "@/components/organisms/RecordDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantRecordManagementPage.css";

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
  const [selectedRecord, setSelectedRecord] = useState<RecordDetailData | null>(MOCK_RECORD);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleFilterChange = useCallback((filter: RecordStatusFilter) => setActiveFilter(filter), []);
  const handleNewRecord = useCallback(() => console.log("Nuevo expediente"), []);
  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedRecord(null);
    console.log("Refrescar");
  }, []);
  const handleUpdateDocuments = useCallback(() => console.log("Actualizar documentos"), []);
  const handleUploadRecord = useCallback(() => console.log("Cargar expediente"), []);
  const handleEdit = useCallback(() => console.log("Editar expediente"), []);
  const handleDelete = useCallback(() => console.log("Eliminar expediente"), []);
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
    </DashboardTemplate>
  );
};
