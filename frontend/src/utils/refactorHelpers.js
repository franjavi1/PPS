export function obtenerMensajeError(err, mensajeDefault = "No se pudo completar la operacion") {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || mensajeDefault;
}

export function crearMapa(items, idKey, valueKey) {
  return (items || []).reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

export function validarPlanesAsignaturasPayload(payload) {
  const camposSelect = [
    ["asignatura_id", "Debe seleccionar una asignatura"],
    ["plan_id", "Debe seleccionar un plan"],
    ["rango_minimo_id", "Debe seleccionar un rango minimo"],
    ["sedes_id", "Debe seleccionar una sede"],
  ];
  for (const [campo, mensaje] of camposSelect) {
    if (!payload[campo]) return mensaje;
  }
  const camposNumericos = [
    ["presentismo_porc", "El presentismo debe ser un numero"],
    ["regularizacion_prom", "La regularizacion debe ser un numero"],
    ["final_aprobacion", "La nota final debe ser un numero"],
    ["duracion", "La duracion debe ser un numero"],
  ];
  for (const [campo, mensaje] of camposNumericos) {
    if (Number.isNaN(payload[campo])) return mensaje;
  }
  if (!payload.regimen) return "El regimen es obligatorio";
  if (!payload.modalidad) return "La modalidad es obligatoria";
  return "";
}

