import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  User,
  CreditCard,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

function NuevoLegajo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [errores, setErrores] = useState({});

  const [formulario, setFormulario] = useState({
    td_id: "",
    nombre: "",
    apellido: "",
    numero_doc: "",
    usuario_accion: 1,
  });

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setErrorGeneral("");

      const tipos = await apiRequest("/tipos-documentos");
      setTiposDocumento(tipos.data || []);

      if (editando) {
        const persona = await apiRequest(`/personas/${id}`);
        setFormulario({
          td_id: persona.data.td_id || "",
          nombre: persona.data.nombre || "",
          apellido: persona.data.apellido || "",
          numero_doc: persona.data.numero_doc || "",
          usuario_accion: persona.data.usuario_accion || 1,
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
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{1,100}$/;

    if (!formulario.td_id) {
      nuevosErrores.td_id = "Selecciona un tipo de documento";
    }

    if (formulario.nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (!regexNombre.test(formulario.nombre)) {
      nuevosErrores.nombre = "El nombre solo puede contener letras";
    }

    if (formulario.apellido.trim() === "") {
      nuevosErrores.apellido = "El apellido es obligatorio";
    } else if (!regexNombre.test(formulario.apellido)) {
      nuevosErrores.apellido = "El apellido solo puede contener letras";
    }

    if (String(formulario.numero_doc).trim() === "") {
      nuevosErrores.numero_doc = "El documento es obligatorio";
    } else if (Number(formulario.numero_doc) <= 0) {
      nuevosErrores.numero_doc = "El documento debe ser positivo";
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

  async function guardarPersona(e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const payload = {
      td_id: Number(formulario.td_id),
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      numero_doc: Number(formulario.numero_doc),
      usuario_accion: Number(formulario.usuario_accion) || 1,
    };

    try {
      setGuardando(true);
      setErrorGeneral("");

      if (editando) {
        await apiRequest(`/personas/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/personas", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      navigate("/legajos");
    } catch (err) {
      if (err.errors) {
        mostrarErroresBackend(err.errors);
      }

      setErrorGeneral(err.message || "No se pudo guardar la persona");
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
            Volver al listado
          </button>

          <h1 className="text-4xl font-extrabold text-slate-800">
            {editando ? "Editar persona" : "Nueva persona"}
          </h1>

          <p className="text-slate-500 mt-2">
            Carga los datos principales para el registro.
          </p>
        </div>

        <form
          onSubmit={guardarPersona}
          className="bg-white rounded-2xl shadow-md border border-slate-200 p-8"
        >
          {errorGeneral && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {errorGeneral}
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Datos personales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CampoSelect
                label="Tipo de documento"
                name="td_id"
                value={formulario.td_id}
                onChange={manejarCambio}
                error={errores.td_id}
                icono={<Shield size={22} />}
                opciones={tiposDocumento}
              />

              <CampoTexto
                label="Numero de documento"
                name="numero_doc"
                value={formulario.numero_doc}
                onChange={manejarCambio}
                error={errores.numero_doc}
                placeholder="Ej: 32456789"
                icono={<CreditCard size={22} />}
                type="number"
              />

              <CampoTexto
                label="Nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                error={errores.nombre}
                placeholder="Ej: Juan"
                icono={<User size={22} />}
              />

              <CampoTexto
                label="Apellido"
                name="apellido"
                value={formulario.apellido}
                onChange={manejarCambio}
                error={errores.apellido}
                placeholder="Ej: Perez"
                icono={<User size={22} />}
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
              {guardando ? "Guardando..." : "Guardar persona"}
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
          <option value="">Seleccionar</option>

          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.descripcion}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default NuevoLegajo;
