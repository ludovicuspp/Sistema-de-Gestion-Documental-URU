package com.cid.sidae.students.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import com.cid.sidae.students.domain.Student;
import com.cid.sidae.students.repo.StudentRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class StudentControllerPageTest {

    @Mock
    private StudentRepository students;

    @InjectMocks
    private StudentController controller;

    @Test
    void searchReturnsPagedResponse() {
        Student student = student("V123", "Ana", "Perez");
        when(students.search(eq("ana"), eq(null), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(student)));

        ApiResponse<PagedResponse<StudentController.StudentResponse>> response =
                controller.search("ana", null, 0, 20);

        PagedResponse<StudentController.StudentResponse> page = response.data();
        assertThat(page.totalElements()).isEqualTo(1);
        assertThat(page.content().get(0).ci()).isEqualTo("V123");
        verify(students).search(eq("ana"), eq(null), any(Pageable.class));
    }

    private Student student(String ci, String firstName, String lastName) {
        Student student = new Student();
        student.setGuidId(UUID.randomUUID());
        student.setCi(ci);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setStatus("ACTIVO");
        student.setType("PREGRADO");
        student.setActive(true);
        student.setCreatedAt(Instant.now());
        return student;
    }
}
