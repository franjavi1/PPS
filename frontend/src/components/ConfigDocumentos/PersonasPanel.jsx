import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, User, CreditCard } from "lucide-react";
import { personaService } from "../../services/personaService";
import { tipoDocumentoService } from "../../services/tipoDocumentoService";
import { hasPermission } from "../../utils/authHelper";

export default function PersonasPanel({ currentUserRole }) {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", apellido: "", tipoDocumentoId: "", documento: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [resPersonas, resTipos] = await Promise.all([
        personaService.obtenerTodas(),
        tipoDocumentoService.obtenerTodos(),
      ]);
      const personasMapeadas = (resPersonas.data || []).map((p) => ({
        ...p,
        tipoDocumentoId: p.td_id,
        documento: p.numero_doc,
      }));
      setPersonas(personasMapeadas);
      setTiposDocumento(resTipos.data || []);
    } catch (err) {
      console.error("Error al cargar datos en PersonasPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) {
      errores.nombre = "El nombre es requerido.";
    }
    if (!form.apellido.trim()) {
      errores.apellido = "El apellido es requerido.";
    }
    if (!form.tipoDocumentoId) {
      errores.tipoDocumentoId = "Debe seleccionar un tipo de documento.";
    }
    if (!form.documento.trim()) {
      errores.documento = "El número de documento es requerido.";
    }
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;

    try {
      let response;
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        td_id: Number(form.tipoDocumentoId),
        numero_doc: form.documento,
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await personaService.actualizar(form.id, payload);
      } else {
        response = await personaService.crear(payload);
      }

      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar persona.");
        return;
      }

      alert(response.message || "Persona guardada con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar persona:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(p) {
    setForm(p);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    if (confirm("¿Confirma la eliminación de este registro de persona?")) {
      try {
        const response = await personaService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Persona eliminada con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar persona:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", apellido: "", tipoDocumentoId: "", documento: "" });
    setError({});
    setModoEdicion(false);
  }

  const obtenerNombreTipoDocumento = (id) => tiposDocumento.find((t) => t.id === id)?.descripcion || "-";

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Registros de Personas
        </h2>
        {hasPermission(currentUserRole, "crear") && (
          <button
            onClick={() => {
              limpiarForm();
              setMostrarModal(true);
            }}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Persona
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Nombre Completo</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Tipo Doc.</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Nro. Documento</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.length > 0 ? (
              personas.map((p) => (
                <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 font-semibold">{p.apellido}, {p.nombre}</td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                      {obtenerNombreTipoDocumento(p.tipoDocumentoId || p.td_id)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{p.documento || p.numero_doc}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => editar(p)}
                        disabled={!hasPermission(currentUserRole, "editar")}
                        className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        disabled={!hasPermission(currentUserRole, "eliminar")}
                        className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "eliminar") ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400">
                  No se registran personas en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                limpiarForm();
                setMostrarModal(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {modoEdicion ? "Editar Persona" : "Nueva Persona"}
              </h2>
            </div>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej: Juan Pablo"
                    className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                      error.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                    }`}
                  />
                </div>
                {error.nombre && (
                  <p className="text-red-600 text-xs mt-1">{error.nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Apellido *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={manejarCambio}
                    placeholder="Ej: González"
                    className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                      error.apellido ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                    }`}
                  />
                </div>
                {error.apellido && (
                  <p className="text-red-600 text-xs mt-1">{error.apellido}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Documento *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    name="tipoDocumentoId"
                    value={form.tipoDocumentoId}
                    onChange={manejarCambio}
                    className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                      error.tipoDocumentoId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                    }`}
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposDocumento.map((td) => (
                      <option key={td.id} value={td.id}>
                        {td.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                {error.tipoDocumentoId && (
                  <p className="text-red-600 text-xs mt-1">{error.tipoDocumentoId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nro. Documento *</label>
                <input
                  type="text"
                  name="documento"
                  value={form.documento}
                  onChange={manejarCambio}
                  placeholder="Ej: 12345678"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.documento ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.documento && (
                  <p className="text-red-600 text-xs mt-1">{error.documento}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    limpiarForm();
                    setMostrarModal(false);
                  }}
                  className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  {modoEdicion ? "Guardar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
