import { useState, useEffect } from "react";
import { Save, X, BookOpen, ChevronsUp, Building2, Hash, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

export default function PlanAsignaturaModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarRegistro,
  asignaturas,
  planes,
  rangos,
  sedes,
}) {
  // Declaramos el estado de control numérico para el wizard
  const [paso, setPaso] = useState(1);
  const [erroresLocales, setErroresLocales] = useState({});

  // Reiniciamos el stepper al cerrar el modal
  useEffect(() => {
    if (!mostrarModal) {
      setPaso(1);
      setErroresLocales({});
    }
  }, [mostrarModal]);

  if (!mostrarModal) return null;

  const pasos = [
    { id: 1, label: "Asociación" },
    { id: 2, label: "Criterios" },
    { id: 3, label: "Confirmación" }
  ];

  // Validación preventiva local por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!formulario.plan_id) nuevosErrores.plan_id = "El plan de estudios es requerido.";
      if (!formulario.asignatura_id) nuevosErrores.asignatura_id = "La asignatura es requerida.";
      if (!formulario.rango_minimo_id) nuevosErrores.rango_minimo_id = "El rango mínimo es requerido.";
      if (!formulario.sedes_id) nuevosErrores.sedes_id = "La sede es requerida.";
    } else if (paso === 2) {
      if (formulario.presentismo_porc === "" || isNaN(formulario.presentismo_porc)) nuevosErrores.presentismo_porc = "Indique el presentismo.";
      if (formulario.regularizacion_prom === "" || isNaN(formulario.regularizacion_prom)) nuevosErrores.regularizacion_prom = "Indique nota de regularización.";
      if (formulario.final_aprobacion === "" || isNaN(formulario.final_aprobacion)) nuevosErrores.final_aprobacion = "Indique nota de aprobación.";
      if (formulario.duracion === "" || isNaN(formulario.duracion)) nuevosErrores.duracion = "Indique duración en horas.";
      if (!formulario.regimen || !formulario.regimen.trim()) nuevosErrores.regimen = "El régimen es requerido.";
      if (!formulario.modalidad || !formulario.modalidad.trim()) nuevosErrores.modalidad = "La modalidad es requerida.";
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

  const errorCombinado = errorFormulario || Object.values(erroresLocales)[0];
  const nombrePlan = planes.find(p => String(p.id) === String(formulario.plan_id))?.nombre || "-";
  const nombreAsig = asignaturas.find(a => String(a.id) === String(formulario.asignatura_id))?.nombre || "-";
  const descRango = rangos.find(r => String(r.id) === String(formulario.rango_minimo_id))?.descripcion || "-";
  const nombreSede = sedes.find(s => String(s.id) === String(formulario.sedes_id))?.nombre || "-";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={cerrarModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition" title="Cerrar modal"><X size={24} /></button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">{editandoId ? "Editar materia de plan" : "Nueva materia de plan"}</h2>
        </div>

        {/* Stepper visual horizontal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          {pasos.map((p) => {
            const activo = paso === p.id;
            const completado = paso > p.id;
            return (
              <div key={p.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  activo ? "bg-red-700 text-white shadow-sm" : completado ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400"
                }`}>{p.id}</div>
                <span className={`text-[11px] font-bold mt-1.5 ${activo || completado ? "text-slate-800" : "text-slate-400"}`}>{p.label}</span>
              </div>
            );
          })}
        </div>

        {errorCombinado && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold text-sm">{errorCombinado}</div>}

        <form onSubmit={(e) => { e.preventDefault(); if (paso === 3) guardarRegistro(e); }} className="space-y-5">
          {paso === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoSelect label="Plan de estudios" name="plan_id" value={formulario.plan_id} onChange={manejarCambio} icon={<BookOpen size={22} />} opciones={planes} getLabel={(item) => item.nombre} />
                <CampoSelect label="Asignatura / Materia" name="asignatura_id" value={formulario.asignatura_id} onChange={manejarCambio} icon={<FileText size={22} />} opciones={asignaturas} getLabel={(item) => item.nombre} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoSelect label="Rango mínimo requerido" name="rango_minimo_id" value={formulario.rango_minimo_id} onChange={manejarCambio} icon={<ChevronsUp size={22} />} opciones={rangos} getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`} />
                <CampoSelect label="Sede de dictado" name="sedes_id" value={formulario.sedes_id} onChange={manejarCambio} icon={<Building2 size={22} />} opciones={sedes} getLabel={(item) => item.nombre} />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <CampoTexto label="Presentismo (%)" name="presentismo_porc" type="number" value={formulario.presentismo_porc} onChange={manejarCambio} placeholder="Ej: 80" icon={<Hash size={18} />} />
                <CampoTexto label="Prom. Regularizar" name="regularizacion_prom" type="number" value={formulario.regularizacion_prom} onChange={manejarCambio} placeholder="Ej: 6" icon={<Hash size={18} />} />
                <CampoTexto label="Nota Aprobación" name="final_aprobacion" type="number" value={formulario.final_aprobacion} onChange={manejarCambio} placeholder="Ej: 4" icon={<Hash size={18} />} />
                <CampoTexto label="Duración (hs)" name="duracion" type="number" value={formulario.duracion} onChange={manejarCambio} placeholder="Ej: 64" icon={<Hash size={18} />} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoTexto label="Régimen (Anual/Cuatrimestral)" name="regimen" value={formulario.regimen} onChange={manejarCambio} placeholder="Ej: Anual" />
                <CampoTexto label="Modalidad (Presencial/Distancia)" name="modalidad" value={formulario.modalidad} onChange={manejarCambio} placeholder="Ej: Presencial" />
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><span className="text-slate-400 font-bold block">Plan / Materia:</span><span className="text-slate-800 font-extrabold">{nombrePlan} - {nombreAsig}</span></div>
              <div><span className="text-slate-400 font-bold block">Sede / Rango:</span><span className="text-slate-800 font-semibold">{nombreSede} (Min: {descRango})</span></div>
              <div><span className="text-slate-400 font-bold block">Duración / Régimen:</span><span className="text-slate-800 font-semibold">{formulario.duracion}hs - {formulario.regimen}</span></div>
              <div><span className="text-slate-400 font-bold block">Aprobación / Regularidad:</span><span className="text-slate-800 font-semibold">Min Aprob: {formulario.final_aprobacion} - Min Reg: {formulario.regularizacion_prom}</span></div>
              <div><span className="text-slate-400 font-bold block">Presentismo / Modalidad:</span><span className="text-slate-800 font-semibold">{formulario.presentismo_porc}% - {formulario.modalidad}</span></div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            {paso === 1 ? (
              <button type="button" onClick={cerrarModal} className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">Cancelar</button>
            ) : (
              <button type="button" onClick={retrocederPaso} className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"><ChevronLeft size={20} />Volver</button>
            )}
            {paso < 3 ? (
              <button type="button" onClick={avanzarPaso} className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition">Siguiente<ChevronRight size={20} /></button>
            ) : (
              <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"><Save size={22} />Confirmar y Guardar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
