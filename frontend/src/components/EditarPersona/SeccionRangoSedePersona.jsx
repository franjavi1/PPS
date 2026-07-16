import React from "react";
import { MapPinned } from "lucide-react";
import { Seccion, CampoSelect, CampoCheckbox } from "./SharedPersonaComponents";

export default function SeccionRangoSedePersona({
  rango,
  rangos,
  sede,
  sedes,
  seccionAbierta,
  setSeccionAbierta,
  cambiarRango,
  cambiarSede,
}) {
  return (
    <Seccion
      id="rango-sede"
      icono={<MapPinned size={23} />}
      titulo="Rango y sede"
      abierta={seccionAbierta === "rango-sede"}
      onToggle={setSeccionAbierta}
    >
      <CampoSelect
        label="Rango"
        name="rangos_institucionales_id"
        value={rango.rangos_institucionales_id}
        onChange={cambiarRango}
        opciones={rangos}
        getValue={(item) => item.id}
        getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
      />
      <CampoSelect
        label="Sede"
        name="sede_id"
        value={sede.sede_id}
        onChange={cambiarSede}
        opciones={sedes}
        getValue={(item) => item.id}
        getLabel={(item) => item.nombre}
      />
      <CampoCheckbox
        label="Es autoridad"
        name="es_autoridad"
        checked={sede.es_autoridad}
        onChange={cambiarSede}
      />
      <CampoCheckbox
        label="Es sede base"
        name="es_sede_base"
        checked={sede.es_sede_base}
        onChange={cambiarSede}
      />
    </Seccion>
  );
}
