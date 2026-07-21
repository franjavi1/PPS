from datetime import datetime

from extensions import db
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

    # Usuario que realizo la ultima accion sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fecha y hora de creacion del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    # Relacion con el modelo de persona.
    persona = relationship("Persona", backref="datos_medicos_items")

    def __repr__(self):
        return f"<DatosMedicos {self.id}>"
