package com.cid.sidae.tasks.repo;

import com.cid.sidae.tasks.domain.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByCreatedAtDesc();

    List<Task> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);

    List<Task> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
}
