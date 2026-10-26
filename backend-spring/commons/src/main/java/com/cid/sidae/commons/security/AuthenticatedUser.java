package com.cid.sidae.commons.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Datos del usuario autenticado extraidos del JWT. */
public record AuthenticatedUser(Long id, String email, String username, String role) {

    public static AuthenticatedUser current() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("No hay usuario autenticado en el contexto.");
        }
        return user;
    }

    public boolean isAdmin() {
        return "Administrador".equalsIgnoreCase(role);
    }
}
