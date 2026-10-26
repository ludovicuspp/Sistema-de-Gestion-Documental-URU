package com.cid.sidae.catalog.repo;

import com.cid.sidae.catalog.domain.MimeType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MimeTypeRepository extends JpaRepository<MimeType, Integer> {

    List<MimeType> findByActiveTrue();
}
