import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, ChevronLeft, ChevronRight, Shield, CheckCircle2 } from "lucide-react";
import { CampoTexto, TituloPaso } from "../FormHelpers";
import { rangoService } from "../../services/rangoService";
import { hasPermission } from "../../utils/authHelper";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function RangoPanel({ currentUserRole }) {
  const [rangos, setRangos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "", nivelPrioridad: "" });
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
      const res = await rangoService.obtenerTodos();
      const rangosMapeados = (res.data || []).map((r) => ({
        ...r,
        nivelPrioridad: r.nivel_jerarquia ?? r.nivel_prioridad,
      }));
      setRangos(rangosMapeados);
    } catch (err) {
      console.error("Error al cargar datos en RangoPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "nivelPrioridad" ? parseInt(value, 10) || "" : value });
  }

  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.descripcion.trim()) nuevosErrores.descripcion = "La denominación es requerida.";
      if (form.nivelPrioridad === "" || isNaN(form.nivelPrioridad) || form.nivelPrioridad <= 0) {
        nuevosErrores.nivelPrioridad = "El nivel debe ser un número entero positivo.";
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
      const payload = {
        descripcion: form.descripcion,
        nivel_jerarquia: form.nivelPrioridad,
        usuario_accion: 1,
      };
      if (modoEdicion) {
        response = await rangoService.actualizar(form.id, payload);
      } else {
        response = await rangoService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar rango.");
        return;
      }
      alert(response.message || "Rango guardado con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar rango:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(rg) {
    setForm(rg);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    if (confirm("¿Confirma la eliminación de este registro de rango?")) {
      try {
        const response = await rangoService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Rango eliminado con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar rango:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, descripcion: "", nivelPrioridad: "" });
    setError({});
    setModoEdicion(false);
  }

  const columnasConfig = [
    { clave: "descripcion", titulo: "Denominación Oficial" },
    {
      clave: "nivelPrioridad",
      titulo: "Nivel Prioridad",
      renderizar: (rg) => (
        <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
          Nivel {rg.nivelPrioridad}
        </span>
      ),
    },
  ];

  const accionesPorFila = (rg) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(rg)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(rg.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  const errorCombinado = { ...error, ...erroresLocales };
  const pasos = [{ id: 1, label: "Formulario" }, { id: 2, label: "Confirmación" }];

  if (mostrarModal) {
    const wizardPasos = [
      { id: 1, label: "Formulario", icono: Shield },
      { id: 2, label: "Confirmación", icono: CheckCircle2 }
    ];
    return (
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shadow-xs">
              <Shield size={28} />
            </div>
            <div>
              <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {modoEdicion ? "Editar Rango" : "Alta de Nuevo Rango"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {modoEdicion ? "Modifica la denominación y prioridad del rango." : "Registra un nuevo rango institucional completando los pasos."}
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
              <TituloPaso icono={<Shield size={26} />} titulo="Datos del Rango" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CampoTexto
                  label="Denominación Oficial *"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Ej: Oficial Principal"
                  error={errorCombinado.descripcion}
                />
                <CampoTexto
                  label="Nivel de Prioridad (Jerarquía) *"
                  name="nivelPrioridad"
                  type="number"
                  value={form.nivelPrioridad}
                  onChange={manejarCambio}
                  placeholder="Ej: 1"
                  min="1"
                  error={errorCombinado.nivelPrioridad}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="border border-slate-200 rounded-xl bg-white p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Denominación</p>
                    <p className="text-slate-800 font-extrabold mt-1 text-base">{form.descripcion}</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl bg-white p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Nivel Prioridad</p>
                    <p className="text-slate-800 font-semibold mt-1 text-base">Nivel {form.nivelPrioridad}</p>
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
        <h2 className="text-xl font-bold text-slate-800">Registros de Rangos Jerárquicos</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Rango
          </button>
        )}
      </div>

      <TablaPrincipal data={rangos} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar rangos..." />
    </div>
  );
}
