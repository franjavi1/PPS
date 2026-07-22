import { useState, useEffect } from "react";
import { tipoDocumentoService } from "../services/tipoDocumentoService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoSedeService } from "../services/tipoSedeService";
import { aulaService } from "../services/aulaService";
import { comisionService } from "../services/comisionService";
import { asignaturaService } from "../services/asignaturaService";

export function useConfigDocumentos() {
  const [sedes, setSedes] = useState([]);
  const [tiposSedes, setTiposSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  async function cargarTodosLosDatos() {
    try {
      setCargando(true);
      await Promise.all([
        cargarTiposDocumento(),
        cargarRangos(),
        cargarSedes(),
        cargarTiposSedes(),
        cargarAulas(),
        cargarAsignaturas(),
        cargarComisiones(),
      ]);
    } catch (error) {
      console.error("Error al cargar datos globales:", error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarTiposDocumento() {
    try {
      const res = await tipoDocumentoService.obtenerTodos();
      setTiposDocumento(res.data || []);
    } catch (error) {
      console.error("Error al cargar tipos de documento:", error);
    }
  }

  async function cargarRangos() {
    try {
      const res = await rangoService.obtenerTodos();
      const rangosMapeados = (res.data || []).map((r) => ({
        ...r,
        nivelPrioridad: r.nivel_jerarquia ?? r.nivel_prioridad,
      }));
      setRangos(rangosMapeados);
    } catch (error) {
      console.error("Error al cargar rangos institucionales:", error);
    }
  }

  async function cargarSedes() {
    try {
      const res = await sedeService.obtenerTodas();
      setSedes(res.data || []);
    } catch (error) {
      console.error("Error al cargar sedes:", error);
    }
  }

  async function cargarTiposSedes() {
    try {
      const res = await tipoSedeService.obtenerTodas();
      setTiposSedes(res.data || []);
    } catch (error) {
      console.error("Error al cargar tipos de sede:", error);
    }
  }

  async function cargarAulas() {
    try {
      const res = await aulaService.obtenerTodas();
      const aulasMapeadas = (res.data || []).map((a) => ({
        ...a,
        sedeId: a.sede_id,
      }));
      setAulas(aulasMapeadas);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
    }
  }

  async function cargarAsignaturas() {
    try {
      const res = await asignaturaService.obtenerTodas();
      setAsignaturas(res.data || []);
    } catch (error) {
      console.error("Error al cargar asignaturas:", error);
    }
  }

  async function cargarComisiones() {
    try {
      const res = await comisionService.obtenerTodas();
      const comisionesMapeadas = (res.data || []).map((c) => ({
        ...c,
        asignaturaId: c.asignatura_id,
        aulaId: c.aula_id,
        cupoMaximo: c.cupo_maximo,
      }));
      setComisiones(comisionesMapeadas);
    } catch (error) {
      console.error("Error al cargar comisiones:", error);
    }
  }

  return {
    sedes,
    tiposSedes,
    aulas,
    asignaturas,
    comisiones,
    tiposDocumento,
    rangos,
    cargando,
    cargarTiposDocumento,
    cargarRangos,
    cargarSedes,
    cargarTiposSedes,
    cargarAulas,
    cargarComisiones,
  };
}
