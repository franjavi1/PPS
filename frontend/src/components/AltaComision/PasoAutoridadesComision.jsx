import React from "react";
import { ShieldUser, PlusCircle, Save } from "lucide-react";

// Recibimos de la vista padre:
// - autoridad: objeto local de formulario que vincula tipo de autoridad, legajo y materia.
// - tiposAutoridad: colección de roles institucionales de comisiones.
// - legajos: colección de legajos del personal.
// - comisionesAsignaturasCargadas: listado de materias ya asignadas a la comisión.
// - autoridadesCargadas: lista de autoridades que ya fueron guardadas.
// - guardando: bandera para inhabilitar controles en peticiones de guardado concurrentes.
// - cambiarAutoridad: callback para registrar cambios en los selectores.
// - agregarAutoridad: trigger callback para persistir la autoridad.
// - setPasoActual: manejador para la navegación entre pasos.
export default function PasoAutoridadesComision({
  autoridad,
  tiposAutoridad,
  legajos,
  comisionesAsignaturasCargadas,
  autoridadesCargadas,
  guardando,
  cambiarAutoridad,
  agregarAutoridad,
  setPasoActual,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <ShieldUser size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Autoridades</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CampoSelect
          label="Tipo autoridad"
          name="tipo_autoridad_id"
          value={autoridad.tipo_autoridad_id}
          onChange={cambiarAutoridad}
        >
          <option value="">Seleccione</option>
          {/* Mapeamos los tipos de autoridades utilizando su ID como key única */}
          {tiposAutoridad.map((item) => (
            <option key={item.id} value={item.id}>
              {item.descripcion}
            </option>
          ))}
        </CampoSelect>

        <CampoSelect
          label="Legajo"
          name="legajo_id"
          value={autoridad.legajo_id}
          onChange={cambiarAutoridad}
        >
          <option value="">Seleccione</option>
          {/* Mapeamos los legajos usando ID y número */}
          {legajos.map((item) => (
            <option key={item.id} value={item.id}>
              {item.numero ? `Nro. ${item.numero}` : `Legajo #${item.id}`}
            </option>
          ))}
        </CampoSelect>

        <CampoSelect
          label="Comision asignatura"
          name="comision_id"
          value={autoridad.comision_id}
          onChange={cambiarAutoridad}
        >
          <option value="">Seleccione</option>
          {/* Mapeamos las materias de la comisión con key única */}
          {comisionesAsignaturasCargadas.map((item) => (
            <option key={item.id_comision_asignatura} value={item.id_comision_asignatura}>
              {item.nombre}
            </option>
          ))}
        </CampoSelect>
      </div>

      <div className="flex justify-end">
        {/* Deshabilitamos el botón si la petición API está cargando */}
        <button
          type="button"
          onClick={agregarAutoridad}
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition"
        >
          <PlusCircle size={22} />
          Agregar autoridad
        </button>
      </div>

      {/* Renderiza el listado de autoridades asignadas */}
      <ListaItems
        items={autoridadesCargadas}
        vacio="Podés finalizar sin autoridades cargadas."
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {/* Regresa al paso de asociar asignaturas */}
        <button
          type="button"
          onClick={() => setPasoActual(2)}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={() => setPasoActual(4)}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
        >
          <Save size={22} />
          Finalizar
        </button>
      </div>
    </section>
  );
}

// Selector dropdown helper para PasoAutoridadesComision
function CampoSelect({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        {children}
      </select>
    </div>
  );
}

// Grilla/lista de items cargados con manejo preventivo de estado vacío
function ListaItems({ items, vacio }) {
  if (items.length === 0) {
    return (
      // Si la colección viene vacía, mostramos un mensaje amigable
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
        {vacio}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mapeamos los elementos asegurando un key consistente */}
      {items.map((item, index) => (
        <div key={index} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
          <p className="text-slate-800 font-extrabold">{item.tipoAutoridad}</p>
          <p className="text-slate-500 font-semibold mt-1">
            {item.legajo || "-"} - {item.comisionAsignatura || "-"}
          </p>
        </div>
      ))}
    </div>
  );
}

