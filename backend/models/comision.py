from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Integer, String, func


class Comision(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "Comision"

    # Identificador principal de la comision.
    id_comision: Mapped[int] = mapped_column(
        "idComision",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion de la comision.
    descripcion: Mapped[str] = mapped_column(
        "Descripcion",
        String(45),
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )


    # Usuario que realizo la ultima accion sobre el registro.
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fecha y hora de creacion del registro.
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion.
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<Comision {self.id_comision}>"
