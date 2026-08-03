import { AlertTriangle, X } from "lucide-react";

function ModalConfirmar({
  isOpen,
  show,
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de realizar esta acción?",
  onConfirm,
  onAceptar,
  onCancel,
  onCancelar,
  onClose,
  cargando = false,
}) {
  const abierto = Boolean(isOpen ?? show);

  if (!abierto) return null;

  const manejarConfirmar = () => {
    if (onConfirm) onConfirm();
    else if (onAceptar) onAceptar();
  };

  const manejarCancelar = () => {
    if (onCancel) onCancel();
    else if (onCancelar) onCancelar();
    else if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">{titulo}</h2>
              <p className="mt-2 text-sm text-slate-600">{mensaje}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={manejarCancelar}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={manejarCancelar}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            type="button"
            onClick={manejarConfirmar}
            disabled={cargando}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Procesando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmar;
