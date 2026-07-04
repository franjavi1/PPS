from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func

class TipoAutoridad(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "TipoAutoridad"

    # ID principal
    id: Mapped[int] = mapped_column(
        "id",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripción del tipo de autoridad
    descripcion: Mapped[str] = mapped_column(
        "descripcion",
        String(45),
        nullable=False
    )

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    # Usuario que realizo la ultima acción sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creacion del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )