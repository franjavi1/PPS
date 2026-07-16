from backend.models.tipo_documento_model import TipoDocumento

from db import ma

from marshmallow import ValidationError, validates_schema, pre_load, post_dump
from marshmallow.validate import Length, Regexp


REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"


class TipoDocumentoSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = TipoDocumento
        load_instance = True
        # los datos que sean enviados desde el front no los toma, solo el back controla esto
        dump_only = ('id_persona_creacion', 'id_persona_modificacion', 'id_persona_baja', 'ts_creacion', 'ts_modificacion', 'ts_baja')

    # Campo de solo lectura para las respuestas.
    id_tipo_documento = ma.auto_field(dump_only=True)
    
    # extraemos datos foraneos si es que ubiera y evitamos importacion circular, la coma(,) representa una tupla otra forma seria ["tipo_documento"]
    # el parametro esper alista e spor eso, y sin la coma lo toma como un string
    # documentacion = ma.Nested("Otra_Tabla", dump_only=True, exclude=("tipo_documento",))

    # Descripcion del tipo de documento.
    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La descripción debe tener entre 1 y 45 caracteres"),
            Regexp(REGEX_SOLO_LETRAS, error="La descripción solo puede contener letras")
        ],
        error_messages={
            "required": "La descripción es obligatoria",
            "null": "La descripción no puede ser null",
            "invalid": "La descripción debe ser un texto válido"
        }
    )

    # persona que realiza la accion sobre el registro.
    id_persona_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El persona de acción es obligatorio",
            "null": "El persona de acción no puede ser null",
            "invalid": "El persona de acción debe ser un número entero"
        }
    )

    # Fechas administradas por la base de datos.
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    # Evita cargar tipos de documento con descripciones repetidas.
    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = TipoDocumento.query.filter_by(
            descripcion=descripcion
        ).first()

        tipo_documento_id = getattr(self, "context", {}).get("tipo_documento_id")

        if existente and existente.id != tipo_documento_id:
            raise ValidationError({
                "descripcion": ["Ya existe un tipo de documento con esa descripción"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip().title()

        return data

    # Mantiene el formato de la descripcion al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].title()

        return data


# Instancias usadas por las rutas y servicios.
tipo_documento_schema = TipoDocumentoSchema()
tipos_documento_schema = TipoDocumentoSchema(many=True)
