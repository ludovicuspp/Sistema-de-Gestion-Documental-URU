import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { RequestRow, type RequestStatus } from "@/components/molecules/RequestRow";
import "./RequestList.css";

export interface RequestListItem {
  id: string;
  studentName: string;
  studentCI: string;
  level: string;
  date: string;
  status: RequestStatus;
}

export interface RequestListProps {
  requests: RequestListItem[];
  onOpen?: (id: string) => void;
  onSearch?: (query: string) => void;
}

/**
 * RequestList - Organism
 *
 * Recent requests section with search, filters, and request list.
 */
export const RequestList = ({ requests, onOpen, onSearch }: RequestListProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch?.("");
  };

  const handleClearFilters = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <Card variant="elevated" className="request-list">
      <h2 className="request-list__title">Solicitudes recientes</h2>
      <div className="request-list__search-row">
        <Input
          placeholder="Buscar por nombre o cédula"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          fullWidth
          endIcon={
            searchValue ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
                className="request-list__clear-btn"
              >
                <span aria-hidden>×</span>
              </button>
            ) : undefined
          }
        />
      </div>
      <div className="request-list__filters">
        <Button variant="outline" size="small" onClick={() => {}}>
          Todos
        </Button>
        <Button variant="outline" size="small" onClick={handleClearFilters}>
          Limpiar
        </Button>
      </div>
      <div className="request-list__list">
        {requests.length === 0 ? (
          <div className="request-list__empty">
            <p>No hay solicitudes disponibles.</p>
          </div>
        ) : (
          requests.map((request) => (
            <RequestRow
              key={request.id}
              id={request.id}
              studentName={request.studentName}
              studentCI={request.studentCI}
              level={request.level}
              date={request.date}
              status={request.status}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </Card>
  );
};
