import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { tipoDocumentoService } from "../../services/tipoDocumentoService";
import { personaService } from "../../services/personaService";
import { hasPermission } from "../../utils/authHelper";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function TipoDocumentoPanel({ currentUserRole }) {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [personas, setPersonas] = useState([]);
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
      const [resTDocs, resPers] = await Promise.all([
        tipoDocumentoService.obtenerTodos(),
        personaService.obtenerTodas(),
      ]);
      setTiposDocumento(resTDocs.data || []);
      setPersonas(resPers.data || []);
    } catch (err) {
      console.error("Error al cargar datos en TipoDocumentoPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.descripcion.trim()) nuevosErrores.descripcion = "La descripción es requerida.";
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
      const payload = { descripcion: form.descripcion, usuario_accion: 1 };
      if (modoEdicion) {
        response = await tipoDocumentoService.actualizar(form.id, payload);
      } else {
        response = await tipoDocumentoService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar tipo de documento.");
        return;
      }
      alert(response.message || "Tipo de documento guardado con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar tipo de documento:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  async function eliminar(id) {
    const enUso = personas.some((p) => p.td_id === id || p.tipoDocumentoId === id);
    if (enUso) {
      alert("No es posible eliminar el tipo de documento. Existen personas registradas asociadas al mismo.");
      return;
    }
    if (confirm("¿Confirma la eliminación de este registro de tipo de documento?")) {
      try {
        const response = await tipoDocumentoService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Tipo de documento eliminado con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar tipo de documento:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, descripcion: "" });
    setError({});
    setModoEdicion(false);
  }

  const estaAsociado = (id) => personas.some((p) => p.td_id === id || p.tipoDocumentoId === id);

  const columnasConfig = [
    { clave: "descripcion", titulo: "Descripción" },
  ];

  const accionesPorFila = (td) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(td)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(td.id)} disabled={!hasPermission(currentUserRole, "eliminar") || estaAsociado(td.id)} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1" title={estaAsociado(td.id) ? "No se puede eliminar: tiene personas asociadas" : "Eliminar Tipo de Doc."}>
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  const errorCombinado = { ...error, ...erroresLocales };
  const pasos = [{ id: 1, label: "Formulario" }, { id: 2, label: "Confirmación" }];

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Tipos de Documento</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Tipo de Doc.
          </button>
        )}
      </div>

      <TablaPrincipal data={tiposDocumento} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar tipos de documento..." />

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => { limpiarForm(); setMostrarModal(false); }} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition" title="Cerrar modal"><X size={20} /></button>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-800">{modoEdicion ? "Editar Tipo de Doc." : "Nuevo Tipo de Doc."}</h2>
            </div>

            {/* Stepper visual horizontal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              {pasos.map((p) => {
                const activo = paso === p.id;
                const completado = paso > p.id;
                return (
                  <div key={p.id} className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      activo ? "bg-red-700 text-white shadow-sm" : completado ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400"
                    }`}>{p.id}</div>
                    <span className={`text-[10px] font-bold mt-1.5 ${activo || completado ? "text-slate-800" : "text-slate-400"}`}>{p.label}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (paso === 2) guardar(e); }} className="space-y-5">
              {paso === 1 && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descripción *</label>
                  <input type="text" name="descripcion" value={form.descripcion} onChange={manejarCambio} placeholder="Ej: DNI, Pasaporte" className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${errorCombinado.descripcion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"}`} />
                  {errorCombinado.descripcion && <p className="text-red-600 text-xs mt-1">{errorCombinado.descripcion}</p>}
                </div>
              )}

              {paso === 2 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del registro</p>
                  <div><span className="text-slate-400 font-bold block">Descripción:</span><span className="text-slate-800 font-extrabold">{form.descripcion}</span></div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {paso === 1 ? (
                  <button type="button" onClick={() => { limpiarForm(); setMostrarModal(false); }} className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition">Cancelar</button>
                ) : (
                  <button type="button" onClick={retrocederPaso} className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"><ChevronLeft size={16} />Volver</button>
                )}
                {paso < 2 ? (
                  <button type="button" onClick={avanzarPaso} className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-1.5">Siguiente<ChevronRight size={16} /></button>
                ) : (
                  <button type="submit" className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"><PlusCircle size={18} />Guardar</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
