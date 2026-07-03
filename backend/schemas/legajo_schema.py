from models.legajo import Legajo
from models.persona import Persona

from db import ma

from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump
from marshmallow.validate import Length


class LegajoSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Legajo
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Persona asociada al legajo.
    persona_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La persona es obligatoria",
            "null": "La persona no puede ser null",
            "invalid": "La persona debe ser un numero entero"
        }
    )

    # Numero identificador del legajo.
    numero = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El numero debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El numero de legajo es obligatorio",
            "null": "El numero de legajo no puede ser null",
            "invalid": "El numero de legajo debe ser un texto valido"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

    # Usuario que realiza la accion sobre el registro.
    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de accion es obligatorio",
            "null": "El usuario de accion no puede ser null",
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

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Evita registrar legajos activos con numeros repetidos.
    @validates_schema
    def validar_numero_unico(self, data, **kwargs):
        numero = data.get("numero")

        if not numero:
            return

        existente = Legajo.query.filter_by(
            numero=numero,
            estado=1
        ).first()

        legajo_id = getattr(self, "context", {}).get("legajo_id")

        if existente and existente.id != legajo_id:
            raise ValidationError({
                "numero": ["Ya existe un legajo activo con ese numero"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "numero" in data and isinstance(data["numero"], str):
            data["numero"] = data["numero"].strip()

        return data

    # Mantiene el numero limpio al devolver la respuesta.
    @post_dump
    def normalizar_salida(self, data, **kwargs):
        if "numero" in data and isinstance(data["numero"], str):
            data["numero"] = data["numero"].strip()

        return data


# Instancias usadas por las rutas y servicios.
legajo_schema = LegajoSchema()
legajos_schema = LegajoSchema(many=True)
