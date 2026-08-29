import { useState, useCallback } from "react";
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
  const [students, setStudents] = useState<StudentListItem[]>(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDetail | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [studentNotFoundAlert, setStudentNotFoundAlert] = useState(false);
  const [noRecordAlert, setNoRecordAlert] = useState(false);

  const selectedStudent =
    selectedStudentId ? (MOCK_DETAILS[selectedStudentId] ?? null) : null;

  const handleViewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
  }, []);

  const handleNewStudent = useCallback(() => {
    setEditingStudent(null);
    setStudentModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedStudentId(null);
    console.log("Refrescar");
  }, []);

  const handleEdit = useCallback((id: string) => {
    const student = MOCK_DETAILS[id] ?? null;
    setEditingStudent(student);
    setStudentModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeletingStudentId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingStudentId) {
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudentId));
      if (selectedStudentId === deletingStudentId) setSelectedStudentId(null);
      setConfirmDeleteOpen(false);
      setDeletingStudentId(null);
    }
  }, [deletingStudentId, selectedStudentId]);

  const handleViewExpedientes = useCallback((id: string) => {
    const student = MOCK_DETAILS[id];
    if (!student?.expedienteSummary) {
      setNoRecordAlert(true);
      return;
    }
    navigate("/admin/records");
  }, [navigate]);

  const handleNewExpediente = useCallback((_id: string) => {
    navigate("/admin/records");
  }, [navigate]);

  // TEMPORAL: Funciones para probar las alertas - ELIMINAR después de probar
  const handleTestNoRecordAlert = useCallback(() => {
    setNoRecordAlert(true);
  }, []);

  const handleTestStudentNotFound = useCallback(() => {
    setStudentNotFoundAlert(true);
  }, []);

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

  const handleTestIncompleteData = useCallback(() => {
    setIncompleteDataAlert(true);
  }, []);

  const handleTestDuplicateRecord = useCallback(() => {
    setDuplicateRecordAlert(true);
  }, []);

  const handleTestEditNotAllowed = useCallback(() => {
    setEditNotAllowedAlert(true);
  }, []);

  const handleTestCannotEdit = useCallback(() => {
    setCannotEditAlert(true);
  }, []);

  const handleTestInvalidData = useCallback(() => {
    setInvalidDataAlert(true);
  }, []);

  const handleTestRecordNotFound = useCallback(() => {
    setRecordNotFoundAlert(true);
  }, []);

  const handleTestRecordDeleted = useCallback(() => {
    setRecordDeletedAlert(true);
  }, []);

  const handleTestCannotDelete = useCallback(() => {
    setCannotDeleteAlert(true);
  }, []);

  const handleTestRecordLinked = useCallback(() => {
    setRecordLinkedAlert(true);
  }, []);

  const handleTestRecordBlocked = useCallback(() => {
    setRecordBlockedAlert(true);
  }, []);

  const handleTestErrorsFound = useCallback(() => {
    setErrorsFoundAlert(true);
  }, []);

  const handleTestIncompleteFields = useCallback(() => {
    setIncompleteFieldsAlert(true);
  }, []);

  const handleTestDuplicateStudent = useCallback(() => {
    setDuplicateStudentAlert(true);
  }, []);

  const handleTestNetworkError = useCallback(() => {
    setNetworkErrorAlert(true);
  }, []);

  const handleTestEditConflict = useCallback(() => {
    setEditConflictAlert(true);
  }, []);

  const handleTestCannotEditGraduated = useCallback(() => {
    setCannotEditGraduatedAlert(true);
  }, []);

  const handleTestSaveChangesError = useCallback(() => {
    setSaveChangesErrorAlert(true);
  }, []);

  const handleTestEditConflict2 = useCallback(() => {
    setEditConflictAlert2(true);
  }, []);

  const handleTestIncompleteData2 = useCallback(() => {
    setIncompleteDataAlert2(true);
  }, []);

  const handleTestNoStudentsFound = useCallback(() => {
    setNoStudentsFoundAlert(true);
  }, []);

  const handleTestCannotDeleteGraduated = useCallback(() => {
    setCannotDeleteGraduatedAlert(true);
  }, []);

  const handleTestCannotDeleteActiveRecords = useCallback(() => {
    setCannotDeleteActiveRecordsAlert(true);
  }, []);

  const handleTestIncompleteData3 = useCallback(() => {
    setIncompleteDataAlert3(true);
  }, []);

  const handleTestTaskNotFound = useCallback(() => {
    setTaskNotFoundAlert(true);
  }, []);

  const handleTestFormNotAvailable = useCallback(() => {
    setFormNotAvailableAlert(true);
  }, []);

  const handleTestIncompleteData4 = useCallback(() => {
    setIncompleteDataAlert4(true);
  }, []);

  const handleTestInvalidEmail = useCallback(() => {
    setInvalidEmailAlert(true);
  }, []);

  const handleTestStudentNotRegistered = useCallback(() => {
    setStudentNotRegisteredAlert(true);
  }, []);

  const handleTestDocumentsNotAvailable = useCallback(() => {
    setDocumentsNotAvailableAlert(true);
  }, []);

  const handleTestDuplicateRequest = useCallback(() => {
    setDuplicateRequestAlert(true);
  }, []);

  const handleTestSaveRequestError = useCallback(() => {
    setSaveRequestErrorAlert(true);
  }, []);

  const handleTestRecordNotFoundHistory = useCallback(() => {
    setRecordNotFoundHistoryAlert(true);
  }, []);

  const handleTestNoPermissionHistory = useCallback(() => {
    setNoPermissionHistoryAlert(true);
  }, []);

  const handleTestNoHistoryChanges = useCallback(() => {
    setNoHistoryChangesAlert(true);
  }, []);

  const handleTestConfirmReject = useCallback(() => {
    setConfirmRejectAlert(true);
  }, []);

  const handleTestMissingDocs = useCallback(() => {
    setMissingDocsAlert(true);
  }, []);

  const handleTestInvalidObservation = useCallback(() => {
    setInvalidObservationAlert(true);
  }, []);

  const handleTestNoDataAvailable = useCallback(() => {
    setNoDataAvailableAlert(true);
  }, []);

  const handleTestSaveChangesError2 = useCallback(() => {
    setSaveChangesErrorAlert2(true);
  }, []);

  const handleTestServerError = useCallback(() => {
    setServerErrorAlert(true);
  }, []);

  const handleTestEmailServerError = useCallback(() => {
    setEmailServerErrorAlert(true);
  }, []);

  const handleTestSessionExpired = useCallback(() => {
    setSessionExpiredAlert(true);
  }, []);

  const handleTestAccessDenied = useCallback(() => {
    setAccessDeniedAlert(true);
  }, []);

  const handleTestMaintenance = useCallback(() => {
    setMaintenanceAlert(true);
  }, []);

  const handleTestOperationCompleted = useCallback(() => {
    setOperationCompletedAlert(true);
  }, []);

  const handleTestOperationFailed = useCallback(() => {
    setOperationFailedAlert(true);
  }, []);

  const handleTestObservationSaved = useCallback(() => {
    setObservationSavedAlert(true);
  }, []);

  const handleTestPreviewNotAvailable = useCallback(() => {
    setPreviewNotAvailableAlert(true);
  }, []);

  const handleTestImportCompleted = useCallback(() => {
    setImportCompletedAlert(true);
  }, []);

  const handleTestDownloadCompleted = useCallback(() => {
    setDownloadCompletedAlert(true);
  }, []);

  const handleTestCorruptedFile = useCallback(() => {
    setCorruptedFileAlert(true);
  }, []);

  const handleTestImportError = useCallback(() => {
    setImportErrorAlert(true);
  }, []);

  const handleTestPendingSend = useCallback(() => {
    setPendingSendAlert(true);
  }, []);

  const handleStudentSubmit = useCallback(
    (data: { name: string; cedula: string; nivel: string; carrera: string; estado: string }) => {
      const nivelLabel = data.nivel === "todos" ? "Pregrado" : data.nivel === "pregrado" ? "Pregrado" : "Postgrado";
      const estadoLabel = data.estado === "activo" ? "Activo" : "Inactivo";
      if (editingStudent) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id
              ? {
                  ...s,
                  name: data.name,
                  ciNivelEstado: `CI: ${data.cedula} - ${nivelLabel} - ${estadoLabel}`,
                  levelLabel: nivelLabel,
                  status: estadoLabel,
                }
              : s
          )
        );
        // Actualizar MOCK_DETAILS no es posible directamente, pero la UI usará students
      } else {
        const newId = String(students.length + 1);
        setStudents((prev) => [
          ...prev,
          {
            id: newId,
            name: data.name,
            ciNivelEstado: `CI: ${data.cedula} - ${nivelLabel} - ${estadoLabel}`,
            levelLabel: nivelLabel,
            status: estadoLabel,
            lastModified: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
    },
    [editingStudent, students.length]
  );

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
        {/* TEMPORAL: Botones de prueba - ELIMINAR después de probar */}
        <div style={{ padding: "1rem", background: "#fff3cd", marginBottom: "1rem", borderRadius: "4px" }}>
          <strong>🧪 Botones de prueba (eliminar después):</strong>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="secondary" size="small" onClick={handleTestStudentNotFound}>
              1. Estudiante no registrado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoRecordAlert}>
              2. Sin expediente asociado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteData}>
              5. Datos incompletos
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDuplicateRecord}>
              6. Ya existe expediente
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestEditNotAllowed}>
              9. Edición no permitida
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotEdit}>
              10. No se puede editar
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestInvalidData}>
              11. Datos inválidos
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordNotFound}>
              12. Expediente no encontrado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordDeleted}>
              13. Expediente ya eliminado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotDelete}>
              14. No se puede eliminar
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordLinked}>
              15. Expediente vinculado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordBlocked}>
              16. Expediente bloqueado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestErrorsFound}>
              32. Errores encontrados
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteFields}>
              33. Campos obligatorios (v3)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDuplicateStudent}>
              34. Posible estudiante duplicado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNetworkError}>
              35. Error de red
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestEditConflict}>
              36. Conflicto de edición
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotEditGraduated}>
              37. No se puede editar (egresado)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSaveChangesError}>
              38. Error al guardar cambios
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestEditConflict2}>
              39. Conflicto de edición (v2)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteData2}>
              40. Datos incompletos (v2)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoStudentsFound}>
              41. No se encontraron estudiantes
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotDeleteGraduated}>
              42. No se puede eliminar (egresado)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCannotDeleteActiveRecords}>
              43. No se puede eliminar (expedientes activos)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteData3}>
              44. Datos incompletos o inválidos (v3)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestTaskNotFound}>
              45. Tarea no encontrada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestFormNotAvailable}>
              46. Formulario no disponible
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteData4}>
              47. Datos incompletos o inválidos (v4)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestInvalidEmail}>
              48. Correo inválido
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestStudentNotRegistered}>
              49. Estudiante no registrado (solicitud)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDocumentsNotAvailable}>
              50. Documentos no disponibles
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDuplicateRequest}>
              51. Solicitud duplicada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSaveRequestError}>
              52. Error al guardar solicitud
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestRecordNotFoundHistory}>
              53. Expediente no encontrado (historial)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoPermissionHistory}>
              54. Sin permisos para ver historial
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoHistoryChanges}>
              55. Sin modificaciones registradas
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestConfirmReject}>
              56. Confirmar rechazo
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestMissingDocs}>
              57. Documentos obligatorios faltantes
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestInvalidObservation}>
              58. Observación inválida
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoDataAvailable}>
              59. No hay datos disponibles
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSaveChangesError2}>
              60. Error al guardar cambios (v2)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestServerError}>
              61. Error interno del servidor
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestEmailServerError}>
              62. Falla en servidor de correo
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSessionExpired}>
              63. Sesión expirada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestAccessDenied}>
              64. Acceso denegado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestMaintenance}>
              65. Mantenimiento programado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestOperationCompleted}>
              66. Operación completada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestOperationFailed}>
              67. Operación fallida
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestObservationSaved}>
              68. Observación guardada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestPreviewNotAvailable}>
              69. Previsualización no disponible
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestImportCompleted}>
              70. Importación completada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestDownloadCompleted}>
              71. Descarga completada
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestCorruptedFile}>
              72. Archivo dañado o ilegible
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestImportError}>
              73. Importación con errores
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestPendingSend}>
              74. Pendiente de envío
            </Button>
          </div>
        </div>
        
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
      <StudentFormModal
        open={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        student={editingStudent}
        onSubmit={handleStudentSubmit}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => { setConfirmDeleteOpen(false); setDeletingStudentId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={handleConfirmDelete}
      />
      <AlertModal
        open={studentNotFoundAlert}
        type="warning"
        title="Estudiante no registrado"
        message="No existe un estudiante con esos datos. Puedes registrarlo."
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
              handleNewExpediente(selectedStudentId ?? "");
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
        message="Se encontraron coincidencias con los datos ingresados."
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
        message="No se pudo conectar con el servidor. Verifica tu conexión y vuelve a intentarlo."
        buttonLabel="Cerrar"
        onClose={() => setNetworkErrorAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setNetworkErrorAlert(false);
              console.log("Reintentar conexión");
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
        message="El estudiante es egresado."
        buttonLabel="Entendido"
        onClose={() => setCannotEditGraduatedAlert(false)}
      />

      <AlertModal
        open={saveChangesErrorAlert}
        type="error"
        title="Error al guardar los cambios"
        message="No se pudo guardar el registro en la base de datos."
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
        message="El estudiante es egresado."
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
              console.log("Ir a inicio de sesión");
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
        message="No se pudo completar la acción."
        buttonLabel="Cerrar"
        onClose={() => setOperationFailedAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setOperationFailedAlert(false);
              console.log("Reintentar operación");
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
