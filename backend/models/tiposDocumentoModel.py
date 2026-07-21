# /backend/models/tiposDocumentoModel.py
from extensions import db
from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, Index

class TiposDocumentoModel(db.Model):
    __tablename__ = 'tipos_documento'
    
    # Restricciones
    __table_args__ = (
        Index(
            'td_constraint_descripcion_unico',
            'descripcion',
            unique=True,
            postgresql_where='"tsBaja" IS NULL' 
        ),
    )
    
    # Clave Primaria
    idTipoDocumento: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Campos
    descripcion: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # --- AUDITORIA ---
    idUsuarioCreacion: Mapped[int] = mapped_column(Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=False)
    idUsuarioModificacion: Mapped[int] = mapped_column(Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=True)
    idUsuarioBaja: Mapped[int] = mapped_column(Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=True)
    tsCreacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    tsModificacion: Mapped[datetime] = mapped_column(DateTime, onupdate=lambda: datetime.now(), nullable=True)
    tsBaja: Mapped[datetime] = mapped_column(DateTime, nullable=True)
