import toast from "react-hot-toast";

export function notificarExito(mensaje) {
  toast.success(mensaje || "Operacion realizada correctamente");
}

export function notificarError(error, mensajeFallback = "No se pudo completar la operacion") {
  toast.error(obtenerMensajeError(error, mensajeFallback));
}

export function obtenerMensajeError(error, mensajeFallback = "No se pudo completar la operacion") {
  const errores = error?.errors || {};
  const primerCampo = Object.keys(errores)[0];
  const primerError = primerCampo && Array.isArray(errores[primerCampo])
    ? errores[primerCampo][0]
    : errores[primerCampo];

  return primerError || error?.message || mensajeFallback;
}
