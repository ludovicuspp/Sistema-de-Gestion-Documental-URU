CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    guid_id       UUID NOT NULL UNIQUE,
    username      VARCHAR(100) NOT NULL,
    email         VARCHAR(60) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    role_id       INTEGER NOT NULL REFERENCES roles (id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ
);

CREATE INDEX idx_users_role ON users (role_id);

INSERT INTO roles (name, description) VALUES
    ('Administrador', 'Acceso total al sistema'),
    ('Verificador', 'Valida cargas y agrega observaciones'),
    ('Asistente', 'Carga expedientes y documentos'),
    ('Estudiante', 'Solicitante externo'),
    ('Usuario', 'Rol por defecto de auto-registro');
