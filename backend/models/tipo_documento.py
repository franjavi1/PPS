from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class TipoDocumento(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "tipos_documento"

    # ID principal del tipo de documento
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion del tipo de documento
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
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)