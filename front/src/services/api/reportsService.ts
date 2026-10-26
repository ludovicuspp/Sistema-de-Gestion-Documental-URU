import { apiFetch, apiFetchBlob } from "./http";

export interface ReportsSummary {
  activeStudents: number | null;
  records: Record<string, number> | null;
  requests: Record<string, number> | null;
  tasks: Record<string, number> | null;
}

export const reportsService = {
  async summary(): Promise<ReportsSummary> {
    return apiFetch<ReportsSummary>("/api/v1/reports/summary");
  },

  /** Descarga un reporte binario (xlsx/pdf/csv) con el nombre indicado. */
  async download(path: string, filename: string): Promise<void> {
    const blob = await apiFetchBlob(path);
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  },
};

function stamp(base: string, extension: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `${base}-${today}.${extension}`;
}

export const reportFiles = {
  summaryPdf: () => ({ path: "/api/v1/reports/summary.pdf", filename: stamp("resumen-sidae", "pdf") }),
  studentsXlsx: () => ({ path: "/api/v1/reports/students.xlsx", filename: stamp("reporte-estudiantes", "xlsx") }),
  recordsXlsx: () => ({ path: "/api/v1/reports/records.xlsx", filename: stamp("reporte-expedientes", "xlsx") }),
  requestsXlsx: () => ({ path: "/api/v1/reports/requests.xlsx", filename: stamp("reporte-solicitudes", "xlsx") }),
  studentsPdf: () => ({ path: "/api/v1/reports/students.pdf", filename: stamp("reporte-estudiantes", "pdf") }),
  recordsPdf: () => ({ path: "/api/v1/reports/records.pdf", filename: stamp("reporte-expedientes", "pdf") }),
  requestsPdf: () => ({ path: "/api/v1/reports/requests.pdf", filename: stamp("reporte-solicitudes", "pdf") }),
  studentsCsv: () => ({ path: "/api/v1/reports/students.csv", filename: stamp("reporte-estudiantes", "csv") }),
  recordsCsv: () => ({ path: "/api/v1/reports/records.csv", filename: stamp("reporte-expedientes", "csv") }),
  requestsCsv: () => ({ path: "/api/v1/reports/requests.csv", filename: stamp("reporte-solicitudes", "csv") }),
};
