import { useState, useEffect } from "react";
import { FormModal } from "@/components/molecules/FormModal";
import type { DocumentTypeItem } from "@/components/organisms/DocumentTypesCard";
import "./DocumentTypeFormModal.css";

export interface DocumentTypeFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Tipo existente para editar, o null para crear nuevo. */
  documentType: DocumentTypeItem | null;
  onSubmit: (data: { name: string; nivel: string; obligatoriedad: string; description: string }) => void;
}

const NIVELES = [
  { value: "todos", label: "Todos" },
  { value: "pregrado", label: "Pregrado" },
  { value: "postgrado", label: "Postgrado" },
];

const OBLIGATORIEDAD = [
  { value: "", label: "Seleccionar" },
  { value: "obligatorio", label: "Obligatorio" },
  { value: "opcional", label: "Opcional" },
];

/**
 * DocumentTypeFormModal - Molecule
 *
 * Modal para crear o editar tipo de documento.
 * Campos: Nombre del documento, Nivel académico aplicable, Estado de obligatoriedad, Descripción breve.
 */
export const DocumentTypeFormModal = ({
  open,
  onClose,
  documentType,
  onSubmit,
}: DocumentTypeFormModalProps) => {
  const [name, setName] = useState("");
  const [nivel, setNivel] = useState("todos");
  const [obligatoriedad, setObligatoriedad] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      if (documentType) {
        setName(documentType.name);
        setDescription(documentType.description);
        // Parsear de description si viene "Obligatorio - Pregrado" etc.
        const descLower = documentType.description.toLowerCase();
        if (descLower.includes("obligatorio")) setObligatoriedad("obligatorio");
        else if (descLower.includes("opcional")) setObligatoriedad("opcional");
        else setObligatoriedad("");
        if (descLower.includes("pregrado")) setNivel("pregrado");
        else if (descLower.includes("postgrado")) setNivel("postgrado");
        else setNivel("todos");
      } else {
        setName("");
        setNivel("todos");
        setObligatoriedad("");
        setDescription("");
      }
    }
  }, [open, documentType]);

  const handleSubmit = () => {
    onSubmit({ name, nivel, obligatoriedad, description });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      label={documentType ? "Editar tipo de documento" : "Crear tipo de documento"}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="form-modal__field">
        <label htmlFor="doc-type-name" className="form-modal__field-label">
          Nombre del documento
        </label>
        <input
          id="doc-type-name"
          type="text"
          className="form-modal__field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Partida de Nacimiento"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="doc-type-nivel" className="form-modal__field-label">
          Nivel académico aplicable
        </label>
        <select
          id="doc-type-nivel"
          className="form-modal__field-select"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
        >
          {NIVELES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="doc-type-obligatoriedad" className="form-modal__field-label">
          Estado de obligatoriedad
        </label>
        <select
          id="doc-type-obligatoriedad"
          className="form-modal__field-select"
          value={obligatoriedad}
          onChange={(e) => setObligatoriedad(e.target.value)}
        >
          {OBLIGATORIEDAD.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="doc-type-description" className="form-modal__field-label">
          Descripción breve
        </label>
        <textarea
          id="doc-type-description"
          className="form-modal__field-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción opcional del tipo de documento"
          rows={3}
        />
      </div>
    </FormModal>
  );
};
