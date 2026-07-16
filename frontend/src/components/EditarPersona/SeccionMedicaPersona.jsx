import React from "react";
import { HeartPulse } from "lucide-react";
import { Seccion, CampoSelectSimple, CampoTexto, CampoCheckbox } from "./SharedPersonaComponents";

export default function SeccionMedicaPersona({
  datosMedicos,
  seccionAbierta,
  setSeccionAbierta,
  cambiarDatosMedicos,
}) {
  return (
    <Seccion
      id="datos-medicos"
      icono={<HeartPulse size={23} />}
      titulo="Datos medicos"
      abierta={seccionAbierta === "datos-medicos"}
      onToggle={setSeccionAbierta}
    >
      <CampoSelectSimple
        label="Grupo sanguineo"
        name="grupo_sanguineo"
        value={datosMedicos.grupo_sanguineo}
        onChange={cambiarDatosMedicos}
        opciones={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
      />
      <CampoTexto
        label="Seguro"
        name="seguro"
        value={datosMedicos.seguro}
        onChange={cambiarDatosMedicos}
        placeholder="Ej: OSDE"
      />
      <CampoTexto
        label="Alergias"
        name="alergias"
        value={datosMedicos.alergias}
        onChange={cambiarDatosMedicos}
        placeholder="Ej: Penicilina"
      />
      <CampoCheckbox
        label="Aptitud fisica"
        name="aptitud_fisica"
        checked={datosMedicos.aptitud_fisica}
        onChange={cambiarDatosMedicos}
      />
    </Seccion>
  );
}
