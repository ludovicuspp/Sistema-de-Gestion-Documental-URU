package com.cid.sidae.students.service;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.students.domain.Student;
import com.cid.sidae.students.repo.StudentRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Importacion masiva de estudiantes desde CSV.
 * Semantica upsert por CI: filas con CI existente actualizan (solo campos no
 * vacios), filas nuevas crean con defaults ACTIVO/PREGRADO. Los egresados no
 * se tocan (RST-05) y van al reporte de errores.
 */
@Service
public class StudentImportService {

    private static final int MAX_ROWS = 5000;

    private final StudentRepository students;

    public StudentImportService(StudentRepository students) {
        this.students = students;
    }

    public record RowError(int row, String ci, String message) {
    }

    public record ImportResult(int created, int updated, List<RowError> errors) {
    }

    public ImportResult importCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("EMPTY_FILE", "Debe adjuntar un archivo CSV.");
        }
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setTrim(true)
                .setIgnoreHeaderCase(true)
                .setAllowMissingColumnNames(true)
                .build();
        try (Reader reader = withoutBom(file);
                CSVParser parser = format.parse(reader)) {
            Set<String> headers = parser.getHeaderMap().keySet().stream()
                    .map(name -> name.toLowerCase(Locale.ROOT))
                    .collect(Collectors.toSet());
            for (String required : List.of("ci", "firstname", "lastname")) {
                if (!headers.contains(required)) {
                    throw ApiException.badRequest("INVALID_HEADER",
                            "El CSV debe incluir las columnas: ci, firstName, lastName.");
                }
            }
            int created = 0;
            int updated = 0;
            List<RowError> errors = new ArrayList<>();
            int rowNumber = 1;
            for (CSVRecord record : parser) {
                rowNumber++;
                if (rowNumber > MAX_ROWS + 1) {
                    throw ApiException.badRequest("FILE_TOO_LARGE",
                            "El archivo supera el maximo de " + MAX_ROWS + " filas.");
                }
                try {
                    if (processRow(record)) {
                        created++;
                    } else {
                        updated++;
                    }
                } catch (ApiException ex) {
                    errors.add(new RowError(rowNumber, safeGet(record, "ci"), ex.getMessage()));
                }
            }
            return new ImportResult(created, updated, errors);
        } catch (IOException ex) {
            throw ApiException.badRequest("INVALID_FILE", "No fue posible leer el archivo CSV.");
        }
    }

    /**
     * @return true si creo, false si actualizo.
     */
    private boolean processRow(CSVRecord record) {
        String ci = safeGet(record, "ci");
        if (ci.isBlank()) {
            throw ApiException.badRequest("ROW_VALIDATION", "La cedula es obligatoria.");
        }
        if (ci.length() > 20) {
            throw ApiException.badRequest("ROW_VALIDATION", "La cedula supera 20 caracteres.");
        }
        String firstName = safeGet(record, "firstname");
        String lastName = safeGet(record, "lastname");
        if (firstName.isBlank() || lastName.isBlank()) {
            throw ApiException.badRequest("ROW_VALIDATION", "Nombre y apellido son obligatorios.");
        }
        if (firstName.length() > 100 || lastName.length() > 100) {
            throw ApiException.badRequest("ROW_VALIDATION", "Nombre o apellido superan 100 caracteres.");
        }
        String email = emptyToNull(safeGet(record, "email"));
        if (email != null && (email.length() > 120 || !email.contains("@"))) {
            throw ApiException.badRequest("ROW_VALIDATION", "Email invalido.");
        }
        String phone = emptyToNull(safeGet(record, "phone"));
        if (phone != null && phone.length() > 30) {
            throw ApiException.badRequest("ROW_VALIDATION", "El telefono supera 30 caracteres.");
        }
        LocalDate birthdate = parseDate(safeGet(record, "birthdate"));
        Integer careerId = parseInteger(safeGet(record, "careerid"), "careerId");
        Integer academicLevelId = parseInteger(safeGet(record, "academiclevelid"), "academicLevelId");
        String status = emptyToNull(safeGet(record, "status"));
        String type = emptyToNull(safeGet(record, "type"));

        var existing = students.findByCi(ci);
        if (existing.isPresent()) {
            Student student = existing.get();
            if ("EGRESADO".equalsIgnoreCase(student.getStatus())) {
                throw ApiException.badRequest("ROW_VALIDATION", "Estudiante egresado, no modificable (RST-05).");
            }
            student.setFirstName(firstName);
            student.setLastName(lastName);
            if (email != null) {
                student.setEmail(email);
            }
            if (phone != null) {
                student.setPhone(phone);
            }
            if (birthdate != null) {
                student.setBirthdate(birthdate);
            }
            if (careerId != null) {
                student.setCareerId(careerId);
            }
            if (academicLevelId != null) {
                student.setAcademicLevelId(academicLevelId);
            }
            if (status != null) {
                student.setStatus(status.toUpperCase(Locale.ROOT));
            }
            if (type != null) {
                student.setType(type.toUpperCase(Locale.ROOT));
            }
            student.setUpdatedAt(Instant.now());
            students.save(student);
            return false;
        }

        Student student = new Student();
        student.setGuidId(UUID.randomUUID());
        student.setCi(ci);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEmail(email);
        student.setPhone(phone);
        student.setBirthdate(birthdate);
        student.setCareerId(careerId);
        student.setAcademicLevelId(academicLevelId);
        student.setStatus(status == null ? "ACTIVO" : status.toUpperCase(Locale.ROOT));
        student.setType(type == null ? "PREGRADO" : type.toUpperCase(Locale.ROOT));
        student.setActive(true);
        student.setCreatedAt(Instant.now());
        students.save(student);
        return true;
    }

    private String safeGet(CSVRecord record, String column) {
        try {
            String value = record.get(column);
            return value == null ? "" : value.trim();
        } catch (IllegalArgumentException ex) {
            return "";
        }
    }

    private String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private LocalDate parseDate(String value) {
        if (value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            throw ApiException.badRequest("ROW_VALIDATION", "Fecha invalida, use YYYY-MM-DD.");
        }
    }

    private Integer parseInteger(String value, String column) {
        if (value.isBlank()) {
            return null;
        }
        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException ex) {
            throw ApiException.badRequest("ROW_VALIDATION", "Columna " + column + " debe ser numerica.");
        }
    }

    private Reader withoutBom(MultipartFile file) throws IOException {
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
        reader.mark(1);
        if (reader.read() != 0xFEFF) {
            reader.reset();
        }
        return reader;
    }
}
