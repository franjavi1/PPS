from datetime import datetime


from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func

class Persona(db.Model):
    __tablename__="personas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    td_id: Mapped[int] = mapped_column(
        "tdId",
        Integer,
        ForeignKey("tipos_documento.id"),
        nullable=False
    )

    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    apellido: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    numero_doc: Mapped[int] = mapped_column(
        "numeroDoc",
        Integer,
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    tipo_documento = relationship("TipoDocumento")