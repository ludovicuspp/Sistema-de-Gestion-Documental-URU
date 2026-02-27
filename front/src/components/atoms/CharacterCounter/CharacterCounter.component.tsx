import "./CharacterCounter.css";

export interface CharacterCounterProps {
  /** Número de caracteres actual. */
  current: number;
  /** Límite máximo de caracteres. */
  max: number;
  /** Clase CSS adicional para el contenedor. */
  className?: string;
}

/**
 * CharacterCounter - Atom
 *
 * Muestra "actual/máx" caracteres. Aplica estilos warning al acercarse al límite
 * y error al alcanzarlo o superarlo.
 */
export const CharacterCounter = ({ current, max, className = "" }: CharacterCounterProps) => {
  const isAtLimit = current >= max;
  const isNearLimit = current >= max * 0.8 && current < max;

  const counterClass = [
    "character-counter",
    isAtLimit && "character-counter--error",
    isNearLimit && "character-counter--warning",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={counterClass} aria-live="polite">
      {current}/{max}
    </span>
  );
};
