package com.cid.sidae.catalog.repo;

import com.cid.sidae.catalog.domain.DocumentType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> {

    List<DocumentType> findByActiveTrueOrderByName();

    Page<DocumentType> findByActiveTrueOrderByName(Pageable pageable);

    boolean existsByNameIgnoreCase(String name);
}
