from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Integer, String, func


class TipoContacto(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "tipoContacto"

    # ID principal del tipo de contacto
    id: Mapped[int] = mapped_column(
        "idtipoContacto",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Tipo de contacto
    tipo: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Usuario que realizo la ultima accion sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fecha y hora de creacion del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    def __repr__(self):
        return f"<TipoContacto {self.id}>"
