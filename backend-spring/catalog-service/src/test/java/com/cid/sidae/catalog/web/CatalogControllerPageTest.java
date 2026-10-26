package com.cid.sidae.catalog.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.cid.sidae.catalog.domain.DocumentType;
import com.cid.sidae.catalog.repo.AcademicLevelRepository;
import com.cid.sidae.catalog.repo.CareerRepository;
import com.cid.sidae.catalog.repo.DocumentTypeRepository;
import com.cid.sidae.catalog.repo.MimeTypeRepository;
import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class CatalogControllerPageTest {

    @Mock
    private CareerRepository careers;
    @Mock
    private AcademicLevelRepository academicLevels;
    @Mock
    private DocumentTypeRepository documentTypes;
    @Mock
    private MimeTypeRepository mimeTypes;

    @InjectMocks
    private CatalogController controller;

    @Test
    void listDocumentTypesReturnsPagedResponse() {
        DocumentType type = new DocumentType();
        type.setName("Cedula");
        type.setRequired(true);
        when(documentTypes.findByActiveTrueOrderByName(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(type)));

        ApiResponse<PagedResponse<CatalogController.DocumentTypeResponse>> response =
                controller.listDocumentTypes(0, 20);

        PagedResponse<CatalogController.DocumentTypeResponse> page = response.data();
        assertThat(page.totalElements()).isEqualTo(1);
        assertThat(page.content().get(0).name()).isEqualTo("Cedula");
        assertThat(page.content().get(0).required()).isTrue();
    }
}
