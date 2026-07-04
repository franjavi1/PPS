from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func, ForeignKey

class Aula(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "Aulas"

    # Identificador principal del aula
    id_aula: Mapped[int] = mapped_column(
        "idAulas",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relación con la sede
    sedes_id: Mapped[int] = mapped_column(
        "sedesId",
        Integer,
        ForeignKey("sedes.id"),
        nullable=False
    )

    # Nombre o número del aula
    aula: Mapped[str] = mapped_column(
        "aula",
        String(45),
        nullable=False
    )

    # Indica si es aula virtual (1 = Sí, 0 = No)
    es_virtual: Mapped[int] = mapped_column(
        "esVirtual",
        Integer,
        nullable=False
    )

    # Usuario que realizó la última acción sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Estado del registro dentro del sistema.
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )


    # Fecha y hora de creación del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la última modificación del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )