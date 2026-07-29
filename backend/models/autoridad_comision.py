from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey, Integer, func


class AutoridadComision(db.Model):
    __tablename__ = "AutoridadComision"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    tipo_autoridad_id: Mapped[int] = mapped_column(
        "tipoAutoridadId",
        Integer,
        ForeignKey("TipoAutoridad.id"),
        nullable=False
    )

    legajo_id: Mapped[int] = mapped_column(
        "legajoId",
        Integer,
        ForeignKey("legajos.id"),
        nullable=False
    )

    comision_id: Mapped[int] = mapped_column(
        "comisionId",
        Integer,
        ForeignKey("ComisionAsignatura.idComisionAsignatura"),
        nullable=False
    )







    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )


    tipo_autoridad = relationship(
        "TipoAutoridad",
        backref="autoridad_comision_items"
    )
    legajo = relationship("Legajo", backref="autoridad_comision_items")
    comision_asignatura = relationship(
        "ComisionAsignatura",
        backref="autoridad_comision_items"
    )

    def __repr__(self):
        return f"<AutoridadComision {self.id}>"

    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)
