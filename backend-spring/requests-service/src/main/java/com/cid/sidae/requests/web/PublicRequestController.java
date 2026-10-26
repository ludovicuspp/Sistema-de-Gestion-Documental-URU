package com.cid.sidae.requests.web;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.requests.domain.RequestDocument;
import com.cid.sidae.requests.domain.RequestItem;
import com.cid.sidae.requests.repo.RequestDocumentRepository;
import com.cid.sidae.requests.repo.RequestItemRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/requests")
public class PublicRequestController {

    private final RequestItemRepository requests;
    private final RequestDocumentRepository requestDocuments;

    public PublicRequestController(
            RequestItemRepository requests,
            RequestDocumentRepository requestDocuments) {
        this.requests = requests;
        this.requestDocuments = requestDocuments;
    }

    /** CU-18: formulario publico de solicitud de documentos. */
    @PostMapping
    public ApiResponse<PublicResponse> create(@Valid @RequestBody CreateRequest request) {
        String ci = request.ci().trim();
        Instant startOfDay = LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC);
        if (requests.existsByCiAndCreatedAtAfter(ci, startOfDay)) {
            throw ApiException.conflict("DUPLICATE_REQUEST",
                    "Ya existe una solicitud registrada hoy para esa cedula.");
        }

        RequestItem item = new RequestItem();
        item.setGuidId(UUID.randomUUID());
        item.setTrackingCode(nextTrackingCode());
        item.setCi(ci);
        item.setFullName(request.fullName().trim());
        item.setEmail(request.email().trim().toLowerCase());
        item.setPhone(request.phone());
        item.setComment(request.comment());
        item.setStatus("RECIBIDA");
        item.setCreatedAt(Instant.now());
        requests.save(item);

        for (DocumentRequest document : request.documents()) {
            RequestDocument row = new RequestDocument();
            row.setRequestId(item.getId());
            row.setDocumentTypeId(document.documentTypeId());
            row.setDocumentName(document.name().trim());
            requestDocuments.save(row);
        }

        return ApiResponse.ok(new PublicResponse(item.getTrackingCode(), item.getStatus(), item.getCreatedAt().toString()));
    }

    /** Seguimiento publico por codigo. */
    @GetMapping("/{trackingCode}")
    public ApiResponse<PublicResponse> tracking(@PathVariable String trackingCode) {
        RequestItem item = requests.findByTrackingCode(trackingCode.trim().toUpperCase())
                .orElseThrow(() -> ApiException.notFound("Solicitud no encontrada."));
        return ApiResponse.ok(new PublicResponse(item.getTrackingCode(), item.getStatus(), item.getCreatedAt().toString()));
    }

    private String nextTrackingCode() {
        String code;
        do {
            code = "CID-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase()
                    + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        } while (requests.findByTrackingCode(code).isPresent());
        return code;
    }

    public record CreateRequest(
            @NotBlank @Size(max = 20) String ci,
            @NotBlank @Size(max = 200) String fullName,
            @NotBlank @Email @Size(max = 120) String email,
            @Size(max = 30) String phone,
            @Size(max = 1000) String comment,
            @NotEmpty List<DocumentRequest> documents) {
    }

    public record DocumentRequest(Integer documentTypeId, @NotBlank @Size(max = 150) String name) {
    }

    public record PublicResponse(String trackingCode, String status, String createdAt) {
    }
}
