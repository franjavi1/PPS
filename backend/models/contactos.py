from datetime import datetime

from extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func


class Contactos(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "Contactos"

    # ID principal del contacto
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Persona asociada al contacto
    persona_id: Mapped[int] = mapped_column(
        "personaId",
        Integer,
        ForeignKey("personas.id"),
        nullable=False
    )

    # Tipo de contacto asociado
    tipo_contacto_id: Mapped[int] = mapped_column(
        "tipoContactoId",
        Integer,
        ForeignKey("tipoContacto.idtipoContacto"),
        nullable=False
    )

    # Indica si es el contacto principal
    principal: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )

    # Valor del contacto
    contacto: Mapped[str] = mapped_column(
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
    persona = relationship("Persona", backref="contactos_items")

    # Relacion con el modelo de tipo de contacto.
    tipo_contacto = relationship("TipoContacto", backref="contactos_items")

    def __repr__(self):
        return f"<Contactos {self.id}>"
