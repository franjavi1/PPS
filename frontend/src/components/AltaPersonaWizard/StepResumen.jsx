import { CheckCircle2, User, IdCard, HeartPulse, MapPinned, Phone, ShieldCheck } from "lucide-react";
import { TituloPaso } from "../FormHelpers";

export function ResumenItem({ icono, titulo, texto }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center shrink-0">
        {icono}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase">{titulo}</h3>
        <p className="text-lg font-bold text-slate-800 mt-1">{texto || "-"}</p>
      </div>
    </div>
  );
}

export default function StepResumen({
  personaResumen,
  personaId,
  legajo,
  legajoId,
  datosMedicos,
  contactos,
  resultadoUsuario,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Resumen del alta" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ResumenItem
          icono={<User size={24} />}
          titulo="Persona"
          texto={`${personaResumen} - ID ${personaId}`}
        />
        <ResumenItem
          icono={<IdCard size={24} />}
          titulo="Legajo"
          texto={`Numero ${legajo.numero} - ID ${legajoId}`}
        />
        <ResumenItem
          icono={<HeartPulse size={24} />}
          titulo="Datos medicos"
          texto={datosMedicos.grupo_sanguineo ? "Cargados o solicitados" : "Omitidos"}
        />
        <ResumenItem
          icono={<MapPinned size={24} />}
          titulo="Rango y sede"
          texto="Guardados si fueron seleccionados"
        />
        <ResumenItem
          icono={<Phone size={24} />}
          titulo="Contactos"
          texto={
            contactos.email || contactos.celular
              ? `${contactos.email || "Sin email"} - ${contactos.celular || "Sin celular"}`
              : "Omitidos"
          }
        />
        <ResumenItem
          icono={<ShieldCheck size={24} />}
          titulo="Usuario"
          texto={resultadoUsuario?.mensaje || "Pendiente"}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
        >
          Cargar otra persona
        </button>
      </div>
    </section>
  );
}
