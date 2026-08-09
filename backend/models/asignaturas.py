from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func



class Asignaturas(db.Model):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    nombre: Mapped[str] = mapped_column(String(45), nullable=False, unique=True)

    estado: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Formato en el que se dicta la asignatura // Ojo, cambiar por int
    formato: Mapped[str] = mapped_column(String(45),nullable=False)
    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)
