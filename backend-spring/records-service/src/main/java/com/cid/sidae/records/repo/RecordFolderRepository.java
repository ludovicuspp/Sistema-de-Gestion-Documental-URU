package com.cid.sidae.records.repo;

import com.cid.sidae.records.domain.RecordFolder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordFolderRepository extends JpaRepository<RecordFolder, Long> {

    List<RecordFolder> findByActiveTrueOrderByCreatedAtDesc();

    List<RecordFolder> findByActiveTrueAndStudentCiContainingIgnoreCase(String ci);

    List<RecordFolder> findByActiveTrueAndStatus(String status);

    boolean existsByStudentIdAndFolderTypeAndActiveTrue(Long studentId, String folderType);

    long countByActiveTrue();

    long countByActiveTrueAndStatus(String status);
}
