package com.cid.sidae.reports.web;

import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.reports.export.ExcelExporter;
import com.cid.sidae.reports.export.CsvExporter;
import com.cid.sidae.reports.export.PdfExporter;
import com.cid.sidae.reports.export.ReportColumn;
import com.cid.sidae.reports.service.ReportDataService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

/** CU-30: agrega estadisticas de los demas microservicios sin duplicar datos. */
@RestController
@RequestMapping("/api/v1/reports")
@PreAuthorize("hasRole('Administrador')")
public class ReportController {

    private final RestClient records;
    private final RestClient requests;
    private final RestClient students;
    private final RestClient tasks;
    private final ReportDataService data;

    public ReportController(
            @Value("${clients.records-url}") String recordsUrl,
            @Value("${clients.requests-url}") String requestsUrl,
            @Value("${clients.students-url}") String studentsUrl,
            @Value("${clients.tasks-url}") String tasksUrl,
            ReportDataService data) {
        this.records = RestClient.builder().baseUrl(recordsUrl).build();
        this.requests = RestClient.builder().baseUrl(requestsUrl).build();
        this.students = RestClient.builder().baseUrl(studentsUrl).build();
        this.tasks = RestClient.builder().baseUrl(tasksUrl).build();
        this.data = data;
    }

    @GetMapping("/summary")
    public ApiResponse<SummaryResponse> summary(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return ApiResponse.ok(buildSummary(authorization));
    }

    private SummaryResponse buildSummary(String authorization) {
        return new SummaryResponse(
                fetch(students, "/api/v1/students/count", authorization, new ParameterizedTypeReference<ApiResponse<Long>>() {
                }),
                fetch(records, "/api/v1/records/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                }),
                fetch(requests, "/api/v1/requests/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                }),
                fetch(tasks, "/api/v1/tasks/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                }));
    }

    private <T> T fetch(RestClient client, String path, String authorization, ParameterizedTypeReference<ApiResponse<T>> type) {
        try {
            ApiResponse<T> response = client.get()
                    .uri(path)
                    .header(HttpHeaders.AUTHORIZATION, authorization == null ? "" : authorization)
                    .retrieve()
                    .body(type);
            return response == null ? null : response.data();
        } catch (Exception ex) {
            return null;
        }
    }

    public record SummaryResponse(
            Long activeStudents,
            Map<String, Object> records,
            Map<String, Object> requests,
            Map<String, Object> tasks) {
    }

    private static final MediaType XLSX = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    @GetMapping(value = "/students.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> studentsXlsx(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(students,
                "/api/v1/students", filters("query", query, "status", status),
                authorization);
        byte[] body = ExcelExporter.export("Estudiantes", List.of(
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombres", row -> ReportColumn.text(row.get("firstName"))),
                new ReportColumn("Apellidos", row -> ReportColumn.text(row.get("lastName"))),
                new ReportColumn("Email", row -> ReportColumn.text(row.get("email"))),
                new ReportColumn("Telefono", row -> ReportColumn.text(row.get("phone"))),
                new ReportColumn("Estado", row -> ReportColumn.text(row.get("status"))),
                new ReportColumn("Tipo", row -> ReportColumn.text(row.get("type")))),
                rows);
        return file(body, XLSX, "reporte-estudiantes-" + LocalDate.now() + ".xlsx");
    }

    @GetMapping(value = "/students.pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> studentsPdf(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(students,
                "/api/v1/students", filters("query", query, "status", status),
                authorization);
        return file(PdfExporter.exportMaps("Reporte de estudiantes", studentColumns(), rows),
                MediaType.APPLICATION_PDF, "reporte-estudiantes-" + LocalDate.now() + ".pdf");
    }

    @GetMapping(value = "/records.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> recordsXlsx(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String ci,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(records,
                "/api/v1/records", filters("ci", ci, "status", status),
                authorization);
        byte[] body = ExcelExporter.export("Expedientes", recordColumns(), rows);
        return file(body, XLSX, "reporte-expedientes-" + LocalDate.now() + ".xlsx");
    }

    @GetMapping(value = "/records.pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> recordsPdf(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String ci,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(records,
                "/api/v1/records", filters("ci", ci, "status", status),
                authorization);
        return file(PdfExporter.exportMaps("Reporte de expedientes", recordColumns(), rows),
                MediaType.APPLICATION_PDF, "reporte-expedientes-" + LocalDate.now() + ".pdf");
    }

