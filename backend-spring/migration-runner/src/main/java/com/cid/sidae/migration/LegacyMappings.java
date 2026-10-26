package com.cid.sidae.migration;

import java.text.Normalizer;
import java.util.Locale;

/** Mapeos puros legado -> nuevo esquema (testeables sin BD). */
public final class LegacyMappings {

    private LegacyMappings() {
    }

    public static String upper(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }

    /** Normaliza para comparar nombres (minusculas, sin tildes, espacios colapsados). */
    public static String normalized(String value) {
        if (value == null) {
            return "";
        }
        String lower = value.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
        return Normalizer.normalize(lower, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }

    public static String taskStatus(String legacy) {
        if (legacy == null) {
            return "PENDIENTE";
        }
        return switch (normalized(legacy)) {
            case "pendiente" -> "PENDIENTE";
            case "en progreso" -> "EN_PROCESO";
            case "finalizada" -> "COMPLETADA";
            default -> "PENDIENTE";
        };
    }

    public static String folderStatus(String legacy) {
        if (legacy == null) {
            return "PENDIENTE";
        }
        return switch (normalized(legacy)) {
            case "pendiente", "sin documentos" -> "PENDIENTE";
            case "aprobado" -> "APROBADO";
            case "rechazado" -> "RECHAZADO";
            default -> "PENDIENTE";
        };
    }

    public static String requestStatus(String legacy) {
        if (legacy == null) {
            return "RECIBIDA";
        }
        return switch (normalized(legacy)) {
            case "pendiente" -> "RECIBIDA";
            case "validado" -> "COMPLETADA";
            case "rechazado" -> "RECHAZADA";
            default -> "RECIBIDA";
        };
    }

    /** Tipo de carpeta nuevo a partir del nivel academico legado. */
    public static String folderTypeFromLevel(String levelName) {
        if (levelName != null && normalized(levelName).equals("postgrado")) {
            return "POSTGRADO";
        }
        return "PREGRADO";
    }

    public static String fileNameOf(String url) {
        if (url == null || url.isBlank()) {
            return "documento";
        }
        String clean = url.split("[?#]", 2)[0];
        int slash = Math.max(clean.lastIndexOf('/'), clean.lastIndexOf('\\'));
        String name = slash >= 0 ? clean.substring(slash + 1) : clean;
        return name.isBlank() ? "documento" : name;
    }

    public static String extensionOf(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        String extension = fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
        return extension.matches("[a-z0-9]{1,10}") ? extension : "";
    }

    public static String contentTypeOf(String fileName) {
        return switch (extensionOf(fileName)) {
            case "pdf" -> "application/pdf";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            default -> "application/octet-stream";
        };
    }
}
