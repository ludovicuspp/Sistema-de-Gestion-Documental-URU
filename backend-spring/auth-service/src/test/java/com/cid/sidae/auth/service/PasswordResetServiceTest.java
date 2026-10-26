package com.cid.sidae.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.auth.domain.PasswordResetToken;
import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.PasswordResetTokenRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.commons.api.ApiException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository users;
    @Mock
    private PasswordResetTokenRepository tokens;
    @Mock
    private JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private PasswordResetService service() {
        return new PasswordResetService(users, tokens, passwordEncoder, mailSender,
                "http://localhost:8080", "no-reply@uru.edu.ve", true);
    }

    @Test
    void requestResetIgnoresUnknownEmail() {
        when(users.findByEmailIgnoreCase("nadie@uru.edu.ve")).thenReturn(Optional.empty());

        service().requestReset("nadie@uru.edu.ve");

        verify(tokens, never()).save(any(PasswordResetToken.class));
    }

    @Test
    void requestResetStoresHashedToken() {
        User user = user(7L, "ana@uru.edu.ve");
        when(users.findByEmailIgnoreCase("ana@uru.edu.ve")).thenReturn(Optional.of(user));
        when(tokens.save(any(PasswordResetToken.class))).thenAnswer(i -> i.getArgument(0));

        service().requestReset("ana@uru.edu.ve");

        ArgumentCaptor<PasswordResetToken> captor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokens).save(captor.capture());
        PasswordResetToken saved = captor.getValue();
        assertThat(saved.getUserId()).isEqualTo(7L);
        assertThat(saved.getTokenHash()).hasSize(64);
        assertThat(saved.getExpiresAt()).isAfter(Instant.now());
    }

    @Test
    void resetPasswordSucceedsWithValidToken() {
        User user = user(7L, "ana@uru.edu.ve");
        user.setPasswordHash(passwordEncoder.encode("Vieja123!"));
        PasswordResetToken reset = token(10L, 7L, Instant.now().plus(1, ChronoUnit.HOURS), null);
        when(tokens.findByTokenHash(anyString()))
                .thenReturn(Optional.of(reset));
        when(users.findById(7L)).thenReturn(Optional.of(user));

        service().resetPassword("token-crudo", "Nueva123!");

        assertThat(passwordEncoder.matches("Nueva123!", user.getPasswordHash())).isTrue();
        assertThat(reset.getUsedAt()).isNotNull();
    }

    @Test
    void resetPasswordRejectsExpiredToken() {
        PasswordResetToken reset = token(11L, 7L, Instant.now().minus(1, ChronoUnit.HOURS), null);
        when(tokens.findByTokenHash(anyString()))
                .thenReturn(Optional.of(reset));

        assertThatThrownBy(() -> service().resetPassword("token-crudo", "Nueva123!"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("EXPIRED_TOKEN"));
    }

    @Test
    void resetPasswordRejectsUsedToken() {
        PasswordResetToken reset = token(12L, 7L, Instant.now().plus(1, ChronoUnit.HOURS), Instant.now());
        when(tokens.findByTokenHash(anyString()))
                .thenReturn(Optional.of(reset));

        assertThatThrownBy(() -> service().resetPassword("token-crudo", "Nueva123!"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("EXPIRED_TOKEN"));
    }

    @Test
    void changePasswordSucceedsWithCurrentPassword() {
        User user = user(7L, "ana@uru.edu.ve");
        user.setPasswordHash(passwordEncoder.encode("Vieja123!"));
        when(users.findById(7L)).thenReturn(Optional.of(user));

        service().changePassword(7L, "Vieja123!", "Nueva123!");

        assertThat(passwordEncoder.matches("Nueva123!", user.getPasswordHash())).isTrue();
    }

    @Test
    void changePasswordRejectsWrongCurrentPassword() {
        User user = user(7L, "ana@uru.edu.ve");
        user.setPasswordHash(passwordEncoder.encode("Vieja123!"));
        when(users.findById(7L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> service().changePassword(7L, "Otra123!", "Nueva123!"))
                .isInstanceOf(ApiException.class);
    }

    private User user(Long id, String email) {
        User user = new User();
        org.springframework.test.util.ReflectionTestUtils.setField(user, "id", id);
        user.setGuidId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername("ana");
        user.setPasswordHash("hash");
        user.setActive(true);
        user.setCreatedAt(Instant.now());
        return user;
    }

    private PasswordResetToken token(Long id, Long userId, Instant expiresAt, Instant usedAt) {
        PasswordResetToken token = new PasswordResetToken();
        token.setUserId(userId);
        token.setTokenHash("abc123hash");
        token.setExpiresAt(expiresAt);
        token.setUsedAt(usedAt);
        token.setCreatedAt(Instant.now());
        return token;
    }
}
