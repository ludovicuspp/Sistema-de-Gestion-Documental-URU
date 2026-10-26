import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/molecules/Card";
import { SummaryCard } from "@/components/molecules/SummaryCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { reportsService, ApiError, clearSession } from "@/services/api";
import type { ReportsSummary } from "@/services/api";
import "./ReportsPage.css";

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

interface ReportDetailRow {
  date: string;
  metric: string;
  quantity: string;
  source: string;
  comments: string;
}

interface StatusDistribution {
  status: string;
  count: number | string;
}

/** Extrae un numero del map crudo del backend (Map<String, Object> serializado). */
const getNumber = (map: Record<string, number> | null, key: string): number | null => {
  const v = map?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
};

const fmt = (v: number | null): string => (v == null ? "—" : v.toLocaleString("es"));

/**
 * ReportsPage - Page
 *
 * Reports view: filters, metrics, status distribution and detail table,
 * alimentados por reportsService.summary() (solo Administrador).
 * Sin fuente en el backend se ocultan: Top 5 carreras y disponibilidad del sistema ("—").
 */
export const ReportsPage = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        setSummary(await reportsService.summary());
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearSession();
          navigate("/");
          return;
        }
        setError(e instanceof Error ? e.message : "No se pudieron cargar los reportes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const recordsTotal = getNumber(summary?.records ?? null, "total");
  const recordsPending = getNumber(summary?.records ?? null, "pending");
  const recordsApproved = getNumber(summary?.records ?? null, "approved");
  const recordsRejected = getNumber(summary?.records ?? null, "rejected");
  const requestsTotal = getNumber(summary?.requests ?? null, "total");
  const requestsReceived = getNumber(summary?.requests ?? null, "received");
  const requestsInProgress = getNumber(summary?.requests ?? null, "inProgress");
  const requestsCompleted = getNumber(summary?.requests ?? null, "completed");
  const unattended =
    requestsReceived != null && requestsInProgress != null
      ? requestsReceived + requestsInProgress
      : null;
  const tasksTotal = getNumber(summary?.tasks ?? null, "total");
  const tasksPending = getNumber(summary?.tasks ?? null, "pending");

  const metrics = [
    { value: "expedientes", label: "Expedientes totales" },
    { value: "documentos", label: "Documentos pendientes" },
    { value: "solicitudes", label: "Solicitudes sin atender" },
  ];

  const kpiData = [
    {
      value: loading ? "…" : fmt(recordsTotal),
      label: "Expedientes totales",
      subtitle: "Periodo seleccionado",
    },
    {
      value: loading ? "…" : fmt(recordsPending),
      label: "Documentos pendientes",
      subtitle: "Por validar",
    },
    {
      value: loading ? "…" : fmt(unattended),
      label: "Solicitudes sin atender",
      subtitle: requestsTotal != null ? `Total: ${requestsTotal.toLocaleString("es")}` : "—",
    },
    { value: "—", label: "Disponibilidad sistema", subtitle: "Sin datos del backend" },
  ];

  const statusDistribution: StatusDistribution[] = [
    { status: "Pendientes", count: loading ? "…" : fmt(recordsPending) },
    { status: "Aprobados", count: loading ? "…" : fmt(recordsApproved) },
    { status: "Rechazados", count: loading ? "…" : fmt(recordsRejected) },
  ];

  const detailRows: ReportDetailRow[] = summary
    ? [
        {
          date: "—",
          metric: "Expedientes totales",
          quantity: fmt(recordsTotal),
          source: "Sistema",
          comments:
            recordsApproved != null || recordsRejected != null
              ? `Aprobados: ${fmt(recordsApproved)} · Rechazados: ${fmt(recordsRejected)}`
              : "—",
        },
        {
          date: "—",
          metric: "Solicitudes recibidas",
          quantity: fmt(requestsTotal),
          source: "Portal",
          comments:
            requestsReceived != null || requestsCompleted != null
              ? `Recibidas: ${fmt(requestsReceived)} · En proceso: ${fmt(requestsInProgress)} · Completadas: ${fmt(requestsCompleted)}`
              : "—",
        },
        {
          date: "—",
          metric: "Tareas",
          quantity: fmt(tasksTotal),
          source: "Sistema",
          comments: tasksPending != null ? `Pendientes: ${fmt(tasksPending)}` : "—",
        },
        {
          date: "—",
          metric: "Estudiantes activos",
          quantity: fmt(summary.activeStudents),
          source: "Sistema",
          comments: "—",
        },
      ]
    : [];

  const handleExport = useCallback(() => {
    console.log("Exportar reporte");
  }, []);

  const handleUpdate = useCallback(() => {
    console.log("Actualizar datos");
  }, []);

  const handleApply = useCallback(() => {
    console.log("Aplicar filtros", { selectedMetric, dateFrom, dateTo });
  }, [selectedMetric, dateFrom, dateTo]);

  const handleViewDetail = useCallback(() => {
    console.log("Ver detalle del gráfico");
  }, []);

  const handleExportCSV = useCallback(() => {
    console.log("Exportar CSV");
  }, []);

  const handleDownloadPDF = useCallback(() => {
    console.log("Descargar PDF");
  }, []);

  const handleDownloadExcel = useCallback(() => {
    console.log("Descargar Excel");
  }, []);

  return (
    <DashboardTemplate currentView="Reportes" onCreateUser={() => {}} onRefresh={() => globalThis.location.reload()}>
      <div className="reports-page">
        {/* Filters Section */}
        <section className="reports-page__filters">
          <Card variant="elevated" className="reports-page__filters-card">
            <h3 className="reports-page__section-title">Filtros y periodos</h3>
            <p className="reports-page__section-subtitle">Selecciona métricas, filtros y rango de fechas</p>
            <div className="reports-page__filters-content">
              <div className="reports-page__filters-left">
                <select
                  className="reports-page__select"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}>
                  <option value="">Seleccionar</option>
                  {metrics.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="date"
                  placeholder="Desde dd/mm/yyyy"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  endIcon={<IconCalendar />}
                />
                <Input
                  type="date"
                  placeholder="Hasta dd/mm/yyyy"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  endIcon={<IconCalendar />}
                />
              </div>
              <div className="reports-page__filters-right">
                <Button variant="primary" onClick={handleExport} startIcon={<IconDownload />}>
                  Exportar
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                  Actualizar
                </Button>
                <Button variant="primary" onClick={handleApply}>
                  Aplicar
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {error && <p style={{ color: "#b42318" }}>{error}</p>}

        {/* KPI Cards */}
        <section className="reports-page__kpis">
          <div className="reports-page__kpis-grid">
            {kpiData.map((kpi, index) => (
              <SummaryCard key={index} value={kpi.value} label={kpi.label} subtitle={kpi.subtitle} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="reports-page__main-grid">
          {/* Left Column: Chart */}
          <section className="reports-page__chart-section">
            <Card variant="elevated" className="reports-page__chart-card">
              <div className="reports-page__chart-header">
                <div>
                  <h3 className="reports-page__section-title">Tendencia de expedientes</h3>
                  <p className="reports-page__section-subtitle">Grupo: Por mes</p>
                </div>
              </div>
              <div className="reports-page__chart-placeholder">
                <p>[Gráfico de líneas / barras]</p>
              </div>
              <div className="reports-page__chart-footer">
                <p className="reports-page__chart-comparison">Comparativa: Pregrado vs Postgrado</p>
                <div className="reports-page__chart-actions">
                  <Button variant="outline" onClick={handleViewDetail}>
                    Ver detalle
                  </Button>
                  <Button variant="outline" onClick={handleExportCSV} startIcon={<IconDownload />}>
                    Exportar CSV
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Right Column: Status Distribution */}
          <aside className="reports-page__right-column">
            {/* Status Distribution */}
            <Card variant="elevated" className="reports-page__status-card">
              <h3 className="reports-page__section-title">Distribución por estado</h3>
              <p className="reports-page__section-subtitle">Hoy</p>
              <ul className="reports-page__status-list">
                {statusDistribution.map((item, index) => (
                  <li key={index} className="reports-page__status-item">
                    <span className="reports-page__status-label">{item.status}:</span>
                    <span className="reports-page__status-count">{item.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>

        {/* Detail Table Section */}
        <section className="reports-page__detail-section">
          <Card variant="elevated" className="reports-page__detail-card">
            <div className="reports-page__detail-header">
              <div>
                <h3 className="reports-page__section-title">Detalle por unidad / filtro</h3>
                <p className="reports-page__section-subtitle">Listado y exportación</p>
              </div>
              <div className="reports-page__detail-actions">
                <Button variant="primary" onClick={handleDownloadPDF} startIcon={<IconFileText />}>
                  Descargar PDF
                </Button>
                <Button variant="primary" onClick={handleDownloadExcel} startIcon={<IconDownload />}>
                  Descargar Excel
                </Button>
              </div>
            </div>
            <div className="reports-page__table-wrapper">
              <table className="reports-page__table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Métrica</th>
                    <th>Cantidad</th>
                    <th>Fuente</th>
                    <th>Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.date}</td>
                      <td>{row.metric}</td>
                      <td>{row.quantity}</td>
                      <td>{row.source}</td>
                      <td>{row.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </DashboardTemplate>
  );
};
