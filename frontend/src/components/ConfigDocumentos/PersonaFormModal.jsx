import { useState, useEffect } from "react";
import { PlusCircle, ChevronRight, ChevronLeft, User, CreditCard, CheckCircle2 } from "lucide-react";
import { CampoTexto, CampoSelect, TituloPaso } from "../FormHelpers";

export default function PersonaFormModal({
  mostrarModal,
  setMostrarModal,
  modoEdicion,
  form,
  error,
  tiposDocumento,
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
    { id: 1, label: "Identidad", icono: User },
    { id: 2, label: "Documentación", icono: CreditCard },
    { id: 3, label: "Resumen", icono: CheckCircle2 }
  ];

  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.nombre || !form.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido.";
      if (!form.apellido || !form.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido.";
    } else if (paso === 2) {
      if (!form.tipoDocumentoId) nuevosErrores.tipoDocumentoId = "Debe seleccionar un tipo de documento.";
      if (!form.documento || !form.documento.trim()) nuevosErrores.documento = "El número de documento es requerido.";
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
  const descripcionTipoDoc = tiposDocumento.find(t => String(t.id) === String(form.tipoDocumentoId))?.descripcion || "-";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shadow-xs">
            <User size={28} />
          </div>
          <div>
            <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {modoEdicion ? "Editar Persona" : "Alta de Nueva Persona"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {modoEdicion ? "Modifica los datos personales y de documentación." : "Registra una nueva persona en el sistema completando los pasos."}
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
        {/* Paso 1: Identidad */}
        {paso === 1 && (
          <div className="space-y-6">
            <TituloPaso icono={<User size={26} />} titulo="Datos de la persona" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CampoTexto
                label="Nombre *"
                name="nombre"
                value={form.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Juan Pablo"
                icon={<User size={18} />}
                error={errorCombinado.nombre}
              />
              <CampoTexto
                label="Apellido *"
                name="apellido"
                value={form.apellido}
                onChange={manejarCambio}
                placeholder="Ej: González"
                icon={<User size={18} />}
                error={errorCombinado.apellido}
              />
            </div>
          </div>
        )}

        {/* Paso 2: Documentación */}
        {paso === 2 && (
          <div className="space-y-6">
            <TituloPaso icono={<CreditCard size={26} />} titulo="Documentación de la persona" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CampoSelect
                label="Tipo de Documento *"
                name="tipoDocumentoId"
                value={form.tipoDocumentoId}
                onChange={manejarCambio}
                opciones={tiposDocumento}
                getLabel={(td) => td.descripcion}
                icon={<CreditCard size={18} />}
                error={errorCombinado.tipoDocumentoId}
              />
              <CampoTexto
                label="Nro. Documento *"
                name="documento"
                value={form.documento}
                onChange={manejarCambio}
                placeholder="Ej: 12345678"
                error={errorCombinado.documento}
              />
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
                  <p className="text-xs font-bold text-slate-400 uppercase">Nombre Completo</p>
                  <p className="text-slate-800 font-extrabold mt-1 text-base">{form.apellido}, {form.nombre}</p>
                </div>
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Tipo Documento</p>
                  <p className="text-slate-800 font-semibold mt-1 text-base">{descripcionTipoDoc}</p>
                </div>
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Nro. Documento</p>
                  <p className="text-slate-800 font-semibold mt-1 text-base">{form.documento}</p>
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
