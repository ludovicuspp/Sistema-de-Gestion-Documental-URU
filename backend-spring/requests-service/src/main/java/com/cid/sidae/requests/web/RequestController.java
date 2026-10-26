package com.cid.sidae.requests.web;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.requests.domain.RequestItem;
import com.cid.sidae.requests.repo.RequestDocumentRepository;
import com.cid.sidae.requests.repo.RequestItemRepository;
import com.cid.sidae.requests.service.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/requests")
public class RequestController {

    private final RequestItemRepository requests;
    private final RequestDocumentRepository requestDocuments;
    private final NotificationService notifications;

    public RequestController(
            RequestItemRepository requests,
            RequestDocumentRepository requestDocuments,
            NotificationService notifications) {
        this.requests = requests;
        this.requestDocuments = requestDocuments;
        this.notifications = notifications;
    }

    @GetMapping
    public ApiResponse<List<RequestResponse>> list(@RequestParam(required = false) String status) {
        List<RequestItem> result = requests.findAllByOrderByCreatedAtDesc();
        if (status != null && !status.isBlank()) {
            String normalized = status.toUpperCase(Locale.ROOT);
            result = result.stream().filter(item -> item.getStatus().equals(normalized)).toList();
        }
        return ApiResponse.ok(result.stream().map(this::toResponse).toList());
    }

    @GetMapping("/stats")
    public ApiResponse<StatsResponse> stats() {
        return ApiResponse.ok(new StatsResponse(
                requests.count(),
                requests.countByStatus("RECIBIDA"),
                requests.countByStatus("EN_PROCESO"),
                requests.countByStatus("COMPLETADA")));
    }

    @GetMapping("/{id}")
    public ApiResponse<RequestResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(toResponse(find(id)));
    }

    /** CU-19: al completar se envia la respuesta por correo. */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('Administrador') or hasRole('Asistente') or hasRole('Verificador')")
    public ApiResponse<RequestResponse> updateStatus(
            @PathVariable Long id, @Valid @RequestBody StatusRequest request) {

        RequestItem item = find(id);
        String status = request.status().toUpperCase(Locale.ROOT);
        if (!List.of("RECIBIDA", "EN_PROCESO", "COMPLETADA", "RECHAZADA").contains(status)) {
            throw ApiException.badRequest("INVALID_STATUS", "Estado de solicitud invalido.");
        }
        item.setStatus(status);
        item.setUpdatedAt(Instant.now());
        requests.save(item);

        if ("COMPLETADA".equals(status)) {
            notifications.sendReadyNotification(item.getEmail(), item.getFullName(), item.getTrackingCode());
        }
        return ApiResponse.ok(toResponse(item));
    }

    private RequestItem find(Long id) {
        return requests.findById(id).orElseThrow(() -> ApiException.notFound("Solicitud no encontrada."));
    }

    private RequestResponse toResponse(RequestItem item) {
        List<RequestResponse.DocumentInfo> docs = requestDocuments.findByRequestId(item.getId()).stream()
                .map(doc -> new RequestResponse.DocumentInfo(doc.getDocumentTypeId(), doc.getDocumentName()))
                .toList();
        return new RequestResponse(
                item.getId(),
                item.getTrackingCode(),
                item.getCi(),
                item.getFullName(),
                item.getEmail(),
                item.getPhone(),
                item.getComment(),
                item.getStatus(),
                item.getCreatedAt().toString(),
                docs);
    }

    public record StatusRequest(@NotBlank String status) {
    }

    public record RequestResponse(
            Long id,
            String trackingCode,
            String ci,
            String fullName,
            String email,
            String phone,
            String comment,
            String status,
            String createdAt,
            List<DocumentInfo> documents) {

        public record DocumentInfo(Integer documentTypeId, String name) {
        }
    }

    public record StatsResponse(long total, long received, long inProgress, long completed) {
    }
}
