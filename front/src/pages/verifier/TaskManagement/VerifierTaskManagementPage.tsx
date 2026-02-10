import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import { RecordDocumentsList } from "@/components/organisms/RecordDocumentsList";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { RecordDocumentListItem } from "@/components/organisms/RecordDocumentsList";
import { VERIFICADOR_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierTaskManagementPage.css";

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

/**
 * VerifierTaskManagementPage - Page (Verifier)
 *
 * Task management view for Verifier role: search student, view record details,
 * status filters, and document list with Ver/Observación. No observations column.
 */
export const VerifierTaskManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RecordStatusFilter>("pending");
  const [selectedRecord, setSelectedRecord] = useState<RecordDetailData | null>(MOCK_RECORD);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((filter: RecordStatusFilter) => {
    setActiveFilter(filter);
  }, []);

  const handleNewRecord = useCallback(() => {
    navigate("/admin/records");
  }, [navigate]);

  const handleUpdateDocuments = useCallback(() => {}, []);

  const handleUploadRecord = useCallback(() => {
    navigate("/admin/records");
  }, [navigate]);

  const handleEdit = useCallback(() => {}, []);

  const handleDelete = useCallback(() => {}, []);

  const handleViewDocument = useCallback((id: string) => {}, []);

  const handleDocumentObservation = useCallback((id: string) => {}, []);

  return (
    <DashboardTemplate
      currentView="Gestión de tareas"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFICADOR_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-task-management-page">
        <div className="verifier-task-management-page__search">
          <RecordSearchCard
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onNewRecord={handleNewRecord}
          />
        </div>
        <div className="verifier-task-management-page__content">
          <div className="verifier-task-management-page__detail">
            <RecordDetailCard
              record={selectedRecord}
              onUpdateDocuments={handleUpdateDocuments}
              onUploadRecord={handleUploadRecord}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
          <div className="verifier-task-management-page__documents">
            <RecordDocumentsList
              title="Documentos"
              documents={selectedRecord ? MOCK_DOCUMENTS : []}
              onViewDocument={handleViewDocument}
              onObservation={handleDocumentObservation}
            />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};
