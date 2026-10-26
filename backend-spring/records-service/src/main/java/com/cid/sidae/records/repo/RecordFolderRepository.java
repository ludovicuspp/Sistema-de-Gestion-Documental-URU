package com.cid.sidae.records.repo;

import com.cid.sidae.records.domain.RecordFolder;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordFolderRepository extends JpaRepository<RecordFolder, Long> {

    List<RecordFolder> findByActiveTrueOrderByCreatedAtDesc();

    Page<RecordFolder> findByActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    List<RecordFolder> findByActiveTrueAndStudentCiContainingIgnoreCase(String ci);

    Page<RecordFolder> findByActiveTrueAndStudentCiContainingIgnoreCase(String ci, Pageable pageable);

    List<RecordFolder> findByActiveTrueAndStatus(String status);

    Page<RecordFolder> findByActiveTrueAndStatus(String status, Pageable pageable);

    boolean existsByStudentIdAndFolderTypeAndActiveTrue(Long studentId, String folderType);

    long countByActiveTrue();

    long countByActiveTrueAndStatus(String status);
}
