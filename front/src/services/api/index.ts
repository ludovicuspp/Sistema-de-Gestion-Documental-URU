/**
 * API services per entity.
 * Each module exposes sample data for the dashboard.
 */
export { recordsService } from "./recordsService";
export type { RecordSummary } from "./recordsService";
export { documentsService } from "./documentsService";
export type { DocumentsSummary } from "./documentsService";
export { tasksService } from "./tasksService";
export type { TasksSummary, TaskDto } from "./tasksService";
export { remindersService } from "./remindersService";
export type { Reminder } from "./remindersService";
export { activityService } from "./activityService";
export type { ActivityEntry } from "./activityService";
export { indicatorsService } from "./indicatorsService";
export type { IndicatorsState, SummaryToday } from "./indicatorsService";
export { authService } from "./authService";
export type { AuthResponse, MeResponse } from "./authService";
export { ApiError, apiFetch, clearSession, getSessionUser, getToken, saveSession } from "./http";
export type { ApiResponse, SessionUser } from "./http";
