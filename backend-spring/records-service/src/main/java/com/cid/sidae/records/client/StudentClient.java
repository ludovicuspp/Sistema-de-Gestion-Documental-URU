package com.cid.sidae.records.client;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class StudentClient {

    private final RestClient restClient;

    public StudentClient(@Value("${clients.students-url}") String studentsUrl, RestClient.Builder builder) {
        this.restClient = builder.baseUrl(studentsUrl).build();
    }

    public StudentDto findByCi(String ci, String authorization) {
        try {
            ApiResponse<StudentDto> response = restClient.get()
                    .uri("/api/v1/students/by-ci/{ci}", ci)
                    .header(HttpHeaders.AUTHORIZATION, authorization == null ? "" : authorization)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<StudentDto>>() {
                    });
            if (response == null || response.data() == null) {
                throw ApiException.notFound("Estudiante no encontrado.");
            }
            return response.data();
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "STUDENTS_UNAVAILABLE",
                    "No fue posible consultar el servicio de estudiantes.");
        }
    }

    public record StudentDto(
            Long id,
            String ci,
            String firstName,
            String lastName,
            String status,
            String type,
            Integer academicLevelId,
            boolean active) {

        public String fullName() {
            return firstName + " " + lastName;
        }
    }
}
