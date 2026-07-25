import React from "react";
import { IdCard } from "lucide-react";
import { Seccion, CampoSelect, CampoTexto } from "./SharedPersonaComponents";

export default function SeccionPersona({
  persona,
  tiposDocumento,
  seccionAbierta,
  setSeccionAbierta,
  cambiarPersona,
}) {
  return (
    <Seccion
      id="persona"
      icono={<IdCard size={23} />}
      titulo="Datos personales"
      abierta={seccionAbierta === "persona"}
      onToggle={setSeccionAbierta}
    >
      <CampoSelect
        label="Tipo de documento"
        name="td_id"
        value={persona.td_id}
        onChange={cambiarPersona}
        opciones={tiposDocumento}
        getValue={(tipo) => tipo.id}
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
    </Seccion>
  );
}
