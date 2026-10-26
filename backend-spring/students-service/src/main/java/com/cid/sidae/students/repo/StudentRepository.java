package com.cid.sidae.students.repo;

import com.cid.sidae.students.domain.Student;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByCi(String ci);

    boolean existsByCi(String ci);

    long countByActiveTrue();

    @Query("""
            SELECT s FROM Student s
            WHERE s.active = true
              AND (:status IS NULL OR s.status = :status)
              AND (:term = '' OR LOWER(s.ci) LIKE LOWER(CONCAT('%', :term, '%'))
                   OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :term, '%'))
                   OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :term, '%')))
            ORDER BY s.lastName, s.firstName
            """)
    java.util.List<Student> search(@Param("term") String term, @Param("status") String status);
}
