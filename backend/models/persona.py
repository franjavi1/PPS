from datetime import datetime


from db import db
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
    # id de usuario del microservicio de auth
    usuario_id: Mapped[int | None ] = mapped_column(Integer, nullable=True, unique=True)

    # Tipo de documento asociado a la persona
    td_id: Mapped[int] = mapped_column(
        "tdId",
        Integer,
        ForeignKey("tipos_documento.id"),
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
    numero_doc: Mapped[str] = mapped_column(
        "numeroDoc",
        String(15),
        nullable=False
    )

    # Estado del registro dentro del sistema
    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )





    # Relacion con el modelo de tipo de documento
    tipo_documento = relationship("TipoDocumento")


    # --- AUDITORIA ---
    id_persona_creacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, ondelete='RESTRICT', nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)