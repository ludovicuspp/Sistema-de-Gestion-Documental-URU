/**
 * API service: Documents
 * Sample data for pending and validated documents.
 */

export interface DocumentsSummary {
  pending: number;
  validatedToday: number;
  subtitle: string;
}

const MOCK: DocumentsSummary = {
  pending: 312,
  validatedToday: 34,
  subtitle: "Por validar por verificadores",
};

export const documentsService = {
  async getSummary(): Promise<DocumentsSummary> {
    await delay(200);
    return MOCK;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
