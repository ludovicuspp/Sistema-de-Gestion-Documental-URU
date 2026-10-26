package com.cid.sidae.reports.web;

import com.cid.sidae.commons.api.ApiResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
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

    public ReportController(
            @Value("${clients.records-url}") String recordsUrl,
            @Value("${clients.requests-url}") String requestsUrl,
            @Value("${clients.students-url}") String studentsUrl,
            @Value("${clients.tasks-url}") String tasksUrl) {
        this.records = RestClient.builder().baseUrl(recordsUrl).build();
        this.requests = RestClient.builder().baseUrl(requestsUrl).build();
        this.students = RestClient.builder().baseUrl(studentsUrl).build();
        this.tasks = RestClient.builder().baseUrl(tasksUrl).build();
    }

    @GetMapping("/summary")
    public ApiResponse<SummaryResponse> summary(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {

        return ApiResponse.ok(new SummaryResponse(
                fetch(students, "/api/v1/students/count", authorization, new ParameterizedTypeReference<ApiResponse<Long>>() {
                }),
                fetch(records, "/api/v1/records/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                }),
                fetch(requests, "/api/v1/requests/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                }),
                fetch(tasks, "/api/v1/tasks/stats", authorization, new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {
                })));
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
}
