from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class Asignaturas(db.Model):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    nombre: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)

    estado: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    formato: Mapped[str] = mapped_column(String(15), nullable=False)

    usuario_accion: Mapped[int] = mapped_column("usuarioAccion", Integer, nullable=False)

    ts_creacion: Mapped[datetime] = mapped_column("tsCreacion", DateTime, server_default=func.now(), nullable=False)

    ts_modificacion: Mapped[datetime] = mapped_column("tsModificacion", DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)