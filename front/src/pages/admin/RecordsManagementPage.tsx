import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RecordFiltersCard } from "@/components/organisms/RecordFiltersCard";
import { RecordStudentCard } from "@/components/organisms/RecordStudentCard";
import { RecordDetailCard } from "@/components/organisms/RecordDetailCard";
import type { RecordFilterTab } from "@/components/organisms/RecordFiltersCard";
import type { RecordStudent } from "@/components/organisms/RecordStudentCard";
import type { RecordDetail } from "@/components/organisms/RecordDetailCard";
import "./RecordsManagementPage.css";

const MOCK_STUDENT: RecordStudent = {
  id: "1",
  name: "Ludovicus Van Vargas",
  cedula: "0113",
  birthDate: "01/09/2003",
  email: "luis@brainv.com",
  initials: "LV",
};

const MOCK_RECORD: RecordDetail = {
  id: "1",
  type: "Expediente - Pregrado",
  createdAt: "2025-08-01",
  location: "Estante 3 / Caja 12 / Fila B",
  status: "Pendiente",
  statusVariant: "pending",
  documents: [
    {
      id: "d1",
      label: "Cédula de Identidad",
      fileName: "cedula.pdf",
      size: "220 KB",
    },
    {
      id: "d2",
      label: "Partida de Nacimiento",
      fileName: "partida.pdf",
      size: "180 KB",
    },
    {
      id: "d3",
      label: "Notas Certificadas",
      fileName: "notas.pdf",
      size: "1.2 MB",
    },
  ],
  observations: [
    {
      id: "o1",
      date: "2025-11-12",
      author: "Verificador A",
      text: 'Documento "Partida de Nacimiento" ilegible — solicitar reescan.',
    },
    {
      id: "o2",
      date: "2025-11-10",
      author: "Asistente B",
      text: "Cédula cargada y vinculada correctamente.",
    },
  ],
};

/**
 * RecordsManagementPage - Page (Admin)
 *
 * Records (expedientes) management: search student, filters, student card, record detail with documents and observations.
 */
export const RecordsManagementPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<RecordFilterTab>("pending");
  const [selectedStudent, setSelectedStudent] = useState<RecordStudent | null>(MOCK_STUDENT);
  const [selectedRecord, setSelectedRecord] = useState<RecordDetail | null>(MOCK_RECORD);

  const handleCreateRecord = useCallback(() => {
    // TODO: open modal or navigate to create record form
    console.log("Create record");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchValue("");
    setSelectedStudent(null);
    setSelectedRecord(null);
    console.log("Refresh");
  }, []);

  const handleLogout = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleUpdateDocuments = useCallback((studentId: string) => {
    console.log("Update documents", studentId);
  }, []);

  const handleUploadRecord = useCallback((studentId: string) => {
    console.log("Upload record", studentId);
  }, []);

  const handleEditRecord = useCallback((recordId: string) => {
    console.log("Edit record", recordId);
  }, []);

  const handleDeleteRecord = useCallback((recordId: string) => {
    console.log("Delete record", recordId);
  }, []);

  const handleViewHistory = useCallback(() => {
    console.log("View observations history");
  }, []);

  const displayStudent = useMemo(() => {
    if (!searchValue.trim()) return selectedStudent;
    const q = searchValue.trim().toLowerCase();
    if (!selectedStudent) return null;
    const matches =
      selectedStudent.name.toLowerCase().includes(q) ||
      selectedStudent.cedula.toLowerCase().includes(q) ||
      selectedStudent.email.toLowerCase().includes(q);
    return matches ? selectedStudent : null;
  }, [searchValue, selectedStudent]);

  const displayRecord = displayStudent ? selectedRecord : null;

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={handleRefresh}
      onPrivacyClick={() => {}}
    >
      <div className="records-management-page">
        <RecordFiltersCard
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateRecord={handleCreateRecord}
        />
        <RecordStudentCard
          student={displayStudent}
          onUpdateDocuments={handleUpdateDocuments}
          onUploadRecord={handleUploadRecord}
        />
        <RecordDetailCard
          record={displayRecord}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onViewHistory={handleViewHistory}
        />
      </div>
    </DashboardTemplate>
  );
};
