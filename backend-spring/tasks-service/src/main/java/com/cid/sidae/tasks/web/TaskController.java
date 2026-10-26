package com.cid.sidae.tasks.web;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.security.AuthenticatedUser;
import com.cid.sidae.tasks.domain.Task;
import com.cid.sidae.tasks.repo.TaskRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskRepository tasks;

    public TaskController(TaskRepository tasks) {
        this.tasks = tasks;
    }

    @GetMapping
    public ApiResponse<List<TaskResponse>> list(
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) String status) {

        List<Task> result;
        if (assignedTo != null) {
            result = tasks.findByAssignedToIdOrderByCreatedAtDesc(assignedTo);
        } else if (status != null && !status.isBlank()) {
            result = tasks.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else {
            result = tasks.findAllByOrderByCreatedAtDesc();
        }
        return ApiResponse.ok(result.stream().map(TaskResponse::from).toList());
    }

    @GetMapping("/stats")
    public ApiResponse<StatsResponse> stats() {
        return ApiResponse.ok(new StatsResponse(
                tasks.count(),
                tasks.countByStatus("PENDIENTE"),
                tasks.countByStatus("EN_PROCESO"),
                tasks.countByStatus("COMPLETADA")));
    }

    @PostMapping
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
        AuthenticatedUser current = AuthenticatedUser.current();
        Task task = new Task();
        task.setGuidId(UUID.randomUUID());
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setDetail(request.detail());
        task.setAssignedToId(request.assignedToId());
        task.setAssignedToName(request.assignedToName());
        task.setDueDate(request.dueDate());
        task.setStatus("PENDIENTE");
        task.setCreatedById(current.id());
        task.setCreatedByName(current.username());
        task.setCreatedAt(Instant.now());
        return ApiResponse.ok(TaskResponse.from(tasks.save(task)));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<TaskResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        Task task = find(id);
        String status = request.status().toUpperCase();
        if (!List.of("PENDIENTE", "EN_PROCESO", "COMPLETADA").contains(status)) {
            throw ApiException.badRequest("INVALID_STATUS", "Estado de tarea invalido.");
        }
        task.setStatus(status);
        task.setUpdatedAt(Instant.now());
        return ApiResponse.ok(TaskResponse.from(tasks.save(task)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Administrador')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        Task task = find(id);
        tasks.delete(task);
        return ApiResponse.ok(null);
    }

    private Task find(Long id) {
        return tasks.findById(id).orElseThrow(() -> ApiException.notFound("Tarea no encontrada."));
    }

    public record CreateTaskRequest(
            @NotBlank @Size(max = 150) String title,
            @Size(max = 1000) String description,
            @Size(max = 2000) String detail,
            Long assignedToId,
            @Size(max = 150) String assignedToName,
            LocalDate dueDate) {
    }

    public record StatusRequest(@NotBlank String status) {
    }

    public record TaskResponse(
            Long id,
            String title,
            String description,
            String detail,
            Long assignedToId,
            String assignedToName,
            LocalDate dueDate,
            String status,
            String createdByName,
            String createdAt) {

        static TaskResponse from(Task task) {
            return new TaskResponse(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getDetail(),
                    task.getAssignedToId(),
                    task.getAssignedToName(),
                    task.getDueDate(),
                    task.getStatus(),
                    task.getCreatedByName(),
                    task.getCreatedAt().toString());
        }
    }

    public record StatsResponse(long total, long pending, long inProgress, long completed) {
    }
}
