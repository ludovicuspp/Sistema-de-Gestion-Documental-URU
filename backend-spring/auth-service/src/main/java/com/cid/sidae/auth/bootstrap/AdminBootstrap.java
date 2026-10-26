package com.cid.sidae.auth.bootstrap;

import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.RoleRepository;
import com.cid.sidae.auth.repo.UserRepository;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    @Bean
    ApplicationRunner seedAdmin(
            UserRepository users,
            RoleRepository roles,
            PasswordEncoder passwordEncoder,
            @Value("${auth.bootstrap-email:admin@uru.edu.ve}") String email,
            @Value("${auth.bootstrap-password:Admin123!}") String password) {

        return args -> {
            String normalized = email.trim().toLowerCase();
            if (users.existsByEmailIgnoreCase(normalized)) {
                return;
            }
            var adminRole = roles.findByName("Administrador")
                    .orElseThrow(() -> new IllegalStateException("Falta el rol Administrador."));

            User admin = new User();
            admin.setGuidId(UUID.randomUUID());
            admin.setEmail(normalized);
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setActive(true);
            admin.setRole(adminRole);
            admin.setCreatedAt(Instant.now());
            users.save(admin);
            log.info("Usuario administrador inicial creado: {}", normalized);
        };
    }
}
