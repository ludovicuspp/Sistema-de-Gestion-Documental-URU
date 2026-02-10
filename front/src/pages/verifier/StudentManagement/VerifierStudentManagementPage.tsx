import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { StudentList } from "@/components/organisms/StudentList";
import { StudentDetails } from "@/components/organisms/StudentDetails";
import type { StudentListItem } from "@/components/organisms/StudentList";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import { VERIFICADOR_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierStudentManagementPage.css";

const MOCK_STUDENTS: StudentListItem[] = [
  {
    id: "1",
    name: "Ludovicus Van Vargas",
    ciNivelEstado: "CI: 0113 · Pregrado · Activo",
    levelLabel: "Pregrado",
    status: "Activo",
    lastModified: "2025-11-12",
  },
  {
    id: "2",
    name: "María Pérez",
    ciNivelEstado: "CI: 98765432 · Postgrado · Activo",
    levelLabel: "Postgrado",
    status: "Activo",
    lastModified: "2025-10-10",
  },
];

const MOCK_DETAILS: Record<string, StudentDetail> = {
  "1": {
    id: "1",
    name: "Ludovicus Van Vargas",
    studentId: "0113",
    birthDate: "01/09/2003",
    email: "luis@brainv.com",
    cedula: "0113",
    nivel: "Pregrado",
    carrera: "Ingeniería Informática",
    estado: "Activo",
    expedienteSummary: "Expediente · Pregrado · Estante 3/Caja 12/Fila B",
  },
  "2": {
    id: "2",
    name: "María Pérez",
    studentId: "98765432",
    birthDate: "15/03/1998",
    email: "maria@example.com",
    cedula: "98765432",
    nivel: "Postgrado",
    carrera: "Maestría en Sistemas",
    estado: "Activo",
  },
};

/**
 * VerifierStudentManagementPage - Page (Verifier)
 *
 * Student management view for Verifier role: consult students, view detail,
 * academic info and associated records. No history/observations section.
 */
export const VerifierStudentManagementPage = () => {
  const navigate = useNavigate();
  const [students] = useState<StudentListItem[]>(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedStudent =
    selectedStudentId ? (MOCK_DETAILS[selectedStudentId] ?? null) : null;

  const handleViewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
  }, []);

  const handleViewExpedientes = useCallback((id: string) => {
    navigate("/admin/records");
  }, [navigate]);

  const handleNewExpediente = useCallback((id: string) => {
    navigate("/admin/records");
  }, [navigate]);

  const filteredStudents = searchQuery
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.ciNivelEstado.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  return (
    <DashboardTemplate
      currentView="Gestión de estudiantes"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFICADOR_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-student-management-page">
        <div className="verifier-student-management-page__top">
          <StudentList
            students={filteredStudents}
            onSearch={setSearchQuery}
            onViewStudent={handleViewStudent}
            onFilterCareer={() => {}}
            onFilterSelect={() => {}}
            showCreateActions={false}
          />
        </div>
        <div className="verifier-student-management-page__count">
          {filteredStudents.length} estudiantes
        </div>
        <div className="verifier-student-management-page__bottom">
          <StudentDetails
            student={selectedStudent}
            onViewExpedientes={handleViewExpedientes}
            onNewExpediente={handleNewExpediente}
            showEditDeleteActions={false}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
