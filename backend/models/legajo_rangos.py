from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey, Integer, func


class LegajoRangos(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "LegajoRangos"

    # ID principal de la relacion entre legajo y rango institucional
    id: Mapped[int] = mapped_column(
        "idLegajoRangos",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Legajo asociado
    legajo_id: Mapped[int] = mapped_column(
        "legajoId",
        Integer,
        ForeignKey("legajos.id"),
        nullable=False
    )

    # Rango institucional asociado
    rangos_institucionales_id: Mapped[int] = mapped_column(
        "rangosInstitucionalesId",
        Integer,
        ForeignKey("rangos_institucionales.id"),
        nullable=True
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    # Relacion con el modelo de legajo.
    legajo = relationship("Legajo", backref="legajo_rangos_items")

    # Relacion con el modelo de rangos institucionales.
    rangos_institucionales = relationship(
        "RangosInstitucionales",
        backref="legajo_rangos_items"
    )

    def __repr__(self):
        return f"<LegajoRangos {self.id}>"

    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)