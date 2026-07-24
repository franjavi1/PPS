import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, ChevronLeft, ChevronRight, Layout, CheckCircle2 } from "lucide-react";
import { CampoTexto, TituloPaso } from "../FormHelpers";
import { tipoSedeService } from "../../services/tipoSedeService";
import { sedeService } from "../../services/sedeService";
import { hasPermission } from "../../utils/authHelper";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function TiposSedesPanel({ currentUserRole }) {
  const [tiposSedes, setTiposSedes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "" });
  const [error, setError] = useState({});

  // Control numérico para el wizard del modal simple
  const [paso, setPaso] = useState(1);
  const [erroresLocales, setErroresLocales] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!mostrarModal) {
      setPaso(1);
      setErroresLocales({});
    }
  }, [mostrarModal]);

  async function cargarDatos() {
    try {
      const [resTipos, resSedes] = await Promise.all([
        tipoSedeService.obtenerTodas(),
        sedeService.obtenerTodas(),
      ]);
      setTiposSedes(resTipos.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      console.error("Error al cargar datos en TiposSedesPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.descripcion.trim()) {
        nuevosErrores.descripcion = "La descripción es requerida.";
      } else {
        const duplicado = tiposSedes.some(
          (t) =>
            t.descripcion.toLowerCase() === form.descripcion.trim().toLowerCase() &&
            t.id !== form.id
        );
        if (duplicado) {
          nuevosErrores.descripcion = "Ya existe un tipo de sede con esa descripción.";
        }
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
    } else {
      setErroresLocales({});
      setPaso(2);
    }
  }

  function retrocederPaso() {
    setErroresLocales({});
    setPaso(1);
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      let response;
      const payload = { descripcion: form.descripcion.trim(), usuario_accion: 1 };
      if (modoEdicion) {
        response = await tipoSedeService.actualizar(form.id, payload);
      } else {
        response = await tipoSedeService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar tipo de sede.");
        return;
      }
      alert(response.message || "Tipo de sede guardado con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar tipo de sede:", err);
      if (err && err.errors) {
        setError(err.errors);
      }
      alert((err && err.message) || "Error al procesar la solicitud.");
    }
  }

  async function eliminar(id) {
    const enUso = sedes.some((s) => s.tipo_sede_id === id);
    if (enUso) {
      alert("No es posible eliminar el tipo de sede. Existen sedes asociadas a este tipo.");
      return;
    }
    if (confirm("¿Confirma la eliminación de este registro de tipo de sede?")) {
      try {
        const response = await tipoSedeService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Tipo de sede eliminado con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar tipo de sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, descripcion: "" });
    setError({});
    setModoEdicion(false);
  }

  function editar(tipo) {
    setForm({ id: tipo.id, descripcion: tipo.descripcion });
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  const tieneSedesAsociadas = (id) => sedes.some((s) => s.tipo_sede_id === id);

  const columnasConfig = [
    { clave: "descripcion", titulo: "Descripción" },
  ];

  const accionesPorFila = (tipo) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(tipo)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(tipo.id)} disabled={tieneSedesAsociadas(tipo.id) || !hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1" title={tieneSedesAsociadas(tipo.id) ? "No se puede eliminar: existen sedes asociadas" : "Eliminar Tipo de Sede"}>
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  const errorCombinado = { ...error, ...erroresLocales };
  const pasos = [{ id: 1, label: "Formulario" }, { id: 2, label: "Confirmación" }];

  if (mostrarModal) {
    const wizardPasos = [
      { id: 1, label: "Formulario", icono: Layout },
      { id: 2, label: "Confirmación", icono: CheckCircle2 }
    ];
    return (
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shadow-xs">
              <Layout size={28} />
            </div>
            <div>
              <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {modoEdicion ? "Editar Tipo de Sede" : "Alta de Nuevo Tipo de Sede"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {modoEdicion ? "Modifica la descripción del tipo de sede." : "Registra un nuevo tipo de sede en el sistema completando los pasos."}
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
          {wizardPasos.map((p) => {
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
        <form onSubmit={(e) => { e.preventDefault(); if (paso === 2) guardar(e); }} className="space-y-6">
          {/* Paso 1: Formulario */}
          {paso === 1 && (
            <div className="space-y-6">
              <TituloPaso icono={<Layout size={26} />} titulo="Datos del Tipo de Sede" />
              <div>
                <CampoTexto
                  label="Descripción *"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Ej: Central"
                  error={errorCombinado.descripcion}
                />
              </div>
            </div>
          )}

          {/* Paso 2: Confirmación */}
          {paso === 2 && (
            <div className="space-y-6">
              <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Confirmación de Datos" />
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <p className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-2">Resumen del registro</p>
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Descripción</p>
                  <p className="text-slate-800 font-extrabold mt-1 text-base">{form.descripcion}</p>
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

            {paso < 2 ? (
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

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Tipos de Sede</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Tipo
          </button>
        )}
      </div>

      <TablaPrincipal data={tiposSedes} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar tipos de sede..." />
    </div>
  );
}
