import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { apiRequest } from "../api";

export function useNuevoLegajo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const editando = Boolean(id);
  const esVer = editando && !location.pathname.endsWith("/editar");

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
    setFormulario((prev) => ({ ...prev, [name]: value }));
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

  return {
    editando,
    esVer,
    personas,
    guardando,
    errorGeneral,
    errores,
    formulario,
    manejarCambio,
    guardarLegajo,
  };
}
