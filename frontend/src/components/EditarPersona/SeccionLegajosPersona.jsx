import React from "react";
import { FileText } from "lucide-react";
import { Seccion, CampoTexto } from "./SharedPersonaComponents";

export default function SeccionLegajosPersona({
  legajo,
  seccionAbierta,
  setSeccionAbierta,
  cambiarLegajo,
}) {
  return (
    <Seccion
      id="legajo"
      icono={<FileText size={23} />}
      titulo="Legajo"
      abierta={seccionAbierta === "legajo"}
      onToggle={setSeccionAbierta}
    >
      <CampoTexto
        label="Numero de legajo"
        name="numero"
        value={legajo.numero}
        onChange={cambiarLegajo}
        placeholder="Ej: 1001"
      />
    </Seccion>
  );
}
