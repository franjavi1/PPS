from datetime import datetime

from db import db
from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column


class CondicionAcademica(db.Model):
    __tablename__ = "CondicionAcademica"

    id_condicion_academica: Mapped[int] = mapped_column(
        "idCondicionAcademica",
        Integer,
        primary_key=True,
        autoincrement=True
    )
    condicion: Mapped[str] = mapped_column(String(45), nullable=False)
    usuario_accion: Mapped[int | None] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )
    ts_creacion: Mapped[datetime | None] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )
    ts_modificacion: Mapped[datetime | None] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    def __repr__(self):
        return f"<CondicionAcademica {self.id_condicion_academica}>"
