package com.cid.sidae.auth.repo;

import com.cid.sidae.auth.domain.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(String name);
}
