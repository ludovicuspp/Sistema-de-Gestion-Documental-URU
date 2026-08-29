import { useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import "./CargarExpedientForm.css";

export interface CargarExpedientFormData {
  file: File | null;
  recordLocation?: string;
}

export interface CargarExpedientFormProps {
  onSubmit: (data: CargarExpedientFormData) => void;
  onCancel: () => void;
}

/**
 * CargarExpedientForm - Molecule
 *
 * Formulario para cargar/subir un expediente: archivo y ubicación opcional.
 * Pensado para usarse dentro del Modal reutilizable.
 */
export const CargarExpedientForm = ({ onSubmit, onCancel }: CargarExpedientFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recordLocation, setRecordLocation] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ file, recordLocation: recordLocation.trim() || undefined });
  };

  return (
    <form className="cargar-expedient-form" onSubmit={handleSubmit}>
      <div className="cargar-expedient-form__row">
        <label className="cargar-expedient-form__label">
          Archivo del expediente <span className="cargar-expedient-form__required">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="cargar-expedient-form__file-input"
          aria-label="Seleccionar archivo"
        />
        {file && (
          <span className="cargar-expedient-form__file-name">{file.name}</span>
        )}
      </div>
      <div className="cargar-expedient-form__row">
        <label className="cargar-expedient-form__label">Ubicación física</label>
        <Input
          value={recordLocation}
          onChange={(e) => setRecordLocation(e.target.value)}
          placeholder="Ej: Estante 3 / Caja 12 / Fila B"
          fullWidth
        />
      </div>
      <div className="cargar-expedient-form__actions">
        <Button type="button" variant="outline" size="medium" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="medium" disabled={!file}>
          Cargar expediente
        </Button>
      </div>
    </form>
  );
};
