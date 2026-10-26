package com.cid.sidae.records.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import com.cid.sidae.records.client.CatalogClient;
import com.cid.sidae.records.client.StudentClient;
import com.cid.sidae.records.domain.RecordFolder;
import com.cid.sidae.records.repo.DocumentEntryRepository;
import com.cid.sidae.records.repo.RecordFolderRepository;
import com.cid.sidae.records.repo.RecordHistoryRepository;
import com.cid.sidae.records.repo.RecordObservationRepository;
import com.cid.sidae.records.service.DocumentStorage;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class RecordControllerPageTest {

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

    @InjectMocks
    private RecordController controller;

    @Test
    void listWithoutFiltersReturnsPagedFolders() {
        RecordFolder folder = folder();
        when(folders.findByActiveTrueOrderByCreatedAtDesc(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(folder)));

        ApiResponse<PagedResponse<RecordController.FolderResponse>> response =
                controller.list(null, null, 0, 20);

        PagedResponse<RecordController.FolderResponse> page = response.data();
        assertThat(page.totalElements()).isEqualTo(1);
        assertThat(page.content().get(0).studentCi()).isEqualTo("V123");
        verify(folders).findByActiveTrueOrderByCreatedAtDesc(any(Pageable.class));
    }

    private RecordFolder folder() {
        RecordFolder folder = new RecordFolder();
        folder.setGuidId(UUID.randomUUID());
        folder.setStudentId(7L);
        folder.setStudentCi("V123");
        folder.setStudentName("Ana Perez");
        folder.setFolderType("PREGRADO");
        folder.setStatus("PENDIENTE");
        folder.setActive(true);
        folder.setCreatedAt(Instant.now());
        return folder;
    }
}
