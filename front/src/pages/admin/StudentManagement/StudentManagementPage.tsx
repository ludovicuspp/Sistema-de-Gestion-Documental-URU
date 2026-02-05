import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { StudentList } from "@/components/organisms/StudentList";
import { StudentDetails } from "@/components/organisms/StudentDetails";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { StudentListItem } from "@/components/organisms/StudentList";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import "./StudentManagementPage.css";

const MOCK_STUDENTS: StudentListItem[] = [
  {
    id: "1",
    name: "Ludovicus Van Vargas",
    ciNivelEstado: "CI: 0113 - Pregrado - Activo",
    levelLabel: "Pregrado",
    status: "Activo",
    lastModified: "2025-11-12",
  },
  {
    id: "2",
    name: "María Pérez",
    ciNivelEstado: "CI: 98765432 - Postgrado - Activo",
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

const MOCK_HISTORY: ActivityEntry[] = [
  { text: "Partida de Nacimiento ilegible — solicitar reescan.", datetime: "2025-11-12 · Verificador A" },
  { text: "Cédula cargada y vinculada correctamente.", datetime: "2025-11-10 · Asistente B" },
  { text: "Estudiante creado en el sistema.", datetime: "2025-08-02 · Admin" },
];

/**
 * StudentManagementPage - Page
 *
 * Student management view: consult students, view detail, academic info and history.
 * Based on UserManagementPage layout.
 */
export const StudentManagementPage = () => {
  const navigate = useNavigate();
  const [students] = useState<StudentListItem[]>(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedStudent =
    selectedStudentId ? (MOCK_DETAILS[selectedStudentId] ?? null) : null;

  const handleViewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
  }, []);

  const handleNewStudent = useCallback(() => {
    console.log("Nuevo estudiante");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedStudentId(null);
    console.log("Refrescar");
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log("Editar estudiante", id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log("Eliminar estudiante", id);
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
      onCreateUser={handleNewStudent}
      onRefresh={handleRefresh}
    >
      <div className="student-management-page">
        <div className="student-management-page__top">
          <StudentList
            students={filteredStudents}
            onSearch={setSearchQuery}
            onViewStudent={handleViewStudent}
            onFilterCareer={() => {}}
            onFilterSelect={() => {}}
            onNewStudent={handleNewStudent}
            onImportList={() => {}}
          />
        </div>
        <div className="student-management-page__count">{filteredStudents.length} estudiantes</div>
        <div className="student-management-page__bottom">
          <div className="student-management-page__detail">
            <StudentDetails
              student={selectedStudent}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewExpedientes={handleViewExpedientes}
              onNewExpediente={handleNewExpediente}
            />
          </div>
          <div className="student-management-page__history">
            <RecentActivity
              title="Historial / Observaciones"
              linkText="Ver todo"
              entries={selectedStudent ? MOCK_HISTORY : []}
              onViewAll={() => {}}
            />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};
