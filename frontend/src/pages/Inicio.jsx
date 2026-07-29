import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers3,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

function Inicio() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({
    legajos: 0,
    planes: 0,
    comisiones: 0,
  });

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    try {
      const [legajos, planes, comisiones] = await Promise.all([
        apiRequest("/legajos"),
        apiRequest("/planes"),
        apiRequest("/comisiones"),
      ]);

      setResumen({
        legajos: obtenerLista(legajos).length,
        planes: obtenerLista(planes).length,
        comisiones: obtenerLista(comisiones).length,
      });
    } catch {
      setResumen({
        legajos: 0,
        planes: 0,
        comisiones: 0,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-full font-extrabold text-sm uppercase">
              <ShieldCheck size={18} />
              Panel principal
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 leading-tight">
              Gestión académica y administrativa
            </h1>

            <p className="text-slate-600 text-lg mt-4 max-w-3xl">
              Accedé rápidamente a personas, planes, comisiones y legajos para
              consultar, cargar y mantener actualizada la información del
              sistema.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                type="button"
                onClick={() => navigate("/alta-persona")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nueva persona
              </button>

              <button
                type="button"
                onClick={() => navigate("/planes/alta")}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                <BookOpen size={22} />
                Nuevo plan
              </button>

              <button
                type="button"
                onClick={() => navigate("/comisiones/alta")}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                <CalendarCheck size={22} />
                Nueva comisión
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          <TarjetaResumen icono={<FileText size={30} />} titulo="Legajos" valor={resumen.legajos} tono="blue" />
          <TarjetaResumen icono={<BookOpen size={30} />} titulo="Planes" valor={resumen.planes} tono="green" />
          <TarjetaResumen icono={<GraduationCap size={30} />} titulo="Comisiones" valor={resumen.comisiones} tono="amber" />
        </section>

        <section>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Accesos principales
                </p>
                <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                  Gestión diaria
                </h2>
              </div>
              <Layers3 className="text-red-700" size={34} />
            </div>

            <div className="space-y-3">
              <AccesoRapido
                icono={<Users size={28} />}
                titulo="Personas"
                descripcion="Alta guiada, listado y edición de personas."
                onClick={() => navigate("/personas")}
              />
              <AccesoRapido
                icono={<BookOpen size={28} />}
                titulo="Planes"
                descripcion="Planes, asignaturas y correlativas."
                onClick={() => navigate("/planes")}
              />
              <AccesoRapido
                icono={<GraduationCap size={28} />}
                titulo="Comisiones"
                descripcion="Alta guiada, consulta y edición de comisiones."
                onClick={() => navigate("/comisiones")}
              />
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-center gap-2 text-slate-500 mt-10">
          <ShieldCheck size={22} />
          <p>Acceso exclusivo para personal autorizado.</p>
        </footer>
      </main>
    </div>
  );
}

function TarjetaResumen({ icono, titulo, valor, tono }) {
  const tonos = {
    red: "text-red-700 bg-red-50 border-red-100",
    blue: "text-blue-700 bg-blue-50 border-blue-100",
    green: "text-green-700 bg-green-50 border-green-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
    slate: "text-slate-700 bg-slate-50 border-slate-200",
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${tonos[tono]}`}>
        {icono}
      </div>
      <p className="text-slate-500 font-bold mt-4">{titulo}</p>
      <p className="text-4xl font-extrabold text-slate-900 mt-1">{valor}</p>
    </article>
  );
}

function AccesoRapido({ icono, titulo, descripcion, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-slate-200 rounded-xl p-4 text-left hover:bg-slate-50 hover:shadow-sm transition flex items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
          {icono}
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-800">{titulo}</h3>
          <p className="text-slate-500 text-sm mt-1">{descripcion}</p>
        </div>
      </div>

      <ChevronRight className="text-slate-400 shrink-0" size={24} />
    </button>
  );
}

function obtenerLista(respuesta) {
  return Array.isArray(respuesta?.data) ? respuesta.data : [];
}

export default Inicio;
