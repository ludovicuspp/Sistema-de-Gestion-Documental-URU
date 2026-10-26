/**
 * API services (backend real).
 * Todos los modulos consumen /api/v1/* via Nginx (mismo origen) con JWT.
 */
export { authService } from "./authService";
export type { AuthResponse, MeResponse } from "./authService";
export { studentsService, studentFullName } from "./studentsService";
export type { StudentDto, StudentRequest } from "./studentsService";
export { recordsService } from "./recordsService";
export type {
  FolderDto,
  FolderRequest,
  FolderUpdateRequest,
  DocumentDto,
  ObservationDto,
  HistoryDto,
  RecentHistoryDto,
  FolderStats,
} from "./recordsService";
export { requestsService, publicRequestsService } from "./requestsService";
export type {
  RequestDto,
  RequestDocumentDto,
  RequestStats,
  PublicRequestPayload,
  PublicRequestReceipt,
} from "./requestsService";
export { tasksService } from "./tasksService";
export type { TaskDto, TaskStats, TaskRequest } from "./tasksService";
export { usersService } from "./usersService";
export type { UserDto, CreateUserRequest } from "./usersService";
export { catalogService } from "./catalogService";
export type { CareerDto, OptionDto, DocumentTypeDto } from "./catalogService";
export { reportsService, reportFiles } from "./reportsService";
export type { ReportsSummary } from "./reportsService";
export { ApiError, apiFetch, apiFetchBlob, clearSession, getSessionUser, getToken, pageParams, saveSession } from "./http";
export type { ApiResponse, PageResponse, SessionUser } from "./http";
