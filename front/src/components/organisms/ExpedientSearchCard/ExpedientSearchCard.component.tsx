import { RecordSearchCard } from "@/components/organisms/RecordSearchCard";
import type { RecordStatusFilter } from "@/components/organisms/RecordSearchCard";

export type ExpedientStatusFilter = RecordStatusFilter;

export interface ExpedientSearchCardProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeFilter?: ExpedientStatusFilter;
  onFilterChange?: (filter: ExpedientStatusFilter) => void;
  onNewExpedient?: () => void;
}

/**
 * ExpedientSearchCard - Organism
 *
 * Variante de RecordSearchCard para la gestion de expedientes.
 * Mantiene el mismo comportamiento y estilos, con el nombre de accion del dominio.
 */
export const ExpedientSearchCard = ({
  onNewExpedient,
  ...props
}: ExpedientSearchCardProps) => (
  <RecordSearchCard {...props} onNewRecord={onNewExpedient} />
);
