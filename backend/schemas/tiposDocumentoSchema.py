# /backend/schemas/tiposDocumentoSchema.py
from extensions import ma
from marshmallow import pre_load, post_dump
from marshmallow.validate import Length
from models.tiposDocumentoModel import TiposDocumentoModel

class TiposDocumentoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TiposDocumentoModel
        load_instance = True
        dump_only = ('idUsuarioCreacion', 'idUsuarioModificacion', 'idUsuarioBaja', 'tsCreacion', 'tsModificacion', 'tsBaja')

    # Campos
    descripcion = ma.auto_field(
        required=True, 
        validate=[
            Length(min=2, max=50, error="La descripcion debe tener entre 2 y 50 caracteres.")
        ],
        error_messages={
            "required": "La descripcion es obligatoria",
            "invalid": "La descripcion debe ser un texto valido",
            "null": "La descripcion no puede ser null"
        }
    )

    # Limpia y transforma antes de validar y guardar
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if not data:
            return data
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip().upper()
        return data

    # Mantiene el formato en la respuesta
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if not data:
            return data
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip().upper()
        return data
    
    idUsuarioCreacion = ma.auto_field(allow_none=True)
    
    idUsuarioModificacion = ma.auto_field(allow_none=True)
    
    idUsuarioBaja = ma.auto_field(allow_none=True)


tipoDocumentoSchema = TiposDocumentoSchema()
tiposDocumentoSchema = TiposDocumentoSchema(many=True)