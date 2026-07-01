import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  FolderOpen,
  PlusCircle,
  Bell,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

function Inicio() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({
    personas: 0,
    activas: 0,
    tiposDocumento: 0,
  });

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    try {
      const [personas, tipos] = await Promise.all([
        apiRequest("/personas"),
        apiRequest("/tipos-documentos"),
      ]);

      const listaPersonas = personas.data || [];
      const listaTipos = tipos.data || [];

      setResumen({
        personas: listaPersonas.length,
        activas: listaPersonas.filter((persona) => persona.estado === 1).length,
        tiposDocumento: listaTipos.length,
      });
    } catch {
      setResumen({
        personas: 0,
        activas: 0,
        tiposDocumento: 0,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Panel principal
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Bienvenido/a al sistema de gestion de legajos de Bomberos Voluntarios.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <TarjetaResumen
            icono={<Users size={36} />}
            titulo="Total de personas"
            valor={resumen.personas}
            color="red"
          />

          <TarjetaResumen
            icono={<UserCheck size={36} />}
            titulo="Activas"
            valor={resumen.activas}
            color="green"
          />

          <TarjetaResumen
            icono={<UserX size={36} />}
            titulo="Inactivas"
            valor={resumen.personas - resumen.activas}
            color="yellow"
          />

          <TarjetaResumen
            icono={<FileText size={36} />}
            titulo="Tipos doc."
            valor={resumen.tiposDocumento}
            color="blue"
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Accesos rapidos
            </h2>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-slate-500 mb-6">
                Gestiona la informacion de personas y documentos de manera rapida.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                <AccesoRapido
                  icono={<FolderOpen size={38} />}
                  titulo="Ver personas"
                  descripcion="Consulta y gestiona personas existentes."
                  onClick={() => navigate("/legajos")}
                />

                <AccesoRapido
                  icono={<PlusCircle size={38} />}
                  titulo="Nueva persona"
                  descripcion="Crea un nuevo registro de persona."
                  onClick={() => navigate("/crearLegajo")}
                />

                <AccesoRapido
                  icono={<FileText size={38} />}
                  titulo="Documentos"
                  descripcion="Administra los tipos de documento."
                  onClick={() => navigate("/config-documentos")}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Avisos
            </h2>

            <div className="border-t border-slate-200 pt-4">
              <Aviso
                titulo="Datos actualizados"
                descripcion="El panel muestra la informacion cargada."
                fecha="Hoy"
                color="red"
              />

              <Aviso
                titulo="Personas activas"
                descripcion={`${resumen.activas} registros activos disponibles.`}
                fecha="Ahora"
                color="yellow"
              />

              <Aviso
                titulo="Tipos de documento"
                descripcion={`${resumen.tiposDocumento} tipos cargados para crear personas.`}
                fecha="Ahora"
                color="blue"
              />

              <button
                onClick={cargarResumen}
                className="w-full mt-4 flex items-center justify-between text-red-700 font-semibold hover:text-red-800"
              >
                Actualizar panel
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-center gap-2 text-slate-500 mt-12">
          <ShieldCheck size={22} />
          <p>Acceso exclusivo para personal autorizado</p>
        </footer>
      </main>
    </div>
  );
}

function TarjetaResumen({ icono, titulo, valor, color }) {
  const coloresIcono = {
    red: "text-red-700",
    green: "text-green-700",
    yellow: "text-yellow-600",
    blue: "text-blue-700",
  };

  const coloresValor = {
    red: "text-red-700",
    green: "text-green-700",
    yellow: "text-yellow-600",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-center gap-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className={`flex items-center justify-center ${coloresIcono[color]}`}>
        {icono}
      </div>

      <div>
        <p className="text-slate-500 font-medium">{titulo}</p>
        <p className={`text-4xl font-extrabold mt-1 ${coloresValor[color]}`}>
          {valor}
        </p>
      </div>
    </div>
  );
}

function AccesoRapido({ icono, titulo, descripcion, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border border-slate-200 rounded-xl p-6 text-left hover:bg-slate-50 hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-5">
        <div className="text-red-700 flex items-center justify-center">
          {icono}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {titulo}
          </h3>
          <p className="text-slate-500 mt-2">
            {descripcion}
          </p>
        </div>
      </div>

      <ChevronRight className="text-slate-500" size={28} />
    </button>
  );
}

function Aviso({ titulo, descripcion, fecha }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-5 transition-colors duration-200 hover:bg-slate-50 px-2 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-amber-500 flex items-center justify-center">
          <Bell size={26} />
        </div>

        <div>
          <h3 className="font-bold text-slate-800">
            {titulo}
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            {descripcion}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {fecha}
      </p>
    </div>
  );
}

export default Inicio;
