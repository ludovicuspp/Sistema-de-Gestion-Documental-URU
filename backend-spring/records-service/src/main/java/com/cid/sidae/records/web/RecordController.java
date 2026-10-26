package com.cid.sidae.records.web;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.security.AuthenticatedUser;
import com.cid.sidae.records.client.StudentClient;
import com.cid.sidae.records.domain.DocumentEntry;
import com.cid.sidae.records.domain.RecordFolder;
import com.cid.sidae.records.domain.RecordHistory;
import com.cid.sidae.records.domain.RecordObservation;
import com.cid.sidae.records.repo.DocumentEntryRepository;
import com.cid.sidae.records.repo.RecordFolderRepository;
import com.cid.sidae.records.repo.RecordHistoryRepository;
import com.cid.sidae.records.repo.RecordObservationRepository;
import com.cid.sidae.records.service.DocumentStorage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/records")
public class RecordController {

    private final RecordFolderRepository folders;
    private final DocumentEntryRepository documents;
    private final RecordObservationRepository observations;
    private final RecordHistoryRepository history;
    private final StudentClient students;
    private final DocumentStorage storage;

    public RecordController(
            RecordFolderRepository folders,
            DocumentEntryRepository documents,
            RecordObservationRepository observations,
            RecordHistoryRepository history,
            StudentClient students,
            DocumentStorage storage) {
        this.folders = folders;
        this.documents = documents;
        this.observations = observations;
        this.history = history;
        this.students = students;
        this.storage = storage;
    }

    @GetMapping
    public ApiResponse<List<FolderResponse>> list(
            @RequestParam(required = false) String ci,
            @RequestParam(required = false) String status) {

        List<RecordFolder> result;
        if (ci != null && !ci.isBlank()) {
            result = folders.findByActiveTrueAndStudentCiContainingIgnoreCase(ci.trim());
        } else if (status != null && !status.isBlank()) {
            result = folders.findByActiveTrueAndStatus(status.toUpperCase());
        } else {
            result = folders.findByActiveTrueOrderByCreatedAtDesc();
        }
        return ApiResponse.ok(result.stream().map(FolderResponse::from).toList());
    }

    @GetMapping("/stats")
    public ApiResponse<StatsResponse> stats() {
        return ApiResponse.ok(new StatsResponse(
                folders.countByActiveTrue(),
                folders.countByActiveTrueAndStatus("APROBADO"),
                folders.countByActiveTrueAndStatus("PENDIENTE"),
                folders.countByActiveTrueAndStatus("RECHAZADO"),
                documents.countByActiveTrue()));
    }

