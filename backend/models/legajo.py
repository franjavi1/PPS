from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func


class Legajo(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "legajos"

    # ID principal del legajo
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Persona asociada al legajo
    persona_id: Mapped[int] = mapped_column(
        "personasId",
        Integer,
        ForeignKey("personas.id"),
        nullable=False
    )

    # Numero identificador del legajo.
    numero: Mapped[str] = mapped_column(
        String(45),
        nullable=False,
        unique=True
    )

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )





    # Relacion con el modelo de persona.
    persona = relationship("Persona")

    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)