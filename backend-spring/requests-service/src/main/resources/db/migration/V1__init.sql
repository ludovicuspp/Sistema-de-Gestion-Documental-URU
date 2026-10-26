CREATE TABLE requests (
    id            BIGSERIAL PRIMARY KEY,
    guid_id       UUID NOT NULL UNIQUE,
    tracking_code VARCHAR(20) NOT NULL UNIQUE,
    ci            VARCHAR(20) NOT NULL,
    full_name     VARCHAR(200) NOT NULL,
    email         VARCHAR(120) NOT NULL,
    phone         VARCHAR(30),
    comment       VARCHAR(1000),
    status        VARCHAR(20) NOT NULL DEFAULT 'RECIBIDA',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ
);

CREATE INDEX idx_requests_ci ON requests (ci);
CREATE INDEX idx_requests_status ON requests (status);
CREATE INDEX idx_requests_created ON requests (created_at);

CREATE TABLE request_documents (
    id               BIGSERIAL PRIMARY KEY,
    request_id       BIGINT NOT NULL REFERENCES requests (id),
    document_type_id INTEGER,
    document_name    VARCHAR(150) NOT NULL
);

CREATE INDEX idx_request_documents_request ON request_documents (request_id);
