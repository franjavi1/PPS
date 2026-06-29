from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class TipoPlanes(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "tipos_planes"

    # Identificador principal del tipo de plan.
    id_tipo_planes: Mapped[int] = mapped_column(
        "idTipoPlanes",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Nombre descriptivo del plan.
    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
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
