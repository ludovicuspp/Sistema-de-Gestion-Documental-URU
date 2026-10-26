package com.cid.sidae.catalog.repo;

import com.cid.sidae.catalog.domain.DocumentType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> {

    List<DocumentType> findByActiveTrueOrderByName();

    boolean existsByNameIgnoreCase(String name);
}
