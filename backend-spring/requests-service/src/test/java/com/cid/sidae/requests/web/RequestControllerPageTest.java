package com.cid.sidae.requests.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.cid.sidae.commons.api.ApiResponse;
import com.cid.sidae.commons.api.PagedResponse;
import com.cid.sidae.requests.domain.RequestItem;
import com.cid.sidae.requests.repo.RequestDocumentRepository;
import com.cid.sidae.requests.repo.RequestItemRepository;
import com.cid.sidae.requests.service.NotificationService;
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
class RequestControllerPageTest {

    @Mock
    private RequestItemRepository requests;
    @Mock
    private RequestDocumentRepository requestDocuments;
    @Mock
    private NotificationService notifications;

    @InjectMocks
    private RequestController controller;

    @Test
    void listWithStatusFiltersServerSide() {
        RequestItem item = item("RECIBIDA");
        when(requests.findByStatusOrderByCreatedAtDesc(eq("RECIBIDA"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(item)));
        when(requestDocuments.findByRequestId(any())).thenReturn(List.of());

        ApiResponse<PagedResponse<RequestController.RequestResponse>> response =
                controller.list("RECIBIDA", 0, 20);

        assertThat(response.data().totalElements()).isEqualTo(1);
        assertThat(response.data().content().get(0).status()).isEqualTo("RECIBIDA");
        verify(requests).findByStatusOrderByCreatedAtDesc(eq("RECIBIDA"), any(Pageable.class));
    }

    private RequestItem item(String status) {
        RequestItem item = new RequestItem();
        item.setGuidId(UUID.randomUUID());
        item.setTrackingCode("CID-1");
        item.setCi("V123");
        item.setFullName("Ana Perez");
        item.setEmail("ana@test.ve");
        item.setStatus(status);
        item.setCreatedAt(Instant.now());
        return item;
    }
}
