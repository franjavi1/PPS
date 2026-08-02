import { useEffect, useState } from "react";
import BotonVolver from "../components/BotonVolver";
import ModalConfirmar from "../components/ModalConfirmar";
import { FileText, Pencil, PlusCircle, Save, Trash2, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import useAuth from "../auth/hooks/useAuth";

function TiposDocumentos() {
  const { currentUserRole, hasPermission } = useAuth();
  const [tipos, setTipos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de borrado
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarTipos();
  }, []);

  async function cargarTipos() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await apiRequest("/tipos-documentos");
      setTipos(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los tipos de documento");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setDescripcion("");
    setEditandoId(null);
    setError("");
  }

  function editarTipo(tipo) {
    setDescripcion(tipo.descripcion);
    setEditandoId(tipo.id);
  }

  async function guardarTipo(e) {
    e.preventDefault();

    if (descripcion.trim() === "") {
      setError("La descripcion es obligatoria");
      return;
    }

    const payload = {
      descripcion: descripcion.trim().toUpperCase(),
      usuario_accion: 1,
    };

    try {
      setError("");

      if (editandoId) {
        await apiRequest(`/tipos-documentos/${editandoId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/tipos-documentos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      limpiarFormulario();
      await cargarTipos();
    } catch (err) {
      const descripcionError = err.errors?.descripcion?.[0];
      setError(descripcionError || err.message || "No se pudo guardar el tipo de documento");
    }
  }

  function solicitarEliminacion(id) {
    setIdAEliminar(id);
  }

  async function confirmarEliminacion() {
    if (!idAEliminar) return;

    try {
      setEliminando(true);
      setError("");
      await apiRequest(`/tipos-documentos/${idAEliminar}`, {
        method: "DELETE",
      });
      setIdAEliminar(null);
      await cargarTipos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el tipo de documento");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* BOTÓN VOLVER INCLUIDO AQUÍ */}
        <BotonVolver ruta="/planes" />

        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <FileText size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-slate-800">
                Tipos de documento
              </h1>

              <p className="text-slate-500 mt-2">
                Administra los tipos que despues se usan al cargar personas.
              </p>
            </div>
          </div>

          <form
            onSubmit={guardarTipo}
            className="border border-slate-200 rounded-xl p-5 mb-8"
          >
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Descripcion
            </label>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                placeholder="Ej: DNI"
                className="flex-1 h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X size={20} />
                  Cancelar
                </button>
              )}

              <button
                disabled={!hasPermission("planes.tipos_documentos.crear")}
                title={
                  hasPermission("planes.tipos_documentos.crear")
                    ? "Crear tipo de documento"
                    : "No tenés permiso para crear tipos de documentos"
                }
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                {editandoId ? <Save size={22} /> : <PlusCircle size={22} />}
                {editandoId ? "Guardar" : "Agregar"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 font-semibold mt-3">
                {error}
              </p>
            )}
          </form>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                      Cargando tipos de documento...
                    </td>
                  </tr>
                ) : tipos.length > 0 ? (
                  tipos.map((tipo) => (
                    <tr key={tipo.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {tipo.descripcion}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarTipo(tipo)}
                            disabled={!hasPermission("planes.tipos_documentos.editar")}
                            title={
                              hasPermission("planes.tipos_documentos.editar")
                                ? "Editar tipo de documento"
                                : "No tenés permiso para editar tipos de documentos"
                            }
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => solicitarEliminacion(tipo.id)}
                            disabled={!hasPermission("planes.tipos_documentos.eliminar")}
                            title={
                              hasPermission("planes.tipos_documentos.eliminar")
                                ? "Eliminar tipo de documento"
                                : "No tenés permiso para eliminar tipos de documentos"
                            }
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                      No hay tipos de documento cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      <ModalConfirmar
        isOpen={Boolean(idAEliminar)}
        titulo="Eliminar tipo de documento"
        mensaje="¿Estás seguro de que querés eliminar este tipo de documento? Esta acción no se puede deshacer."
        onConfirm={confirmarEliminacion}
        onCancel={() => setIdAEliminar(null)}
        cargando={eliminando}
      />
    </div>
  );
}

export default TiposDocumentos;