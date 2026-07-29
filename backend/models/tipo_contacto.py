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

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )



    def __repr__(self):
        return f"<TipoContacto {self.id}>"

    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)