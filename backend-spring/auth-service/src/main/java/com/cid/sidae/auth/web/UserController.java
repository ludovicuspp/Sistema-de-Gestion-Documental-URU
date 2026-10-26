package com.cid.sidae.auth.web;

import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.RoleRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.auth.web.AuthDtos.CreateUserRequest;
import com.cid.sidae.auth.web.AuthDtos.UserResponse;
import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.Locale;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('Administrador')")
public class UserController {

    private static final List<String> CREATABLE_ROLES = List.of("Verificador", "Asistente");

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository users, RoleRepository roles, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ApiResponse<PagedResponse<UserResponse>> list(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Pageable pageable = pageable(page, size);
        String term = query == null ? "" : query.trim();
        Page<User> result = term.isEmpty()
                ? users.findAll(pageable)
                : users.findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCase(term, term, pageable);
        return ApiResponse.ok(PagedResponse.of(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements()));
    }

    private static Pageable pageable(Integer page, Integer size) {
        int pageNumber = page == null || page < 0 ? 0 : page;
        int pageSize = size == null || size <= 0 ? 20 : Math.min(size, 100);
        return PageRequest.of(pageNumber, pageSize);
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        if (!CREATABLE_ROLES.contains(request.role())) {
            throw ApiException.badRequest("ROLE_NOT_ALLOWED", "Solo se pueden crear usuarios Verificador o Asistente.");
        }
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("ALREADY_EXISTS", "El email ya se encuentra registrado.");
        }

        var role = roles.findByName(request.role())
                .orElseThrow(() -> ApiException.badRequest("ROLE_NOT_FOUND", "Rol inexistente."));

        User user = new User();
        user.setGuidId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(request.username().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setActive(true);
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        users.save(user);
        return ApiResponse.ok(toResponse(user));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        User user = users.findById(id).orElseThrow(() -> ApiException.notFound("Usuario no encontrado."));
        if ("Administrador".equalsIgnoreCase(user.getRole().getName())) {
            throw ApiException.forbidden("No se puede desactivar a un Administrador.");
        }
        user.setActive(false);
        user.setUpdatedAt(Instant.now());
        users.save(user);
        return ApiResponse.ok(null);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().getName(),
                user.isActive(),
                user.getCreatedAt() == null ? null : user.getCreatedAt().toString());
    }
}
