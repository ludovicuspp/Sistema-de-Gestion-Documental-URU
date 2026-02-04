/**
 * API service: Records.
 * Sample data for total records and activity.
 */

export interface RecordSummary {
  total: number;
  updatedAt: string;
  createdLast30Days: number;
}

const MOCK: RecordSummary = {
  total: 1248,
  updatedAt: "13 Nov 2025",
  createdLast30Days: 84,
};

export const recordsService = {
  async getSummary(): Promise<RecordSummary> {
    await delay(200);
    return MOCK;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
