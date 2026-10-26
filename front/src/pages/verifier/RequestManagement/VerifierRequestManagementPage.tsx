import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { RequestList, type RequestListItem } from "@/components/organisms/RequestList";
import { RequestDetailCard, type RequestDetailData } from "@/components/organisms/RequestDetailCard";
import { RequestActionsCard } from "@/components/organisms/RequestActionsCard";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { ApiError, clearSession } from "@/services/api/http";
import { requestsService, type RequestDto } from "@/services/api/requestsService";
import "./VerifierRequestManagementPage.css";

type Feedback = { kind: "success" | "error" | "info"; text: string };

const toListStatus = (status: string): RequestListItem["status"] => {
  if (status === "COMPLETADA") return "validated";
  if (status === "RECHAZADA") return "rejected";
  return "pending";
};

const toDetailStatus = (status: string): RequestDetailData["status"] => {
  if (status === "COMPLETADA") return "validated";
  if (status === "RECHAZADA") return "rejected";
  return "not-validated";
};

const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const splitName = (fullName: string): [string, string] => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return [parts[0] ?? "", parts.slice(1).join(" ")];
  return [parts.slice(0, 2).join(" "), parts.slice(2).join(" ")];
};

const toListItem = (r: RequestDto): RequestListItem => ({
  id: String(r.id),
  studentName: r.fullName,
  studentCI: r.ci,
  level: "—",
  date: formatDateTime(r.createdAt),
  status: toListStatus(r.status),
});

const toDetail = (r: RequestDto): RequestDetailData => {
  const [name, surname] = splitName(r.fullName);
  return {
    id: String(r.id),
    studentName: name,
    studentSurname: surname,
    studentCI: r.ci,
    level: "—",
    email: r.email,
    comment: r.comment ?? "",
    requestedDocuments: r.documents.map((d) => d.name),
    status: toDetailStatus(r.status),
  };
};

/**
 * VerifierRequestManagementPage - Page (Verifier)
 *
 * Request management view for verifier role: search requests, view request details, and administrative actions.
 * Same structure and base as admin RequestManagementPage.
 * Datos reales desde requests-service (CU-18/CU-19).
 */
