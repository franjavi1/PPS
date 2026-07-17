import { User } from "lucide-react";
import { TituloPaso, CampoTexto, CampoSelect, Acciones } from "../FormHelpers";

// Recibimos de la vista padre:
// - persona: objeto local con atributos de identificación (nombre, documento, etc).
// - cambiarPersona: callback para actualizar el estado local al escribir.
// - tiposDocumento: colección con los tipos de documento cargados en la base de datos.
// - guardando: flag boolean para deshabilitar controles y mostrar el spinner.
// - guardarPersona: callback onSubmit para crear la persona e ir al siguiente paso.
export default function StepPersona({
  persona,
  cambiarPersona,
  tiposDocumento,
  guardando,
  guardarPersona,
}) {
  return (
    // Guardamos los datos de la persona física y avanzamos al paso de legajo
    <form onSubmit={guardarPersona} className="space-y-6">
      <TituloPaso icono={<User size={26} />} titulo="Datos de la persona" />
      {/* Grilla responsiva para ordenar la captura de datos de identidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoSelect
          label="Tipo de documento"
          name="td_id"
          value={persona.td_id}
          onChange={cambiarPersona}
          opciones={tiposDocumento}
          getLabel={(tipo) => tipo.descripcion}
        />
        <CampoTexto
          label="Numero de documento"
          name="numero_doc"
          type="number"
          value={persona.numero_doc}
          onChange={cambiarPersona}
          placeholder="Ej: 30123456"
        />
        <CampoTexto
          label="Nombre"
          name="nombre"
          value={persona.nombre}
          onChange={cambiarPersona}
          placeholder="Ej: Juan"
        />
        <CampoTexto
          label="Apellido"
          name="apellido"
          value={persona.apellido}
          onChange={cambiarPersona}
          placeholder="Ej: Perez"
        />
      </div>
      {/* Disparador de submit del formulario que maneja el flag de guardando */}
      <Acciones guardando={guardando} texto="Crear persona y seguir" />
    </form>
  );
}

