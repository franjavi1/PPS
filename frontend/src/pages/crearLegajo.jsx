import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  User,
  Hash,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

function NuevoLegajo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);

  const [personas, setPersonas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [errores, setErrores] = useState({});

  const [formulario, setFormulario] = useState({
    persona_id: "",
    numero: "",
    usuario_accion: 1,
  });

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setErrorGeneral("");

      const respuestaPersonas = await apiRequest("/personas");
      setPersonas(respuestaPersonas.data || []);

      if (editando) {
        const legajo = await apiRequest(`/legajos/${id}`);
        setFormulario({
          persona_id: legajo.data.persona_id || "",
          numero: legajo.data.numero || "",
          usuario_accion: legajo.data.usuario_accion || 1,
        });
      }
    } catch (err) {
      setErrorGeneral(err.message || "No se pudieron cargar los datos");
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formulario.persona_id) {
      nuevosErrores.persona_id = "Selecciona una persona";
    }

    if (String(formulario.numero).trim() === "") {
      nuevosErrores.numero = "El numero de legajo es obligatorio";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  function mostrarErroresBackend(errors) {
    const nuevosErrores = {};

    Object.entries(errors || {}).forEach(([campo, mensajes]) => {
      nuevosErrores[campo] = Array.isArray(mensajes) ? mensajes[0] : mensajes;
    });

    setErrores(nuevosErrores);
  }

  async function guardarLegajo(e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const payload = {
      persona_id: Number(formulario.persona_id),
      numero: String(formulario.numero).trim(),
      usuario_accion: Number(formulario.usuario_accion) || 1,
    };

    try {
      setGuardando(true);
      setErrorGeneral("");

      if (editando) {
        await apiRequest(`/legajos/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/legajos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      navigate("/legajos");
    } catch (err) {
      if (err.errors) {
        mostrarErroresBackend(err.errors);
      }

      setErrorGeneral(err.message || "No se pudo guardar el legajo");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate("/legajos")}
            className="flex items-center gap-2 text-slate-600 hover:text-red-700 font-semibold mb-4"
          >
            <ArrowLeft size={22} />
            Volver al listado de legajos
          </button>

          <h1 className="text-4xl font-extrabold text-slate-800">
            {editando ? "Editar legajo" : "Nuevo legajo"}
          </h1>

          <p className="text-slate-500 mt-2">
            Selecciona una persona y asignale un numero de legajo.
          </p>
        </div>

        <form
          onSubmit={guardarLegajo}
          className="bg-white rounded-2xl shadow-md border border-slate-200 p-8"
        >
          {errorGeneral && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {errorGeneral}
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Datos del legajo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CampoSelect
                label="Persona"
                name="persona_id"
                value={formulario.persona_id}
                onChange={manejarCambio}
                error={errores.persona_id}
                icono={<User size={22} />}
                opciones={personas}
              />

              <CampoTexto
                label="Numero de legajo"
                name="numero"
                value={formulario.numero}
                onChange={manejarCambio}
                error={errores.numero}
                placeholder="Ej: 1001"
                icono={<Hash size={22} />}
              />
            </div>
          </section>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/legajos")}
              className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
            >
              <Save size={22} />
              {guardando ? "Guardando..." : "Guardar legajo"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function CampoTexto({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  icono,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icono}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-14 pl-12 pr-4 border rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-slate-300 focus:ring-red-500 focus:border-red-500"
          }`}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

function CampoSelect({ label, name, value, onChange, error, icono, opciones }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icono}
        </div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full h-14 pl-12 pr-4 border rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-slate-300 focus:ring-red-500 focus:border-red-500"
          }`}
        >
          <option value="">Seleccionar persona</option>

          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.apellido}, {opcion.nombre} - DNI {opcion.numero_doc}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default NuevoLegajo;
