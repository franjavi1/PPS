from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, func

class Planes(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "planes"

    # ID principal del plan
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Tipo de plan asociado
    tipo_planes_id_tipo_planes: Mapped[int] = mapped_column(
        "tipoPlanesIdTipoPlanes",
        Integer,
        ForeignKey("tipos_planes.idTipoPlanes"),
        nullable=False
    )

    # Numero de resolucion ministerial del plan
    resolucion_ministerial: Mapped[str] = mapped_column(
        "ResolucionMinisterial",
        String(14),
        nullable=False

    )

    # Nombre del plan
    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # Descripcion general del plan
    descrip: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    # Fecha de inicio de vigencia
    vigencia_dde: Mapped[datetime] = mapped_column(
        "vigenciaDde",
        DateTime,
        nullable=False
    )

    
    # Fecha de fin de vigencia
    vigencia_hta: Mapped[datetime] = mapped_column(
        "vigenciaHta",
        DateTime,
        nullable=False
    )

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )



    


    # Relacion con el modelo de tipo de plan
    tipo_plan = relationship("TipoPlanes")


    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)