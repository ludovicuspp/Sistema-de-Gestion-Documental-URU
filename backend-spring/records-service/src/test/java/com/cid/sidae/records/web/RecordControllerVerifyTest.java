package com.cid.sidae.records.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiException;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.security.AuthenticatedUser;
import com.cid.sidae.records.client.CatalogClient;
import com.cid.sidae.records.client.StudentClient;
import com.cid.sidae.records.domain.DocumentEntry;
import com.cid.sidae.records.domain.RecordFolder;
import com.cid.sidae.records.repo.DocumentEntryRepository;
import com.cid.sidae.records.repo.RecordFolderRepository;
import com.cid.sidae.records.repo.RecordHistoryRepository;
import com.cid.sidae.records.repo.RecordObservationRepository;
import com.cid.sidae.records.service.DocumentStorage;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class RecordControllerVerifyTest {

    @Mock
    private RecordFolderRepository folders;
    @Mock
    private DocumentEntryRepository documents;
    @Mock
    private RecordObservationRepository observations;
    @Mock
    private RecordHistoryRepository history;
    @Mock
    private StudentClient students;
    @Mock
    private CatalogClient catalog;
    @Mock
    private DocumentStorage storage;

    private RecordController controller;

    @BeforeEach
    void setUp() {
        controller = new RecordController(folders, documents, observations, history, students, catalog, storage);
        var principal = new AuthenticatedUser(1L, "admin@uru.edu.ve", "admin", "Administrador");
        var authentication = new UsernamePasswordAuthenticationToken(
                principal, null, List.of(new SimpleGrantedAuthority("ROLE_Administrador")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void approveSucceedsWhenRequiredDocumentsPresent() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(students.findByCi("V123", "Bearer x")).thenReturn(pregradoStudent("ACTIVO"));
        when(catalog.documentTypes("Bearer x")).thenReturn(List.of(
                new CatalogClient.DocumentTypeDto(5, "Cedula de identidad", true, 1),
                new CatalogClient.DocumentTypeDto(9, "Foto", false, 1)));
        when(documents.findByFolderIdAndActiveTrueOrderByCreatedAt(1L))
                .thenReturn(List.of(documentWithType(5)));

        ApiResponse<RecordController.FolderResponse> response =
                controller.verify(1L, new RecordController.VerifyRequest(true, "Todo en orden"), "Bearer x");

        assertThat(response.data().status()).isEqualTo("APROBADO");
    }

    @Test
    void approveFailsListingMissingRequiredDocuments() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(students.findByCi("V123", "Bearer x")).thenReturn(pregradoStudent("ACTIVO"));
        when(catalog.documentTypes("Bearer x")).thenReturn(List.of(
                new CatalogClient.DocumentTypeDto(5, "Cedula de identidad", true, 1),
                new CatalogClient.DocumentTypeDto(6, "Partida de nacimiento", true, 1)));
        when(documents.findByFolderIdAndActiveTrueOrderByCreatedAt(1L))
                .thenReturn(List.of(documentWithType(5)));

        assertThatThrownBy(() -> controller.verify(1L,
                        new RecordController.VerifyRequest(true, "ok"), "Bearer x"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException api = (ApiException) ex;
                    assertThat(api.getCode()).isEqualTo("MISSING_REQUIRED_DOCS");
                    assertThat(api.getMessage()).contains("Partida de nacimiento");
                });
    }

    @Test
    void approveFailsOnEmptyFolder() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(documents.findByFolderIdAndActiveTrueOrderByCreatedAt(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> controller.verify(1L,
                        new RecordController.VerifyRequest(true, "ok"), "Bearer x"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo("EMPTY_FOLDER"));
    }

    @Test
    void approveResolvesLevelByTypeWhenStudentHasNoLevelId() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(students.findByCi("V123", "Bearer x"))
                .thenReturn(new StudentClient.StudentDto(7L, "V123", "Ana", "Perez",
                        "ACTIVO", "POSTGRADO", null, true));
        when(catalog.academicLevels("Bearer x")).thenReturn(List.of(
                new CatalogClient.LevelDto(1, "Pregrado"),
                new CatalogClient.LevelDto(2, "Postgrado")));
        when(catalog.documentTypes("Bearer x")).thenReturn(List.of(
                new CatalogClient.DocumentTypeDto(8, "Veredicto", true, 2)));
        when(documents.findByFolderIdAndActiveTrueOrderByCreatedAt(1L))
                .thenReturn(List.of(documentWithType(8)));

        ApiResponse<RecordController.FolderResponse> response =
                controller.verify(1L, new RecordController.VerifyRequest(true, "ok"), "Bearer x");

        assertThat(response.data().status()).isEqualTo("APROBADO");
    }

    @Test
    void updateBlockedForGraduatedStudent() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(students.findByCi("V123", "Bearer x")).thenReturn(pregradoStudent("EGRESADO"));

        assertThatThrownBy(() -> controller.update(1L,
                        new RecordController.FolderUpdateRequest(null, "E1", "C2", "F3"), "Bearer x"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getStatus()).isEqualTo(HttpStatus.FORBIDDEN));
    }

    @Test
    void deleteBlockedForGraduatedStudent() {
        when(folders.findById(1L)).thenReturn(Optional.of(pendingFolder()));
        when(students.findByCi("V123", "Bearer x")).thenReturn(pregradoStudent("EGRESADO"));

        assertThatThrownBy(() -> controller.delete(1L, "Bearer x"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> assertThat(((ApiException) ex).getStatus()).isEqualTo(HttpStatus.FORBIDDEN));
    }

    @Test
    void deleteAllowedForActiveStudent() {
        RecordFolder folder = pendingFolder();
        when(folders.findById(1L)).thenReturn(Optional.of(folder));
        when(students.findByCi("V123", "Bearer x")).thenReturn(pregradoStudent("ACTIVO"));
        when(folders.save(any(RecordFolder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        controller.delete(1L, "Bearer x");

        assertThat(folder.isActive()).isFalse();
    }

    private RecordFolder pendingFolder() {
        RecordFolder folder = new RecordFolder();
        folder.setGuidId(java.util.UUID.randomUUID());
        folder.setStudentId(7L);
        folder.setStudentCi("V123");
        folder.setStudentName("Ana Perez");
        folder.setFolderType("PREGRADO");
        folder.setStatus("PENDIENTE");
        folder.setActive(true);
        folder.setCreatedAt(java.time.Instant.now());
        return folder;
    }

    private StudentClient.StudentDto pregradoStudent(String status) {
        return new StudentClient.StudentDto(7L, "V123", "Ana", "Perez", status, "PREGRADO", 1, true);
    }

    private DocumentEntry documentWithType(int documentTypeId) {
        DocumentEntry document = new DocumentEntry();
        document.setFolderId(1L);
        document.setName("documento.pdf");
        document.setStoredPath("abc.pdf");
        document.setDocumentTypeId(documentTypeId);
        return document;
    }
}
