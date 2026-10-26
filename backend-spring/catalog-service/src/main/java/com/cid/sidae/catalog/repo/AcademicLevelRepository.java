package com.cid.sidae.catalog.repo;

import com.cid.sidae.catalog.domain.AcademicLevel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicLevelRepository extends JpaRepository<AcademicLevel, Integer> {

    List<AcademicLevel> findByActiveTrueOrderByName();
}
