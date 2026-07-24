from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class TipoLegajo(db.Model):
    # Nombre de la tabla en la base de datos
    __tablename__ = "tipoLegajo"

    # ID principal del tipo de legajo
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion o nombre del tipo de legajo
    descripcion: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Usuario que realizo la ultima accion
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fecha y hora de creacion
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    # Fecha y hora de modificacion
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    def __repr__(self):
        return f"<TipoLegajo {self.descripcion}>"
