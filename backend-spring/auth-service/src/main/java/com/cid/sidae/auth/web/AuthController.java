package com.cid.sidae.auth.web;

import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.RoleRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.auth.web.AuthDtos.AuthResponse;
import com.cid.sidae.auth.web.AuthDtos.LoginRequest;
import com.cid.sidae.auth.web.AuthDtos.MeResponse;
import com.cid.sidae.auth.web.AuthDtos.RegisterRequest;
import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.security.AuthenticatedUser;
import com.cid.sidae.commons.security.JwtService;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String defaultRegisterRole;

    public AuthController(
            UserRepository users,
            RoleRepository roles,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${auth.default-register-role:Usuario}") String defaultRegisterRole) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.defaultRegisterRole = defaultRegisterRole;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Credenciales invalidas."));

        if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Credenciales invalidas.");
        }

        String token = jwtService.generate(user.getId(), user.getEmail(), user.getUsername(), user.getRole().getName());
        return ApiResponse.ok(new AuthResponse(token, user.getEmail(), user.getUsername(), user.getRole().getName()));
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("ALREADY_EXISTS", "El email ya se encuentra registrado.");
        }

        var role = roles.findByName(defaultRegisterRole)
                .orElseThrow(() -> ApiException.badRequest("CONFIGURATION", "Rol por defecto no configurado."));

        User user = new User();
        user.setGuidId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(request.username() == null || request.username().isBlank() ? email : request.username().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setActive(true);
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        users.save(user);

        String token = jwtService.generate(user.getId(), user.getEmail(), user.getUsername(), role.getName());
        return ApiResponse.ok(new AuthResponse(token, user.getEmail(), user.getUsername(), role.getName()));
    }

    @GetMapping("/me")
    public ApiResponse<MeResponse> me() {
        AuthenticatedUser current = AuthenticatedUser.current();
        User user = users.findById(current.id())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Usuario no autorizado."));
        return ApiResponse.ok(new MeResponse(
                user.getId(), user.getEmail(), user.getUsername(), user.getRole().getName(), user.isActive()));
    }
}
