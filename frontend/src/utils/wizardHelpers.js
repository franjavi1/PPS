export function obtenerIdRespuesta(respuesta) {
  return (
    respuesta?.data?.id ||
    respuesta?.data?.persona_id ||
    respuesta?.data?.legajo_id
  );
}

export function validarContactos(contactos) {
  const email = contactos.email.trim();
  const celular = contactos.celular.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexCelular = /^[0-9+\-\s()]{6,20}$/;

  if (email && !regexEmail.test(email)) {
    return "Ingresa un email valido";
  }

  if (celular && !regexCelular.test(celular)) {
    return "Ingresa un celular valido";
  }

  return "";
}

export function obtenerTipoContacto(tiposContacto, nombre) {
  const nombreNormalizado = normalizarTexto(nombre);

  return tiposContacto.find((tipo) => {
    const tipoNormalizado = normalizarTexto(tipo.tipo || tipo.descripcion || "");
    return tipoNormalizado === nombreNormalizado;
  });
}

export function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo completar la operacion";
}
