package com.cid.sidae.catalog.web;

import com.cid.sidae.catalog.domain.AcademicLevel;
import com.cid.sidae.catalog.domain.Career;
import com.cid.sidae.catalog.domain.DocumentType;
import com.cid.sidae.catalog.domain.MimeType;
import com.cid.sidae.catalog.repo.AcademicLevelRepository;
import com.cid.sidae.catalog.repo.CareerRepository;
import com.cid.sidae.catalog.repo.DocumentTypeRepository;
import com.cid.sidae.catalog.repo.MimeTypeRepository;
import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    private final CareerRepository careers;
    private final AcademicLevelRepository academicLevels;
    private final DocumentTypeRepository documentTypes;
    private final MimeTypeRepository mimeTypes;

    public CatalogController(
            CareerRepository careers,
            AcademicLevelRepository academicLevels,
            DocumentTypeRepository documentTypes,
            MimeTypeRepository mimeTypes) {
        this.careers = careers;
        this.academicLevels = academicLevels;
        this.documentTypes = documentTypes;
        this.mimeTypes = mimeTypes;
    }

    @GetMapping("/careers")
    public ApiResponse<List<CareerResponse>> listCareers() {
        return ApiResponse.ok(careers.findByActiveTrueOrderByName().stream().map(CareerResponse::from).toList());
    }

    @PostMapping("/careers")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<CareerResponse> createCareer(@Valid @RequestBody CareerRequest request) {
        Career career = new Career();
        career.setName(request.name().trim());
        career.setCode(request.code());
        return ApiResponse.ok(CareerResponse.from(careers.save(career)));
    }

    @PutMapping("/careers/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<CareerResponse> updateCareer(@PathVariable Integer id, @Valid @RequestBody CareerRequest request) {
        Career career = careers.findById(id).orElseThrow(() -> ApiException.notFound("Carrera no encontrada."));
        career.setName(request.name().trim());
        career.setCode(request.code());
        return ApiResponse.ok(CareerResponse.from(careers.save(career)));
    }

    @DeleteMapping("/careers/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<Void> deleteCareer(@PathVariable Integer id) {
        Career career = careers.findById(id).orElseThrow(() -> ApiException.notFound("Carrera no encontrada."));
        career.setActive(false);
        careers.save(career);
        return ApiResponse.ok(null);
    }

    @GetMapping("/academic-levels")
    public ApiResponse<List<OptionResponse>> listAcademicLevels() {
        return ApiResponse.ok(academicLevels.findByActiveTrueOrderByName().stream()
                .map(level -> new OptionResponse(level.getId(), level.getName()))
                .toList());
    }

    @GetMapping("/document-types")
    public ApiResponse<List<DocumentTypeResponse>> listDocumentTypes() {
        return ApiResponse.ok(documentTypes.findByActiveTrueOrderByName().stream()
                .map(DocumentTypeResponse::from)
                .toList());
    }

    @PostMapping("/document-types")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<DocumentTypeResponse> createDocumentType(@Valid @RequestBody DocumentTypeRequest request) {
        if (documentTypes.existsByNameIgnoreCase(request.name().trim())) {
            throw ApiException.conflict("ALREADY_EXISTS", "Ya existe un tipo de documento con ese nombre.");
        }
        DocumentType type = new DocumentType();
        type.setName(request.name().trim());
        type.setRequired(request.required());
        type.setAcademicLevelId(request.academicLevelId());
        type.setCreatedAt(Instant.now());
        return ApiResponse.ok(DocumentTypeResponse.from(documentTypes.save(type)));
    }

    @PutMapping("/document-types/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<DocumentTypeResponse> updateDocumentType(
            @PathVariable Integer id, @Valid @RequestBody DocumentTypeRequest request) {
        DocumentType type = documentTypes.findById(id)
                .orElseThrow(() -> ApiException.notFound("Tipo de documento no encontrado."));
        type.setName(request.name().trim());
        type.setRequired(request.required());
        type.setAcademicLevelId(request.academicLevelId());
        return ApiResponse.ok(DocumentTypeResponse.from(documentTypes.save(type)));
    }

    @DeleteMapping("/document-types/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<Void> deleteDocumentType(@PathVariable Integer id) {
        DocumentType type = documentTypes.findById(id)
                .orElseThrow(() -> ApiException.notFound("Tipo de documento no encontrado."));
        type.setActive(false);
        documentTypes.save(type);
        return ApiResponse.ok(null);
    }

    @GetMapping("/mime-types")
    public ApiResponse<List<OptionResponse>> listMimeTypes() {
        return ApiResponse.ok(mimeTypes.findByActiveTrue().stream()
                .map(mime -> new OptionResponse(mime.getId(), mime.getName() + " (." + mime.getExtension() + ")"))
                .toList());
    }

    public record CareerRequest(@NotBlank @Size(max = 150) String name, @Size(max = 30) String code) {
    }

    public record CareerResponse(Integer id, String name, String code) {
        static CareerResponse from(Career career) {
            return new CareerResponse(career.getId(), career.getName(), career.getCode());
        }
    }

    public record DocumentTypeRequest(
            @NotBlank @Size(max = 150) String name,
            boolean required,
            Integer academicLevelId) {
    }

    public record DocumentTypeResponse(
            Integer id, String name, boolean required, Integer academicLevelId) {
        static DocumentTypeResponse from(DocumentType type) {
            return new DocumentTypeResponse(type.getId(), type.getName(), type.isRequired(), type.getAcademicLevelId());
        }
    }

    public record OptionResponse(Integer id, String name) {
    }
}
