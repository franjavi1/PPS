import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft, Save, User, Hash, ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { CampoTexto, CampoSelect } from "../components/FormHelpers";

export default function NuevoLegajo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const editando = Boolean(id);
  const esVer = editando && !location.pathname.endsWith("/editar");

  // Declaramos el estado de control numérico para el wizard
  const [paso, setPaso] = useState(1);
  const [personas, setPersonas] = useState([]);
  const [tiposLegajo, setTiposLegajo] = useState([]);
  const [tiposLegajoSeleccionados, setTiposLegajoSeleccionados] = useState([]);
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
      const [respuestaPersonas, respuestaTLegajos] = await Promise.all([
        apiRequest("/personas"),
        apiRequest("/tipos-legajo"),
      ]);
      setPersonas(respuestaPersonas.data || []);
      setTiposLegajo(respuestaTLegajos.data || []);

      if (editando) {
        const legajo = await apiRequest(`/legajos/${id}`);
        setFormulario({
          persona_id: legajo.data.persona_id || "",
          numero: legajo.data.numero || "",
          usuario_accion: legajo.data.usuario_accion || 1,
        });
        setTiposLegajoSeleccionados((legajo.data.tipos_legajo || []).map(t => t.id));
      }
    } catch (err) {
      setErrorGeneral(err.message || "No se pudieron cargar los datos");
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function handleTipoLegajoChange(tid) {
    setTiposLegajoSeleccionados((prev) =>
      prev.includes(tid) ? prev.filter((id) => id !== tid) : [...prev, tid]
    );
  }

  // Validación preventiva local por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!formulario.persona_id) nuevosErrores.persona_id = "Selecciona una persona";
    } else if (paso === 2) {
      if (String(formulario.numero).trim() === "") nuevosErrores.numero = "El numero de legajo es obligatorio";
      if (tiposLegajoSeleccionados.length === 0) nuevosErrores.tipos_legajo = "Debe seleccionar al menos un tipo de legajo";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
    } else {
      setErrores({});
      setPaso(paso + 1);
    }
  }

  function retrocederPaso() {
    setErrores({});
    setPaso(paso - 1);
  }

  async function guardarLegajo(e) {
    e.preventDefault();
    const payload = {
      persona_id: Number(formulario.persona_id),
      numero: String(formulario.numero).trim(),
      usuario_accion: Number(formulario.usuario_accion) || 1,
      tipo_legajo_ids: tiposLegajoSeleccionados,
    };

    try {
      setGuardando(true);
      setErrorGeneral("");

      if (editando) {
        await apiRequest(`/legajos/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiRequest("/legajos", { method: "POST", body: JSON.stringify(payload) });
      }
      navigate("/legajos");
    } catch (err) {
      setErrorGeneral(err.message || "No se pudo guardar el legajo");
    } finally {
      setGuardando(false);
    }
  }

  const personaSeleccionada = personas.find(p => String(p.id) === String(formulario.persona_id));
  const etiquetaPersona = personaSeleccionada ? `${personaSeleccionada.apellido}, ${personaSeleccionada.nombre} - DNI ${personaSeleccionada.numero_doc}` : "-";
  const pasos = [{ id: 1, label: "Selección" }, { id: 2, label: "Identificador" }, { id: 3, label: "Confirmación" }];

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button onClick={() => navigate("/legajos")} className="flex items-center gap-2 text-slate-600 hover:text-red-700 font-semibold mb-4">
            <ArrowLeft size={22} /> Volver al listado de legajos
          </button>
          <h1 className="text-4xl font-extrabold text-slate-800">{editando ? "Editar legajo" : "Nuevo legajo"}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          {/* Stepper visual horizontal */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            {pasos.map((p) => {
              const activo = paso === p.id;
              const completado = paso > p.id;
              return (
                <div key={p.id} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    activo ? "bg-red-700 text-white shadow-sm" : completado ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {p.id}
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 ${activo || completado ? "text-slate-800" : "text-slate-400"}`}>{p.label}</span>
                </div>
              );
            })}
          </div>

          {errorGeneral && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{errorGeneral}</div>}

          <form onSubmit={(e) => { e.preventDefault(); if (paso === 3) guardarLegajo(e); }} className="space-y-6">
            {paso === 1 && (
              <CampoSelect
                label="Persona"
                name="persona_id"
                value={formulario.persona_id}
                onChange={manejarCambio}
                error={errores.persona_id}
                icon={<User size={22} />}
                opciones={personas}
                disabled={esVer}
                getLabel={(opt) => `${opt.apellido}, ${opt.nombre} - DNI ${opt.numero_doc}`}
              />
            )}

            {paso === 2 && (
              <div className="space-y-6">
                <CampoTexto
                  label="Numero de legajo"
                  name="numero"
                  value={formulario.numero}
                  onChange={manejarCambio}
                  error={errores.numero}
                  placeholder="Ej: 1001"
                  icon={<Hash size={22} />}
                  disabled={esVer}
                />

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-base font-extrabold text-slate-800 mb-3">Tipos de Legajo *</h3>
                  {errores.tipos_legajo && <p className="text-red-500 text-xs font-bold mb-2">{errores.tipos_legajo}</p>}
                  {tiposLegajo.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tiposLegajo.map((tipo) => {
                        const checked = tiposLegajoSeleccionados.includes(tipo.id);
                        return (
                          <label
                            key={tipo.id}
                            className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all ${
                              checked ? "border-red-500 bg-red-50/30 font-bold text-red-900 shadow-xs" : "border-slate-200 text-slate-700 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={esVer}
                              onChange={() => handleTipoLegajoChange(tipo.id)}
                              className="w-5 h-5 rounded text-red-600 border-slate-300 focus:ring-red-500 cursor-pointer"
                            />
                            <span className="text-sm select-none">{tipo.descripcion}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No hay tipos de legajo configurados en el sistema.</p>
                  )}
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del nuevo legajo</p>
                <div>
                  <span className="text-slate-400 font-bold block">Persona Asociada:</span>
                  <span className="text-slate-800 font-extrabold">{etiquetaPersona}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Número de Legajo:</span>
                  <span className="text-slate-800 font-extrabold">Legajo #{formulario.numero}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Tipos de Legajo:</span>
                  <span className="text-slate-800 font-extrabold">
                    {tiposLegajo
                      .filter(t => tiposLegajoSeleccionados.includes(t.id))
                      .map(t => t.descripcion)
                      .join(", ") || "-"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              {paso === 1 ? (
                <button type="button" onClick={() => navigate("/legajos")} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">Cancelar</button>
              ) : (
                <button type="button" onClick={retrocederPaso} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"><ChevronLeft size={18} />Volver</button>
              )}

              {paso < 3 ? (
                <button type="button" onClick={avanzarPaso} className="px-6 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center gap-1.5">Siguiente<ChevronRight size={18} /></button>
              ) : (
                !esVer && (
                  <button type="submit" disabled={guardando} className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60">
                    <Save size={22} /> {guardando ? "Confirmar y Guardar" : "Confirmar y Guardar"}
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
