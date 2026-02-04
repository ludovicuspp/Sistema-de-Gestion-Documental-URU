/**
 * API service: Reminders
 * Sample data for dashboard reminders.
 */

export interface Reminder {
  id: string;
  text: string;
}

const MOCK: Reminder[] = [
  { id: "1", text: "Revisar expedientes pendientes de validación (312)" },
  { id: "2", text: "Programar backup mensual de documentos" },
  { id: "3", text: "Auditoría: historial de modificaciones" },
];

export const remindersService = {
  async list(): Promise<Reminder[]> {
    await delay(200);
    return MOCK;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
