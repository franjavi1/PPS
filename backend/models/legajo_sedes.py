from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, func


class LegajoSedes(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "LegajoSedes"

    # ID principal de la relacion entre legajo y sede
    id: Mapped[int] = mapped_column(
        "idSedeLegajo",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Sede asociada
    sede_id: Mapped[int] = mapped_column(
        "sedesId",
        Integer,
        ForeignKey("sedes.id"),
        nullable=False
    )

    # Legajo asociado
    legajo_id: Mapped[int] = mapped_column(
        "Legajo_id",
        Integer,
        ForeignKey("legajos.id"),
        nullable=False
    )

    # Indica si el legajo es autoridad en la sede
    es_autoridad: Mapped[bool] = mapped_column(
        "esAutoridad",
        Boolean,
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )




    # Indica si esta sede es la base principal del legajo
    es_sede_base: Mapped[bool] = mapped_column(
        "esSedeBase",
        Boolean,
        nullable=False
    )

    # Relacion con el modelo de sede.
    sede = relationship("Sedes", backref="legajo_sedes_items")

    # Relacion con el modelo de legajo.
    legajo = relationship("Legajo", backref="legajo_sedes_items")

    def __repr__(self):
        return f"<LegajoSedes {self.id}>"

    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)