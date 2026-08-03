from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class RangosInstitucionales(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "rangos_institucionales"

    # ID principal del rango institucional
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion del rango institucional
    descripcion: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Nivel de jerarquia del rango institucional
    nivel_jerarquia: Mapped[int] = mapped_column(
        "nivelJerarquia",
        Integer,
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)

