package com.cid.sidae.auth.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.auth.domain.Role;
import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.RoleRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.auth.service.PasswordResetService;
import com.cid.sidae.auth.web.AuthDtos.AuthResponse;
import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.security.JwtService;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository users;
    @Mock
    private RoleRepository roles;
    @Mock
    private PasswordResetService passwordResetService;

    private AuthController controller;

    @BeforeEach
    void setUp() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        JwtService jwtService = new JwtService("test-secret-que-supera-los-32-bytes-minimo-xyz", 3600000, "test");
        controller = new AuthController(users, roles, encoder, jwtService, passwordResetService, "Usuario");
    }

    @Test
    void loginSucceedsWithValidCredentials() {
        User user = user("admin@uru.edu.ve", "admin", true, "Administrador",
                new BCryptPasswordEncoder().encode("Secret123!"));
        when(users.findByEmailIgnoreCase("admin@uru.edu.ve")).thenReturn(Optional.of(user));

        ApiResponse<AuthResponse> response = controller.login(
                new AuthDtos.LoginRequest("admin@uru.edu.ve", "Secret123!"));

        assertThat(response.success()).isTrue();
        assertThat(response.data().token()).isNotBlank();
        assertThat(response.data().role()).isEqualTo("Administrador");
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = user("admin@uru.edu.ve", "admin", true,
                new BCryptPasswordEncoder().encode("Secret123!"));
        when(users.findByEmailIgnoreCase("admin@uru.edu.ve")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> controller.login(
                        new AuthDtos.LoginRequest("admin@uru.edu.ve", "OtraClave!")))
                .isInstanceOf(ApiException.class);
    }

    @Test
    void registerCreatesUserWithDefaultRole() {
        Role role = mock(Role.class);
        when(role.getName()).thenReturn("Usuario");
        when(users.existsByEmailIgnoreCase("nuevo@uru.edu.ve")).thenReturn(false);
        when(roles.findByName("Usuario")).thenReturn(Optional.of(role));

        ApiResponse<AuthResponse> response = controller.register(
                new AuthDtos.RegisterRequest("nuevo@uru.edu.ve", "Temporal123*", "nuevo"));

        assertThat(response.success()).isTrue();
        assertThat(response.data().role()).isEqualTo("Usuario");
        verify(users).save(any(User.class));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(users.existsByEmailIgnoreCase("nuevo@uru.edu.ve")).thenReturn(true);

        assertThatThrownBy(() -> controller.register(
                        new AuthDtos.RegisterRequest("nuevo@uru.edu.ve", "Temporal123*", "nuevo")))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("ALREADY_EXISTS"));
    }

    @Test
    void forgotPasswordDelegatesAndReturnsOk() {
        ApiResponse<Void> response = controller.forgotPassword(
                new AuthDtos.ForgotPasswordRequest("alguien@uru.edu.ve"));

        assertThat(response.success()).isTrue();
        verify(passwordResetService).requestReset("alguien@uru.edu.ve");
    }

    private User user(String email, String username, boolean active, String roleName, String hash) {
        Role role = mock(Role.class);
        when(role.getName()).thenReturn(roleName);
        return user(email, username, active, hash, role);
    }

    private User user(String email, String username, boolean active, String hash) {
        return user(email, username, active, hash, mock(Role.class));
    }

    private User user(String email, String username, boolean active, String hash, Role role) {
        User user = new User();
        user.setGuidId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(hash);
        user.setActive(active);
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        return user;
    }
}