    @GetMapping(value = "/requests.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> requestsXlsx(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(requests,
                "/api/v1/requests", filters("status", status, null, null),
                authorization);
        byte[] body = ExcelExporter.export("Solicitudes", requestColumns(), rows);
        return file(body, XLSX, "reporte-solicitudes-" + LocalDate.now() + ".xlsx");
    }

    @GetMapping(value = "/requests.pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> requestsPdf(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(requests,
                "/api/v1/requests", filters("status", status, null, null),
                authorization);
        return file(PdfExporter.exportMaps("Reporte de solicitudes", requestColumns(), rows),
                MediaType.APPLICATION_PDF, "reporte-solicitudes-" + LocalDate.now() + ".pdf");
    }

    @GetMapping(value = "/summary.pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> summaryPdf(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        SummaryResponse summary = buildSummary(authorization);
        List<Map<String, Object>> rows = new ArrayList<>();
        rows.add(Map.of("indicador", "Estudiantes activos", "valor", String.valueOf(summary.activeStudents())));
        addStatsRows(rows, "Expedientes", summary.records());
        addStatsRows(rows, "Solicitudes", summary.requests());
        addStatsRows(rows, "Tareas", summary.tasks());
        byte[] body = PdfExporter.exportMaps("Resumen SIDAE",
                List.of(new ReportColumn("Indicador", row -> ReportColumn.text(row.get("indicador"))),
                        new ReportColumn("Valor", row -> ReportColumn.text(row.get("valor")))),
                rows);
        return file(body, MediaType.APPLICATION_PDF, "resumen-sidae-" + LocalDate.now() + ".pdf");
    }

    @GetMapping(value = "/students.csv", produces = "text/csv")
    public ResponseEntity<byte[]> studentsCsv(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(students,
                "/api/v1/students", filters("query", query, "status", status),
                authorization);
        return file(CsvExporter.export(studentColumns(), rows),
                MediaType.parseMediaType("text/csv"), "reporte-estudiantes-" + LocalDate.now() + ".csv");
    }

    @GetMapping(value = "/records.csv", produces = "text/csv")
    public ResponseEntity<byte[]> recordsCsv(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String ci,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(records,
                "/api/v1/records", filters("ci", ci, "status", status),
                authorization);
        return file(CsvExporter.export(recordColumns(), rows),
                MediaType.parseMediaType("text/csv"), "reporte-expedientes-" + LocalDate.now() + ".csv");
    }

    @GetMapping(value = "/requests.csv", produces = "text/csv")
    public ResponseEntity<byte[]> requestsCsv(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> rows = data.fetchAll(requests,
                "/api/v1/requests", filters("status", status, null, null),
                authorization);
        return file(CsvExporter.export(requestColumns(), rows),
                MediaType.parseMediaType("text/csv"), "reporte-solicitudes-" + LocalDate.now() + ".csv");
    }

    private static List<ReportColumn> studentColumns() {
        return List.of(
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombres", row -> ReportColumn.text(row.get("firstName"))),
                new ReportColumn("Apellidos", row -> ReportColumn.text(row.get("lastName"))),
                new ReportColumn("Email", row -> ReportColumn.text(row.get("email"))),
                new ReportColumn("Telefono", row -> ReportColumn.text(row.get("phone"))),
                new ReportColumn("Estado", row -> ReportColumn.text(row.get("status"))),
                new ReportColumn("Tipo", row -> ReportColumn.text(row.get("type"))));
    }

    private static List<ReportColumn> recordColumns() {
        return List.of(
                new ReportColumn("ID", row -> ReportColumn.text(row.get("id"))),
                new ReportColumn("CI", row -> ReportColumn.text(row.get("studentCi"))),
                new ReportColumn("Estudiante", row -> ReportColumn.text(row.get("studentName"))),
                new ReportColumn("Tipo", row -> ReportColumn.text(row.get("folderType"))),
                new ReportColumn("Estado", row -> ReportColumn.text(row.get("status"))),
                new ReportColumn("Descripcion", row -> ReportColumn.text(row.get("description"))),
                new ReportColumn("Ubicacion", row -> locationOf(row)),
                new ReportColumn("Creado", row -> ReportColumn.text(row.get("createdAt"))));
    }

    private static List<ReportColumn> requestColumns() {
        return List.of(
                new ReportColumn("Codigo", row -> ReportColumn.text(row.get("trackingCode"))),
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombre", row -> ReportColumn.text(row.get("fullName"))),
                new ReportColumn("Email", row -> ReportColumn.text(row.get("email"))),
                new ReportColumn("Estado", row -> ReportColumn.text(row.get("status"))),
                new ReportColumn("Creada", row -> ReportColumn.text(row.get("createdAt"))));
    }

    private static String locationOf(Map<String, Object> row) {
        List<String> parts = new ArrayList<>();
        for (String key : List.of("shelf", "box", "rowNumber")) {
            String value = ReportColumn.text(row.get(key));
            if (!value.isBlank()) {
                parts.add(value);
            }
        }
        return String.join(" / ", parts);
    }

    private static void addStatsRows(List<Map<String, Object>> rows, String section, Map<String, Object> stats) {
        if (stats == null) {
            rows.add(Map.of("indicador", section, "valor", "no disponible"));
            return;
        }
        stats.forEach((key, value) -> rows.add(Map.of("indicador", section + " - " + key,
                "valor", String.valueOf(value))));
    }

    private static Map<String, String> filters(String key1, String value1, String key2, String value2) {
        Map<String, String> filters = new java.util.LinkedHashMap<>();
        if (key1 != null && value1 != null && !value1.isBlank()) {
            filters.put(key1, value1);
        }
        if (key2 != null && value2 != null && !value2.isBlank()) {
            filters.put(key2, value2);
        }
        return filters;
    }

    private static ResponseEntity<byte[]> file(byte[] body, MediaType contentType, String filename) {
        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(filename)
                        .build()
                        .toString())
                .body(body);
    }
}

