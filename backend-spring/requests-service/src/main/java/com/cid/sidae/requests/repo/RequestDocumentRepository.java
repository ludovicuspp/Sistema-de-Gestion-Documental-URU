package com.cid.sidae.requests.repo;

import com.cid.sidae.requests.domain.RequestDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestDocumentRepository extends JpaRepository<RequestDocument, Long> {

    List<RequestDocument> findByRequestId(Long requestId);
}
