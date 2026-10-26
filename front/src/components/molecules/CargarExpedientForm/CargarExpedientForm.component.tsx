import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { catalogService } from "@/services/api/catalogService";
import type { DocumentTypeDto } from "@/services/api/catalogService";
import "./CargarExpedientForm.css";

export interface CargarExpedientFormData {
  file: File | null;
  recordLocation?: string;
  /** Id del tipo de documento (obligatorio para verificar CU-23). */
  documentTypeId?: string;
}

export interface CargarExpedientFormProps {
  onSubmit: (data: CargarExpedientFormData) => void;
  onCancel: () => void;
  /** Muestra el campo de ubicación física. Por defecto: true. */
  showLocation?: boolean;
}

/**
 * CargarExpedientForm - Molecule
 *
 * Formulario para cargar/subir un expediente: archivo, tipo de documento
 * (obligatorio, del catálogo) y ubicación opcional.
 * Pensado para usarse dentro del Modal reutilizable.
 */
export const CargarExpedientForm = ({
  onSubmit,
  onCancel,
  showLocation = true,
}: CargarExpedientFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recordLocation, setRecordLocation] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDto[]>([]);
  const [documentTypeId, setDocumentTypeId] = useState("");

  useEffect(() => {
    let cancelled = false;
    catalogService
      .documentTypes(0, 100)
      .then((page) => {
        if (!cancelled) setDocumentTypes(page.content);
      })
      .catch(() => {
        if (!cancelled) setDocumentTypes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentTypeId) return;
    onSubmit({
      file,
      recordLocation: recordLocation.trim() || undefined,
      documentTypeId,
    });
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
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="cargar-expedient-form__file-input"
          aria-label="Seleccionar archivo"
        />
        {file && (
          <span className="cargar-expedient-form__file-name">{file.name}</span>
        )}
      </div>
      <div className="cargar-expedient-form__row">
        <label className="cargar-expedient-form__label">
          Tipo de documento <span className="cargar-expedient-form__required">*</span>
        </label>
        <select
          className="cargar-expedient-form__select"
          value={documentTypeId}
          onChange={(e) => setDocumentTypeId(e.target.value)}
          required
          aria-label="Tipo de documento"
        >
          <option value="">Seleccione el tipo de documento</option>
          {documentTypes.map((type) => (
            <option key={type.id} value={String(type.id)}>
              {type.name}
              {type.required ? " (obligatorio)" : ""}
            </option>
          ))}
        </select>
      </div>
      {showLocation && (
        <div className="cargar-expedient-form__row">
          <label className="cargar-expedient-form__label">Ubicación física</label>
          <Input
            value={recordLocation}
            onChange={(e) => setRecordLocation(e.target.value)}
            placeholder="Ej: Estante 3 / Caja 12 / Fila B"
            fullWidth
          />
        </div>
      )}
      <div className="cargar-expedient-form__actions">
        <Button type="button" variant="outline" size="medium" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="medium" disabled={!file || !documentTypeId}>
          Cargar expediente
        </Button>
      </div>
    </form>
  );
};
