import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { personaService } from "../services/personaService";
import { tipoDocumentoService } from "../services/tipoDocumentoService";

function Legajos() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resPersonas, resTipos] = await Promise.all([
        personaService.obtenerTodas(),
        tipoDocumentoService.obtenerTodos(),
      ]);
      setPersonas(resPersonas.data || []);
      setTiposDocumento(resTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos");
    } finally {
      setCargando(false);
    }
  }

  async function eliminarPersona(id) {
    const confirmar = confirm("¿Seguro que querés eliminar esta persona?");

    if (!confirmar) {
      return;
    }

    try {
      const response = await personaService.eliminar(id);
      if (response.status === "error") {
        alert(response.message);
        return;
      }
      await cargarDatos();
    } catch (err) {
      alert(err.message || "No se pudo eliminar la persona");
    }
  }

  function obtenerNombreTipoDocumento(id) {
    const encontrado = tiposDocumento.find((td) => td.id === id);
    return encontrado ? encontrado.nombre : `ID: ${id}`;
  }

  const personasFiltradas = personas.filter((persona) => {
    const textoBusqueda = busqueda.toLowerCase();
    const documento = String(persona.numero_doc || "");

    return (
      persona.nombre.toLowerCase().includes(textoBusqueda) ||
      persona.apellido.toLowerCase().includes(textoBusqueda) ||
      documento.includes(textoBusqueda) ||
      String(persona.id).includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800">
                Legajos de Personas
              </h1>

              <p className="text-slate-500 mt-2">
                Consulta, busca y gestiona las personas cargadas en el sistema.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarDatos}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={() => navigate("/crearLegajo")}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nueva persona
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
              placeholder="Buscar por nombre, apellido, documento o ID"
              className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">ID</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Apellido</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo doc.</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      Cargando personas...
                    </td>
                  </tr>
                ) : personasFiltradas.length > 0 ? (
                  personasFiltradas.map((persona) => (
                    <tr
                      key={persona.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 text-slate-700">{persona.id}</td>
                      <td className="px-5 py-5 text-slate-700">{persona.nombre}</td>
                      <td className="px-5 py-5 text-slate-700">{persona.apellido}</td>
                      <td className="px-5 py-5 text-slate-700">{persona.numero_doc}</td>
                      <td className="px-5 py-5 text-slate-700">
                        <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                          {obtenerNombreTipoDocumento(persona.td_id)}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={persona.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => navigate(`/legajos/${persona.id}`)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Eye size={18} />
                            Ver
                          </button>

                          <button
                            onClick={() => navigate(`/legajos/${persona.id}/editar`)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarPersona(persona.id)}
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800"
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
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron personas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 bg-white">
              <p className="text-slate-500">
                Mostrando {personasFiltradas.length} de {personas.length} personas
              </p>

              <div className="flex items-center gap-2">
                <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                  <ChevronLeft size={20} />
                </button>

                <button className="w-10 h-10 bg-red-700 text-white rounded-lg font-bold">
                  1
                </button>

                <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function EstadoBadge({ estado }) {
  if (estado === 1) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Activo
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      Inactivo
    </span>
  );
}

export default Legajos;
