package com.cid.sidae.records.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiException;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@ExtendWith(MockitoExtension.class)
class S3DocumentStorageTest {

    @Mock
    private S3Client s3;

    private S3DocumentStorage storage;

    @BeforeEach
    void setUp() {
        storage = new S3DocumentStorage(s3, "sidae-test");
    }

    @Test
    void storesPdfWithDetectedContentType() {
        var file = new MockMultipartFile("file", "documento.bin", "application/octet-stream",
                "%PDF-1.4 contenido falso".getBytes(StandardCharsets.US_ASCII));
        when(s3.putObject(any(PutObjectRequest.class), any(software.amazon.awssdk.core.sync.RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        DocumentStorage.StoredFile stored = storage.store(file);

        assertThat(stored.contentType()).isEqualTo("application/pdf");
        assertThat(stored.path()).endsWith(".pdf");
        ArgumentCaptor<PutObjectRequest> request = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3).putObject(request.capture(), any(software.amazon.awssdk.core.sync.RequestBody.class));
        assertThat(request.getValue().bucket()).isEqualTo("sidae-test");
        assertThat(request.getValue().key()).isEqualTo(stored.path());
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
    @SuppressWarnings("unchecked")
    void loadReturnsBytes() {
        byte[] pdf = "%PDF-1.4".getBytes(StandardCharsets.US_ASCII);
        ResponseBytes<GetObjectResponse> responseBytes = mock(ResponseBytes.class);
        when(responseBytes.asByteArray()).thenReturn(pdf);
        when(s3.getObjectAsBytes(any(GetObjectRequest.class))).thenReturn(responseBytes);

        org.springframework.core.io.Resource resource = storage.load("abc.pdf");

        assertThat(resource.exists()).isTrue();
    }

    @Test
    void loadMissingKeyThrowsNotFound() {
        when(s3.getObjectAsBytes(any(GetObjectRequest.class)))
                .thenThrow(NoSuchKeyException.builder().message("Not found").build());

        assertThatThrownBy(() -> storage.load("missing.pdf"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("NOT_FOUND"));
    }

    @Test
    void loadRejectsPathTraversal() {
        assertThatThrownBy(() -> storage.load("../secreto.pdf"))
                .isInstanceOf(ApiException.class);
    }
}
