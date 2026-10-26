package com.cid.sidae.reports.service;

import com.cid.sidae.commons.api.ApiResponse;
import java.util.ArrayList;
import java.util.List;
import com.cid.sidae.commons.api.ApiException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Descarga listados completos paginando (los listados estan paginados, Fase B). */
@Component
public class ReportDataService {

    private static final int PAGE_SIZE = 100;

    public record PageDto(List<Map<String, Object>> content, long totalElements) {
    }

    private static final ParameterizedTypeReference<ApiResponse<PageDto>> PAGE_TYPE =
            new ParameterizedTypeReference<>() {
            };

    public List<Map<String, Object>> fetchAll(RestClient client, String basePath,
            Map<String, String> filters, String authorization) {
        List<Map<String, Object>> all = new ArrayList<>();
        int page = 0;
        while (true) {
            final int currentPage = page;
            ApiResponse<PageDto> response;
            try {
                response = client.get()
                        .uri(builder -> {
                            var uri = builder.path(basePath);
                            filters.forEach((key, value) -> {
                                if (value != null && !value.isBlank()) {
                                    uri.queryParam(key, value);
                                }
                            });
                            return uri.queryParam("page", currentPage).queryParam("size", PAGE_SIZE).build();
                        })
                        .header(HttpHeaders.AUTHORIZATION, authorization == null ? "" : authorization)
                        .retrieve()
                        .body(PAGE_TYPE);
            } catch (Exception ex) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "UPSTREAM_UNAVAILABLE",
                        "No fue posible obtener datos para el reporte: " + basePath);
            }
            if (response == null || response.data() == null || response.data().content() == null) {
                break;
            }
            all.addAll(response.data().content());
            if (all.size() >= response.data().totalElements() || response.data().content().isEmpty()) {
                break;
            }
            page++;
        }
        return all;
    }
}
