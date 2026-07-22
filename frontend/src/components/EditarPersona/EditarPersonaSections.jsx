import { Mail, Phone } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple, CampoCheckbox } from "../FormHelpers";

export function SeccionPersona({ persona, cambiarPersona, tiposDocumento }) {
  return (
    <>
      <CampoSelect
        label="Tipo de documento"
        name="td_id"
        value={persona.td_id}
        onChange={cambiarPersona}
        opciones={tiposDocumento}
        getLabel={(item) => item.descripcion}
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
    </>
  );
}

export function SeccionLegajo({ legajo, cambiarLegajo }) {
  return (
    <CampoTexto
      label="Numero de legajo"
      name="numero"
      value={legajo.numero}
      onChange={cambiarLegajo}
      placeholder="Ej: 1001"
    />
  );
}

export function SeccionDatosMedicos({ datosMedicos, cambiarDatosMedicos }) {
  return (
    <>
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
    </>
  );
}

export function SeccionContactos({ contactos, cambiarContactos }) {
  return (
    <>
      <CampoTexto
        label="Email"
        name="email"
        type="email"
        value={contactos.email}
        onChange={cambiarContactos}
        placeholder="Ej: persona@email.com"
        icon={<Mail size={20} />}
      />
      <CampoTexto
        label="Celular"
        name="celular"
        value={contactos.celular}
        onChange={cambiarContactos}
        placeholder="Ej: 3415551234"
        icon={<Phone size={20} />}
      />
    </>
  );
}

export function SeccionRangoSede({ rango, cambiarRango, sede, cambiarSede, rangos, sedes }) {
  return (
    <>
      <CampoSelect
        label="Rango"
        name="rangos_institucionales_id"
        value={rango.rangos_institucionales_id}
        onChange={cambiarRango}
        opciones={rangos}
        getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
      />
      <CampoSelect
        label="Sede"
        name="sede_id"
        value={sede.sede_id}
        onChange={cambiarSede}
        opciones={sedes}
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
    </>
  );
}
