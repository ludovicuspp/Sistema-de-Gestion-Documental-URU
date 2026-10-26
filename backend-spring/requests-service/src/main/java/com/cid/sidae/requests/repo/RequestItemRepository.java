package com.cid.sidae.requests.repo;

import com.cid.sidae.requests.domain.RequestItem;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {

    Optional<RequestItem> findByTrackingCode(String trackingCode);

    boolean existsByCiAndCreatedAtAfter(String ci, Instant since);

    Page<RequestItem> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<RequestItem> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(String status);
}
