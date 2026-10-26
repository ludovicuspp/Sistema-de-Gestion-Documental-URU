CREATE TABLE academic_levels (
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE careers (
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(150) NOT NULL UNIQUE,
    code   VARCHAR(30),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE document_types (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL UNIQUE,
    is_required       BOOLEAN NOT NULL DEFAULT FALSE,
    academic_level_id INTEGER REFERENCES academic_levels (id),
    active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mime_types (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    extension VARCHAR(20) NOT NULL,
    active    BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO academic_levels (name) VALUES ('Pregrado'), ('Postgrado');

INSERT INTO document_types (name, is_required, academic_level_id) VALUES
    ('Partida de nacimiento', TRUE, 1),
    ('Cedula de identidad', TRUE, 1),
    ('Fondo negro del titulo', TRUE, 1),
    ('Fondo negro de notas certificadas', TRUE, 1),
    ('OPSU', TRUE, 1),
    ('Veredicto', TRUE, 2),
    ('Servicio comunitario', TRUE, 1),
    ('Pasantias', FALSE, 1),
    ('Reconocimientos', FALSE, 1);

INSERT INTO mime_types (name, extension) VALUES
    ('PDF', 'pdf'),
    ('JPEG', 'jpg'),
    ('PNG', 'png');
