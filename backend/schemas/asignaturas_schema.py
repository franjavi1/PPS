from models.asignaturas import Asignaturas
from db import ma, db
from marshmallow import ValidationError, validates, pre_load, post_dump
from marshmallow.validate import Length


class AsignaturasSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Asignaturas
        load_instance = True

    id = ma.auto_field(dump_only=True)

    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=20,
                   error="El nombre debe tener entre 1 y 20 caracteres")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null",
            "invalid": "El nombre debe ser un texto valido"
        }
    )

    estado = ma.auto_field(dump_only=True)

    formato = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=15,
                   error="El formato debe tener entre 1 y 15 caracteres")
        ],
        error_messages={
            "required": "El formato es obligatorio",
            "null": "El formato no puede ser null",
            "invalid": "El formato debe ser un texto valido"
        }
    )

    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de accion es obligatorio",
            "null": "El usuario de accion no puede ser null",
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    @validates("nombre")
    def validar_nombre_unico(self, value, **kwargs):
        query = db.session.query(Asignaturas).filter(Asignaturas.nombre == value)
        
        if self.instance and getattr(self.instance, 'id', None):
            query = query.filter(Asignaturas.id != self.instance.id)
            
        if query.first():
            raise ValidationError("Ya existe una asignatura con ese nombre")

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError(
                "El usuario de accion debe ser un numero entero positivo")

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "formato" in data and isinstance(data["formato"], str):
            data["formato"] = data["formato"].strip().title()

        return data

    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "formato" in data and isinstance(data["formato"], str):
            data["formato"] = data["formato"].strip().title()

        return data


asignatura_schema = AsignaturasSchema()
asignaturas_schema = AsignaturasSchema(many=True)