from datetime import datetime

from db import db
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

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    # Relacion con el modelo de persona.
    persona = relationship("Persona", backref="contactos_items")

    # Relacion con el modelo de tipo de contacto.
    tipo_contacto = relationship("TipoContacto", backref="contactos_items")

    def __repr__(self):
        return f"<Contactos {self.id}>"

    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)