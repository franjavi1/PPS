from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, func


class TipoDocumentoModel(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "tipos_documento"
    
    # se podrian implementar restricciones ej, un tipo decumento con fecha baja null su descripcion no se debe repetir
    __table_args__ = (
        Index(
            'td_constraint_descripcion_unico',
            'descripcion',
            unique=True,
            postgresql_where='"tsBaja" IS NULL' # si es posgres
        ),
    )

    # ID principal del tipo de documento
    id_tipo_documento: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Descripcion del tipo de documento
    descripcion: Mapped[str] = mapped_column( String(45), nullable=False )

    # Usaurio que le dio de alta al registro
    id_usuario_creacion: Mapped[int] = mapped_column( Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=True )
    
    # Usaurio que modifico el registro
    id_usuario_modificaion: Mapped[int] = mapped_column(Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=True)
    
    # Usaurio que le dio de baja al registro
    id_usuario_baja: Mapped[int] = mapped_column(Integer, ForeignKey('personas.id', ondelete='RESTRICT'), nullable=True)

    # Fecha y hora de creacion del registro
    ts_creacion:  Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=False)

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, onupdate=lambda: datetime.now(), nullable=True)
    
    # Fecha y hora de la baja del registro
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)


    # aca se puede colocar la relacion que tiene con documento y extraer la lista de documentos de la persona que deberia ser una tabla intermedia para todos sus documentos
    # buscamos lo que fecha bada de documentos de la La_Otra_Tabla es nulo y coninica con el id de esta tabla
    # esto sirve para extraer dados de la otra tabla
    #documentos: Mapped[list["La_Otra_Tabla"]] = relationship(
    #    "La_Otra_Tabla", 
    #    back_populates="tipoDocumento",
    #    primaryjoin="and_(TipoDocumentoModel.id_tipo_documento == La_Otra_Tabla.id_tipo_documento, La_Otra_Tabla.tsBaja == None)",
    #    foreign_keys="[La_Otra_Tabla.id_tipo_documento]"
    #)