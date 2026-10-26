package com.cid.sidae.auth.service;

import com.cid.sidae.auth.domain.PasswordResetToken;
import com.cid.sidae.auth.domain.User;
import com.cid.sidae.auth.repo.PasswordResetTokenRepository;
import com.cid.sidae.auth.repo.UserRepository;
import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.mail.EmailTemplates;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();
    private final String frontUrl;
    private final String from;
    private final boolean mailEnabled;

    public PasswordResetService(
            UserRepository users,
            PasswordResetTokenRepository tokens,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${auth.front-url:http://localhost:8080}") String frontUrl,
            @Value("${notifications.from:no-reply@uru.edu.ve}") String from,
            @Value("${notifications.enabled:true}") boolean mailEnabled) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontUrl = frontUrl;
        this.from = from;
        this.mailEnabled = mailEnabled;
    }

    /** Siempre exitoso para no revelar si el email existe. */
    public void requestReset(String email) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        var user = users.findByEmailIgnoreCase(normalized);
        if (user.isEmpty()) {
            return;
        }
        byte[] raw = new byte[32];
        random.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        PasswordResetToken reset = new PasswordResetToken();
        reset.setUserId(user.get().getId());
        reset.setTokenHash(sha256(token));
        reset.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
        reset.setCreatedAt(Instant.now());
        tokens.save(reset);

        sendResetEmail(user.get().getEmail(), frontUrl + "/restablecer?token=" + token);
    }

    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken reset = tokens.findByTokenHash(sha256(rawToken.trim()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "INVALID_TOKEN",
                        "El enlace es invalido o ya fue utilizado."));
        if (reset.getUsedAt() != null || Instant.now().isAfter(reset.getExpiresAt())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EXPIRED_TOKEN",
                    "El enlace vencio o ya fue utilizado. Solicite uno nuevo.");
        }
        User user = users.findById(reset.getUserId())
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado."));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Instant.now());
        users.save(user);
        reset.setUsedAt(Instant.now());
        tokens.save(reset);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Usuario no autorizado."));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "La contrasena actual es incorrecta.");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Instant.now());
        users.save(user);
    }

    private void sendResetEmail(String to, String resetUrl) {
        if (!mailEnabled) {
            log.info("Notificacion deshabilitada. Reset para {}", to);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(EmailTemplates.passwordResetSubject());
            helper.setText(EmailTemplates.passwordResetBody(resetUrl), true);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("No fue posible enviar el correo de recuperacion a {}", to, ex);
        }
    }

    static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("SHA-256 no disponible.", ex);
        }
    }
}
