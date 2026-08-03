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




    def __repr__(self):
        return f"<Comision {self.id_comision}>"

    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)