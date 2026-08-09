from db import db


class LogAuditoria(db.Model):

    __tablename__ = "logs_auditoria"

    id_log = db.Column(
        db.BigInteger,
        primary_key=True
    )

    request_id = db.Column(
        db.String(36),
        nullable=False,
        index=True
    )

    timestamp = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
        index=True
    )

    metodo_http = db.Column(
        db.String(10),
        nullable=False,
        index=True
    )

    endpoint = db.Column(
        db.String(255),
        nullable=True,
        index=True
    )

    path = db.Column(
        db.String(500),
        nullable=False
    )

    query_params = db.Column(
        db.JSON,
        nullable=True
    )

    request_body = db.Column(
        db.JSON,
        nullable=True
    )

    response_body = db.Column(
        db.JSON,
        nullable=True
    )

    status_code = db.Column(
        db.SmallInteger,
        nullable=False,
        index=True
    )

    duracion_ms = db.Column(
        db.Integer,
        nullable=False
    )

    ip_origen = db.Column(
        db.String(45),
        nullable=False,
        index=True
    )

    user_agent = db.Column(
        db.String(500),
        nullable=True
    )

    id_usuario = db.Column(
        db.Integer,
        nullable=True,
        index=True
    )

    roles = db.Column(
        db.JSON,
        nullable=True
    )

    error_type = db.Column(
        db.String(100),
        nullable=True
    )

    error_message = db.Column(
        db.String(500),
        nullable=True
    )

    def __repr__(self):
        return f"<LogAuditoria {self.metodo_http} {self.path} {self.status_code}>"