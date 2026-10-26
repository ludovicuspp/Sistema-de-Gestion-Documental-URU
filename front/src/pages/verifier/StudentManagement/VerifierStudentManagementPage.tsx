import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { StudentList } from "@/components/organisms/StudentList";
import type { StudentListItem } from "@/components/organisms/StudentList";
import { StudentDetails } from "@/components/organisms/StudentDetails";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Pagination } from "@/components/molecules/Pagination";
import { Button } from "@/components/atoms/Button";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { studentsService, type StudentDto } from "@/services/api/studentsService";
import { ApiError, clearSession } from "@/services/api/http";
import { usePagedList } from "@/hooks/usePagedList";
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
  const [, setSelectedStudentId] = useState<string | null>(null);
  const [detailDto, setDetailDto] = useState<StudentDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryKey, setQueryKey] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleListError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setLoadError(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista de estudiantes."
      );
    },
    [navigate]
  );

  const loadStudentsPage = useCallback(
    (page: number, size: number) => studentsService.search(queryKey, undefined, page, size),
    [queryKey]
  );

  const paged = usePagedList(loadStudentsPage, 20, handleListError);
  const dtos = paged.items;
  const loadingList = paged.loading;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      paged.setPage(0);
      setQueryKey(searchQuery);
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const selectedStudent = detailDto ? toDetail(detailDto) : null;
  const items = dtos.map(toListItem);

  const handleViewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
    void (async () => {
      try {
        const fresh = await studentsService.byId(Number(id));
        setDetailDto(fresh);
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
        setDetailDto(null);
      }
    })();
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedStudentId(null);
    setDetailDto(null);
    setQueryKey("");
    paged.setPage(0);
    paged.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {loadingList ? "Cargando estudiantes…" : `${paged.totalElements} estudiantes`}
        </div>
        <Pagination
          page={paged.page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          onPageChange={paged.setPage}
        />
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
              paged.reload();
            }}
          >
            Reintentar
          </Button>
        }
      />
    </DashboardTemplate>
  );
};
