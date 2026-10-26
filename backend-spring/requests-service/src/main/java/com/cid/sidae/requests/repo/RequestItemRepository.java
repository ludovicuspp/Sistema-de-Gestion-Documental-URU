package com.cid.sidae.requests.repo;

import com.cid.sidae.requests.domain.RequestItem;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {

    Optional<RequestItem> findByTrackingCode(String trackingCode);

    boolean existsByCiAndCreatedAtAfter(String ci, Instant since);

    List<RequestItem> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);
}
