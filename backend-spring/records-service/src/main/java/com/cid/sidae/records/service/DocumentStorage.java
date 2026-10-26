package com.cid.sidae.records.service;

import com.cid.sidae.commons.api.ApiException;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

/**
 * Almacenamiento de documentos. Implementaciones: local (volumen) y S3
 * (MinIO en dev, S3 real en prod). Se elige con {@code storage.backend}.
 */
public interface DocumentStorage {

    StoredFile store(MultipartFile file);

    Resource load(String storedPath);

    /** Archivo validado por contenido. La extension y el content-type se derivan de los magic bytes. */
    record StoredFile(String path, String contentType) {
    }

    static String newFileName(String kind) {
        return UUID.randomUUID() + switch (kind) {
            case "PDF" -> ".pdf";
            case "PNG" -> ".png";
            case "JPEG" -> ".jpg";
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_FORMAT",
                    "Solo se permiten PDF o imagenes (contenido no reconocido).");
        };
    }

    static String contentTypeOf(String fileName) {
        String extension = extensionOf(fileName);
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            default -> "application/octet-stream";
        };
    }

    static String extensionOf(String fileName) {
        if (fileName == null) {
            return "";
        }
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        String extension = fileName.substring(dot + 1).toLowerCase();
        return extension.matches("[a-z0-9]{1,10}") ? extension : "";
    }

    /** PDF (%PDF-), PNG (89 50 4E 47 0D 0A 1A 0A) o JPEG (FF D8 FF). Null si no se reconoce. */
    static String detectKind(byte[] header) {
        if (header == null) {
            return null;
        }
        if (header.length >= 5
                && header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44
                && header[3] == 0x46 && header[4] == 0x2D) {
            return "PDF";
        }
        if (header.length >= 8
                && header[0] == (byte) 0x89 && header[1] == 0x50 && header[2] == 0x4E
                && header[3] == 0x47 && header[4] == 0x0D && header[5] == 0x0A
                && header[6] == 0x1A && header[7] == 0x0A) {
            return "PNG";
        }
        if (header.length >= 3
                && header[0] == (byte) 0xFF && header[1] == (byte) 0xD8 && header[2] == (byte) 0xFF) {
            return "JPEG";
        }
        return null;
    }
}
