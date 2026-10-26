CREATE TABLE tasks (
    id               BIGSERIAL PRIMARY KEY,
    guid_id          UUID NOT NULL UNIQUE,
    title            VARCHAR(150) NOT NULL,
    description      VARCHAR(1000),
    detail           VARCHAR(2000),
    assigned_to_id   BIGINT,
    assigned_to_name VARCHAR(150),
    due_date         DATE,
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    created_by_id    BIGINT,
    created_by_name  VARCHAR(150),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ
);

CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_assigned ON tasks (assigned_to_id);
