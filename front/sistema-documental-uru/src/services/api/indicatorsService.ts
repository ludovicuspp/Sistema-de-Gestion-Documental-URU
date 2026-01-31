/**
 * API service: Indicators and current status
 * Sample data for dashboard indicators.
 */

export interface IndicatorsState {
  pendingDocuments: number;
  unattendedRequests: number;
  inactiveUsers: number;
  systemAvailability: string;
}

export interface SummaryToday {
  newRecords: number;
  validatedDocuments: number;
  processedRequests: number;
}

const MOCK_INDICATORS: IndicatorsState = {
  pendingDocuments: 312,
  unattendedRequests: 24,
  inactiveUsers: 8,
  systemAvailability: "98%",
};

const MOCK_SUMMARY_TODAY: SummaryToday = {
  newRecords: 12,
  validatedDocuments: 34,
  processedRequests: 7,
};

export const indicatorsService = {
  async getCurrentState(): Promise<IndicatorsState> {
    await delay(200);
    return MOCK_INDICATORS;
  },
  async getSummaryToday(): Promise<SummaryToday> {
    await delay(200);
    return MOCK_SUMMARY_TODAY;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
