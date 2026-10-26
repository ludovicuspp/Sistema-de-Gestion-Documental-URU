package com.cid.sidae.records.repo;

import com.cid.sidae.records.domain.RecordObservation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordObservationRepository extends JpaRepository<RecordObservation, Long> {

    List<RecordObservation> findByFolderIdOrderByCreatedAtDesc(Long folderId);
}
