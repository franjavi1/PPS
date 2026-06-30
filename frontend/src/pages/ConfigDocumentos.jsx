import { useState, useEffect } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  FileText,
  User,
  Shield,
  X,
  Mail,
  CreditCard,
  Sliders,
  Building2,
} from "lucide-react";
import Navbar from "../components/Navbar";

// Importación de la capa de servicios para la integración asíncrona con el Backend (Flask + PostgreSQL)
import { tipoDocumentoService } from "../services/tipoDocumentoService";
import { personaService } from "../services/personaService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { aulaService } from "../services/aulaService";
import { comisionService } from "../services/comisionService";
import { asignaturaService } from "../services/asignaturaService";

/**
 * Componente principal para la configuración y gestión de parámetros institucionales.
 * Administra las entidades de tipo_documento, persona y rango_institucional.
 */
function ConfigDocumentos() {
  // Estado para la gestión de la pestaña activa ('tipo_documento', 'persona', 'rango_institucional', 'infraestructura')
  const [pestanaActiva, setPestanaActiva] = useState("tipo_documento");

  // Estado para la sub-pestaña de infraestructura ('sedes', 'aulas', 'comisiones')
  const [subPestanaActiva, setSubPestanaActiva] = useState("sedes");

  // Estados para almacenar los listados recuperados asíncronamente de los servicios
  const [sedes, setSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [rangos, setRangos] = useState([]);

  // Carga asíncrona inicial de todas las entidades mediante Promise.all para optimizar rendimiento
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [tDocs, pers, rgs, sds, als, asig, coms] = await Promise.all([
          tipoDocumentoService.obtenerTodos(),
          personaService.obtenerTodas(),
          rangoService.obtenerTodos(),
          sedeService.obtenerTodas(),
          aulaService.obtenerTodas(),
          asignaturaService.obtenerTodas(),
          comisionService.obtenerTodas(),
        ]);
        setTiposDocumento(tDocs);
        setPersonas(pers);
        setRangos(rgs);
        setSedes(sds);
        setAulas(als);
        setAsignaturas(asig);
        setComisiones(coms);
      } catch (error) {
        console.error("Error al cargar datos de configuración desde los servicios:", error);
      }
    }
    cargarDatos();
  }, []);

  // Estado para el control del formulario de Sede
  const [formSede, setFormSede] = useState({ id: null, nombre: "", direccion: "" });
  const [errorSede, setErrorSede] = useState({});
  const [modoEdicionSede, setModoEdicionSede] = useState(false);

  // Estado para el control del formulario de Aula
  const [formAula, setFormAula] = useState({ id: null, nombre: "", sedeId: "", capacidad: "" });
  const [errorAula, setErrorAula] = useState({});
  const [modoEdicionAula, setModoEdicionAula] = useState(false);

  // Estado para el control del formulario de Comisión
  const [formComision, setFormComision] = useState({
    id: null,
    nombre: "",
    asignaturaId: "",
    aulaId: "",
    cupoMaximo: "",
    inscritos: 0,
  });
  const [errorComision, setErrorComision] = useState({});
  const [modoEdicionComision, setModoEdicionComision] = useState(false);

  // Estado para el control del formulario de Tipo de Documento (creación y edición)
  const [formTipoDoc, setFormTipoDoc] = useState({ id: null, nombre: "", descripcion: "" });
  const [errorTipoDoc, setErrorTipoDoc] = useState({});
  const [modoEdicionTipoDoc, setModoEdicionTipoDoc] = useState(false);

  // Estado para el control del formulario de Persona (creación y edición)
  const [formPersona, setFormPersona] = useState({
    id: null,
    nombre: "",
    apellido: "",
    tipoDocumentoId: "",
    documento: "",
    email: "",
  });
  const [errorPersona, setErrorPersona] = useState({});
  const [modoEdicionPersona, setModoEdicionPersona] = useState(false);

  // Estado para el control del formulario de Rango Institucional (creación y edición)
  const [formRango, setFormRango] = useState({ id: null, descripcion: "", nivelPrioridad: "" });
  const [errorRango, setErrorRango] = useState({});
  const [modoEdicionRango, setModoEdicionRango] = useState(false);

  // Estados para controlar la visibilidad de los modales de creación y edición (mejorando accesibilidad y control de permisos)
  const [mostrarModalTipoDoc, setMostrarModalTipoDoc] = useState(false);
  const [mostrarModalPersona, setMostrarModalPersona] = useState(false);
  const [mostrarModalRango, setMostrarModalRango] = useState(false);
  const [mostrarModalSede, setMostrarModalSede] = useState(false);
  const [mostrarModalAula, setMostrarModalAula] = useState(false);
  const [mostrarModalComision, setMostrarModalComision] = useState(false);

  

  /**
   * Procesa los cambios en los campos de entrada del formulario de tipo de documento.
   */
  function manejarCambioTipoDoc(e) {
    const { name, value } = e.target;
    setFormTipoDoc({ ...formTipoDoc, [name]: value });
  }

  /**
   * Valida la estructura y restricciones de negocio del tipo de documento.
   */
  function validarTipoDoc() {
    const errores = {};
    if (!formTipoDoc.nombre.trim()) {
      errores.nombre = "El nombre identificador es requerido.";
    } else if (formTipoDoc.nombre.length > 10) {
      errores.nombre = "El nombre no debe exceder los 10 caracteres.";
    }

    if (!formTipoDoc.descripcion.trim()) {
      errores.descripcion = "La descripción es requerida.";
    }

    // Validación de unicidad de nombre (exceptuando el registro en edición)
    const duplicado = tiposDocumento.some(
      (td) => td.nombre.toLowerCase() === formTipoDoc.nombre.toLowerCase() && td.id !== formTipoDoc.id
    );
    if (duplicado) {
      errores.nombre = "Ya existe un tipo de documento con este nombre.";
    }

    setErrorTipoDoc(errores);
    return Object.keys(errores).length === 0;
  }

  /**
   * Guarda o actualiza un tipo de documento utilizando el servicio asíncrono.
   * Se comunica con POST/PUT en /api/v1/tipos-documentos.
   */
  async function guardarTipoDoc(e) {
    e.preventDefault();
    if (!validarTipoDoc()) return;

    try {
      if (modoEdicionTipoDoc) {
        await tipoDocumentoService.actualizar(formTipoDoc.id, {
          nombre: formTipoDoc.nombre,
          descripcion: formTipoDoc.descripcion,
        });
      } else {
        await tipoDocumentoService.crear({
          nombre: formTipoDoc.nombre,
          descripcion: formTipoDoc.descripcion,
        });
      }
      const actualizados = await tipoDocumentoService.obtenerTodos();
      setTiposDocumento(actualizados);
      limpiarFormTipoDoc();
      setMostrarModalTipoDoc(false);
    } catch (err) {
      console.error("Error al guardar tipo de documento:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  /**
   * Carga los datos de un tipo de documento seleccionado para su edición.
   */
  function editarTipoDoc(doc) {
    setFormTipoDoc(doc);
    setModoEdicionTipoDoc(true);
    setErrorTipoDoc({});
    // Se abre el modal de Tipo de Documento al iniciar la edicion
    setMostrarModalTipoDoc(true);
  }

  /**
   * Elimina un tipo de documento, validando previamente que no se vulnere la integridad referencial.
   * Se comunica con DELETE en /api/v1/tipos-documentos/:id.
   */
  async function eliminarTipoDoc(id) {
    // Validación de clave foránea en la lista de personas
    const enUso = personas.some((p) => p.tipoDocumentoId === id);
    if (enUso) {
      alert(
        "No es posible eliminar el tipo de documento. Existen registros de personas asociados a este tipo."
      );
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de tipo de documento?")) {
      try {
        await tipoDocumentoService.eliminar(id);
        const actualizados = await tipoDocumentoService.obtenerTodos();
        setTiposDocumento(actualizados);
        if (formTipoDoc.id === id) limpiarFormTipoDoc();
      } catch (err) {
        console.error("Error al eliminar tipo de documento:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  /**
   * Restablece el estado del formulario de tipo de documento.
   */
  function limpiarFormTipoDoc() {
    setFormTipoDoc({ id: null, nombre: "", descripcion: "" });
    setErrorTipoDoc({});
    setModoEdicionTipoDoc(false);
  }

  

  /**
   * Procesa los cambios en los campos de entrada del formulario de persona.
   */
  function manejarCambioPersona(e) {
    const { name, value } = e.target;
    setFormPersona({
      ...formPersona,
      [name]: name === "tipoDocumentoId" ? parseInt(value, 10) || "" : value,
    });
  }

  /**
   * Valida la estructura, tipos de datos y restricciones de negocio para la entidad persona.
   */
  function validarPersona() {
    const errores = {};
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formPersona.nombre.trim()) {
      errores.nombre = "El nombre es requerido.";
    }
    if (!formPersona.apellido.trim()) {
      errores.apellido = "El apellido es requerido.";
    }
    if (!formPersona.tipoDocumentoId) {
      errores.tipoDocumentoId = "Debe seleccionar un tipo de documento.";
    }
    if (!formPersona.documento.trim()) {
      errores.documento = "El número de documento es requerido.";
    } else {
      // Validación de unicidad de documento (exceptuando el registro en edición)
      const duplicadoDoc = personas.some(
        (p) => p.documento.trim() === formPersona.documento.trim() && p.id !== formPersona.id
      );
      if (duplicadoDoc) {
        errores.documento = "Ya existe una persona registrada con este número de documento.";
      }
    }
    if (!formPersona.email.trim()) {
      errores.email = "El correo electrónico es requerido.";
    } else if (!regexEmail.test(formPersona.email)) {
      errores.email = "Ingrese una dirección de correo electrónico válida.";
    }

    setErrorPersona(errores);
    return Object.keys(errores).length === 0;
  }

  /**
   * Guarda o actualiza una persona utilizando el servicio asíncrono.
   * Se comunica con POST/PUT en /api/v1/personas.
   */
  async function guardarPersona(e) {
    e.preventDefault();
    if (!validarPersona()) return;

    try {
      if (modoEdicionPersona) {
        await personaService.actualizar(formPersona.id, {
          nombre: formPersona.nombre,
          apellido: formPersona.apellido,
          tipoDocumentoId: formPersona.tipoDocumentoId,
          documento: formPersona.documento,
          email: formPersona.email,
        });
      } else {
        await personaService.crear({
          nombre: formPersona.nombre,
          apellido: formPersona.apellido,
          tipoDocumentoId: formPersona.tipoDocumentoId,
          documento: formPersona.documento,
          email: formPersona.email,
        });
      }
      const actualizadas = await personaService.obtenerTodas();
      setPersonas(actualizadas);
      limpiarFormPersona();
      setMostrarModalPersona(false);
    } catch (err) {
      console.error("Error al guardar persona:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  /**
   * Carga los datos de una persona seleccionada para su edición.
   */
  function editarPersona(pers) {
    setFormPersona(pers);
    setModoEdicionPersona(true);
    setErrorPersona({});
    // Se abre el modal de Persona al iniciar la edicion
    setMostrarModalPersona(true);
  }

  /**
   * Elimina un registro de persona utilizando el servicio asíncrono.
   * Se comunica con DELETE en /api/v1/personas/:id.
   */
  async function eliminarPersona(id) {
    if (confirm("¿Confirma la eliminación de este registro de persona?")) {
      try {
        await personaService.eliminar(id);
        const actualizadas = await personaService.obtenerTodas();
        setPersonas(actualizadas);
        if (formPersona.id === id) limpiarFormPersona();
      } catch (err) {
        console.error("Error al eliminar persona:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  /**
   * Restablece el estado del formulario de persona.
   */
  function limpiarFormPersona() {
    setFormPersona({
      id: null,
      nombre: "",
      apellido: "",
      tipoDocumentoId: "",
      documento: "",
      email: "",
    });
    setErrorPersona({});
    setModoEdicionPersona(false);
  }

  

  /**
   * Procesa los cambios en los campos de entrada del formulario de rango.
   */
  function manejarCambioRango(e) {
    const { name, value } = e.target;
    setFormRango({
      ...formRango,
      [name]: name === "nivelPrioridad" ? parseInt(value, 10) || "" : value,
    });
  }

  /**
   * Valida la estructura y restricciones de negocio del rango institucional.
   */
  function validarRango() {
    const errores = {};
    if (!formRango.descripcion.trim()) {
      errores.descripcion = "La descripción oficial es requerida.";
    }

    if (formRango.nivelPrioridad === "") {
      errores.nivelPrioridad = "El nivel de prioridad es requerido.";
    } else {
      const prioridadNum = parseInt(formRango.nivelPrioridad, 10);
      if (isNaN(prioridadNum) || prioridadNum <= 0) {
        errores.nivelPrioridad = "Debe ser un valor numérico entero positivo.";
      }
    }

    setErrorRango(errores);
    return Object.keys(errores).length === 0;
  }

  /**
   * Guarda o actualiza un rango utilizando el servicio asíncrono.
   * Se comunica con POST/PUT en /api/v1/rangos.
   */
  async function guardarRango(e) {
    e.preventDefault();
    if (!validarRango()) return;

    try {
      if (modoEdicionRango) {
        await rangoService.actualizar(formRango.id, {
          descripcion: formRango.descripcion,
          nivelPrioridad: formRango.nivelPrioridad,
        });
      } else {
        await rangoService.crear({
          descripcion: formRango.descripcion,
          nivelPrioridad: formRango.nivelPrioridad,
        });
      }
      const actualizados = await rangoService.obtenerTodos();
      setRangos(actualizados);
      limpiarFormRango();
      setMostrarModalRango(false);
    } catch (err) {
      console.error("Error al guardar rango:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  /**
   * Carga los datos de un rango seleccionado para su edición.
   */
  function editarRango(rg) {
    setFormRango(rg);
    setModoEdicionRango(true);
    setErrorRango({});
    // Se abre el modal de Rango al iniciar la edicion
    setMostrarModalRango(true);
  }

  /**
   * Elimina un rango utilizando el servicio asíncrono.
   * Se comunica con DELETE en /api/v1/rangos/:id.
   */
  async function eliminarRango(id) {
    if (confirm("¿Confirma la eliminación de este rango institucional?")) {
      try {
        await rangoService.eliminar(id);
        const actualizados = await rangoService.obtenerTodos();
        setRangos(actualizados);
        if (formRango.id === id) limpiarFormRango();
      } catch (err) {
        console.error("Error al eliminar rango:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  /**
   * Restablece el estado del formulario de rango.
   */
  function limpiarFormRango() {
    setFormRango({ id: null, descripcion: "", nivelPrioridad: "" });
    setErrorRango({});
    setModoEdicionRango(false);
  }

  // Retorna el nombre legible del tipo de documento según su id (utilizado en la lista de personas)
  function obtenerNombreTipoDocumento(id) {
    const encontrado = tiposDocumento.find((td) => td.id === id);
    return encontrado ? encontrado.nombre : "No definido";
  }

  // Retorna el nombre legible de la sede según su id
  function obtenerNombreSede(id) {
    const encontrada = sedes.find((s) => s.id === id);
    return encontrada ? encontrada.nombre : "Sede no definida";
  }

  // Retorna el nombre legible del aula según su id
  function obtenerNombreAula(id) {
    const encontrada = aulas.find((a) => a.id === id);
    return encontrada ? encontrada.nombre : "Aula no definida";
  }

  // Retorna el nombre legible de la asignatura según su id
  function obtenerNombreAsignatura(id) {
    const encontrada = asignaturas.find((asig) => asig.id === id);
    return encontrada ? encontrada.nombre : "Asignatura no definida";
  }

  

  // Procesa los cambios en los campos de entrada del formulario de sedes.
  function manejarCambioSede(e) {
    const { name, value } = e.target;
    setFormSede({ ...formSede, [name]: value });
  }

  // Valida que los campos obligatorios del formulario de sedes no se encuentren vacíos.
  function validarSede() {
    const errores = {};
    if (!formSede.nombre.trim()) {
      errores.nombre = "El nombre de la sede es requerido.";
    }
    if (!formSede.direccion.trim()) {
      errores.direccion = "La dirección de la sede es requerida.";
    }
    setErrorSede(errores);
    return Object.keys(errores).length === 0;
  }

  // Guarda la nueva sede o actualiza el registro existente utilizando el servicio asíncrono.
  // Se comunica con POST/PUT en /api/v1/sedes.
  async function guardarSede(e) {
    e.preventDefault();
    if (!validarSede()) return;

    try {
      if (modoEdicionSede) {
        await sedeService.actualizar(formSede.id, {
          nombre: formSede.nombre,
          direccion: formSede.direccion,
        });
      } else {
        await sedeService.crear({
          nombre: formSede.nombre,
          direccion: formSede.direccion,
        });
      }
      const actualizadas = await sedeService.obtenerTodas();
      setSedes(actualizadas);
      limpiarFormSede();
      setMostrarModalSede(false);
    } catch (err) {
      console.error("Error al guardar sede:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  // Carga los datos de la sede seleccionada en el formulario para proceder a su edición.
  function editarSede(sede) {
    setFormSede(sede);
    setModoEdicionSede(true);
    setErrorSede({});
    setMostrarModalSede(true);
  }

  // Elimina el registro de la sede validando previamente la inexistencia de aulas asociadas.
  // Se comunica con DELETE en /api/v1/sedes/:id.
  async function eliminarSede(id) {
    const enUso = aulas.some((a) => a.sedeId === id);
    if (enUso) {
      alert("No es posible eliminar la sede. Existen aulas registradas asociadas a la misma.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de sede?")) {
      try {
        await sedeService.eliminar(id);
        const actualizadas = await sedeService.obtenerTodas();
        setSedes(actualizadas);
        if (formSede.id === id) limpiarFormSede();
      } catch (err) {
        console.error("Error al eliminar sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  // Restablece los campos del formulario de sedes y limpia los registros de errores asociados.
  function limpiarFormSede() {
    setFormSede({ id: null, nombre: "", direccion: "" });
    setErrorSede({});
    setModoEdicionSede(false);
  }

  // Procesa los cambios en los campos de entrada del formulario de aulas.
  function manejarCambioAula(e) {
    const { name, value } = e.target;
    setFormAula({
      ...formAula,
      [name]: name === "sedeId" ? parseInt(value, 10) || "" : name === "capacidad" ? parseInt(value, 10) || "" : value,
    });
  }

  // Valida que el nombre del aula esté completo, la sede seleccionada y la capacidad física sea un entero positivo.
  function validarAula() {
    const errores = {};
    if (!formAula.nombre.trim()) {
      errores.nombre = "El nombre del aula es requerido.";
    }
    if (!formAula.sedeId) {
      errores.sedeId = "Debe seleccionar una sede de la lista.";
    }
    if (formAula.capacidad === "" || isNaN(formAula.capacidad) || formAula.capacidad <= 0) {
      errores.capacidad = "Debe ingresar una capacidad física válida (entero positivo).";
    }
    setErrorAula(errores);
    return Object.keys(errores).length === 0;
  }

  // Guarda la nueva aula o actualiza el registro existente utilizando el servicio asíncrono.
  // Se comunica con POST/PUT en /api/v1/aulas.
  async function guardarAula(e) {
    e.preventDefault();
    if (!validarAula()) return;

    try {
      if (modoEdicionAula) {
        await aulaService.actualizar(formAula.id, {
          nombre: formAula.nombre,
          sedeId: formAula.sedeId,
          capacidad: formAula.capacidad,
        });
      } else {
        await aulaService.crear({
          nombre: formAula.nombre,
          sedeId: formAula.sedeId,
          capacidad: formAula.capacidad,
        });
      }
      const actualizadas = await aulaService.obtenerTodas();
      setAulas(actualizadas);
      limpiarFormAula();
      setMostrarModalAula(false);
    } catch (err) {
      console.error("Error al guardar aula:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  // Carga los datos del aula seleccionada en el formulario para proceder a su edición.
  function editarAula(aula) {
    setFormAula(aula);
    setModoEdicionAula(true);
    setErrorAula({});
    setMostrarModalAula(true);
  }

  // Elimina el registro del aula verificando previamente que no se encuentre asignada a ninguna comisión activa.
  // Se comunica con DELETE en /api/v1/aulas/:id.
  async function eliminarAula(id) {
    const enUso = comisiones.some((c) => c.aulaId === id);
    if (enUso) {
      alert("No es posible eliminar el aula. Existen comisiones registradas asociadas a la misma.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de aula?")) {
      try {
        await aulaService.eliminar(id);
        const actualizadas = await aulaService.obtenerTodas();
        setAulas(actualizadas);
        if (formAula.id === id) limpiarFormAula();
      } catch (err) {
        console.error("Error al eliminar aula:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  // Restablece los campos del formulario de aulas y limpia los registros de errores asociados.
  function limpiarFormAula() {
    setFormAula({ id: null, nombre: "", sedeId: "", capacidad: "" });
    setErrorAula({});
    setModoEdicionAula(false);
  }

  // Procesa los cambios en los campos de entrada del formulario de comisiones.
  function manejarCambioComision(e) {
    const { name, value } = e.target;
    setFormComision({
      ...formComision,
      [name]: name === "asignaturaId" || name === "aulaId" || name === "cupoMaximo" || name === "inscritos"
        ? parseInt(value, 10) || 0
        : value,
    });
  }

  // Valida los datos del formulario de comisión y verifica que el cupo no supere la capacidad física del aula asignada.
  function validarComision() {
    const errores = {};
    if (!formComision.nombre.trim()) {
      errores.nombre = "El nombre de la comisión es requerido.";
    }
    if (!formComision.asignaturaId) {
      errores.asignaturaId = "Debe seleccionar una asignatura de la lista.";
    }
    if (!formComision.aulaId) {
      errores.aulaId = "Debe seleccionar un aula física de la lista.";
    }

    const cupo = parseInt(formComision.cupoMaximo, 10);
    if (isNaN(cupo) || cupo <= 0) {
      errores.cupoMaximo = "Debe ingresar un cupo máximo válido (entero positivo).";
    } else if (formComision.aulaId) {
      const aulaAsignada = aulas.find((a) => a.id === formComision.aulaId);
      if (aulaAsignada && cupo > aulaAsignada.capacidad) {
        errores.cupoMaximo = `El cupo máximo de la comisión (${cupo}) supera la capacidad física del aula seleccionada (${aulaAsignada.capacidad} alumnos).`;
      }
    }

    const inscritosVal = parseInt(formComision.inscritos, 10);
    if (isNaN(inscritosVal) || inscritosVal < 0) {
      errores.inscritos = "El número de inscritos debe ser un valor entero no negativo.";
    } else if (!isNaN(cupo) && inscritosVal > cupo) {
      errores.inscritos = "El número de inscritos no puede superar al cupo máximo definido.";
    }

    setErrorComision(errores);
    return Object.keys(errores).length === 0;
  }

  // Guarda la nueva comisión o actualiza el registro existente utilizando el servicio asíncrono.
  // Se comunica con POST/PUT en /api/v1/comisiones.
  async function guardarComision(e) {
    e.preventDefault();
    if (!validarComision()) return;

    try {
      if (modoEdicionComision) {
        await comisionService.actualizar(formComision.id, {
          nombre: formComision.nombre,
          asignaturaId: formComision.asignaturaId,
          aulaId: formComision.aulaId,
          cupoMaximo: formComision.cupoMaximo,
          inscritos: formComision.inscritos,
        });
      } else {
        await comisionService.crear({
          nombre: formComision.nombre,
          asignaturaId: formComision.asignaturaId,
          aulaId: formComision.aulaId,
          cupoMaximo: formComision.cupoMaximo,
          inscritos: formComision.inscritos,
        });
      }
      const actualizadas = await comisionService.obtenerTodas();
      setComisiones(actualizadas);
      limpiarFormComision();
      setMostrarModalComision(false);
    } catch (err) {
      console.error("Error al guardar comisión:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  // Carga los datos de la comisión seleccionada en el formulario para proceder a su edición.
  function editarComision(comision) {
    setFormComision(comision);
    setModoEdicionComision(true);
    setErrorComision({});
    setMostrarModalComision(true);
  }

  // Elimina el registro de la comisión utilizando el servicio asíncrono.
  // Se comunica con DELETE en /api/v1/comisiones/:id.
  async function eliminarComision(id) {
    if (confirm("¿Confirma la eliminación de este registro de comisión?")) {
      try {
        await comisionService.eliminar(id);
        const actualizadas = await comisionService.obtenerTodas();
        setComisiones(actualizadas);
        if (formComision.id === id) limpiarFormComision();
      } catch (err) {
        console.error("Error al eliminar comisión:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  // Restablece los campos del formulario de comisiones y limpia los registros de errores asociados.
  function limpiarFormComision() {
    setFormComision({
      id: null,
      nombre: "",
      asignaturaId: "",
      aulaId: "",
      cupoMaximo: "",
      inscritos: 0,
    });
    setErrorComision({});
    setModoEdicionComision(false);
  }

  

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Encabezado Principal */}
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Parámetros y Catálogos
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gestión y mantenimiento del catálogo de base del sistema (Tipos de documento, personas, rangos jerárquicos e infraestructura).
          </p>
        </section>

        {/* Control de Pestañas Navigacionales */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-8 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setPestanaActiva("tipo_documento")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "tipo_documento"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText size={20} />
            Tipos de Documento
          </button>

          <button
            onClick={() => setPestanaActiva("persona")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "persona"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User size={20} />
            Personas
          </button>

          <button
            onClick={() => setPestanaActiva("rango_institucional")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "rango_institucional"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Shield size={20} />
            Rangos Institucionales
          </button>

          <button
            onClick={() => setPestanaActiva("infraestructura")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "infraestructura"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={20} />
            Infraestructura
          </button>
        </div>

        {/* Contenido Condicional de Pestañas */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TAB: TIPO DOCUMENTO */}
          {pestanaActiva === "tipo_documento" && (
            <>
              {/* Tabla de Registros (ahora ocupa todo el ancho) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Registros de Tipos de Documento
                  </h2>
                  {/* Botón para abrir la pantalla/modal de agregar */}
                  <button
                    onClick={() => {
                      limpiarFormTipoDoc();
                      setMostrarModalTipoDoc(true);
                    }}
                    className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                  >
                    <PlusCircle size={16} />
                    Agregar Tipo de Doc.
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-4 text-slate-700 font-bold">Sigla</th>
                        <th className="px-5 py-4 text-slate-700 font-bold">Descripción</th>
                        <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiposDocumento.length > 0 ? (
                        tiposDocumento.map((td) => (
                          <tr key={td.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-5 py-4 text-slate-800 font-bold">{td.nombre}</td>
                            <td className="px-5 py-4 text-slate-600">{td.descripcion}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => editarTipoDoc(td)}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                >
                                  <Pencil size={16} />
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarTipoDoc(td.id)}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                          <td colSpan="3" className="text-center py-8 text-slate-400">
                            No se registran tipos de documento en el sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulario en Modal Emergente */}
              {mostrarModalTipoDoc && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => {
                        limpiarFormTipoDoc();
                        setMostrarModalTipoDoc(false);
                      }}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                      title="Cerrar modal"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        {modoEdicionTipoDoc ? "Editar Tipo de Doc." : "Nuevo Tipo de Doc."}
                      </h2>
                    </div>

                    <form onSubmit={guardarTipoDoc} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Sigla / Nombre *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select
                            name="nombre"
                            value={formTipoDoc.nombre}
                            onChange={manejarCambioTipoDoc}
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                              errorTipoDoc.nombre
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-slate-300 focus:ring-red-500 focus:border-red-500"
                            }`}
                          >
                            <option value="">Seleccione una Sigla / Nombre</option>
                            <option value="DNI">DNI - Documento Nacional de Identidad</option>
                            <option value="PASAPORTE">PASAPORTE - Pasaporte Internacional</option>
                            <option value="LC">LC - Libreta Cívica</option>
                            <option value="LE">LE - Libreta de Enrolamiento</option>
                            <option value="CI">CI - Cédula de Identidad</option>
                            <option value="OTRO">OTRO - Otro Documento / Extranjero</option>
                          </select>
                        </div>
                        {errorTipoDoc.nombre && (
                          <p className="text-red-600 text-xs mt-1">{errorTipoDoc.nombre}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Descripción *
                        </label>
                        <textarea
                          name="descripcion"
                          value={formTipoDoc.descripcion}
                          onChange={manejarCambioTipoDoc}
                          placeholder="Ingrese el detalle formal del tipo de documento..."
                          className={`w-full h-24 p-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                            errorTipoDoc.descripcion
                              ? "border-red-500 focus:ring-red-500"
                              : "border-slate-300 focus:ring-red-500"
                          }`}
                        />
                        {errorTipoDoc.descripcion && (
                          <p className="text-red-600 text-xs mt-1">{errorTipoDoc.descripcion}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            limpiarFormTipoDoc();
                            setMostrarModalTipoDoc(false);
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
                          {modoEdicionTipoDoc ? "Guardar" : "Agregar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: PERSONA */}
          {pestanaActiva === "persona" && (
            <>
              {/* Tabla de Registros (ahora ocupa todo el ancho) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Registros de Personas
                  </h2>
                  {/* Botón para abrir la pantalla/modal de agregar */}
                  <button
                    onClick={() => {
                      limpiarFormPersona();
                      setMostrarModalPersona(true);
                    }}
                    className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                  >
                    <PlusCircle size={16} />
                    Agregar Persona
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-4 text-slate-700 font-bold">Nombre Completo</th>
                        <th className="px-5 py-4 text-slate-700 font-bold">Tipo Doc.</th>
                        <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                        <th className="px-5 py-4 text-slate-700 font-bold">Email</th>
                        <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.length > 0 ? (
                        personas.map((p) => (
                          <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-5 py-4 text-slate-800 font-semibold">
                              {p.apellido}, {p.nombre}
                            </td>
                            <td className="px-5 py-4">
                              <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                                {obtenerNombreTipoDocumento(p.tipoDocumentoId)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600 font-medium">{p.documento}</td>
                            <td className="px-5 py-4 text-slate-600 text-sm">{p.email}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => editarPersona(p)}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                >
                                  <Pencil size={16} />
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarPersona(p.id)}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                          <td colSpan="5" className="text-center py-8 text-slate-400">
                            No se registran personas en el sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulario en Modal Emergente */}
              {mostrarModalPersona && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => {
                        limpiarFormPersona();
                        setMostrarModalPersona(false);
                      }}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                      title="Cerrar modal"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        {modoEdicionPersona ? "Editar Persona" : "Nueva Persona"}
                      </h2>
                    </div>

                    <form onSubmit={guardarPersona} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            name="nombre"
                            value={formPersona.nombre}
                            onChange={manejarCambioPersona}
                            placeholder="Ej: Juan Pablo"
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                              errorPersona.nombre
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          />
                        </div>
                        {errorPersona.nombre && (
                          <p className="text-red-600 text-xs mt-1">{errorPersona.nombre}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Apellido *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            name="apellido"
                            value={formPersona.apellido}
                            onChange={manejarCambioPersona}
                            placeholder="Ej: González"
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                              errorPersona.apellido
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          />
                        </div>
                        {errorPersona.apellido && (
                          <p className="text-red-600 text-xs mt-1">{errorPersona.apellido}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Tipo de Documento *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select
                            name="tipoDocumentoId"
                            value={formPersona.tipoDocumentoId}
                            onChange={manejarCambioPersona}
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                              errorPersona.tipoDocumentoId
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          >
                            <option value="">Seleccionar tipo</option>
                            {tiposDocumento.map((td) => (
                              <option key={td.id} value={td.id}>
                                {td.nombre} - {td.descripcion}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errorPersona.tipoDocumentoId && (
                          <p className="text-red-600 text-xs mt-1">{errorPersona.tipoDocumentoId}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          N° Documento *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            name="documento"
                            value={formPersona.documento}
                            onChange={manejarCambioPersona}
                            placeholder="Ej: 32456789"
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                              errorPersona.documento
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          />
                        </div>
                        {errorPersona.documento && (
                          <p className="text-red-600 text-xs mt-1">{errorPersona.documento}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Email Institucional/Personal *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={formPersona.email}
                            onChange={manejarCambioPersona}
                            placeholder="Ej: correo@bomberos.org"
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                              errorPersona.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          />
                        </div>
                        {errorPersona.email && (
                          <p className="text-red-600 text-xs mt-1">{errorPersona.email}</p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            limpiarFormPersona();
                            setMostrarModalPersona(false);
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
                          {modoEdicionPersona ? "Guardar" : "Agregar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: RANGO INSTITUCIONAL */}
          {pestanaActiva === "rango_institucional" && (
            <>
              {/* Tabla de Registros (ahora ocupa todo el ancho) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Registros de Rangos Jerárquicos
                  </h2>
                  {/* Botón para abrir la pantalla/modal de agregar */}
                  <button
                    onClick={() => {
                      limpiarFormRango();
                      setMostrarModalRango(true);
                    }}
                    className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                  >
                    <PlusCircle size={16} />
                    Agregar Rango
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-4 text-slate-700 font-bold">Denominación Oficial</th>
                        <th className="px-5 py-4 text-slate-700 font-bold">Nivel Prioridad</th>
                        <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rangos.length > 0 ? (
                        rangos
                          .sort((a, b) => a.nivelPrioridad - b.nivelPrioridad)
                          .map((rg) => (
                            <tr key={rg.id} className="border-b border-slate-200 hover:bg-slate-50">
                              <td className="px-5 py-4 text-slate-800 font-bold">{rg.descripcion}</td>
                              <td className="px-5 py-4">
                                <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                                  Nivel {rg.nivelPrioridad}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => editarRango(rg)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                  >
                                    <Pencil size={16} />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => eliminarRango(rg.id)}
                                    className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                          <td colSpan="3" className="text-center py-8 text-slate-400">
                            No se registran rangos institucionales.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulario en Modal Emergente */}
              {mostrarModalRango && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => {
                        limpiarFormRango();
                        setMostrarModalRango(false);
                      }}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                      title="Cerrar modal"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        {modoEdicionRango ? "Editar Rango" : "Nuevo Rango"}
                      </h2>
                    </div>

                    <form onSubmit={guardarRango} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Denominación Oficial *
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select
                            name="descripcion"
                            value={formRango.descripcion}
                            onChange={manejarCambioRango}
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                              errorRango.descripcion
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          >
                            <option value="">Seleccione una Denominación</option>
                            <option value="Aspirante">Aspirante</option>
                            <option value="Bombero">Bombero</option>
                            <option value="Cabo">Cabo</option>
                            <option value="Cabo Primero">Cabo Primero</option>
                            <option value="Sargento">Sargento</option>
                            <option value="Sargento Primero">Sargento Primero</option>
                            <option value="Suboficial Principal">Suboficial Principal</option>
                            <option value="Suboficial Mayor">Suboficial Mayor</option>
                            <option value="Oficial Inspector">Oficial Inspector</option>
                            <option value="Oficial Principal">Oficial Principal</option>
                            <option value="Comandante">Comandante</option>
                          </select>
                        </div>
                        {errorRango.descripcion && (
                          <p className="text-red-600 text-xs mt-1">{errorRango.descripcion}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Nivel de Prioridad *
                        </label>
                        <div className="relative">
                          <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="number"
                            name="nivelPrioridad"
                            value={formRango.nivelPrioridad}
                            onChange={manejarCambioRango}
                            placeholder="Ej: 1"
                            min="1"
                            step="1"
                            className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                              errorRango.nivelPrioridad
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-red-500"
                            }`}
                          />
                        </div>
                        {errorRango.nivelPrioridad && (
                          <p className="text-red-600 text-xs mt-1">{errorRango.nivelPrioridad}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            limpiarFormRango();
                            setMostrarModalRango(false);
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
                          {modoEdicionRango ? "Guardar" : "Agregar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: INFRAESTRUCTURA */}
          {pestanaActiva === "infraestructura" && (
            <>
              {/* Navegación por sub-solapas que abarca las 3 columnas de la grilla */}
              <div className="lg:col-span-3 mb-2 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
                <div className="flex gap-3">
                  <button
                    onClick={() => setSubPestanaActiva("sedes")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      subPestanaActiva === "sedes"
                        ? "bg-red-700 text-white shadow"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Building2 size={18} />
                    Sedes
                  </button>
                  <button
                    onClick={() => setSubPestanaActiva("aulas")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      subPestanaActiva === "aulas"
                        ? "bg-red-700 text-white shadow"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Building2 size={18} />
                    Aulas
                  </button>
                  <button
                    onClick={() => setSubPestanaActiva("comisiones")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      subPestanaActiva === "comisiones"
                        ? "bg-red-700 text-white shadow"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Building2 size={18} />
                    Comisiones
                  </button>
                </div>
              </div>

              {/* VISTA INTERNA: SEDES */}
              {subPestanaActiva === "sedes" && (
                <>
                  {/* Tabla de Registros de Sedes (ahora ocupa todo el ancho) */}
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                      <h2 className="text-xl font-bold text-slate-800 font-bold">
                        Registros de Sedes
                      </h2>
                      {/* Botón para abrir la pantalla/modal de agregar */}
                      <button
                        onClick={() => {
                          limpiarFormSede();
                          setMostrarModalSede(true);
                        }}
                        className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                      >
                        <PlusCircle size={16} />
                        Agregar Sede
                      </button>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr className="border-b border-slate-200">
                            <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Dirección</th>
                            <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sedes.length > 0 ? (
                            sedes.map((s) => (
                              <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-5 py-4 text-slate-800 font-bold">{s.nombre}</td>
                                <td className="px-5 py-4 text-slate-600 font-medium">{s.direccion}</td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={() => editarSede(s)}
                                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                    >
                                      <Pencil size={16} />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => eliminarSede(s.id)}
                                      className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                              <td colSpan="3" className="text-center py-8 text-slate-400">
                                No se registran sedes en el sistema.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Formulario de Sedes en Modal Emergente */}
                  {mostrarModalSede && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => {
                            limpiarFormSede();
                            setMostrarModalSede(false);
                          }}
                          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                          title="Cerrar modal"
                        >
                          <X size={20} />
                        </button>
                        
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-slate-800">
                            {modoEdicionSede ? "Editar Sede" : "Nueva Sede"}
                          </h2>
                        </div>

                        <form onSubmit={guardarSede} className="space-y-5">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Nombre de la Sede *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="text"
                                name="nombre"
                                value={formSede.nombre}
                                onChange={manejarCambioSede}
                                placeholder="Ej: Cuartel Central"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorSede.nombre
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorSede.nombre && (
                              <p className="text-red-600 text-xs mt-1">{errorSede.nombre}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Dirección *
                            </label>
                            <textarea
                              name="direccion"
                              value={formSede.direccion}
                              onChange={manejarCambioSede}
                              placeholder="Ej: Av. Corrientes 1234..."
                              className={`w-full h-24 p-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                errorSede.direccion
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-slate-300 focus:ring-red-500"
                              }`}
                            />
                            {errorSede.direccion && (
                              <p className="text-red-600 text-xs mt-1">{errorSede.direccion}</p>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                limpiarFormSede();
                                setMostrarModalSede(false);
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
                              {modoEdicionSede ? "Guardar" : "Agregar"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* VISTA INTERNA: AULAS */}
              {subPestanaActiva === "aulas" && (
                <>
                  {/* Tabla de Registros de Aulas (ahora ocupa todo el ancho) */}
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                      <h2 className="text-xl font-bold text-slate-800 font-bold">
                        Registros de Aulas
                      </h2>
                      {/* Botón para abrir la pantalla/modal de agregar */}
                      <button
                        onClick={() => {
                          limpiarFormAula();
                          setMostrarModalAula(true);
                        }}
                        className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                      >
                        <PlusCircle size={16} />
                        Agregar Aula
                      </button>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr className="border-b border-slate-200">
                            <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Sede Asignada</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Capacidad</th>
                            <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aulas.length > 0 ? (
                            aulas.map((a) => (
                              <tr key={a.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-5 py-4 text-slate-800 font-bold">{a.nombre}</td>
                                <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreSede(a.sedeId)}</td>
                                <td className="px-5 py-4">
                                  <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                                    {a.capacidad} Alumnos
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={() => editarAula(a)}
                                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                    >
                                      <Pencil size={16} />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => eliminarAula(a.id)}
                                      className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                                No se registran aulas en el sistema.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Formulario de Aulas en Modal Emergente */}
                  {mostrarModalAula && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => {
                            limpiarFormAula();
                            setMostrarModalAula(false);
                          }}
                          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                          title="Cerrar modal"
                        >
                          <X size={20} />
                        </button>
                        
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-slate-800">
                            {modoEdicionAula ? "Editar Aula" : "Nueva Aula"}
                          </h2>
                        </div>

                        <form onSubmit={guardarAula} className="space-y-5">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Nombre / Identificación del Aula *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="text"
                                name="nombre"
                                value={formAula.nombre}
                                onChange={manejarCambioAula}
                                placeholder="Ej: Aula 302"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorAula.nombre
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorAula.nombre && (
                              <p className="text-red-600 text-xs mt-1">{errorAula.nombre}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Sede de Ubicación *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <select
                                name="sedeId"
                                value={formAula.sedeId}
                                onChange={manejarCambioAula}
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorAula.sedeId
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              >
                                <option value="">Seleccione una Sede</option>
                                {sedes.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {errorAula.sedeId && (
                              <p className="text-red-600 text-xs mt-1">{errorAula.sedeId}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Capacidad (Alumnos Sentados) *
                            </label>
                            <div className="relative">
                              <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="number"
                                name="capacidad"
                                value={formAula.capacidad}
                                onChange={manejarCambioAula}
                                placeholder="Ej: 30"
                                min="1"
                                step="1"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorAula.capacidad
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorAula.capacidad && (
                              <p className="text-red-600 text-xs mt-1">{errorAula.capacidad}</p>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                limpiarFormAula();
                                setMostrarModalAula(false);
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
                              {modoEdicionAula ? "Guardar" : "Agregar"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* VISTA INTERNA: COMISIONES */}
              {subPestanaActiva === "comisiones" && (
                <>
                  {/* Tabla de Registros de Comisiones (ahora ocupa todo el ancho) */}
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                      <h2 className="text-xl font-bold text-slate-800 font-bold">
                        Registros de Comisiones
                      </h2>
                      {/* Botón para abrir la pantalla/modal de agregar */}
                      <button
                        onClick={() => {
                          limpiarFormComision();
                          setMostrarModalComision(true);
                        }}
                        className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                      >
                        <PlusCircle size={16} />
                        Agregar Comisión
                      </button>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr className="border-b border-slate-200">
                            <th className="px-5 py-4 text-slate-700 font-bold">Comisión</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Asignatura</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
                            <th className="px-5 py-4 text-slate-700 font-bold">Inscriptos / Cupo</th>
                            <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comisiones.length > 0 ? (
                            comisiones.map((c) => (
                              <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-5 py-4 text-slate-800 font-bold">{c.nombre}</td>
                                <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreAsignatura(c.asignaturaId)}</td>
                                <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreAula(c.aulaId)}</td>
                                <td className="px-5 py-4">
                                  <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                                    {c.inscritos} / {c.cupoMaximo} Alumnos
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={() => editarComision(c)}
                                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                                    >
                                      <Pencil size={16} />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => eliminarComision(c.id)}
                                      className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
                              <td colSpan="5" className="text-center py-8 text-slate-400">
                                No se registran comisiones en el sistema.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Formulario de Comisiones en Modal Emergente */}
                  {mostrarModalComision && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => {
                            limpiarFormComision();
                            setMostrarModalComision(false);
                          }}
                          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                          title="Cerrar modal"
                        >
                          <X size={20} />
                        </button>
                        
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-slate-800">
                            {modoEdicionComision ? "Editar Comisión" : "Nueva Comisión"}
                          </h2>
                        </div>

                        <form onSubmit={guardarComision} className="space-y-5">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Identificador de la Comisión *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="text"
                                name="nombre"
                                value={formComision.nombre}
                                onChange={manejarCambioComision}
                                placeholder="Ej: Comisión A"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorComision.nombre
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorComision.nombre && (
                              <p className="text-red-600 text-xs mt-1">{errorComision.nombre}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Asignatura Relacionada *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <select
                                name="asignaturaId"
                                value={formComision.asignaturaId}
                                onChange={manejarCambioComision}
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorComision.asignaturaId
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              >
                                <option value="">Seleccione una Asignatura</option>
                                {asignaturas.map((asig) => (
                                  <option key={asig.id} value={asig.id}>
                                    {asig.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {errorComision.asignaturaId && (
                              <p className="text-red-600 text-xs mt-1">{errorComision.asignaturaId}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Aula de Cursada *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <select
                                name="aulaId"
                                value={formComision.aulaId}
                                onChange={manejarCambioComision}
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorComision.aulaId
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              >
                                <option value="">Seleccione un Aula</option>
                                {aulas.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.nombre} (Capacidad: {a.capacidad} alumnos)
                                  </option>
                                ))}
                              </select>
                            </div>
                            {errorComision.aulaId && (
                              <p className="text-red-600 text-xs mt-1">{errorComision.aulaId}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Cupo Máximo Operativo *
                            </label>
                            <div className="relative">
                              <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="number"
                                name="cupoMaximo"
                                value={formComision.cupoMaximo}
                                onChange={manejarCambioComision}
                                placeholder="Ej: 25"
                                min="1"
                                step="1"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorComision.cupoMaximo
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorComision.cupoMaximo && (
                              <p className="text-red-600 text-xs mt-1">{errorComision.cupoMaximo}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Alumnos Inscriptos
                            </label>
                            <div className="relative">
                              <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="number"
                                name="inscritos"
                                value={formComision.inscritos}
                                onChange={manejarCambioComision}
                                placeholder="Ej: 0"
                                min="0"
                                step="1"
                                className={`w-full h-11 pl-10 pr-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                                  errorComision.inscritos
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-red-500"
                                }`}
                              />
                            </div>
                            {errorComision.inscritos && (
                              <p className="text-red-600 text-xs mt-1">{errorComision.inscritos}</p>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                limpiarFormComision();
                                setMostrarModalComision(false);
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
                              {modoEdicionComision ? "Guardar" : "Agregar"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default ConfigDocumentos;
