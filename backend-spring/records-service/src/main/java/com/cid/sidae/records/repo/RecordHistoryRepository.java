package com.cid.sidae.records.repo;

import com.cid.sidae.records.domain.RecordHistory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordHistoryRepository extends JpaRepository<RecordHistory, Long> {

    List<RecordHistory> findByFolderIdOrderByCreatedAtDesc(Long folderId);

    List<RecordHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
