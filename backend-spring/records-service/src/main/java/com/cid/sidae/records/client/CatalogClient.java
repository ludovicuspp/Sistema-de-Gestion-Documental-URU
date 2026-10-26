package com.cid.sidae.records.client;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Cliente del catalogo (tipos de documento obligatorios por nivel, CU-23). */
@Component
public class CatalogClient {

    private final RestClient restClient;

    public CatalogClient(@Value("${clients.catalog-url:http://catalog-service:8082}") String catalogUrl,
            RestClient.Builder builder) {
        this.restClient = builder.baseUrl(catalogUrl).build();
    }

    public List<DocumentTypeDto> documentTypes(String authorization) {
        try {
            ApiResponse<List<DocumentTypeDto>> response = restClient.get()
                    .uri("/api/v1/catalog/document-types")
                    .header(HttpHeaders.AUTHORIZATION, authorization == null ? "" : authorization)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<List<DocumentTypeDto>>>() {
                    });
            if (response == null || response.data() == null) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "CATALOG_UNAVAILABLE",
                        "No fue posible consultar el catalogo de documentos.");
            }
            return response.data();
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "CATALOG_UNAVAILABLE",
                    "No fue posible consultar el catalogo de documentos.");
        }
    }

    public List<LevelDto> academicLevels(String authorization) {
        try {
            ApiResponse<List<LevelDto>> response = restClient.get()
                    .uri("/api/v1/catalog/academic-levels")
                    .header(HttpHeaders.AUTHORIZATION, authorization == null ? "" : authorization)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<List<LevelDto>>>() {
                    });
            if (response == null || response.data() == null) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "CATALOG_UNAVAILABLE",
                        "No fue posible consultar los niveles academicos.");
            }
            return response.data();
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "CATALOG_UNAVAILABLE",
                    "No fue posible consultar los niveles academicos.");
        }
    }

    public record DocumentTypeDto(Integer id, String name, boolean required, Integer academicLevelId) {
    }

    public record LevelDto(Integer id, String name) {
    }
}
