/**
 * API service: Recent activity
 * Sample data for the activity log.
 */

export interface ActivityEntry {
  id: string;
  text: string;
  datetime: string;
}

const MOCK: ActivityEntry[] = [
  { id: "1", text: "Verificador A validó expediente #0113", datetime: "2025-11-12 09:24" },
  { id: "2", text: "Asistente B subió cedula.pdf para Ludovicus V.", datetime: "2025-11-10 14:02" },
  {
    id: "3",
    text: 'Administrador creó tipo de documento "Acta de Egreso"',
    datetime: "2025-10-21 11:10",
  },
];

export const activityService = {
  async getRecent(): Promise<ActivityEntry[]> {
    await delay(200);
    return MOCK;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
