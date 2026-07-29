from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func



class Asignaturas(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "asignaturas"

    # ID principal de la asignatura.
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Nombre de la asignatura
    nombre: Mapped[str] = mapped_column(String(105),nullable=False)

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Formato en el que se dicta la asignatura // Ojo, cambiar por int
    formato: Mapped[str] = mapped_column(String(45),nullable=False)
    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)
