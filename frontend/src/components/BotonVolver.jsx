import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BotonVolver({ ruta, reemplazar = false }) {
  const navigate = useNavigate();
  const destino = ruta;

  function volver() {
    if (destino) {
      navigate(destino, { replace: reemplazar });
      return;
    }

    const posicionHistorial = window.history.state?.idx ?? 0;

    if (posicionHistorial > 0) {
      navigate(-1);
    } else {
      navigate("/inicio", { replace: true });
    }
  }

  return (
    <button
      type="button"
      onClick={volver}
      className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold shadow-sm hover:bg-slate-100 hover:border-slate-400 transition cursor-pointer"
    >
      <ArrowLeft size={20} />
      Volver
    </button>
  );
}

export default BotonVolver;