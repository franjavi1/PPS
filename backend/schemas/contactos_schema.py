from models.contactos import Contactos
from models.persona import Persona
from models.tipo_contacto import TipoContacto

from schemas.tipo_contacto_schema import TipoContactoSchema

from db import ma

from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump, fields
from marshmallow.validate import Length


class ContactosSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Contactos
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Persona asociada al contacto.
    persona_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La persona es obligatoria",
            "null": "La persona no puede ser null",
            "invalid": "La persona debe ser un numero entero"
        }
    )

    # Tipo de contacto asociado.
    tipo_contacto_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El tipo de contacto es obligatorio",
            "null": "El tipo de contacto no puede ser null",
            "invalid": "El tipo de contacto debe ser un numero entero"
        }
    )

    # Indica si es el contacto principal.
    principal = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El campo principal es obligatorio",
            "null": "El campo principal no puede ser null",
            "invalid": "El campo principal debe ser verdadero o falso"
        }
    )

    # Valor del contacto.
    contacto = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El contacto debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El contacto es obligatorio",
            "null": "El contacto no puede ser null",
            "invalid": "El contacto debe ser un texto valido"
        }
    )
    
    tipo_contacto = fields.Nested(TipoContactoSchema, dump_only=True)
    
    estado = ma.auto_field(dump_only=True)
    # Usuario que realiza la accion sobre el registro.
    usuario_accion = ma.auto_field(
        required=False,
        allow_none=True,
        error_messages={
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    # Fechas administradas por la base de datos.
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    # Verifica que la persona exista y este activa.
    @validates("persona_id")
    def validar_persona_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La persona debe ser un numero entero positivo")
        if Persona.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("La persona indicada no existe o no esta activa")

    # Verifica que el tipo de contacto exista.
    @validates("tipo_contacto_id")
    def validar_tipo_contacto_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El tipo de contacto debe ser un numero entero positivo")
        if TipoContacto.query.get(value) is None:
            raise ValidationError("El tipo de contacto indicado no existe.")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Evita registrar contactos repetidos para la misma persona y tipo.
    @validates_schema
    def validar_contacto_unico(self, data, **kwargs):
        persona_id = data.get("persona_id")
        tipo_contacto_id = data.get("tipo_contacto_id")
        contacto = data.get("contacto")

        if not persona_id or not tipo_contacto_id or not contacto:
            return

        existente = Contactos.query.filter_by(
            persona_id=persona_id,
            tipo_contacto_id=tipo_contacto_id,
            contacto=contacto
        ).first()

        contacto_id = getattr(self, "context", {}).get("contacto_id")

        if existente and existente.id != contacto_id:
            raise ValidationError({
                "contacto": ["Ya existe ese contacto para la persona indicada"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "contacto" in data and isinstance(data["contacto"], str):
            data["contacto"] = data["contacto"].strip()

        return data

    # Mantiene el contacto limpio al devolver la respuesta.
    @post_dump
    def normalizar_salida(self, data, **kwargs):
        if "contacto" in data and isinstance(data["contacto"], str):
            data["contacto"] = data["contacto"].strip()

        return data

# Instancias usadas por las rutas y servicios.
contacto_schema = ContactosSchema()
contactos_schema = ContactosSchema(many=True)
