package com.cid.sidae.tasks.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import com.cid.sidae.tasks.domain.Task;
import com.cid.sidae.tasks.repo.TaskRepository;
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
class TaskControllerPageTest {

    @Mock
    private TaskRepository tasks;

    @InjectMocks
    private TaskController controller;

    @Test
    void listWithSingleStatusReturnsPagedResponse() {
        Task task = task("Revisar expediente", "PENDIENTE");
        when(tasks.findByStatusOrderByCreatedAtDesc(eq("PENDIENTE"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(task)));

        ApiResponse<PagedResponse<TaskController.TaskResponse>> response =
                controller.list(null, "PENDIENTE", 0, 20);

        assertThat(response.data().totalElements()).isEqualTo(1);
        assertThat(response.data().content().get(0).title()).isEqualTo("Revisar expediente");
        verify(tasks).findByStatusOrderByCreatedAtDesc(eq("PENDIENTE"), any(Pageable.class));
    }

    @Test
    void listWithCommaSeparatedStatusesQueriesUnion() {
        Task task = task("Cargar documentos", "EN_PROCESO");
        when(tasks.findByStatusInOrderByCreatedAtDesc(eq(List.of("PENDIENTE", "EN_PROCESO")), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(task)));

        ApiResponse<PagedResponse<TaskController.TaskResponse>> response =
                controller.list(null, "PENDIENTE,EN_PROCESO", 0, 20);

        assertThat(response.data().totalElements()).isEqualTo(1);
        assertThat(response.data().content().get(0).status()).isEqualTo("EN_PROCESO");
        verify(tasks).findByStatusInOrderByCreatedAtDesc(eq(List.of("PENDIENTE", "EN_PROCESO")), any(Pageable.class));
    }

    private Task task(String title, String status) {
        Task task = new Task();
        task.setGuidId(UUID.randomUUID());
        task.setTitle(title);
        task.setStatus(status);
        task.setCreatedAt(Instant.now());
        return task;
    }
}
