from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func, ForeignKey

class Aula(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "Aulas"

    # Identificador principal del aula
    id_aula: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relacion con la sede
    sedes_id: Mapped[int] = mapped_column(
        "sedesId",
        Integer,
        ForeignKey("sedes.id"),
        nullable=False
    )

    # Nombre o numero del aula
    aula: Mapped[str] = mapped_column(
        "aula",
        String(45),
        nullable=False
    )

    # Indica si es aula virtual (1 = Si, 0 = No)
    es_virtual: Mapped[int] = mapped_column(
        "esVirtual",
        Integer,
        nullable=False
    )


    # Estado del registro dentro del sistema.
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)