import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { StudentList } from "@/components/organisms/StudentList";
import type { StudentListItem } from "@/components/organisms/StudentList";
import { StudentDetails } from "@/components/organisms/StudentDetails";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { studentsService, type StudentDto } from "@/services/api/studentsService";
import { ApiError, clearSession } from "@/services/api/http";
import "./VerifierStudentManagementPage.css";

const capitalizeLabel = (value: string | null | undefined): string => {
  if (!value) return "—";
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const toListItem = (dto: StudentDto): StudentListItem => {
  const name = `${dto.firstName} ${dto.lastName}`.trim();
  const levelLabel = capitalizeLabel(dto.type);
  const statusLabel = capitalizeLabel(dto.status);
  return {
    id: String(dto.id),
    name,
    ciNivelEstado: `CI: ${dto.ci} - ${levelLabel} - ${statusLabel}`,
    levelLabel,
    status: statusLabel,
    lastModified: "",
  };
};

const toDetail = (dto: StudentDto): StudentDetail => ({
  id: String(dto.id),
  name: `${dto.firstName} ${dto.lastName}`.trim(),
  studentId: dto.ci,
  birthDate: dto.birthdate ?? undefined,
  email: dto.email ?? undefined,
  cedula: dto.ci,
  nivel: capitalizeLabel(dto.type),
  carrera: dto.careerId != null ? String(dto.careerId) : undefined,
  estado: capitalizeLabel(dto.status),
});

/**
 * VerifierStudentManagementPage - Page (Verifier)
 *
 * Student management view for Verifier role: consult students, view detail,
 * academic info and associated records. Same structure as admin but without
 * history/observations section. Based on the provided image layout.
 * Solo lectura: sin botones de crear/editar/eliminar.
 */
export const VerifierStudentManagementPage = () => {
  const navigate = useNavigate();
  const [dtos, setDtos] = useState<StudentDto[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const searchSeq = useRef(0);

  const loadStudents = useCallback(async (query: string) => {
    const seq = ++searchSeq.current;
    setLoadingList(true);
    try {
      const data = await studentsService.search(query);
      if (searchSeq.current !== seq) return;
      setDtos(data);
    } catch (err) {
      if (searchSeq.current !== seq) return;
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setLoadError(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista de estudiantes."
      );
    } finally {
      if (searchSeq.current === seq) setLoadingList(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStudents(searchQuery);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [loadStudents, searchQuery]);

  const selectedDto =
    selectedStudentId ? (dtos.find((d) => String(d.id) === selectedStudentId) ?? null) : null;
  const selectedStudent = selectedDto ? toDetail(selectedDto) : null;
  const items = dtos.map(toListItem);

  const handleViewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
    void (async () => {
      try {
        const fresh = await studentsService.byId(Number(id));
        setDtos((prev) =>
          prev.some((d) => d.id === fresh.id)
            ? prev.map((d) => (d.id === fresh.id ? fresh : d))
            : [...prev, fresh]
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          navigate("/");
          return;
        }
        setLoadError(
          err instanceof ApiError ? err.message : "No se pudo cargar el estudiante."
        );
        setSelectedStudentId(null);
      }
    })();
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedStudentId(null);
    void loadStudents("");
  }, [loadStudents]);

  const handleViewExpedientes = useCallback(() => {
    navigate("/verifier/records");
  }, [navigate]);

  const handleNewExpediente = useCallback(() => {
    navigate("/verifier/records");
  }, [navigate]);

  return (
    <DashboardTemplate
      currentView="Gestión de estudiantes"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={handleRefresh}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFIER_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-student-management-page">
        <div className="verifier-student-management-page__top">
          <StudentList
            students={items}
            onSearch={setSearchQuery}
            onViewStudent={handleViewStudent}
            onFilterCareer={() => {}}
            onFilterSelect={() => {}}
            showCreateActions={false}
          />
        </div>
        <div className="verifier-student-management-page__count">
          {loadingList ? "Cargando estudiantes…" : `${items.length} estudiantes`}
        </div>
        <div className="verifier-student-management-page__bottom">
          <div className="verifier-student-management-page__detail">
            <StudentDetails
              student={selectedStudent}
              onViewExpedientes={handleViewExpedientes}
              onNewExpediente={handleNewExpediente}
              showEditDeleteActions={false}
            />
          </div>
        </div>
      </div>
      <AlertModal
        open={loadError !== null}
        type="error"
        title="Error al cargar estudiantes"
        message={loadError ?? ""}
        buttonLabel="Cerrar"
        onClose={() => setLoadError(null)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setLoadError(null);
              void loadStudents(searchQuery);
            }}
          >
            Reintentar
          </Button>
        }
      />
    </DashboardTemplate>
  );
};
