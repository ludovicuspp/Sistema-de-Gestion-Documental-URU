import { useState, useCallback } from "react";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ExpedientSearchCard } from "@/components/organisms/ExpedientSearchCard";
import { ExpedientDetailCard } from "@/components/organisms/ExpedientDetailCard";
import { ExpedientDocumentsList } from "@/components/organisms/ExpedientDocumentsList";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { ExpedientStatusFilter } from "@/components/organisms/ExpedientSearchCard";
import type { ExpedientDetailData } from "@/components/organisms/ExpedientDetailCard";
import type { ExpedientDocumentListItem } from "@/components/organisms/ExpedientDocumentsList";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import "./ExpedientManagementPage.css";

const MOCK_EXPEDIENT: ExpedientDetailData = {
  studentId: "1",
  studentName: "Ludovicus Van Vargas",
  studentCI: "0113",
  studentBirthDate: "01/09/2003",
  studentEmail: "luis@brainv.com",
  expedientType: "Pregrado",
  expedientCreatedDate: "2025-08-01",
  expedientLocation: "Estante 3 / Caja 12 / Fila B",
  expedientStatus: "pending",
};

const MOCK_DOCUMENTS: ExpedientDocumentListItem[] = [
  {
    id: "1",
    type: "Cédula de Identidad",
    fileName: "cedula.pdf",
    fileSize: "220 KB",
  },
  {
    id: "2",
    type: "Partida de Nacimiento",
    fileName: "partida.pdf",
    fileSize: "180 KB",
  },
  {
    id: "3",
    type: "Notas Certificadas",
    fileName: "notas.pdf",
    fileSize: "1.2 MB",
  },
];

const MOCK_OBSERVATIONS: ActivityEntry[] = [
  {
    text: 'Documento "Partida de Nacimiento" ilegible — solicitar reescan.',
    datetime: "2025-11-12 · Verificador A",
  },
  {
    text: "Cédula cargada y vinculada correctamente.",
    datetime: "2025-11-10 · Asistente B",
  },
];

/**
 * ExpedientManagementPage - Page
 *
 * Expedient management view: search students, view expedient details, documents, and observations.
 * Based on StudentManagementPage layout.
 */
export const ExpedientManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ExpedientStatusFilter>("pending");
  const [selectedExpedient, setSelectedExpedient] = useState<ExpedientDetailData | null>(MOCK_EXPEDIENT);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((filter: ExpedientStatusFilter) => {
    setActiveFilter(filter);
  }, []);

  const handleNewExpedient = useCallback(() => {
    console.log("Nuevo expediente");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("pending");
    setSelectedExpedient(null);
    console.log("Refrescar");
  }, []);

  const handleUpdateDocuments = useCallback(() => {
    console.log("Actualizar documentos");
  }, []);

  const handleUploadExpedient = useCallback(() => {
    console.log("Cargar expediente");
  }, []);

  const handleEdit = useCallback(() => {
    console.log("Editar expediente");
  }, []);

  const handleDelete = useCallback(() => {
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setSelectedExpedient(null);
    setConfirmDeleteOpen(false);
  }, []);

  const handleViewDocument = useCallback((id: string) => {
    console.log("Ver documento", id);
  }, []);

  const handleDocumentObservation = useCallback((id: string) => {
    console.log("Observación documento", id);
  }, []);

  const handleViewHistory = useCallback(() => {
    console.log("Ver historial");
  }, []);

  return (
    <DashboardTemplate
      currentView="Gestión de expedientes"
      onCreateUser={handleNewExpedient}
      onRefresh={handleRefresh}
    >
      <div className="expedient-management-page">
        <div className="expedient-management-page__top">
          <ExpedientSearchCard
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onNewExpedient={handleNewExpedient}
          />
        </div>
        <div className="expedient-management-page__content">
          <div className="expedient-management-page__left">
            <div className="expedient-management-page__detail">
              <ExpedientDetailCard
                expedient={selectedExpedient}
                onUpdateDocuments={handleUpdateDocuments}
                onUploadExpedient={handleUploadExpedient}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="expedient-management-page__documents">
              <ExpedientDocumentsList
                title="Documentos"
                documents={selectedExpedient ? MOCK_DOCUMENTS : []}
                onViewDocument={handleViewDocument}
                onObservation={handleDocumentObservation}
              />
            </div>
          </div>
          <div className="expedient-management-page__right">
            <RecentActivity
              title="Observaciones"
              linkText="Ver historial"
              entries={selectedExpedient ? MOCK_OBSERVATIONS : []}
              onViewAll={handleViewHistory}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        label="Eliminar"
        message="¿Seguro que desea eliminar el expediente?"
        onConfirm={handleConfirmDelete}
      />
    </DashboardTemplate>
  );
};
