import { useEffect, useState } from "react";
import { BookOpen, Pencil, PlusCircle, Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { tipoPlanesService } from "../services/tipoPlanesService";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";

function TiposPlanes() {
  // Explicamos el inicio síncrono del componente y cómo consume el rol de sesión con el hook useAuth.
  const { currentUserRole } = useAuth();

  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTiposPlanes();
  }, []);

  async function cargarTiposPlanes() {
    try {
      setCargando(true);
      const respuesta = await tipoPlanesService.obtenerTodos();
      setTiposPlanes(respuesta.data || []);
    } catch (error) {
      console.error("Error al cargar tipos de plan:", error);
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() { setDescripcion(""); setEditandoId(null); }
  function editarTipo(tipo) { setDescripcion(tipo.descripcion || ""); setEditandoId(tipo.id_tipo_planes); }

  async function guardarTipo(e) {
    e.preventDefault();
    const descripcionLimpia = descripcion.trim();
    if (!descripcionLimpia) return toast.error("La descripcion es obligatoria");

    const payload = { descripcion: descripcionLimpia, usuario_accion: 1 };
    try {
      if (editandoId) {
        await tipoPlanesService.actualizar(editandoId, payload);
        toast.success("Tipo de plan actualizado");
      } else {
        await tipoPlanesService.crear(payload);
        toast.success("Tipo de plan creado");
      }
      limpiarFormulario(); await cargarTiposPlanes();
    } catch (error) {
      console.error("Error al guardar tipo de plan:", error);
    }
  }

  async function eliminarTipo(id) {
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    if (!confirm("Seguro que queres eliminar este tipo de plan?")) return;
    try {
      await tipoPlanesService.eliminar(id);
      toast.success("Tipo de plan eliminado"); await cargarTiposPlanes();
    } catch (error) {
      console.error("Error al eliminar tipo de plan:", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            <BookOpen className="text-red-700" size={34} />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">Tipos de plan</h1>
              <p className="text-slate-500 mt-1">Administra las opciones que aparecen al crear un plan.</p>
            </div>
          </div>

          <form onSubmit={guardarTipo} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Formacion Inicial" className="flex-1 h-12 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="h-12 px-5 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer"><X size={19} />Cancelar</button>
            )}
            {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
            <button type="submit" disabled={!hasPermission(currentUserRole, "crear")} className="h-12 px-6 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              {editandoId ? <Save size={20} /> : <PlusCircle size={20} />}
              {editandoId ? "Guardar" : "Agregar"}
            </button>
          </form>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700">Descripcion</th>
                  <th className="px-6 py-4 text-right text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="2" className="px-6 py-10 text-center text-slate-500">Cargando tipos de plan...</td></tr>
                ) : tiposPlanes.length > 0 ? (
                  tiposPlanes.map((tipo) => (
                    <tr key={tipo.id_tipo_planes} className="border-b border-slate-100">
                      <td className="px-6 py-4 font-semibold text-slate-800">{tipo.descripcion}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                          <button type="button" onClick={() => editarTipo(tipo)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-60"><Pencil size={17} />Editar</button>
                          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                          <button type="button" onClick={() => eliminarTipo(tipo.id_tipo_planes)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-60"><Trash2 size={17} />Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" className="px-6 py-10 text-center text-slate-500">No hay tipos de plan registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TiposPlanes;
