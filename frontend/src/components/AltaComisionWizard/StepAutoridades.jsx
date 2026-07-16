import { ShieldUser, PlusCircle } from "lucide-react";
import { TituloPaso, CampoSelect, Acciones } from "../FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

export default function StepAutoridades({
  autoridad,
  cambiarAutoridad,
  tiposAutoridad,
  legajos,
  comisionesAsignaturasCargadas,
  agregarAutoridad,
  autoridadesCargadas,
  guardando,
  onBack,
  onNext,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<ShieldUser size={26} />} titulo="Autoridades" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CampoSelect
          label="Tipo autoridad"
          name="tipo_autoridad_id"
          value={autoridad.tipo_autoridad_id}
          onChange={cambiarAutoridad}
          opciones={tiposAutoridad}
          getLabel={(item) => item.descripcion}
        />
        <CampoSelect
          label="Legajo"
          name="legajo_id"
          value={autoridad.legajo_id}
          onChange={cambiarAutoridad}
          opciones={legajos}
          getLabel={(item) => (item.numero ? `Nro. ${item.numero}` : `Legajo #${item.id}`)}
        />
        <CampoSelect
          label="Comision asignatura"
          name="comision_id"
          value={autoridad.comision_id}
          onChange={cambiarAutoridad}
          opciones={comisionesAsignaturasCargadas}
          getLabel={(item) => item.nombre}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={agregarAutoridad}
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
        >
          <PlusCircle size={22} />
          Agregar autoridad
        </button>
      </div>

      {autoridadesCargadas.length === 0 ? (
        <EstadoVacio texto="Podés finalizar sin autoridades cargadas." />
      ) : (
        <div className="space-y-3">
          {autoridadesCargadas.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <p className="text-slate-800 font-extrabold">{item.tipoAutoridad}</p>
              <p className="text-slate-500 font-semibold mt-1">
                {item.legajo || "-"} - {item.comisionAsignatura || "-"}
              </p>
            </div>
          ))}
        </div>
      )}

      <Acciones
        guardando={false}
        texto="Finalizar"
        onBack={onBack}
        onSubmit={onNext}
      />
    </section>
  );
}
