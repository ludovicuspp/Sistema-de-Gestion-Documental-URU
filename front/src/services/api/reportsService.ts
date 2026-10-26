import { apiFetch } from "./http";

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
};
