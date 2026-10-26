import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { StudentList } from "@/components/organisms/StudentList";
import { StudentDetails } from "@/components/organisms/StudentDetails";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { StudentFormModal } from "@/components/molecules/StudentFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
import type { StudentListItem } from "@/components/organisms/StudentList";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import { studentsService, type StudentDto } from "@/services/api/studentsService";
import { ApiError, clearSession } from "@/services/api/http";
import { usePagedList } from "@/hooks/usePagedList";
import { Pagination } from "@/components/molecules/Pagination";
import "./StudentManagementPage.css";

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

const resolveNames = (name: string): [string, string] => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() ?? "";
  const lastName = parts.length > 0 ? parts.join(" ") : firstName;
  return [firstName, lastName];
};

const resolveType = (nivel: string): string => {
  if (nivel === "postgrado") return "POSTGRADO";
  if (nivel === "cursos_avanzados") return "CURSOS_AVANZADOS";
  return "PREGRADO";
};

const resolveStatus = (estado: string): string =>
  estado === "inactivo" ? "INACTIVO" : "ACTIVO";

/**
 * StudentManagementPage - Page
 *
 * Student management view: consult students, view detail, academic info and history.
 * Datos reales desde students-service (search/crear/editar/eliminar).
 * Based on UserManagementPage layout.
 */
