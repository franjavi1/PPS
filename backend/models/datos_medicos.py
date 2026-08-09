from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func


class DatosMedicos(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "DatosMedicos"

    # ID principal de los datos medicos
    id: Mapped[int] = mapped_column(
        "idDatosMedicos",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Persona asociada a los datos medicos
    persona_id: Mapped[int] = mapped_column(
        "personasId",
        Integer,
        ForeignKey("personas.id"),
        nullable=False
    )

    # Grupo sanguineo de la persona
    grupo_sanguineo: Mapped[str] = mapped_column(
        "grupoSanguineo",
        String(3),
        nullable=False
    )

    # Alergias registradas de la persona
    alergias: Mapped[str] = mapped_column(
        String(45),
        nullable=True
    )

    # Aptitud fisica de la persona
    aptitud_fisica: Mapped[bool] = mapped_column(
        "aptitudFisica",
        Boolean,
        nullable=False
    )

    # Seguro medico de la persona
    seguro: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    # Relacion con el modelo de persona.
    persona = relationship("Persona", backref="datos_medicos_items")

    def __repr__(self):
        return f"<DatosMedicos {self.id}>"

    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)