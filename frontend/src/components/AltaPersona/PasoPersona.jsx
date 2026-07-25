import React from "react";
import { User } from "lucide-react";
import { TituloPaso, CampoSelect, CampoTexto, Acciones } from "./FormFields";

// Recibimos de la vista padre:
// - persona: objeto local con los datos de identificación personal.
// - tiposDocumento: colección de tipos de documentos.
// - cambiarPersona: callback para guardar las entradas al estado.
// - guardarPersona: callback onSubmit para crear el registro físico.
// - guardando: boolean flag de carga de peticiones API.
export default function PasoPersona({
  persona,
  tiposDocumento,
  cambiarPersona,
  guardarPersona,
  guardando,
}) {
  return (
    // Dispara el guardado de la persona física básica
    <form onSubmit={guardarPersona} className="space-y-6">
      <TituloPaso icono={<User size={26} />} titulo="Datos de la persona" />
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
      <Acciones guardando={guardando} texto="Crear persona y seguir" />
    </form>
  );
}

