import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import "./NewExpedientForm.css";

export interface NewExpedientFormData {
  studentCI: string;
  studentName: string;
  recordType: string;
  studentEmail?: string;
  studentBirthDate?: string;
  recordLocation?: string;
}

export interface NewExpedientFormProps {
  onSubmit: (data: NewExpedientFormData) => void;
  onCancel: () => void;
}

/**
 * NewExpedientForm - Molecule
 *
 * Formulario para crear un nuevo expediente (CI, nombre, tipo, email, etc.).
 * Pensado para usarse dentro de un Modal.
 */
export const NewExpedientForm = ({ onSubmit, onCancel }: NewExpedientFormProps) => {
  const [studentCI, setStudentCI] = useState("");
  const [studentName, setStudentName] = useState("");
  const [recordType, setRecordType] = useState("Pregrado");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentBirthDate, setStudentBirthDate] = useState("");
  const [recordLocation, setRecordLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCI.trim() || !studentName.trim()) return;
    onSubmit({
      studentCI: studentCI.trim(),
      studentName: studentName.trim(),
      recordType,
      studentEmail: studentEmail.trim() || undefined,
      studentBirthDate: studentBirthDate.trim() || undefined,
      recordLocation: recordLocation.trim() || undefined,
    });
  };

  return (
    <form className="new-expedient-form" onSubmit={handleSubmit}>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">
          Cédula (CI) <span className="new-expedient-form__required">*</span>
        </label>
        <Input
          value={studentCI}
          onChange={(e) => setStudentCI(e.target.value)}
          placeholder="Ej: V-12345678"
          fullWidth
          required
        />
      </div>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">
          Nombre del estudiante <span className="new-expedient-form__required">*</span>
        </label>
        <Input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Nombre completo"
          fullWidth
          required
        />
      </div>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">Tipo de expediente</label>
        <select
          className="new-expedient-form__select"
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
        >
          <option value="Pregrado">Pregrado</option>
          <option value="Postgrado">Postgrado</option>
        </select>
      </div>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">Email</label>
        <Input
          type="email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          fullWidth
        />
      </div>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">Fecha de nacimiento</label>
        <Input
          type="date"
          value={studentBirthDate}
          onChange={(e) => setStudentBirthDate(e.target.value)}
          fullWidth
        />
      </div>
      <div className="new-expedient-form__row">
        <label className="new-expedient-form__label">Ubicación física</label>
        <Input
          value={recordLocation}
          onChange={(e) => setRecordLocation(e.target.value)}
          placeholder="Ej: Estante 3 / Caja 12 / Fila B"
          fullWidth
        />
      </div>
      <div className="new-expedient-form__actions">
        <Button type="button" variant="outline" size="medium" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="medium">
          Crear expediente
        </Button>
      </div>
    </form>
  );
};
