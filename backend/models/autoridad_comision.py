from datetime import datetime

from extensions import db
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

    usuario_accion: Mapped[int | None] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    ts_creacion: Mapped[datetime | None] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    ts_modificacion: Mapped[datetime | None] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
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
