import { House, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function PaginaNoEncontrada() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-md p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-700 flex items-center justify-center">
            <SearchX size={42} />
          </div>

          <p className="mt-6 text-red-700 font-extrabold uppercase tracking-wider">
            Error 404
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Página no encontrada
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            La página que buscás no existe o la dirección
            ingresada es incorrecta.
          </p>

          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
          >
            <House size={21} />
            Volver al inicio
          </button>
        </section>
      </main>
    </div>
  );
}

export default PaginaNoEncontrada;