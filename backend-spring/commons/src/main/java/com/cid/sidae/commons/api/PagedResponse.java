package com.cid.sidae.commons.api;

import java.util.List;

/**
 * Respuesta paginada estable dentro de {@link ApiResponse#data()}.
 * No se expone el Page de Spring para no filtrar internals a la API publica
 * (y para no arrastrar spring-data como dependencia de commons).
 */
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages) {

    public static <T> PagedResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = size <= 0 ? 0 : (int) Math.ceil((double) totalElements / (double) size);
        return new PagedResponse<>(content, page, size, totalElements, totalPages);
    }
}
