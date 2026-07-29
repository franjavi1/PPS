from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class Modalidades(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "Modalidades"

    # ID principal de la modalidad
    modalidadesid: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion de la modalidad
    descripcion: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )





    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)