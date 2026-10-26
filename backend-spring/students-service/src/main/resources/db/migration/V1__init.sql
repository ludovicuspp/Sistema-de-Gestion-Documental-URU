CREATE TABLE students (
    id                 BIGSERIAL PRIMARY KEY,
    guid_id            UUID NOT NULL UNIQUE,
    ci                 VARCHAR(20) NOT NULL UNIQUE,
    first_name         VARCHAR(100) NOT NULL,
    last_name          VARCHAR(100) NOT NULL,
    email              VARCHAR(120),
    phone              VARCHAR(30),
    birthdate          DATE,
    career_id          INTEGER,
    academic_level_id  INTEGER,
    status             VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    type               VARCHAR(20) NOT NULL DEFAULT 'PREGRADO',
    active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ
);

CREATE INDEX idx_students_name ON students (last_name, first_name);
CREATE INDEX idx_students_status ON students (status);
