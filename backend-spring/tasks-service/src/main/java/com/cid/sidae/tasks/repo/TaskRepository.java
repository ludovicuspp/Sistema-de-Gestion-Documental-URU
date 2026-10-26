package com.cid.sidae.tasks.repo;

import com.cid.sidae.tasks.domain.Task;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByCreatedAtDesc();

    Page<Task> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Task> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);

    Page<Task> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId, Pageable pageable);

    List<Task> findByStatusOrderByCreatedAtDesc(String status);

    Page<Task> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<Task> findByStatusInOrderByCreatedAtDesc(List<String> statuses, Pageable pageable);

    long countByStatus(String status);
}
