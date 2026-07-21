from datetime import datetime


from extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func

class Persona(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__="personas"

    # ID principal de la persona
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Tipo de documento asociado a la persona
    td_id: Mapped[int] = mapped_column(
        "tdId",
        Integer,
        ForeignKey("tipos_documento.idTipoDocumento"),
        nullable=False
    )

    # Nombre de la persona
    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # Apellido de la persona
    apellido: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # Numero de documento registrado
    numero_doc: Mapped[int] = mapped_column(
        "numeroDoc",
        Integer,
        nullable=False
    )

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    # Usuario que realizo la ultima accion sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creacion del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relacion con el modelo de tipo de documento
    tipo_documento = relationship("TipoDocumento")
