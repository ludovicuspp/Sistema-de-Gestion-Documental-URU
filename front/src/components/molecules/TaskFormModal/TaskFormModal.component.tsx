import { useState, useEffect } from "react";
import { FormModal } from "@/components/molecules/FormModal";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import "./TaskFormModal.css";

export interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Tarea existente para editar, o null para crear nueva. */
  task: TaskDetail | null;
  onSubmit: (data: {
    title: string;
    assignee: string;
    assignmentDate: string;
    dueDate: string;
    status: "Pendiente" | "Finalizada";
    description: string;
    workDetail: string[];
  }) => void;
}

const ESTADOS: { value: "Pendiente" | "Finalizada"; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Finalizada", label: "Finalizada" },
];

/**
 * TaskFormModal - Molecule
 *
 * Modal para crear o editar tarea.
 */
export const TaskFormModal = ({
  open,
  onClose,
  task,
  onSubmit,
}: TaskFormModalProps) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Pendiente" | "Finalizada">("Pendiente");
  const [description, setDescription] = useState("");
  const [workDetailText, setWorkDetailText] = useState("");

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setAssignee(task.assignee);
        setAssignmentDate(task.assignmentDate ?? "");
        setDueDate(task.dueDate ?? "");
        setStatus(task.status ?? "Pendiente");
        setDescription(task.description ?? "");
        setWorkDetailText(task.workDetail?.join("\n") ?? "");
      } else {
        setTitle("");
        setAssignee("");
        setAssignmentDate(new Date().toISOString().slice(0, 10));
        setDueDate("");
        setStatus("Pendiente");
        setDescription("");
        setWorkDetailText("");
      }
    }
  }, [open, task]);

  const handleSubmit = () => {
    const workDetail = workDetailText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ title, assignee, assignmentDate, dueDate, status, description, workDetail });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      label={task ? "Editar Tarea" : "Crear Tarea"}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="form-modal__field">
        <label htmlFor="task-title" className="form-modal__field-label">
          Título
        </label>
        <input
          id="task-title"
          type="text"
          className="form-modal__field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Revisión de partidas - Grupo A"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-assignee" className="form-modal__field-label">
          Asignada a
        </label>
        <input
          id="task-assignee"
          type="text"
          className="form-modal__field-input"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Ej: Verificador A"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-assignment-date" className="form-modal__field-label">
          Fecha asignación
        </label>
        <input
          id="task-assignment-date"
          type="date"
          className="form-modal__field-input"
          value={assignmentDate}
          onChange={(e) => setAssignmentDate(e.target.value)}
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-due-date" className="form-modal__field-label">
          Fecha límite
        </label>
        <input
          id="task-due-date"
          type="date"
          className="form-modal__field-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-status" className="form-modal__field-label">
          Estado
        </label>
        <select
          id="task-status"
          className="form-modal__field-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as "Pendiente" | "Finalizada")}
        >
          {ESTADOS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-description" className="form-modal__field-label">
          Descripción
        </label>
        <textarea
          id="task-description"
          className="form-modal__field-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea"
          rows={3}
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="task-work-detail" className="form-modal__field-label">
          Detalle de trabajo (un ítem por línea)
        </label>
        <textarea
          id="task-work-detail"
          className="form-modal__field-textarea"
          value={workDetailText}
          onChange={(e) => setWorkDetailText(e.target.value)}
          placeholder="Cada línea es un ítem"
          rows={4}
        />
      </div>
    </FormModal>
  );
};
