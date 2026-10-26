package com.cid.sidae.students.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.students.domain.Student;
import com.cid.sidae.students.repo.StudentRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class StudentImportServiceTest {

    @Mock
    private StudentRepository students;

    @InjectMocks
    private StudentImportService importService;

    @Test
    void importCsvCreatesUpdatesAndReportsErrors() {
        String csv = """
                ci,firstName,lastName,email,phone,birthdate,careerId,academicLevelId,status,type
                V100,Nuevo,Estudiante,nuevo@test.ve,,2000-01-15,,,,,
                V200,Ana,Perez Actualizado,,,,,,,
                V300,Graduado,Intento,,,,,,,
                V400,,SinNombre,,,,,,,
                V500,Fecha,Mala,,,1999-99-99,,,,
                """;
        when(students.findByCi("V100")).thenReturn(Optional.empty());
        when(students.findByCi("V200")).thenReturn(Optional.of(active("V200")));
        when(students.findByCi("V300")).thenReturn(Optional.of(graduated("V300")));
        when(students.save(any(Student.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        StudentImportService.ImportResult result = importService.importCsv(csvFile(csv));

        assertThat(result.created()).isEqualTo(1);
        assertThat(result.updated()).isEqualTo(1);
        assertThat(result.errors()).hasSize(3);
        assertThat(result.errors().stream().map(StudentImportService.RowError::ci))
                .containsExactlyInAnyOrder("V300", "V400", "V500");
    }

    @Test
    void importCsvRejectsMissingHeaders() {
        String csv = "cedula,nombre\nV1,Ana\n";

        assertThatThrownBy(() -> importService.importCsv(csvFile(csv)))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("INVALID_HEADER"));
    }

    @Test
    void importCsvRejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "vacio.csv", "text/csv", new byte[0]);

        assertThatThrownBy(() -> importService.importCsv(file))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("EMPTY_FILE"));
    }

    private MockMultipartFile csvFile(String content) {
        return new MockMultipartFile("file", "estudiantes.csv", "text/csv",
                content.getBytes(StandardCharsets.UTF_8));
    }

    private Student active(String ci) {
        Student student = new Student();
        student.setGuidId(UUID.randomUUID());
        student.setCi(ci);
        student.setFirstName("Ana");
        student.setLastName("Perez");
        student.setStatus("ACTIVO");
        student.setType("PREGRADO");
        student.setActive(true);
        student.setCreatedAt(Instant.now());
        return student;
    }

    private Student graduated(String ci) {
        Student student = active(ci);
        student.setStatus("EGRESADO");
        return student;
    }
}
