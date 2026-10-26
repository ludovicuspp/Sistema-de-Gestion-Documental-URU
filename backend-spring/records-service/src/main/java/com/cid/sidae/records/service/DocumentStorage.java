package com.cid.sidae.records.service;

import com.cid.sidae.commons.api.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentStorage {

    private final Path basePath;

    public DocumentStorage(@Value("${storage.base-path:/data/documents}") String basePath) {
        this.basePath = Path.of(basePath).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        String extension = extensionOf(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + extension;
        try {
            Files.createDirectories(basePath);
            Path target = basePath.resolve(fileName).normalize();
            if (!target.startsWith(basePath)) {
                throw ApiException.badRequest("INVALID_FILE", "Nombre de archivo invalido.");
            }
            try (var input = file.getInputStream()) {
                Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
            }
            return fileName;
        } catch (IOException ex) {
            throw new ApiException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR,
                    "STORAGE_ERROR", "No fue posible almacenar el documento.");
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

    private String extensionOf(String name) {
        if (name == null || !name.contains(".")) {
            return "";
        }
        String extension = name.substring(name.lastIndexOf('.')).toLowerCase();
        return extension.matches("\\.[a-z0-9]{1,10}") ? extension : "";
    }
}
