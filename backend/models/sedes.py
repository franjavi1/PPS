from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func


class Sedes(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "sedes"

    # Identificador principal de la sede.
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Tipo de sede asociado.
    tipo_sede_id: Mapped[int] = mapped_column(
        "tipoSedeId",
        Integer,
        ForeignKey("tipos_sedes.id"),
        nullable=False
    )

    # Nombre de la sede.
    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # Direccion de la sede.
    direccion: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    # Estado del registro dentro del sistema.
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    # Usuario que realizo la ultima accion sobre el registro.
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creacion del registro.
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion del registro.
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relacion con el modelo de tipo de sede.
    tipo_sede = relationship("TipoSede")
