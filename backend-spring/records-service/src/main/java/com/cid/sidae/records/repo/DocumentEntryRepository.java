package com.cid.sidae.records.repo;

import com.cid.sidae.records.domain.DocumentEntry;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentEntryRepository extends JpaRepository<DocumentEntry, Long> {

    List<DocumentEntry> findByFolderIdAndActiveTrueOrderByCreatedAt(Long folderId);

    Optional<DocumentEntry> findByIdAndActiveTrue(Long id);

    long countByActiveTrue();
}
