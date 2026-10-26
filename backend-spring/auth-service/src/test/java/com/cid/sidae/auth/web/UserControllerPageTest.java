package com.cid.sidae.auth.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.auth.domain.Role;
import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.RoleRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserControllerPageTest {

    @Mock
    private UserRepository users;
    @Mock
    private RoleRepository roles;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserController controller;

    @Test
    void listWithoutQueryReturnsPagedUsers() {
        User user = user("admin@uru.edu.ve", "admin");
        Pageable pageable = PageRequest.of(0, 20);
        when(users.findAll(pageable)).thenReturn(new PageImpl<>(List.of(user), pageable, 1));

        ApiResponse<PagedResponse<AuthDtos.UserResponse>> response = controller.list(null, 0, 20);

        PagedResponse<AuthDtos.UserResponse> page = response.data();
        assertThat(page.totalElements()).isEqualTo(1);
        assertThat(page.totalPages()).isEqualTo(1);
        assertThat(page.content()).hasSize(1);
        assertThat(page.content().get(0).email()).isEqualTo("admin@uru.edu.ve");
    }

    @Test
    void listWithQueryFiltersByEmailOrUsername() {
        User user = user("verif@uru.edu.ve", "verif");
        when(users.findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCase(
                        eq("verif"), eq("verif"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(user)));

        ApiResponse<PagedResponse<AuthDtos.UserResponse>> response = controller.list("verif", 0, 20);

        assertThat(response.data().totalElements()).isEqualTo(1);
        verify(users).findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCase(
                eq("verif"), eq("verif"), any(Pageable.class));
    }

    private User user(String email, String username) {
        Role role = org.mockito.Mockito.mock(Role.class);
        when(role.getName()).thenReturn("Administrador");
        User user = new User();
        user.setGuidId(java.util.UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash("hash");
        user.setActive(true);
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        return user;
    }
}
