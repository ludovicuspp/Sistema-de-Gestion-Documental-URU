package com.cid.sidae.records.service;

import com.cid.sidae.commons.api.ApiException;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/** Almacenamiento S3 (MinIO en dev, S3 real en prod). Activo con {@code storage.backend=s3}. */
@Service
@ConditionalOnProperty(name = "storage.backend", havingValue = "s3")
public class S3DocumentStorage implements DocumentStorage {

    private final S3Client s3;
    private final String bucket;

    public S3DocumentStorage(S3Client s3, @Value("${storage.s3.bucket}") String bucket) {
        this.s3 = s3;
        this.bucket = bucket;
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
            String key = DocumentStorage.newFileName(kind);
            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(DocumentStorage.contentTypeOf(key))
                            .contentLength((long) bytes.length)
                            .build(),
                    RequestBody.fromBytes(bytes));
            return new StoredFile(key, DocumentStorage.contentTypeOf(key));
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "STORAGE_ERROR", "No fue posible almacenar el documento.");
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "STORAGE_ERROR", "No fue posible almacenar el documento.");
        }
    }

    @Override
    public Resource load(String storedPath) {
        if (storedPath == null || storedPath.isBlank() || storedPath.contains("..")) {
            throw ApiException.notFound("Documento no encontrado en almacenamiento.");
        }
        try {
            byte[] bytes = s3.getObjectAsBytes(GetObjectRequest.builder()
                            .bucket(bucket)
                            .key(storedPath)
                            .build())
                    .asByteArray();
            return new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return storedPath;
                }
            };
        } catch (NoSuchKeyException ex) {
            throw ApiException.notFound("Documento no encontrado en almacenamiento.");
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw ApiException.notFound("Documento no encontrado en almacenamiento.");
        }
    }
}
