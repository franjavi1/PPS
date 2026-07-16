import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, CalendarCheck, ClipboardList, FileText, GraduationCap, Layers3, PlusCircle, ShieldCheck, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { TarjetaResumen, AccesoRapido, IndicadorOperativo } from "../components/Inicio/InicioComponents";

const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

export default function Inicio() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({ legajos: 0, personas: 0, planes: 0, comisiones: 0, tiposDocumento: 0 });

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    try {
      const [legajos, personas, planes, comisiones, tipos] = await Promise.all([
        apiRequest("/legajos"),
        apiRequest("/personas"),
        apiRequest("/planes"),
        apiRequest("/comisiones"),
        apiRequest("/tipos-documentos"),
      ]);
      setResumen({
        legajos: obtenerLista(legajos).length,
        personas: obtenerLista(personas).length,
        planes: obtenerLista(planes).length,
        comisiones: obtenerLista(comisiones).length,
        tiposDocumento: obtenerLista(tipos).length,
      });
    } catch {
      // Ignorar fallos de carga inicial
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-full font-extrabold text-sm uppercase">
                <ShieldCheck size={18} /> Panel principal
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 leading-tight">
                Gestión académica y administrativa.
              </h1>
              <p className="text-slate-600 text-lg mt-4 max-w-3xl">
                Accede rápidamente a personas, planes, comisiones y legajos para consultar, cargar y mantener la información del sistema.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => navigate("/alta-persona")}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
                >
                  <PlusCircle size={22} /> Nueva persona
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/planes/alta")}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition"
                >
                  <BookOpen size={22} /> Nuevo plan
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/comisiones/alta")}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition"
                >
                  <CalendarCheck size={22} /> Nueva comisión
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <ClipboardList className="text-red-300" size={54} />
                <p className="text-slate-300 font-semibold mt-6">Resumen operativo</p>
                <h2 className="text-3xl font-extrabold mt-2">Datos disponibles</h2>
                <p className="text-slate-300 mt-3">Usa este panel como punto de entrada para revisar las secciones principales.</p>
              </div>
              <div className="mt-8 border border-white/15 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-300 uppercase">Módulos activos</p>
                <p className="text-4xl font-extrabold mt-1">{resumen.personas + resumen.planes + resumen.comisiones}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          <TarjetaResumen icono={<Users size={30} />} titulo="Personas" valor={resumen.personas} tono="red" />
          <TarjetaResumen icono={<FileText size={30} />} titulo="Legajos" valor={resumen.legajos} tono="blue" />
          <TarjetaResumen icono={<BookOpen size={30} />} titulo="Planes" valor={resumen.planes} tono="green" />
          <TarjetaResumen icono={<GraduationCap size={30} />} titulo="Comisiones" valor={resumen.comisiones} tono="amber" />
          <TarjetaResumen icono={<ClipboardList size={30} />} titulo="Tipos doc." valor={resumen.tiposDocumento} tono="slate" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">Accesos principales</p>
                <h2 className="text-2xl font-extrabold text-slate-800 mt-1">Gestión diaria</h2>
              </div>
              <Layers3 className="text-red-700" size={34} />
            </div>
            <div className="space-y-3">
              <AccesoRapido icono={<Users size={28} />} titulo="Personas" descripcion="Alta guiada, listado y edición de personas." onClick={() => navigate("/personas")} />
              <AccesoRapido icono={<BookOpen size={28} />} titulo="Planes" descripcion="Planes, asignaturas y correlativas." onClick={() => navigate("/planes")} />
              <AccesoRapido icono={<GraduationCap size={28} />} titulo="Comisiones" descripcion="Alta guiada y edición." onClick={() => navigate("/comisiones")} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">Actividad institucional</p>
                <h2 className="text-2xl font-extrabold text-slate-800 mt-1">Estado general</h2>
              </div>
              <ShieldCheck className="text-green-700" size={34} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <IndicadorOperativo titulo="Formación" descripcion="Planes y asignaturas disponibles." valor={resumen.planes} />
              <IndicadorOperativo titulo="Cursado" descripcion="Comisiones registradas." valor={resumen.comisiones} />
              <IndicadorOperativo titulo="Personal" descripcion="Personas cargadas." valor={resumen.personas} />
              <IndicadorOperativo titulo="Legajos" descripcion="Registros administrativos." valor={resumen.legajos} />
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-center gap-2 text-slate-500 mt-10">
          <ShieldCheck size={22} /> <p>Acceso exclusivo para personal autorizado</p>
        </footer>
      </main>
    </div>
  );
}
