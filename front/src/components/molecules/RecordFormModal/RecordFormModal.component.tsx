import { useState, useEffect } from "react";
import { FormModal } from "@/components/molecules/FormModal";
import type { RecordDetailData } from "@/components/organisms/RecordDetailCard";
import type { ExpedientDetailData } from "@/components/organisms/ExpedientDetailCard";
import "./RecordFormModal.css";

type RecordData = RecordDetailData | ExpedientDetailData;

export interface RecordFormData {
  studentCI: string;
  studentName: string;
  recordType: string;
  studentEmail?: string;
  studentBirthDate?: string;
  recordLocation?: string;
}

export interface RecordFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Expediente/record existente para editar, o null para crear nuevo. */
  record: RecordData | null;
  onSubmit: (data: RecordFormData) => void;
}

const TIPOS = [
  { value: "Pregrado", label: "Pregrado" },
  { value: "Postgrado", label: "Postgrado" },
];

/**
 * RecordFormModal - Molecule
 *
 * Modal para crear o editar expediente/record.
 * Campos: CI, nombre, tipo, email, fecha nacimiento, ubicación.
 */
export const RecordFormModal = ({
  open,
  onClose,
  record,
  onSubmit,
}: RecordFormModalProps) => {
  const [studentCI, setStudentCI] = useState("");
  const [studentName, setStudentName] = useState("");
  const [recordType, setRecordType] = useState("Pregrado");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentBirthDate, setStudentBirthDate] = useState("");
  const [recordLocation, setRecordLocation] = useState("");

  const getRecordType = (r: RecordData) =>
    "recordType" in r ? r.recordType : r.expedientType;
  const getRecordLocation = (r: RecordData) =>
    "recordLocation" in r ? r.recordLocation : r.expedientLocation;

  useEffect(() => {
    if (open) {
      if (record) {
        setStudentCI(record.studentCI ?? "");
        setStudentName(record.studentName ?? "");
        setRecordType(getRecordType(record) ?? "Pregrado");
        setStudentEmail(record.studentEmail ?? "");
        setStudentBirthDate(record.studentBirthDate ?? "");
        setRecordLocation(getRecordLocation(record) ?? "");
      } else {
        setStudentCI("");
        setStudentName("");
        setRecordType("Pregrado");
        setStudentEmail("");
        setStudentBirthDate("");
        setRecordLocation("");
      }
    }
  }, [open, record]);

  const handleSubmit = () => {
    onSubmit({
      studentCI,
      studentName,
      recordType,
      studentEmail: studentEmail.trim() || undefined,
      studentBirthDate: studentBirthDate.trim() || undefined,
      recordLocation: recordLocation.trim() || undefined,
    });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      label={record ? "Editar Expediente" : "Crear Expediente"}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="form-modal__field">
        <label htmlFor="record-student-ci" className="form-modal__field-label">
          Cédula (CI) <span className="form-modal__required">*</span>
        </label>
        <input
          id="record-student-ci"
          type="text"
          className="form-modal__field-input"
          value={studentCI}
          onChange={(e) => setStudentCI(e.target.value)}
          placeholder="Ej: V-12345678"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="record-student-name" className="form-modal__field-label">
          Nombre del estudiante <span className="form-modal__required">*</span>
        </label>
        <input
          id="record-student-name"
          type="text"
          className="form-modal__field-input"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="record-type" className="form-modal__field-label">
          Tipo de expediente
        </label>
        <select
          id="record-type"
          className="form-modal__field-select"
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
        >
          {TIPOS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="record-student-email" className="form-modal__field-label">
          Email
        </label>
        <input
          id="record-student-email"
          type="email"
          className="form-modal__field-input"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="record-student-birth" className="form-modal__field-label">
          Fecha de nacimiento
        </label>
        <input
          id="record-student-birth"
          type="date"
          className="form-modal__field-input"
          value={studentBirthDate}
          onChange={(e) => setStudentBirthDate(e.target.value)}
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="record-location" className="form-modal__field-label">
          Ubicación física
        </label>
        <input
          id="record-location"
          type="text"
          className="form-modal__field-input"
          value={recordLocation}
          onChange={(e) => setRecordLocation(e.target.value)}
          placeholder="Ej: Estante 3 / Caja 12 / Fila B"
        />
      </div>
    </FormModal>
  );
};
