from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, DateTime, ForeignKey, func


class LegajoTiposLegajo(db.Model):
    # Nombre de la tabla en la base de datos
    __tablename__ = "LegajoTiposLegajo"

    # ID principal asociativo
    id_legajo_tipos_legajo: Mapped[int] = mapped_column(
        "idLegajoTiposLegajo",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relacion de FK con Legajos
    legajo_id: Mapped[int] = mapped_column(
        "legajoId",
        Integer,
        ForeignKey("legajos.id"),
        nullable=False
    )

    # Relacion de FK con TipoLegajo
    tipo_legajo_id: Mapped[int] = mapped_column(
        "tipoLegajoId",
        Integer,
        ForeignKey("tipoLegajo.id"),
        nullable=False
    )

    # Usuario de accion
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fechas
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    # Relaciones y referencias
    legajo = relationship("Legajo", backref="legajo_tipos_items")
    tipo_legajo = relationship("TipoLegajo", backref="legajo_tipos_items")

    def __repr__(self):
        return f"<LegajoTiposLegajo legajo:{self.legajo_id} tipo:{self.tipo_legajo_id}>"