    @GetMapping("/{id}")
    public ApiResponse<FolderResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(FolderResponse.from(findFolder(id)));
    }

    @PostMapping
    public ApiResponse<FolderResponse> create(
            @Valid @RequestBody FolderRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {

        StudentClient.StudentDto student = students.findByCi(request.studentCi().trim(), authorization);
        String folderType = request.folderType() == null ? student.type() : request.folderType().toUpperCase();

        if (folders.existsByStudentIdAndFolderTypeAndActiveTrue(student.id(), folderType)) {
            throw ApiException.conflict("DUPLICATE_FOLDER",
                    "Ya existe un expediente de ese tipo para el estudiante.");
        }

        AuthenticatedUser current = AuthenticatedUser.current();
        RecordFolder folder = new RecordFolder();
        folder.setGuidId(UUID.randomUUID());
        folder.setStudentId(student.id());
        folder.setStudentCi(student.ci());
        folder.setStudentName(student.fullName());
        folder.setFolderType(folderType);
        folder.setDescription(request.description());
        folder.setShelf(request.shelf());
        folder.setBox(request.box());
        folder.setRowNumber(request.rowNumber());
        folder.setStatus("PENDIENTE");
        folder.setCreatedById(current.id());
        folder.setCreatedByName(current.username());
        folder.setCreatedAt(Instant.now());
        folders.save(folder);

        record(folder.getId(), "CREACION", "Expediente creado", current);
        return ApiResponse.ok(FolderResponse.from(folder));
    }

    @PutMapping("/{id}")
    public ApiResponse<FolderResponse> update(@PathVariable Long id, @Valid @RequestBody FolderUpdateRequest request) {
        RecordFolder folder = findFolder(id);
        if ("APROBADO".equalsIgnoreCase(folder.getStatus())) {
            throw ApiException.forbidden("No se puede modificar un expediente aprobado.");
        }
        AuthenticatedUser current = AuthenticatedUser.current();
        folder.setDescription(request.description());
        folder.setShelf(request.shelf());
        folder.setBox(request.box());
        folder.setRowNumber(request.rowNumber());
        folder.setUpdatedAt(Instant.now());
        folders.save(folder);
        record(folder.getId(), "EDICION", "Expediente actualizado", current);
        return ApiResponse.ok(FolderResponse.from(folder));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        RecordFolder folder = findFolder(id);
        AuthenticatedUser current = AuthenticatedUser.current();
        folder.setActive(false);
        folder.setUpdatedAt(Instant.now());
        folders.save(folder);
        record(folder.getId(), "ELIMINACION", "Expediente eliminado", current);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{id}/documents")
    public ApiResponse<List<DocumentResponse>> listDocuments(@PathVariable Long id) {
        findFolder(id);
        return ApiResponse.ok(documents.findByFolderIdAndActiveTrueOrderByCreatedAt(id).stream()
                .map(DocumentResponse::from)
                .toList());
    }

    @PostMapping(value = "/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<DocumentResponse> upload(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "documentTypeId", required = false) String documentTypeId) {

        RecordFolder folder = findFolder(id);
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("EMPTY_FILE", "Debe adjuntar un archivo.");
        }
        String contentType = file.getContentType();
        if (contentType != null
                && !contentType.equals("application/pdf")
                && !contentType.startsWith("image/")) {
            throw ApiException.badRequest("INVALID_FORMAT", "Solo se permiten PDF o imagenes.");
        }

        AuthenticatedUser current = AuthenticatedUser.current();
        String storedPath = storage.store(file);

        DocumentEntry document = new DocumentEntry();
        document.setGuidId(UUID.randomUUID());
        document.setFolderId(folder.getId());
        document.setName(file.getOriginalFilename() == null ? "documento" : file.getOriginalFilename());
        document.setStoredPath(storedPath);
        document.setContentType(contentType);
        document.setFileSize(file.getSize());
        if (documentTypeId != null && !documentTypeId.isBlank()) {
            document.setDocumentTypeId(Integer.valueOf(documentTypeId));
        }
        document.setCreatedById(current.id());
        document.setCreatedAt(Instant.now());
        documents.save(document);

        record(folder.getId(), "CARGA_DOCUMENTO", "Documento cargado: " + document.getName(), current);
        return ApiResponse.ok(DocumentResponse.from(document));
    }

    @GetMapping("/documents/{documentId}/file")
    public ResponseEntity<Resource> download(@PathVariable Long documentId) {
        DocumentEntry document = documents.findByIdAndActiveTrue(documentId)
                .orElseThrow(() -> ApiException.notFound("Documento no encontrado."));
        Resource resource = storage.load(document.getStoredPath());
        MediaType mediaType = document.getContentType() == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(document.getContentType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + document.getName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/documents/{documentId}")
    public ApiResponse<Void> deleteDocument(@PathVariable Long documentId) {
        DocumentEntry document = documents.findByIdAndActiveTrue(documentId)
                .orElseThrow(() -> ApiException.notFound("Documento no encontrado."));
        document.setActive(false);
        documents.save(document);
        record(document.getFolderId(), "ELIMINACION_DOCUMENTO", "Documento eliminado: " + document.getName(),
                AuthenticatedUser.current());
        return ApiResponse.ok(null);
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('Administrador') or hasRole('Verificador')")
    public ApiResponse<FolderResponse> verify(@PathVariable Long id, @Valid @RequestBody VerifyRequest request) {
        RecordFolder folder = findFolder(id);
        AuthenticatedUser current = AuthenticatedUser.current();

        if (!request.approved() && (request.observations() == null || request.observations().isBlank())) {
            throw ApiException.badRequest("OBSERVATION_REQUIRED",
                    "Las observaciones son obligatorias cuando se rechaza un expediente.");
        }
        if (request.approved() && documents.findByFolderIdAndActiveTrueOrderByCreatedAt(id).isEmpty()) {
            throw ApiException.badRequest("EMPTY_FOLDER",
                    "No se puede aprobar un expediente sin documentos cargados.");
        }

        folder.setStatus(request.approved() ? "APROBADO" : "RECHAZADO");
        folder.setUpdatedAt(Instant.now());
        folders.save(folder);

        if (request.observations() != null && !request.observations().isBlank()) {
            saveObservation(folder.getId(), null, request.observations(), current);
        }
        record(folder.getId(), request.approved() ? "APROBACION" : "RECHAZO",
                request.observations(), current);
        return ApiResponse.ok(FolderResponse.from(folder));
    }

    @PostMapping("/{id}/observations")
    @PreAuthorize("hasRole('Administrador') or hasRole('Verificador')")
    public ApiResponse<ObservationResponse> addObservation(
            @PathVariable Long id, @Valid @RequestBody ObservationRequest request) {

        findFolder(id);
        RecordObservation observation = saveObservation(
                id, request.documentId(), request.content(), AuthenticatedUser.current());
        return ApiResponse.ok(ObservationResponse.from(observation));
    }

    @GetMapping("/{id}/observations")
    public ApiResponse<List<ObservationResponse>> listObservations(@PathVariable Long id) {
        findFolder(id);
        return ApiResponse.ok(observations.findByFolderIdOrderByCreatedAtDesc(id).stream()
                .map(ObservationResponse::from)
                .toList());
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<HistoryResponse>> listHistory(@PathVariable Long id) {
        findFolder(id);
        return ApiResponse.ok(history.findByFolderIdOrderByCreatedAtDesc(id).stream()
                .map(HistoryResponse::from)
                .toList());
    }

    private RecordFolder findFolder(Long id) {
        return folders.findById(id)
                .filter(RecordFolder::isActive)
                .orElseThrow(() -> ApiException.notFound("Expediente no encontrado."));
    }

    private RecordObservation saveObservation(Long folderId, Long documentId, String content, AuthenticatedUser author) {
        RecordObservation observation = new RecordObservation();
        observation.setGuidId(UUID.randomUUID());
        observation.setFolderId(folderId);
        observation.setDocumentId(documentId);
        observation.setContent(content.trim());
        observation.setAuthorId(author.id());
        observation.setAuthorName(author.username());
        observation.setCreatedAt(Instant.now());
        return observations.save(observation);
    }

    private void record(Long folderId, String action, String detail, AuthenticatedUser user) {
        RecordHistory entry = new RecordHistory();
        entry.setFolderId(folderId);
        entry.setAction(action);
        entry.setDetail(detail);
        entry.setUserId(user.id());
        entry.setUserName(user.username());
        entry.setCreatedAt(Instant.now());
        history.save(entry);
    }

    public record FolderRequest(
            @NotBlank @Size(max = 20) String studentCi,
            @Size(max = 500) String description,
            String folderType,
            @Size(max = 50) String shelf,
            @Size(max = 50) String box,
            @Size(max = 50) String rowNumber) {
    }

    public record FolderUpdateRequest(
            @Size(max = 500) String description,
            @Size(max = 50) String shelf,
            @Size(max = 50) String box,
            @Size(max = 50) String rowNumber) {
    }

    public record VerifyRequest(boolean approved, @Size(max = 1000) String observations) {
    }

    public record ObservationRequest(@Size(max = 1000) @NotBlank String content, Long documentId) {
    }

    public record FolderResponse(
            Long id,
            String guidId,
            String studentCi,
            String studentName,
            String folderType,
            String status,
            String description,
            String shelf,
            String box,
            String rowNumber,
            String createdAt) {

        static FolderResponse from(RecordFolder folder) {
            return new FolderResponse(
                    folder.getId(),
                    folder.getGuidId().toString(),
                    folder.getStudentCi(),
                    folder.getStudentName(),
                    folder.getFolderType(),
                    folder.getStatus(),
                    folder.getDescription(),
                    folder.getShelf(),
                    folder.getBox(),
                    folder.getRowNumber(),
                    folder.getCreatedAt().toString());
        }
    }

    public record DocumentResponse(
            Long id,
            String name,
            String contentType,
            Long size,
            Integer documentTypeId,
            String createdAt) {

        static DocumentResponse from(DocumentEntry document) {
            return new DocumentResponse(
                    document.getId(),
                    document.getName(),
                    document.getContentType(),
                    document.getFileSize(),
                    document.getDocumentTypeId(),
                    document.getCreatedAt().toString());
        }
    }

    public record ObservationResponse(
            Long id, Long documentId, String content, String authorName, String createdAt) {

        static ObservationResponse from(RecordObservation observation) {
            return new ObservationResponse(
                    observation.getId(),
                    observation.getDocumentId(),
                    observation.getContent(),
                    observation.getAuthorName(),
                    observation.getCreatedAt().toString());
        }
    }

    public record HistoryResponse(
            Long id, String action, String detail, String userName, String createdAt) {

        static HistoryResponse from(RecordHistory entry) {
            return new HistoryResponse(
                    entry.getId(),
                    entry.getAction(),
                    entry.getDetail(),
                    entry.getUserName(),
                    entry.getCreatedAt().toString());
        }
    }

    public record StatsResponse(long total, long approved, long pending, long rejected, long documents) {
    }
}