export const VerifierRequestManagementPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestDto[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [detail, setDetail] = useState<RequestDetailData | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);

  const resolveError = useCallback((err: unknown, fallback: string): string | null => {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        clearSession();
        navigate("/");
        return null;
      }
      return err.message;
    }
    return fallback;
  }, [navigate]);

  const loadDetail = useCallback(async (id: number) => {
    setDetailError(null);
    try {
      const dto = await requestsService.get(id);
      setDetail(toDetail(dto));
    } catch (err) {
      setDetail(null);
      const msg = err instanceof ApiError && err.status === 401
        ? (clearSession(), navigate("/"), null)
        : err instanceof ApiError ? err.message : "No se pudo cargar el detalle de la solicitud.";
      if (msg) setDetailError(msg);
    }
  }, [navigate]);

  const fetchAll = useCallback(async (keepSelection?: string | null) => {
    setListError(null);
    try {
      const data = await requestsService.list();
      setRequests(data);
      const wanted = keepSelection === undefined
        ? (data.length > 0 ? String(data[0].id) : null)
        : keepSelection;
      const exists = wanted != null && data.some((r) => String(r.id) === wanted);
      const finalId = exists ? wanted : (data.length > 0 ? String(data[0].id) : null);
      setSelectedRequestId(finalId);
      if (finalId != null) {
        await loadDetail(Number(finalId));
      } else {
        setDetail(null);
      }
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 401
        ? (clearSession(), navigate("/"), null)
        : err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes.";
      if (msg) setListError(msg);
    }
  }, [loadDetail, navigate]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const filteredRequests = useMemo(() => {
    const items = requests.map(toListItem);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((r) => {
      const raw = requests.find((x) => String(x.id) === r.id);
      return (
        r.studentName.toLowerCase().includes(query) ||
        r.studentCI.toLowerCase().includes(query) ||
        (raw?.trackingCode.toLowerCase().includes(query) ?? false)
      );
    });
  }, [requests, searchQuery]);

  const selectedRawStatus = useMemo(() => (
    requests.find((r) => String(r.id) === selectedRequestId)?.status ?? null
  ), [requests, selectedRequestId]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleOpenRequest = useCallback((id: string) => {
    setSelectedRequestId(id);
    setFeedback(null);
    void loadDetail(Number(id));
  }, [loadDetail]);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setFeedback(null);
    void fetchAll(undefined);
  }, [fetchAll]);

  const handleSaveNote = useCallback(() => {
    setFeedback({
      kind: "info",
      text: "El backend actual no persiste observaciones administrativas.",
    });
  }, []);

  const handleClearNote = useCallback(() => {
    setFeedback(null);
  }, []);

  const handleApprove = useCallback(async () => {
    if (selectedRequestId == null) return;
    setConfirmApproveOpen(false);
    setFeedback(null);
    try {
      await requestsService.updateStatus(Number(selectedRequestId), "COMPLETADA");
      setFeedback({
        kind: "success",
        text: "Solicitud completada. Se envió un correo de notificación al solicitante.",
      });
      await fetchAll(selectedRequestId);
    } catch (err) {
      const msg = resolveError(err, "No se pudo completar la solicitud.");
      if (msg) setFeedback({ kind: "error", text: msg });
    }
  }, [selectedRequestId, fetchAll, resolveError]);

  const handleReject = useCallback(async () => {
    if (selectedRequestId == null) return;
    setConfirmRejectOpen(false);
    setFeedback(null);
    try {
      await requestsService.updateStatus(Number(selectedRequestId), "RECHAZADA");
      setFeedback({ kind: "success", text: "Solicitud rechazada." });
      await fetchAll(selectedRequestId);
    } catch (err) {
      const msg = resolveError(err, "No se pudo rechazar la solicitud.");
      if (msg) setFeedback({ kind: "error", text: msg });
    }
  }, [selectedRequestId, fetchAll, resolveError]);

  const canApproveReject = selectedRawStatus === "RECIBIDA" || selectedRawStatus === "EN_PROCESO";
  const bannerError = listError ?? detailError;

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
        {bannerError && (
          <p
            role="alert"
            style={{ margin: 0, padding: "0.75rem 1rem", borderRadius: "0.5rem", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", fontSize: "0.875rem" }}
          >
            {bannerError}
          </p>
        )}
        {feedback && (
          <p
            role="status"
            style={{
              margin: 0,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              backgroundColor: feedback.kind === "success" ? "#f0fdf4" : feedback.kind === "error" ? "#fef2f2" : "#eff6ff",
              color: feedback.kind === "success" ? "#15803d" : feedback.kind === "error" ? "#b91c1c" : "#1d4ed8",
              border: `1px solid ${feedback.kind === "success" ? "#bbf7d0" : feedback.kind === "error" ? "#fecaca" : "#bfdbfe"}`,
            }}
          >
            {feedback.text}
          </p>
        )}
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
              <RequestDetailCard request={detail} />
            </div>
          </div>
          <div className="request-management-page__right">
            <RequestActionsCard
              onSaveNote={handleSaveNote}
              onClear={handleClearNote}
              confirmBeforeSave
              confirmSaveMessage="¿Desea guardar la nota?"
              onApprove={() => setConfirmApproveOpen(true)}
              onReject={() => setConfirmRejectOpen(true)}
              canApproveReject={canApproveReject}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmApproveOpen}
        onCancel={() => setConfirmApproveOpen(false)}
        label="aprobar"
        message="¿Seguro que desea aprobar?"
        onConfirm={() => void handleApprove()}
      />
      <ConfirmModal
        open={confirmRejectOpen}
        onCancel={() => setConfirmRejectOpen(false)}
        label="Rechazar"
        message="¿Seguro que desea rechazar?"
        onConfirm={() => void handleReject()}
      />
    </DashboardTemplate>
  );
};
