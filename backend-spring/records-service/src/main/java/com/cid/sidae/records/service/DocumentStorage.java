package com.cid.sidae.records.service;

import com.cid.sidae.commons.api.ApiException;
import java.io.IOException;
import java.io.PushbackInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentStorage {

    private final Path basePath;

    public DocumentStorage(@Value("${storage.base-path:/data/documents}") String basePath) {
        this.basePath = Path.of(basePath).toAbsolutePath().normalize();
    }

    /** Archivo validado por contenido. La extension y el content-type se derivan de los magic bytes. */
    public record StoredFile(String path, String contentType) {
    }

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("EMPTY_FILE", "Debe adjuntar un archivo.");
        }
        String kind;
        try (var raw = file.getInputStream(); var input = new PushbackInputStream(raw, 8)) {
            byte[] header = input.readNBytes(8);
            kind = detectKind(header);
            if (kind == null) {
                throw ApiException.badRequest("INVALID_FORMAT",
                        "Solo se permiten PDF o imagenes (contenido no reconocido).");
            }
            input.unread(header);
            String fileName = UUID.randomUUID() + extensionFor(kind);
            try {
                Files.createDirectories(basePath);
                Path target = basePath.resolve(fileName).normalize();
                if (!target.startsWith(basePath)) {
                    throw ApiException.badRequest("INVALID_FILE", "Nombre de archivo invalido.");
                }
                Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "STORAGE_ERROR", "No fue posible almacenar el documento.");
            }
            return new StoredFile(fileName, contentTypeFor(kind));
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "STORAGE_ERROR", "No fue posible leer el documento.");
        }
    }

    public Resource load(String storedPath) {
        try {
            Path file = basePath.resolve(storedPath).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw ApiException.notFound("Documento no encontrado en almacenamiento.");
            }
            return resource;
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw ApiException.notFound("Documento no encontrado en almacenamiento.");
        }
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

    private String extensionFor(String kind) {
        return switch (kind) {
            case "PDF" -> ".pdf";
            case "PNG" -> ".png";
            case "JPEG" -> ".jpg";
            default -> "";
        };
    }

    private String contentTypeFor(String kind) {
        return switch (kind) {
            case "PDF" -> "application/pdf";
            case "PNG" -> "image/png";
            case "JPEG" -> "image/jpeg";
            default -> "application/octet-stream";
        };
    }
}
