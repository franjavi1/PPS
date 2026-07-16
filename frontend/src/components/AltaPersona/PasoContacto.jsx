import React from "react";
import { ClipboardPlus, Mail, Phone } from "lucide-react";
import {
  TituloPaso,
  CampoSelectSimple,
  CampoTexto,
  CampoCheckbox,
  CampoSelect,
  Acciones,
} from "./FormFields";

export default function PasoContacto({
  datosMedicos,
  cambiarDatosMedicos,
  contactos,
  cambiarContactos,
  datosLegajo,
  cambiarDatosLegajo,
  rangos,
  sedes,
  guardarDatosDelLegajo,
  guardando,
  onBack,
}) {
  return (
    <form onSubmit={guardarDatosDelLegajo} className="space-y-8">
      <TituloPaso icono={<ClipboardPlus size={26} />} titulo="Datos asociados" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-4">
          Datos medicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-4">Contactos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CampoTexto
            label="Email"
            name="email"
            type="email"
            value={contactos.email}
            onChange={cambiarContactos}
            placeholder="Ej: persona@email.com"
            icono={<Mail size={20} />}
          />
          <CampoTexto
            label="Celular"
            name="celular"
            value={contactos.celular}
            onChange={cambiarContactos}
            placeholder="Ej: 3415551234"
            icono={<Phone size={20} />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-4">
          Rango y sede
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CampoSelect
            label="Rango"
            name="rangos_institucionales_id"
            value={datosLegajo.rangos_institucionales_id}
            onChange={cambiarDatosLegajo}
            opciones={rangos}
            getLabel={(rango) =>
              `${rango.descripcion} - Nivel ${rango.nivel_jerarquia}`
            }
          />
          <CampoSelect
            label="Sede"
            name="sede_id"
            value={datosLegajo.sede_id}
            onChange={cambiarDatosLegajo}
            opciones={sedes}
            getLabel={(sede) => sede.nombre}
          />
          <CampoCheckbox
            label="Es autoridad"
            name="es_autoridad"
            checked={datosLegajo.es_autoridad}
            onChange={cambiarDatosLegajo}
          />
          <CampoCheckbox
            label="Es sede base"
            name="es_sede_base"
            checked={datosLegajo.es_sede_base}
            onChange={cambiarDatosLegajo}
          />
        </div>
      </div>

      <Acciones
        guardando={guardando}
        texto="Guardar datos y seguir"
        onBack={onBack}
      />
    </form>
  );
}
