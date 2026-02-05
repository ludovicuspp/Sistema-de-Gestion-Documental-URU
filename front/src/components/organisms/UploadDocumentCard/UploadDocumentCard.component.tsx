import { useRef } from "react";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./UploadDocumentCard.css";

export interface UploadDocumentCardProps {
  title?: string;
  context?: string;
  selectedExpedientLabel?: string;
  documentTypes: { value: string; label: string }[];
  selectedTypeId?: string;
  selectedTypeError?: boolean;
  onUpload?: (file: File | null, typeId: string) => void;
  onFileChange?: (file: File | null) => void;
  onTypeChange?: (typeId: string) => void;
  /** Quick rules shown in the same card (e.g. "Reglas rápidas"). */
  quickRules?: string[];
  quickRulesTitle?: string;
}

/**
 * UploadDocumentCard - Organism
 *
 * Card for uploading documents: context, expedient info, file input, type select, Subir button, rules.
 */
export const UploadDocumentCard = ({
  title = "Subir documento",
  context = "Asociar archivos a un expediente.",
  selectedExpedientLabel,
  documentTypes,
  selectedTypeId = "",
  selectedTypeError,
  onUpload,
  onFileChange,
  onTypeChange,
  quickRules,
  quickRulesTitle = "Reglas rápidas",
}: UploadDocumentCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange?.(file);
  };

  const handleUploadClick = () => {
    const input = fileInputRef.current;
    if (!input) return;
    const file = input.files?.[0] ?? null;
    onUpload?.(file, selectedTypeId);
  };

  return (
    <Card variant="elevated" className="upload-document-card">
      <h3 className="upload-document-card__title">{title}</h3>
      <p className="upload-document-card__context">{context}</p>
      {selectedExpedientLabel && (
        <p className="upload-document-card__expedient-info">
          Expediente: {selectedExpedientLabel}
        </p>
      )}
      <div className="upload-document-card__row">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="upload-document-card__file-input"
          aria-label="Seleccionar archivo"
        />
        <select
          className={`upload-document-card__type-select ${selectedTypeError ? "upload-document-card__type-select--error" : ""}`}
          value={selectedTypeId}
          onChange={(e) => onTypeChange?.(e.target.value)}
          aria-label="Seleccionar tipo de documento"
        >
          <option value="">Seleccionar tipo de documento</option>
          {documentTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button variant="primary" size="small" onClick={handleUploadClick}>
          Subir
        </Button>
      </div>
      <p className="upload-document-card__rules">
        Reglas: solo PDF permitidos; tamaño máximo 5 MB; nombre claro y tipo asignado.
      </p>
      {quickRules != null && quickRules.length > 0 && (
        <section className="upload-document-card__quick-rules" aria-labelledby="quick-rules-heading">
          <h4 id="quick-rules-heading" className="upload-document-card__quick-rules-title">
            {quickRulesTitle}
          </h4>
          <ul className="upload-document-card__quick-rules-list">
            {quickRules.map((rule, i) => (
              <li key={i} className="upload-document-card__quick-rules-item">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Card>
  );
};
