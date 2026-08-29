import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RequestList, type RequestListItem } from "@/components/organisms/RequestList";
import { RequestDetailCard, type RequestDetailData } from "@/components/organisms/RequestDetailCard";
import { RequestActionsCard } from "@/components/organisms/RequestActionsCard";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierRequestManagementPage.css";

const MOCK_REQUESTS: RequestListItem[] = [
  {
    id: "1",
    studentName: "José Luis Pérez Gómez",
    studentCI: "V-12345678",
    level: "Pregrado",
    date: "2025-11-10 14:32",
    status: "pending",
  },
  {
    id: "2",
    studentName: "María González",
    studentCI: "V-87654321",
    level: "Postgrado",
    date: "2025-11-12 09:12",
    status: "validated",
  },
  {
    id: "3",
    studentName: "Carlos Andrés Rojas M.",
    studentCI: "V-11223344",
    level: "Pregrado",
    date: "2025-11-13 08:20",
    status: "rejected",
  },
];

const MOCK_REQUEST_DETAILS: Record<string, RequestDetailData> = {
  "1": {
    id: "1",
    studentName: "José Luis",
    studentSurname: "Pérez Gómez",
    studentCI: "V-12345678",
    level: "Pregrado",
    email: "jose.perez@example.com",
    comment: "Solicito los documentos necesarios para mi expediente académico.",
    requestedDocuments: ["Fondo negro titular bachiller", "Veredicto"],
    status: "not-validated",
  },
  "2": {
    id: "2",
    studentName: "María",
    studentSurname: "González",
    studentCI: "V-87654321",
    level: "Postgrado",
    email: "maria.gonzalez@example.com",
    comment: "Necesito los documentos para completar mi expediente.",
    requestedDocuments: ["Título universitario", "Certificado de notas"],
    status: "validated",
  },
  "3": {
    id: "3",
    studentName: "Carlos Andrés",
    studentSurname: "Rojas M.",
    studentCI: "V-11223344",
    level: "Pregrado",
    email: "carlos.rojas@example.com",
    comment: "Documentos requeridos para mi expediente.",
    requestedDocuments: ["Cédula", "Partida de nacimiento"],
    status: "rejected",
  },
};

/**
 * VerifierRequestManagementPage - Page (Verifier)
 *
 * Request management view for verifier role: search requests, view request details, and administrative actions.
 * Same structure and base as admin RequestManagementPage.
 */
export const VerifierRequestManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>("1");

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_REQUESTS;
    const query = searchQuery.toLowerCase();
    return MOCK_REQUESTS.filter(
      (r) =>
        r.studentName.toLowerCase().includes(query) ||
        r.studentCI.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedRequest = selectedRequestId ? MOCK_REQUEST_DETAILS[selectedRequestId] ?? null : null;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleOpenRequest = useCallback((id: string) => {
    setSelectedRequestId(id);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedRequestId(null);
    console.log("Refrescar");
  }, []);

  const handleExport = useCallback(() => {
    console.log("Exportar solicitud", selectedRequestId);
  }, [selectedRequestId]);

  const handleSaveNote = useCallback((note: string) => {
    console.log("Guardar nota", note);
  }, []);

  const handleClearNote = useCallback(() => {
    console.log("Limpiar nota");
  }, []);

  return (
    <DashboardTemplate
      currentView="Gestión de solicitudes"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={handleRefresh}
      sidebarModules={VERIFIER_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="request-management-page">
        <div className="request-management-page__content">
          <div className="request-management-page__left">
            <div className="request-management-page__list">
              <RequestList
                requests={filteredRequests}
                onOpen={handleOpenRequest}
                onSearch={handleSearch}
              />
            </div>
            <div className="request-management-page__detail">
              <RequestDetailCard
                request={selectedRequest}
                onExport={handleExport}
              />
            </div>
          </div>
          <div className="request-management-page__right">
            <RequestActionsCard
              onSaveNote={handleSaveNote}
              onClear={handleClearNote}
              confirmBeforeSave
              confirmSaveMessage="¿Desea guardar la nota?"
            />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};
