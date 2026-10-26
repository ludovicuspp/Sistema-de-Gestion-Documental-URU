package com.cid.sidae.records.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.cid.sidae.commons.api.ApiException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

class DocumentStorageTest {

    @TempDir
    private Path tempDir;

    private DocumentStorage storage;

    @BeforeEach
    void setUp() {
        storage = new DocumentStorage(tempDir.toString());
    }

    @Test
    void storesPdfDetectedByMagicBytes() throws Exception {
        var file = new MockMultipartFile("file", "documento.bin", "application/octet-stream",
                "%PDF-1.4 contenido falso".getBytes(StandardCharsets.US_ASCII));

        DocumentStorage.StoredFile stored = storage.store(file);

        assertThat(stored.contentType()).isEqualTo("application/pdf");
        assertThat(stored.path()).endsWith(".pdf");
        assertThat(Files.exists(tempDir.resolve(stored.path()))).isTrue();
    }

    @Test
    void storesPngDetectedByMagicBytes() {
        byte[] png = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00};
        var file = new MockMultipartFile("file", "imagen.txt", "text/plain", png);

        DocumentStorage.StoredFile stored = storage.store(file);

        assertThat(stored.contentType()).isEqualTo("image/png");
        assertThat(stored.path()).endsWith(".png");
    }

    @Test
    void storesJpegDetectedByMagicBytes() {
        byte[] jpeg = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00, 0x10};
        var file = new MockMultipartFile("file", "foto", "application/octet-stream", jpeg);

        DocumentStorage.StoredFile stored = storage.store(file);

        assertThat(stored.contentType()).isEqualTo("image/jpeg");
        assertThat(stored.path()).endsWith(".jpg");
    }

    @Test
    void rejectsExecutableRenamedAsPdf() {
        byte[] exe = "MZ contenido ejecutable falso".getBytes(StandardCharsets.US_ASCII);
        var file = new MockMultipartFile("file", "documento.pdf", "application/pdf", exe);

        assertThatThrownBy(() -> storage.store(file))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("INVALID_FORMAT"));
    }

    @Test
    void rejectsEmptyFile() {
        var file = new MockMultipartFile("file", "vacio.pdf", "application/pdf", new byte[0]);

        assertThatThrownBy(() -> storage.store(file))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("EMPTY_FILE"));
    }
}
