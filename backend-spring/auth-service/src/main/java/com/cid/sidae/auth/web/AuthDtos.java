package com.cid.sidae.auth.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {
    }

    public record RegisterRequest(
            @NotBlank @Email @Size(max = 60) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @Size(max = 100) String username) {
    }

    public record AuthResponse(String token, String email, String username, String role) {
    }

    public record MeResponse(Long userId, String email, String username, String role, boolean active) {
    }

    public record CreateUserRequest(
            @NotBlank @Email @Size(max = 60) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(max = 100) String username,
            @NotBlank String role) {
    }

    public record ForgotPasswordRequest(@NotBlank @Email String email) {
    }

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8, max = 72) String newPassword) {
    }

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8, max = 72) String newPassword) {
    }

    public record UserResponse(
            Long id, String email, String username, String role, boolean active, String createdAt) {
    }
}