export const StudentManagementPage = () => {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [detailDto, setDetailDto] = useState<StudentDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryKey, setQueryKey] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDetail | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [studentNotFoundAlert, setStudentNotFoundAlert] = useState(false);
  const [noRecordAlert, setNoRecordAlert] = useState(false);

  const handleListError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setApiErrorMessage(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista de estudiantes."
      );
      setNetworkErrorAlert(true);
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

  const selectedDto = detailDto;
  const selectedStudent = selectedDto ? toDetail(selectedDto) : null;
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
        setApiErrorMessage(
          err instanceof ApiError ? err.message : "No se pudo cargar el estudiante."
        );
        setSelectedStudentId(null);
        setDetailDto(null);
        setStudentNotFoundAlert(true);
      }
    })();
  }, [navigate]);

  const handleNewStudent = useCallback(() => {
    setEditingStudent(null);
    setStudentModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedStudentId(null);
    setDetailDto(null);
    setQueryKey("");
    paged.setPage(0);
    paged.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = useCallback(async (id: string) => {
    const cached = dtos.find((d) => String(d.id) === id) ?? detailDto;
    if (cached && String(cached.id) === id) {
      setEditingStudent(toDetail(cached));
      setStudentModalOpen(true);
      return;
    }
    try {
      const fresh = await studentsService.byId(Number(id));
      setDetailDto(fresh);
      setEditingStudent(toDetail(fresh));
      setStudentModalOpen(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setApiErrorMessage(
        err instanceof ApiError ? err.message : "No se pudo cargar el estudiante."
      );
      setStudentNotFoundAlert(true);
    }
  }, [dtos, detailDto, navigate]);

  const handleDelete = useCallback((id: string) => {
    setDeletingStudentId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingStudentId) return;
    const id = Number(deletingStudentId);
    try {
      await studentsService.remove(id);
      if (selectedStudentId === deletingStudentId) {
        setSelectedStudentId(null);
        setDetailDto(null);
      }
      setConfirmDeleteOpen(false);
      setDeletingStudentId(null);
      paged.reload();
      setOperationCompletedAlert(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setApiErrorMessage(
        err instanceof ApiError ? err.message : "No se pudo eliminar el estudiante."
      );
      setConfirmDeleteOpen(false);
      if (err instanceof ApiError && err.status === 403) {
        setCannotDeleteGraduatedAlert(true);
      } else {
        setOperationFailedAlert(true);
      }
    }
  }, [deletingStudentId, selectedStudentId, navigate, paged]);

  const handleViewExpedientes = useCallback(() => {
    navigate("/admin/records");
  }, [navigate]);

  const handleNewExpediente = useCallback(() => {
    navigate("/admin/records");
  }, [navigate]);

  const [incompleteDataAlert, setIncompleteDataAlert] = useState(false);
  const [duplicateRecordAlert, setDuplicateRecordAlert] = useState(false);
  const [editNotAllowedAlert, setEditNotAllowedAlert] = useState(false);
  const [cannotEditAlert, setCannotEditAlert] = useState(false);
  const [invalidDataAlert, setInvalidDataAlert] = useState(false);
  const [recordNotFoundAlert, setRecordNotFoundAlert] = useState(false);
  const [recordDeletedAlert, setRecordDeletedAlert] = useState(false);
  const [cannotDeleteAlert, setCannotDeleteAlert] = useState(false);
  const [recordLinkedAlert, setRecordLinkedAlert] = useState(false);
  const [recordBlockedAlert, setRecordBlockedAlert] = useState(false);
  const [errorsFoundAlert, setErrorsFoundAlert] = useState(false);
  const [incompleteFieldsAlert, setIncompleteFieldsAlert] = useState(false);
  const [duplicateStudentAlert, setDuplicateStudentAlert] = useState(false);
  const [networkErrorAlert, setNetworkErrorAlert] = useState(false);
  const [editConflictAlert, setEditConflictAlert] = useState(false);
  const [cannotEditGraduatedAlert, setCannotEditGraduatedAlert] = useState(false);
  const [saveChangesErrorAlert, setSaveChangesErrorAlert] = useState(false);
  const [editConflictAlert2, setEditConflictAlert2] = useState(false);
  const [incompleteDataAlert2, setIncompleteDataAlert2] = useState(false);
  const [noStudentsFoundAlert, setNoStudentsFoundAlert] = useState(false);
  const [cannotDeleteGraduatedAlert, setCannotDeleteGraduatedAlert] = useState(false);
  const [cannotDeleteActiveRecordsAlert, setCannotDeleteActiveRecordsAlert] = useState(false);
  const [incompleteDataAlert3, setIncompleteDataAlert3] = useState(false);
  const [taskNotFoundAlert, setTaskNotFoundAlert] = useState(false);
  const [formNotAvailableAlert, setFormNotAvailableAlert] = useState(false);
  const [incompleteDataAlert4, setIncompleteDataAlert4] = useState(false);
  const [invalidEmailAlert, setInvalidEmailAlert] = useState(false);
  const [studentNotRegisteredAlert, setStudentNotRegisteredAlert] = useState(false);
  const [documentsNotAvailableAlert, setDocumentsNotAvailableAlert] = useState(false);
  const [duplicateRequestAlert, setDuplicateRequestAlert] = useState(false);
  const [saveRequestErrorAlert, setSaveRequestErrorAlert] = useState(false);
  const [recordNotFoundHistoryAlert, setRecordNotFoundHistoryAlert] = useState(false);
  const [noPermissionHistoryAlert, setNoPermissionHistoryAlert] = useState(false);
  const [noHistoryChangesAlert, setNoHistoryChangesAlert] = useState(false);
  const [confirmRejectAlert, setConfirmRejectAlert] = useState(false);
  const [missingDocsAlert, setMissingDocsAlert] = useState(false);
  const [invalidObservationAlert, setInvalidObservationAlert] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [noDataAvailableAlert, setNoDataAvailableAlert] = useState(false);
  const [saveChangesErrorAlert2, setSaveChangesErrorAlert2] = useState(false);
  const [serverErrorAlert, setServerErrorAlert] = useState(false);
  const [emailServerErrorAlert, setEmailServerErrorAlert] = useState(false);
  const [sessionExpiredAlert, setSessionExpiredAlert] = useState(false);
  const [accessDeniedAlert, setAccessDeniedAlert] = useState(false);
  const [maintenanceAlert, setMaintenanceAlert] = useState(false);
  const [operationCompletedAlert, setOperationCompletedAlert] = useState(false);
  const [operationFailedAlert, setOperationFailedAlert] = useState(false);
  const [observationSavedAlert, setObservationSavedAlert] = useState(false);
  const [previewNotAvailableAlert, setPreviewNotAvailableAlert] = useState(false);
  const [importCompletedAlert, setImportCompletedAlert] = useState(false);
  const [downloadCompletedAlert, setDownloadCompletedAlert] = useState(false);
  const [corruptedFileAlert, setCorruptedFileAlert] = useState(false);
  const [importErrorAlert, setImportErrorAlert] = useState(false);
  const [pendingSendAlert, setPendingSendAlert] = useState(false);

  const handleStudentSubmit = useCallback(
    async (data: { name: string; cedula: string; nivel: string; carrera: string; estado: string }) => {
      const [firstName, lastName] = resolveNames(data.name);
      const type = resolveType(data.nivel);
      const status = resolveStatus(data.estado);
      try {
        if (editingStudent) {
          const id = Number(editingStudent.id);
          const previous = dtos.find((d) => String(d.id) === editingStudent.id) ?? detailDto;
          const updated = await studentsService.update(id, {
            ci: data.cedula.trim(),
            firstName,
            lastName,
            careerId: previous?.careerId ?? undefined,
            academicLevelId: previous?.academicLevelId ?? undefined,
            status,
            type,
          });
          setDetailDto(updated);
          paged.reload();
        } else {
          const created = await studentsService.create({
            ci: data.cedula.trim(),
            firstName,
            lastName,
            status,
            type,
          });
          setDetailDto(created);
          setSelectedStudentId(String(created.id));
          paged.reload();
        }
        setEditingStudent(null);
        setOperationCompletedAlert(true);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          navigate("/");
          return;
        }
        setApiErrorMessage(
          err instanceof ApiError ? err.message : "No se pudo guardar el estudiante."
        );
        if (err instanceof ApiError && err.status === 403) {
          setCannotEditGraduatedAlert(true);
        } else if (err instanceof ApiError && (err.status === 409 || err.code === "ALREADY_EXISTS")) {
          setDuplicateStudentAlert(true);
        } else {
          setSaveChangesErrorAlert(true);
        }
      }
    },
    [editingStudent, dtos, detailDto, navigate, paged]
  );

  return (
    <DashboardTemplate
      currentView="Gestión de estudiantes"
      onCreateUser={handleNewStudent}
      onRefresh={handleRefresh}
    >
      <div className="student-management-page">
        <div className="student-management-page__top">
          <StudentList
            students={items}
            onSearch={setSearchQuery}
            onViewStudent={handleViewStudent}
            onFilterCareer={() => {}}
            onFilterSelect={() => {}}
            onNewStudent={handleNewStudent}
            onImportList={() => {}}
          />
        </div>
        <div className="student-management-page__count">
          {loadingList ? "Cargando estudiantes…" : `${paged.totalElements} estudiantes`}
        </div>
        <Pagination
          page={paged.page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          onPageChange={paged.setPage}
        />
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
              entries={[]}
              onViewAll={() => {}}
            />
          </div>
        </div>
      </div>
      <StudentFormModal
        open={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        student={editingStudent}
        onSubmit={(data) => { void handleStudentSubmit(data); }}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => { setConfirmDeleteOpen(false); setDeletingStudentId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={() => { void handleConfirmDelete(); }}
      />
      <AlertModal
        open={studentNotFoundAlert}
        type="warning"
        title="Estudiante no registrado"
        message={apiErrorMessage || "No existe un estudiante con esos datos. Puedes registrarlo."}
        buttonLabel="Cancelar"
        onClose={() => setStudentNotFoundAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setStudentNotFoundAlert(false);
              handleNewStudent();
            }}
          >
            Crear estudiante
          </Button>
        }
      />
      <AlertModal
        open={noRecordAlert}
        type="warning"
        title="Sin expediente asociado"
        message="El estudiante no posee expedientes en el sistema."
        buttonLabel="Cerrar"
        onClose={() => setNoRecordAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setNoRecordAlert(false);
              handleNewExpediente();
            }}
          >
            Crear expediente
          </Button>
        }
      >
        <p style={{ marginTop: "0.75rem", marginBottom: "0.25rem", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
          Opciones disponibles:
        </p>
        <ul className="alert-modal__list">
          <li>Crear expediente nuevo</li>
          <li>Buscar por otro identificador</li>
        </ul>
      </AlertModal>
      <AlertModal
        open={incompleteDataAlert}
        type="warning"
        title="Datos incompletos o inválidos"
        message="Revisa tipo, fecha y ubicación del expediente."
        buttonLabel="Corregir"
        onClose={() => setIncompleteDataAlert(false)}
      />
      <AlertModal
        open={duplicateRecordAlert}
        type="warning"
        title="Ya existe expediente de este tipo"
        message="Se encontró un expediente del mismo tipo asociado."
        buttonLabel="Volver"
        onClose={() => setDuplicateRecordAlert(false)}
        actions={
          <>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                setDuplicateRecordAlert(false);
                console.log("Abrir expediente existente");
              }}
            >
              Abrir existente
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                setDuplicateRecordAlert(false);
                console.log("Corregir datos");
              }}
            >
              Corregir
            </Button>
          </>
        }
      />
      <AlertModal
        open={editNotAllowedAlert}
        type="error"
        title="Edición no permitida"
        message="El estudiante está marcado como egresado."
        buttonLabel="Cerrar"
        onClose={() => setEditNotAllowedAlert(false)}
      />
      <AlertModal
        open={cannotEditAlert}
        type="error"
        title="No se puede editar"
        message="El expediente seleccionado no existe o está restringido."
        buttonLabel="Cerrar"
        onClose={() => setCannotEditAlert(false)}
      />
      <AlertModal
        open={invalidDataAlert}
        type="error"
        title="Datos ingresados inválidos"
        message="Tipos de datos no soportados o incompletos"
        buttonLabel="Cerrar"
        onClose={() => setInvalidDataAlert(false)}
      />
      <AlertModal
        open={recordNotFoundAlert}
        type="warning"
        title="Expediente no encontrado"
        message="No existe el expediente indicado."
        buttonLabel="Cerrar"
        onClose={() => setRecordNotFoundAlert(false)}
      />
      <AlertModal
        open={recordDeletedAlert}
        type="warning"
        title="Expediente ya eliminado"
        message="Este expediente fue eliminado previamente."
        buttonLabel="Cerrar"
        onClose={() => setRecordDeletedAlert(false)}
      />
      <AlertModal
        open={cannotDeleteAlert}
        type="error"
        title="No se puede eliminar"
        message="El estudiante es egresado."
        buttonLabel="Entendido"
        onClose={() => setCannotDeleteAlert(false)}
      />
      <AlertModal
        open={recordLinkedAlert}
        type="warning"
        title="Expediente vinculado"
        message="El expediente tiene solicitudes activas vinculadas."
        buttonLabel="Cerrar"
        onClose={() => setRecordLinkedAlert(false)}
      />
      <AlertModal
        open={recordBlockedAlert}
        type="error"
        title="Expediente bloqueado"
        message="No se puede eliminar un expediente bloqueado."
        buttonLabel="Cerrar"
        onClose={() => setRecordBlockedAlert(false)}
      />
      <AlertModal
        open={errorsFoundAlert}
        type="error"
        title="Errores encontrados"
        message="Revise el archivo"
        buttonLabel="Cerrar"
        onClose={() => setErrorsFoundAlert(false)}
      />
      <AlertModal
        open={incompleteFieldsAlert}
        type="warning"
        title="Complete los campos obligatorios"
        message="Cédula, nombre completo, correo y documentos requeridos."
        buttonLabel="Corregir"
        onClose={() => setIncompleteFieldsAlert(false)}
      />
      <AlertModal
        open={duplicateStudentAlert}
        type="warning"
        title="Posible estudiante duplicado"
        message={apiErrorMessage || "Se encontraron coincidencias con los datos ingresados."}
        buttonLabel="Cerrar"
        onClose={() => setDuplicateStudentAlert(false)}
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Revisa las coincidencias antes de crear un nuevo registro.
        </p>
      </AlertModal>
      <AlertModal
        open={networkErrorAlert}
        type="error"
        title="Error de red"
        message={apiErrorMessage || "No se pudo conectar con el servidor. Verifica tu conexión y vuelve a intentarlo."}
        buttonLabel="Cerrar"
        onClose={() => setNetworkErrorAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setNetworkErrorAlert(false);
              paged.reload();
            }}
          >
            Reintentar
          </Button>
        }
      />
      <AlertModal
        open={editConflictAlert}
        type="warning"
        title="Conflicto de edición"
        message="Otro usuario modificó el registro. Revisa los cambios."
        buttonLabel="Cerrar"
        onClose={() => setEditConflictAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setEditConflictAlert(false);
              console.log("Refrescar datos");
            }}
          >
            Refrescar
          </Button>
        }
      />

      {/* Caso de uso 14 */}
      <AlertModal
        open={cannotEditGraduatedAlert}
        type="error"
        title="No se puede editar"
        message={apiErrorMessage || "El estudiante es egresado."}
        buttonLabel="Entendido"
        onClose={() => setCannotEditGraduatedAlert(false)}
      />

      <AlertModal
        open={saveChangesErrorAlert}
        type="error"
        title="Error al guardar los cambios"
        message={apiErrorMessage || "No se pudo guardar el registro en la base de datos."}
        buttonLabel="Cerrar"
        onClose={() => setSaveChangesErrorAlert(false)}
      />

      <AlertModal
        open={editConflictAlert2}
        type="warning"
        title="Conflicto de edición"
        message="Otro usuario modificó el registro. Revisa los cambios."
        buttonLabel="Cerrar"
        onClose={() => setEditConflictAlert2(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setEditConflictAlert2(false);
              console.log("Refrescar datos");
            }}
          >
            Refrescar
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

      {/* Caso de uso 15 */}
      <AlertModal
        open={noStudentsFoundAlert}
        type="warning"
        title="No se encontraron estudiantes"
        message="No hay resultados para los criterios ingresados."
        buttonLabel="Entendido"
        onClose={() => setNoStudentsFoundAlert(false)}
      />

      <AlertModal
        open={cannotDeleteGraduatedAlert}
        type="error"
        title="No se puede eliminar"
        message={apiErrorMessage || "El estudiante es egresado."}
        buttonLabel="Entendido"
        onClose={() => setCannotDeleteGraduatedAlert(false)}
      />

      <AlertModal
        open={cannotDeleteActiveRecordsAlert}
        type="warning"
        title="No se puede eliminar"
        message="El estudiante tiene expedientes activos."
        buttonLabel="Entendido"
        onClose={() => setCannotDeleteActiveRecordsAlert(false)}
      />

      {/* Caso de uso 16 */}
      <AlertModal
        open={incompleteDataAlert3}
        type="warning"
        title="Datos incompletos o inválidos"
        message="Rellena toda la información requerida"
        buttonLabel="Corregir"
        onClose={() => setIncompleteDataAlert3(false)}
      />

      {/* Caso de uso 17 */}
      <AlertModal
        open={taskNotFoundAlert}
        type="warning"
        title="Tarea no encontrada"
        message="La tarea indicada no existe."
        buttonLabel="Cerrar"
        onClose={() => setTaskNotFoundAlert(false)}
      />

      {/* Caso de uso 18 */}
      <AlertModal
        open={formNotAvailableAlert}
        type="warning"
        title="Formulario no disponible"
        message="El formulario de solicitudes no está activo en este momento."
        buttonLabel="Cerrar"
        onClose={() => setFormNotAvailableAlert(false)}
      />

      <AlertModal
        open={incompleteDataAlert4}
        type="warning"
        title="Datos incompletos o inválidos"
        message="Rellena toda la información requerida"
        buttonLabel="Corregir"
        onClose={() => setIncompleteDataAlert4(false)}
      />

      <AlertModal
        open={invalidEmailAlert}
        type="warning"
        title="Correo inválido"
        message="No es posible enviar la respuesta al correo recibido."
        buttonLabel="Cerrar"
        onClose={() => setInvalidEmailAlert(false)}
      />

      <AlertModal
        open={studentNotRegisteredAlert}
        type="warning"
        title="Estudiante no registrado"
        message="No se encontró el estudiante al procesar la solicitud."
        buttonLabel="Cerrar"
        onClose={() => setStudentNotRegisteredAlert(false)}
      />

      <AlertModal
        open={documentsNotAvailableAlert}
        type="warning"
        title="Documentos no disponibles"
        message="Los documentos seleccionados no aplican para su estatus."
        buttonLabel="Entendido"
        onClose={() => setDocumentsNotAvailableAlert(false)}
      />

      <AlertModal
        open={duplicateRequestAlert}
        type="warning"
        title="Solicitud duplicada"
        message="Ya existe una solicitud enviada hoy."
        buttonLabel="Aceptar"
        onClose={() => setDuplicateRequestAlert(false)}
      />

      <AlertModal
        open={saveRequestErrorAlert}
        type="error"
        title="Error al guardar solicitud"
        message="No se pudo registrar la solicitud por error de red o base de datos."
        buttonLabel="Cerrar"
        onClose={() => setSaveRequestErrorAlert(false)}
      />

      {/* Caso de uso 22 */}
      <AlertModal
        open={recordNotFoundHistoryAlert}
        type="warning"
        title="Expediente no encontrado"
        message="No se pudo cargar el historial del expediente indicado."
        buttonLabel="Cerrar"
        onClose={() => setRecordNotFoundHistoryAlert(false)}
      />

      <AlertModal
        open={noPermissionHistoryAlert}
        type="error"
        title="Sin permisos para ver historial"
        message="Tu rol no tiene acceso a este historial."
        buttonLabel="Cerrar"
        onClose={() => setNoPermissionHistoryAlert(false)}
      />

      <AlertModal
        open={noHistoryChangesAlert}
        type="warning"
        title="Sin modificaciones registradas"
        message="Este expediente no tiene cambios históricos."
        buttonLabel="Entendido"
        onClose={() => setNoHistoryChangesAlert(false)}
      />

      {/* Caso de uso 23 */}
      <AlertModal
        open={confirmRejectAlert}
        type="warning"
        title="Confirmar rechazo"
        message="El rechazo requiere un motivo obligatorio."
        buttonLabel="Rechazar"
        onClose={() => {
          setConfirmRejectAlert(false);
          setRejectReason("");
        }}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setConfirmRejectAlert(false);
              setRejectReason("");
            }}
          >
            Cancelar
          </Button>
        }
      >
        <div style={{ marginTop: "1rem" }}>
          <label
            htmlFor="reject-reason"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            Motivo del rechazo
          </label>
          <textarea
            id="reject-reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Escribe el motivo del rechazo (obligatorio)"
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "0.5rem",
              fontSize: "0.875rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--border-radius-sm)",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
            }}
          >
            El motivo quedará registrado en el historial y se notificará al responsable.
          </p>
        </div>
      </AlertModal>

      <AlertModal
        open={missingDocsAlert}
        type="warning"
        title="Documentos obligatorios faltantes"
        message="No es posible aprobar el expediente."
        buttonLabel="Cerrar"
        onClose={() => setMissingDocsAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setMissingDocsAlert(false);
              console.log("Solicitar reenvío de documentos");
            }}
          >
            Solicitar reenvío
          </Button>
        }
      >
        <div style={{ marginTop: "0.75rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
            Documentos faltantes:
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
            }}
          >
            <li>Cédula de identidad</li>
            <li>Partida de nacimiento</li>
          </ul>
        </div>
      </AlertModal>

      {/* Caso de uso 24 */}
      <AlertModal
        open={invalidObservationAlert}
        type="warning"
        title="Observación inválida"
        message="El comentario está vacío o supera el límite permitido."
        buttonLabel="Corregir"
        onClose={() => setInvalidObservationAlert(false)}
      />

      {/* Caso de uso 30 */}
      <AlertModal
        open={noDataAvailableAlert}
        type="warning"
        title="No hay datos disponibles"
        message="No se encontraron datos para los filtros seleccionados."
        buttonLabel="Entendido"
        onClose={() => setNoDataAvailableAlert(false)}
      />

      {/* General */}
      <AlertModal
        open={saveChangesErrorAlert2}
        type="error"
        title="Error al guardar cambios"
        message="Se produjo un error durante la actualización."
        buttonLabel="Cerrar"
        onClose={() => setSaveChangesErrorAlert2(false)}
      />

      <AlertModal
        open={serverErrorAlert}
        type="error"
        title="Error interno del servidor"
        message="Se produjo un error en el servidor."
        buttonLabel="Cerrar"
        onClose={() => setServerErrorAlert(false)}
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Intenta nuevamente más tarde. Si persiste, registra el código de error y contacta soporte.
        </p>
      </AlertModal>

      <AlertModal
        open={emailServerErrorAlert}
        type="error"
        title="Falla en servidor de correo"
        message="El servidor de correo no está disponible."
        buttonLabel="Cerrar"
        onClose={() => setEmailServerErrorAlert(false)}
      />

      <AlertModal
        open={sessionExpiredAlert}
        type="info"
        title="Sesión expirada"
        message="Por seguridad debes iniciar sesión nuevamente."
        buttonLabel="Cerrar"
        onClose={() => setSessionExpiredAlert(false)}
        actions={
          <Button
            variant="primary"
            size="medium"
            onClick={() => {
              setSessionExpiredAlert(false);
              clearSession();
              navigate("/");
            }}
          >
            Ir a inicio de sesión
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Se cerrará la sesión automáticamente en caso de inactividad prolongada.
        </p>
      </AlertModal>

      <AlertModal
        open={accessDeniedAlert}
        type="error"
        title="Acceso denegado"
        message="No tienes permisos para ejecutar esta acción."
        buttonLabel="Cerrar"
        onClose={() => setAccessDeniedAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setAccessDeniedAlert(false);
              console.log("Solicitar acceso");
            }}
          >
            Solicitar acceso
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Solicita elevación de permisos a un administrador si corresponde.
        </p>
      </AlertModal>

      <AlertModal
        open={maintenanceAlert}
        type="info"
        title="Mantenimiento programado"
        message="El sistema estará en mantenimiento en el horario indicado."
        buttonLabel="Cerrar"
        onClose={() => setMaintenanceAlert(false)}
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Algunas funciones están limitadas durante el mantenimiento.
        </p>
      </AlertModal>

      <AlertModal
        open={operationCompletedAlert}
        type="success"
        title="Operación completada"
        message="La acción se realizó correctamente."
        buttonLabel="Cerrar"
        onClose={() => setOperationCompletedAlert(false)}
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Se registró el evento en el historial.
        </p>
      </AlertModal>

      <AlertModal
        open={operationFailedAlert}
        type="error"
        title="Operación fallida"
        message={apiErrorMessage || "No se pudo completar la acción."}
        buttonLabel="Cerrar"
        onClose={() => setOperationFailedAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setOperationFailedAlert(false);
              if (deletingStudentId) {
                void handleConfirmDelete();
              }
            }}
          >
            Reintentar
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Si el problema persiste, contacta al soporte. Código: ERR-OP-001
        </p>
      </AlertModal>

      <AlertModal
        open={observationSavedAlert}
        type="success"
        title="Observación guardada"
        message="La observación se registró correctamente."
        buttonLabel="Cerrar"
        onClose={() => setObservationSavedAlert(false)}
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Se notificó al responsable y quedó registrada en el historial.
        </p>
      </AlertModal>

      <AlertModal
        open={previewNotAvailableAlert}
        type="info"
        title="Previsualización no disponible"
        message="El documento no puede previsualizarse en el visor."
        buttonLabel="Cerrar"
        onClose={() => setPreviewNotAvailableAlert(false)}
        actions={
          <Button
            variant="primary"
            size="medium"
            onClick={() => {
              setPreviewNotAvailableAlert(false);
              console.log("Descargar documento");
            }}
          >
            Descargar
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Descarga el archivo para revisarlo localmente.
        </p>
      </AlertModal>

      <AlertModal
        open={importCompletedAlert}
        type="success"
        title="Importación completada"
        message="Se importaron registros correctamente."
        buttonLabel="Cerrar"
        onClose={() => setImportCompletedAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setImportCompletedAlert(false);
              console.log("Ver reporte de importación");
            }}
          >
            Ver reporte
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Ejemplo: 120 registros importados, 3 omitidos por errores.
        </p>
      </AlertModal>

      <AlertModal
        open={downloadCompletedAlert}
        type="success"
        title="Descarga completada"
        message="El reporte fue generado y descargado correctamente."
        buttonLabel="Cerrar"
        onClose={() => setDownloadCompletedAlert(false)}
      />

      <AlertModal
        open={corruptedFileAlert}
        type="error"
        title="Archivo dañado o ilegible"
        message="El adjunto no se pudo validar para el envío."
        buttonLabel="Cerrar"
        onClose={() => setCorruptedFileAlert(false)}
      />

      <AlertModal
        open={importErrorAlert}
        type="error"
        title="Importación con errores"
        message="No se pudo procesar el archivo de importación."
        buttonLabel="Cerrar"
        onClose={() => setImportErrorAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setImportErrorAlert(false);
              console.log("Descargar log de errores");
            }}
          >
            Descargar log
          </Button>
        }
      >
        <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Errores: fila con cédula duplicada, campos obligatorios vacíos.
        </p>
      </AlertModal>

      <AlertModal
        open={pendingSendAlert}
        type="warning"
        title="Pendiente de envío"
        message="Se produjo un error al generar el archivo adjunto."
        buttonLabel="Cerrar"
        onClose={() => setPendingSendAlert(false)}
      />
    </DashboardTemplate>
  );
};
