CREATE TABLE record_folders (
    id              BIGSERIAL PRIMARY KEY,
    guid_id         UUID NOT NULL UNIQUE,
    description     VARCHAR(500),
    student_id      BIGINT NOT NULL,
    student_ci      VARCHAR(20) NOT NULL,
    student_name    VARCHAR(200) NOT NULL,
    folder_type     VARCHAR(20) NOT NULL DEFAULT 'PREGRADO',
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    shelf           VARCHAR(50),
    box             VARCHAR(50),
    row_number      VARCHAR(50),
    created_by_id   BIGINT,
    created_by_name VARCHAR(150),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ,
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_folders_student ON record_folders (student_id);
CREATE INDEX idx_folders_ci ON record_folders (student_ci);
CREATE INDEX idx_folders_status ON record_folders (status);

CREATE TABLE document_entries (
    id               BIGSERIAL PRIMARY KEY,
    guid_id          UUID NOT NULL UNIQUE,
    folder_id        BIGINT NOT NULL REFERENCES record_folders (id),
    name             VARCHAR(255) NOT NULL,
    stored_path      VARCHAR(500) NOT NULL,
    content_type     VARCHAR(100),
    file_size        BIGINT,
    document_type_id INTEGER,
    created_by_id    BIGINT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    active           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_documents_folder ON document_entries (folder_id);

CREATE TABLE record_observations (
    id          BIGSERIAL PRIMARY KEY,
    guid_id     UUID NOT NULL UNIQUE,
    folder_id   BIGINT NOT NULL REFERENCES record_folders (id),
    document_id BIGINT REFERENCES document_entries (id),
    content     VARCHAR(1000) NOT NULL,
    author_id   BIGINT,
    author_name VARCHAR(150),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE record_history (
    id          BIGSERIAL PRIMARY KEY,
    folder_id   BIGINT NOT NULL REFERENCES record_folders (id),
    action      VARCHAR(50) NOT NULL,
    detail      VARCHAR(1000),
    user_id     BIGINT,
    user_name   VARCHAR(150),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_history_folder ON record_history (folder_id, created_at);
