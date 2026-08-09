BEGIN;

CREATE TABLE IF NOT EXISTS logs_auditoria (
    id_log BIGSERIAL PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_http VARCHAR(10) NOT NULL,
    endpoint VARCHAR(255),
    path VARCHAR(500) NOT NULL,
    query_params JSON,
    request_body JSON,
    response_body JSON,
    status_code SMALLINT NOT NULL,
    duracion_ms INTEGER NOT NULL,
    ip_origen VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500),
    id_usuario INTEGER,
    roles JSON,
    error_type VARCHAR(100),
    error_message VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_request_id
    ON logs_auditoria (request_id);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_timestamp
    ON logs_auditoria ("timestamp");

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_metodo_http
    ON logs_auditoria (metodo_http);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_endpoint
    ON logs_auditoria (endpoint);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_status_code
    ON logs_auditoria (status_code);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_ip_origen
    ON logs_auditoria (ip_origen);

CREATE INDEX IF NOT EXISTS ix_logs_auditoria_id_usuario
    ON logs_auditoria (id_usuario);

COMMIT;