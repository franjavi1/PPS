import { useNavigate } from "react-router";
import { Users, UserCheck, UserX, GraduationCap, FolderOpen, PlusCircle, ChevronRight, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { TarjetaResumen, AccesoRapido, Aviso } from "../components/Inicio/InicioComponents";

export default function Inicio() {
  const navigate = useNavigate();
  // Explicamos el inicio síncrono del componente y cómo consume el rol de sesión con el hook useAuth.
  const { user } = useAuth();
  const userRole = user?.role || "invitado";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">Panel principal</h1>
          <p className="text-slate-500 mt-3 text-lg">Bienvenido/a al sistema de gestión de legajos de Bomberos Voluntarios.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <TarjetaResumen icono={<Users size={36} />} titulo="Total de bomberos" valor="35" color="red" />
          <TarjetaResumen icono={<UserCheck size={36} />} titulo="Activos" valor="30" color="green" />
          <TarjetaResumen icono={<UserX size={36} />} titulo="Inactivos" valor="5" color="yellow" />
          <TarjetaResumen icono={<GraduationCap size={36} />} titulo="Capacitaciones" valor="12" color="blue" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Accesos rápidos</h2>
            <div className="border-t border-slate-200 pt-6">
              <p className="text-slate-500 mb-6">Gestioná la información de los bomberos de manera rápida y sencilla.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AccesoRapido icono={<FolderOpen size={38} />} titulo="Ver legajos" descripcion="Consultá y gestioná legajos existentes." onClick={() => navigate("/legajos")} />
                {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                {hasPermission(userRole, "crear") && (
                  <AccesoRapido icono={<PlusCircle size={38} />} titulo="Nuevo legajo" descripcion="Creá un nuevo legajo para un bombero." onClick={() => navigate("/crearLegajo")} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Avisos</h2>
            <div className="border-t border-slate-200 pt-4">
              <Aviso titulo="Actualización de datos" descripcion="Recordá mantener los legajos actualizados." fecha="20/05/2024" color="red" />
              <Aviso titulo="Capacitación obligatoria" descripcion="Nueva capacitación disponible: RCP Básico." fecha="18/05/2024" color="yellow" />
              <Aviso titulo="Revisión anual" descripcion="Iniciá la revisión anual de legajos." fecha="15/05/2024" color="blue" />
              <button className="w-full mt-4 flex items-center justify-between text-red-700 font-semibold hover:text-red-800">
                Ver todos los avisos
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
