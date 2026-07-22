import React from "react";
import { BookOpenCheck, PlusCircle, Tag, BookOpen, Hash, Save } from "lucide-react";

// Recibimos de la vista padre:
// - comisionAsignatura: objeto de formulario local con datos de la materia a asociar.
// - planesAsignaturas: coleccion de asignaturas vinculadas a planes.
// - aulas: coleccion de aulas fisicas.
// - mapas: diccionario con traducciones de nombres por ID.
// - comisionesAsignaturasCargadas: materias asociadas previamente en esta carga.
// - guardando: flag booleano para inhabilitar controles en el submit.
// - cambiarComisionAsignatura: callback para actualizar los campos.
// - agregarComisionAsignatura: callback para persistir la asociacion.
// - setPasoActual: manejador callback para la navegación entre pasos.
export default function PasoAsignaturasComision({
  comisionAsignatura,
  planesAsignaturas,
  aulas,
  mapas,
  comisionesAsignaturasCargadas,
  guardando,
  cambiarComisionAsignatura,
  agregarComisionAsignatura,
  setPasoActual,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <BookOpenCheck size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Asignaturas de la comision</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CampoSelect
          label="Plan asignatura"
          name="plan_asignaturas_id"
          value={comisionAsignatura.plan_asignaturas_id}
          onChange={cambiarComisionAsignatura}
        >
          <option value="">Seleccione</option>
          {/* Mapeamos los planes de asignaturas utilizando su ID como key única */}
          {planesAsignaturas.map((item) => (
            <option key={item.id} value={item.id}>
              {mapas.planesAsignaturas[item.id]}
            </option>
          ))}
        </CampoSelect>

        <CampoSelect
          label="Aula"
          name="aula_id"
          value={comisionAsignatura.aula_id}
          onChange={cambiarComisionAsignatura}
        >
          <option value="">Seleccione</option>
          {/* Mapeamos las aulas asociadas utilizando su ID como key */}
          {aulas.map((item) => (
            <option key={item.id_aula} value={item.id_aula}>
              {item.aula}
            </option>
          ))}
        </CampoSelect>

        <CampoTexto
          label="Nombre"
          name="nombre"
          value={comisionAsignatura.nombre}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: Comision A - Incendios"
          icono={<Tag size={20} />}
        />

        <CampoTexto
          label="Modalidad"
          name="modalidad"
          value={comisionAsignatura.modalidad}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: Presencial"
          icono={<BookOpen size={20} />}
        />

        <CampoTexto
          label="Cupo maximo"
          name="cupo_maximo"
          type="number"
          value={comisionAsignatura.cupo_maximo}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: 30"
          icono={<Hash size={20} />}
        />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Estado</label>
          <select
            name="estado"
            value={comisionAsignatura.estado}
            onChange={cambiarComisionAsignatura}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        {/* Deshabilita el botón si la API está en proceso de creación */}
        <button
          type="button"
          onClick={agregarComisionAsignatura}
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition"
        >
          <PlusCircle size={22} />
          Agregar asignatura
        </button>
      </div>

      {/* Renderiza el listado de materias de la comisión */}
      <ListaItems
        items={comisionesAsignaturasCargadas}
        vacio="Todavia no agregaste asignaturas."
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {/* Regresa al paso de datos básicos de la comisión */}
        <button
          type="button"
          onClick={() => setPasoActual(1)}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
        {/* Bloqueamos el botón continuar si no hay materias registradas en la comisión */}
        <button
          type="button"
          onClick={() => setPasoActual(3)}
          disabled={comisionesAsignaturasCargadas.length === 0}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition"
        >
          <Save size={22} />
          Continuar
        </button>
      </div>
    </section>
  );
}

// Input de texto helper para PasoAsignaturasComision
function CampoTexto({ label, name, value, onChange, placeholder, type = "text", icono }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {icono && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>
  );
}

// Selector dropdown helper para PasoAsignaturasComision
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
          <p className="text-slate-800 font-extrabold">{item.nombre}</p>
          <p className="text-slate-500 font-semibold mt-1">
            {item.planAsignatura || "-"} - Aula {item.aula || "-"}
          </p>
        </div>
      ))}
    </div>
  );
}

