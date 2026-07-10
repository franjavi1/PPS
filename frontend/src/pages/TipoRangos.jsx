import { useEffect, useState } from "react";
import {
  ChevronsUp,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { rangoService } from "../services/rangoService";

const formularioInicial = {
  descripcion: "",
  nivel_jerarquia: "",
};

function TipoRangos() {
  const [rangos, setRangos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  useEffect(() => {
    cargarRangos();
  }, []);

  async function cargarRangos() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await rangoService.obtenerTodos();
      setRangos(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los tipos de rango");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevoRango() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  function cerrarModal() {
    limpiarFormulario();
    setMostrarModal(false);
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function editarRango(rango) {
    setFormulario({
      descripcion: rango.descripcion || "",
      nivel_jerarquia: rango.nivel_jerarquia || "",
    });
    setEditandoId(rango.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRango(e) {
    e.preventDefault();

    const descripcion = formulario.descripcion.trim();
    const nivelJerarquia = Number(formulario.nivel_jerarquia);

    if (!descripcion) {
      setErrorFormulario("La descripcion es obligatoria");
      return;
    }

    if (descripcion.length > 45) {
      setErrorFormulario("La descripcion debe tener hasta 45 caracteres");
      return;
    }

    if (!nivelJerarquia || nivelJerarquia <= 0) {
      setErrorFormulario("El nivel de jerarquia debe ser un numero positivo");
      return;
    }

    const payload = {
      descripcion,
      nivel_jerarquia: nivelJerarquia,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await rangoService.actualizar(editandoId, payload);
      } else {
        await rangoService.crear(payload);
      }

      cerrarModal();
      await cargarRangos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRango(id) {
    const confirmar = confirm("Seguro que queres eliminar este tipo de rango?");

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      const respuesta = await rangoService.eliminar(id);
      alert(respuesta.message || "Tipo de rango eliminado correctamente");
      await cargarRangos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  const rangosFiltrados = rangos.filter((rango) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      String(rango.descripcion || "").toLowerCase().includes(textoBusqueda) ||
      String(rango.nivel_jerarquia || "").includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <ChevronsUp size={32} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Tipo de rangos
                </h1>
                <p className="text-slate-500 mt-2">
                  Consulta y gestiona los rangos institucionales disponibles.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={cargarRangos}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                type="button"
                onClick={abrirNuevoRango}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nuevo tipo
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por descripcion o nivel"
              className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          <div className="lg:hidden space-y-4">
            {cargando ? (
              <EstadoVacio texto="Cargando tipos de rango..." />
            ) : rangosFiltrados.length > 0 ? (
              rangosFiltrados.map((rango) => (
                <TarjetaRango
                  key={rango.id}
                  rango={rango}
                  onEdit={editarRango}
                  onDelete={eliminarRango}
                />
              ))
            ) : (
              <EstadoVacio texto="No se encontraron tipos de rango." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nivel</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="3" className="px-5 py-8 text-center text-slate-500">
                      Cargando tipos de rango...
                    </td>
                  </tr>
                ) : rangosFiltrados.length > 0 ? (
                  rangosFiltrados.map((rango) => (
                    <tr key={rango.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {rango.descripcion}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        Nivel {rango.nivel_jerarquia}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editarRango(rango)}
                            className="h-10 px-3 flex items-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarRango(rango.id)}
                            className="h-10 px-3 flex items-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
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
                    <td colSpan="3" className="px-5 py-8 text-center text-slate-500">
                      No se encontraron tipos de rango.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[200] px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-xl relative">
            <button
              type="button"
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
              {editandoId ? "Editar tipo de rango" : "Nuevo tipo de rango"}
            </h2>

            {errorFormulario && (
              <div className="mb-5 border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 font-semibold">
                {errorFormulario}
              </div>
            )}

            <form onSubmit={guardarRango} className="space-y-5">
              <CampoTexto
                label="Descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                placeholder="Ej: Cabo"
              />

              <CampoTexto
                label="Nivel de jerarquia"
                name="nivel_jerarquia"
                type="number"
                value={formulario.nivel_jerarquia}
                onChange={manejarCambio}
                placeholder="Ej: 2"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
                >
                  <Save size={20} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaRango({ rango, onEdit, onDelete }) {
  return (
    <article className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase">Tipo de rango</p>
      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
        {rango.descripcion}
      </h2>
      <p className="text-slate-500 font-semibold mt-1">
        Nivel {rango.nivel_jerarquia}
      </p>

      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onEdit(rango)}
          className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
        >
          <Pencil size={16} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(rango.id)}
          className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>
    </article>
  );
}

function CampoTexto({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
      {texto}
    </div>
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo completar la operacion";
}

export default TipoRangos;
