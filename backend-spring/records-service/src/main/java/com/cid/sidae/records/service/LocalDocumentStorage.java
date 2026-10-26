package com.cid.sidae.records.service;

import com.cid.sidae.commons.api.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Almacenamiento local en volumen. Activo por defecto ({@code storage.backend=local}). */
@Service
@ConditionalOnProperty(name = "storage.backend", havingValue = "local", matchIfMissing = true)
public class LocalDocumentStorage implements DocumentStorage {

    private final Path basePath;

    public LocalDocumentStorage(@Value("${storage.base-path:/data/documents}") String basePath) {
        this.basePath = Path.of(basePath).toAbsolutePath().normalize();
    }

    @Override
    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("EMPTY_FILE", "Debe adjuntar un archivo.");
        }
        try {
            byte[] bytes = file.getBytes();
            String kind = DocumentStorage.detectKind(bytes);
            if (kind == null) {
                throw ApiException.badRequest("INVALID_FORMAT",
                        "Solo se permiten PDF o imagenes (contenido no reconocido).");
            }
            String fileName = DocumentStorage.newFileName(kind);
            Files.createDirectories(basePath);
            Path target = basePath.resolve(fileName).normalize();
            if (!target.startsWith(basePath)) {
                throw ApiException.badRequest("INVALID_FILE", "Nombre de archivo invalido.");
            }
            Files.write(target, bytes);
            return new StoredFile(fileName, DocumentStorage.contentTypeOf(fileName));
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "STORAGE_ERROR", "No fue posible almacenar el documento.");
        }
    }

    @Override
    public Resource load(String storedPath) {
        try {
            Path file = basePath.resolve(storedPath).normalize();
            if (!file.startsWith(basePath)) {
                throw ApiException.notFound("Documento no encontrado en almacenamiento.");
            }
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
}
