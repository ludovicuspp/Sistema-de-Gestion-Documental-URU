package com.cid.sidae.catalog.repo;

import com.cid.sidae.catalog.domain.Career;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRepository extends JpaRepository<Career, Integer> {

    List<Career> findByActiveTrueOrderByName();
}
