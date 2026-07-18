import { useState, useEffect } from "react";
import { PlusCircle, ChevronRight, ChevronLeft, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { CampoTexto, CampoSelect, TituloPaso } from "../FormHelpers";

export default function SedeFormModal({
  mostrarModal,
  setMostrarModal,
  modoEdicion,
  form,
  error,
  tiposSedes,
  manejarCambio,
  guardar,
  limpiarForm
}) {
  const [paso, setPaso] = useState(1);
  const [erroresLocales, setErroresLocales] = useState({});

  useEffect(() => {
    if (!mostrarModal) {
      setPaso(1);
      setErroresLocales({});
    }
  }, [mostrarModal]);

  if (!mostrarModal) return null;

  const pasos = [
    { id: 1, label: "Datos Básicos", icono: Building2 },
    { id: 2, label: "Ubicación", icono: MapPin },
    { id: 3, label: "Confirmación", icono: CheckCircle2 }
  ];

  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.tipo_sede_id) nuevosErrores.tipo_sede_id = "El tipo de sede es requerido.";
      if (!form.nombre || !form.nombre.trim()) nuevosErrores.nombre = "El nombre de la sede es requerido.";
    } else if (paso === 2) {
      if (!form.direccion || !form.direccion.trim()) nuevosErrores.direccion = "La dirección de la sede es requerida.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
    } else {
      setErroresLocales({});
      setPaso(paso + 1);
    }
  }

  function retrocederPaso() {
    setErroresLocales({});
    setPaso(paso - 1);
  }

  const errorCombinado = { ...error, ...erroresLocales };
  const nombreTipoSede = tiposSedes.find(t => String(t.id) === String(form.tipo_sede_id))?.descripcion || "-";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shadow-xs">
            <Building2 size={28} />
          </div>
          <div>
            <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {modoEdicion ? "Editar Sede" : "Alta de Nueva Sede"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {modoEdicion ? "Modifica los datos y ubicación de la sede." : "Registra una nueva sede en el sistema completando los pasos."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { limpiarForm(); setMostrarModal(false); }}
          className="border border-slate-300 px-4 py-2 rounded-xl text-slate-700 text-sm font-semibold bg-white hover:bg-slate-50 transition"
        >
          ← Volver al listado
        </button>
      </div>

      {/* Stepper Horizontal */}
      <div className="flex items-center justify-between mb-10 relative px-4">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
        {pasos.map((p) => {
          const activo = paso === p.id;
          const completado = paso > p.id;
          const Icono = p.icono;
          return (
            <div key={p.id} className="flex flex-col items-center flex-1 relative bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                activo || completado ? "bg-red-700 text-white shadow-md scale-110" : "bg-slate-100 border border-slate-200 text-slate-400"
              }`}>
                <Icono size={18} />
              </div>
              <span className={`text-[10px] mt-2 font-bold transition-colors duration-300 ${
                activo || completado ? "text-red-700 font-extrabold" : "text-slate-500"
              }`}>
                {p.id}. {p.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cuerpo del Formulario */}
      <form onSubmit={(e) => { e.preventDefault(); if (paso === 3) guardar(e); }} className="space-y-6">
        {/* Paso 1: Datos Básicos */}
        {paso === 1 && (
          <div className="space-y-6">
            <TituloPaso icono={<Building2 size={26} />} titulo="Datos Básicos" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CampoSelect
                label="Tipo de Sede *"
                name="tipo_sede_id"
                value={form.tipo_sede_id}
                onChange={manejarCambio}
                opciones={tiposSedes}
                getLabel={(t) => t.descripcion}
                error={errorCombinado.tipo_sede_id}
              />
              <CampoTexto
                label="Nombre de la Sede *"
                name="nombre"
                value={form.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Cuartel Central"
                error={errorCombinado.nombre}
              />
            </div>
          </div>
        )}

        {/* Paso 2: Ubicación */}
        {paso === 2 && (
          <div className="space-y-6">
            <TituloPaso icono={<MapPin size={26} />} titulo="Ubicación de la Sede" />
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Dirección *</label>
              <textarea
                name="direccion"
                value={form.direccion || ""}
                onChange={manejarCambio}
                placeholder="Dirección completa"
                className={`w-full border rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px] ${
                  errorCombinado.direccion ? "border-red-500 focus:ring-red-500" : "border-slate-300"
                }`}
              />
              {errorCombinado.direccion && <p className="text-red-600 text-sm mt-2">{errorCombinado.direccion}</p>}
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {paso === 3 && (
          <div className="space-y-6">
            <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Confirmación de Datos" />
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <p className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-2">Resumen del registro</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Tipo Sede</p>
                  <p className="text-slate-800 font-extrabold mt-1 text-base">{nombreTipoSede}</p>
                </div>
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Nombre</p>
                  <p className="text-slate-800 font-semibold mt-1 text-base">{form.nombre}</p>
                </div>
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Dirección</p>
                  <p className="text-slate-800 font-semibold mt-1 text-base">{form.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botonera de control de navegación */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          {paso === 1 ? (
            <button
              type="button"
              onClick={() => { limpiarForm(); setMostrarModal(false); }}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={retrocederPaso}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <ChevronLeft size={16} />
              Volver
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              onClick={avanzarPaso}
              className="px-8 py-3 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition flex items-center justify-center gap-1.5"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition flex items-center justify-center gap-1.5"
            >
              <PlusCircle size={18} />
              Confirmar y Guardar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
