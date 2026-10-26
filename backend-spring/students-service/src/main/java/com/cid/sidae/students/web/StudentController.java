package com.cid.sidae.students.web;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import com.cid.sidae.students.domain.Student;
import com.cid.sidae.students.repo.StudentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentRepository students;

    public StudentController(StudentRepository students) {
        this.students = students;
    }

    @GetMapping
    public ApiResponse<PagedResponse<StudentResponse>> search(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Page<Student> result = students.search(query.trim(), status, pageable(page, size));
        return ApiResponse.ok(PagedResponse.of(
                result.getContent().stream().map(StudentResponse::from).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements()));
    }

    private static Pageable pageable(Integer page, Integer size) {
        int pageNumber = page == null || page < 0 ? 0 : page;
        int pageSize = size == null || size <= 0 ? 20 : Math.min(size, 100);
        return PageRequest.of(pageNumber, pageSize);
    }

    @GetMapping("/by-ci/{ci}")
    public ApiResponse<StudentResponse> byCi(@PathVariable String ci) {
        return ApiResponse.ok(StudentResponse.from(
                students.findByCi(ci.trim()).orElseThrow(() -> ApiException.notFound("Estudiante no encontrado."))));
    }

    @GetMapping("/{id}")
    public ApiResponse<StudentResponse> byId(@PathVariable Long id) {
        return ApiResponse.ok(StudentResponse.from(
                students.findById(id).orElseThrow(() -> ApiException.notFound("Estudiante no encontrado."))));
    }

    @GetMapping("/count")
    public ApiResponse<Long> count() {
        return ApiResponse.ok(students.countByActiveTrue());
    }

    @PostMapping
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<StudentResponse> create(@Valid @RequestBody StudentRequest request) {
        String ci = request.ci().trim();
        if (students.existsByCi(ci)) {
            throw ApiException.conflict("ALREADY_EXISTS", "Ya existe un estudiante con esa cedula.");
        }
        Student student = new Student();
        student.setGuidId(UUID.randomUUID());
        student.setCi(ci);
        apply(student, request);
        student.setCreatedAt(Instant.now());
        return ApiResponse.ok(StudentResponse.from(students.save(student)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<StudentResponse> update(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        Student student = students.findById(id).orElseThrow(() -> ApiException.notFound("Estudiante no encontrado."));
        if ("EGRESADO".equalsIgnoreCase(student.getStatus())) {
            throw ApiException.forbidden("No se puede modificar un estudiante egresado (RST-05).");
        }
        apply(student, request);
        student.setUpdatedAt(Instant.now());
        return ApiResponse.ok(StudentResponse.from(students.save(student)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        Student student = students.findById(id).orElseThrow(() -> ApiException.notFound("Estudiante no encontrado."));
        if ("EGRESADO".equalsIgnoreCase(student.getStatus())) {
            throw ApiException.forbidden("No se puede eliminar un estudiante egresado (RST-05).");
        }
        student.setActive(false);
        student.setUpdatedAt(Instant.now());
        students.save(student);
        return ApiResponse.ok(null);
    }

    private void apply(Student student, StudentRequest request) {
        student.setFirstName(request.firstName().trim());
        student.setLastName(request.lastName().trim());
        student.setEmail(request.email());
        student.setPhone(request.phone());
        student.setBirthdate(request.birthdate());
        student.setCareerId(request.careerId());
        student.setAcademicLevelId(request.academicLevelId());
        student.setStatus(request.status() == null ? "ACTIVO" : request.status().toUpperCase());
        student.setType(request.type() == null ? "PREGRADO" : request.type().toUpperCase());
    }

    public record StudentRequest(
            @NotBlank @Size(max = 20) String ci,
            @NotBlank @Size(max = 100) String firstName,
            @NotBlank @Size(max = 100) String lastName,
            @Size(max = 120) String email,
            @Size(max = 30) String phone,
            LocalDate birthdate,
            Integer careerId,
            Integer academicLevelId,
            String status,
            String type) {
    }

    public record StudentResponse(
            Long id,
            String ci,
            String firstName,
            String lastName,
            String email,
            String phone,
            LocalDate birthdate,
            Integer careerId,
            Integer academicLevelId,
            String status,
            String type,
            boolean active) {

        static StudentResponse from(Student student) {
            return new StudentResponse(
                    student.getId(),
                    student.getCi(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getEmail(),
                    student.getPhone(),
                    student.getBirthdate(),
                    student.getCareerId(),
                    student.getAcademicLevelId(),
                    student.getStatus(),
                    student.getType(),
                    student.isActive());
        }
    }
}
