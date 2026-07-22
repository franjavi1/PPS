import { Routes, Route, Navigate } from "react-router";
import { useEffect, lazy, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import InicioSesion from "./pages/Login";

// Importaciones dinámicas mediante React.lazy
const Inicio = lazy(() => import("./pages/Inicio"));
const Legajos = lazy(() => import("./pages/Legajos"));
const NuevoLegajo = lazy(() => import("./pages/crearLegajo"));
const ConfigDocumentos = lazy(() => import("./pages/ConfigDocumentos"));
const Asignaturas = lazy(() => import("./pages/Asignaturas"));
const Comisiones = lazy(() => import("./pages/Comisiones"));
const AltaComisionWizard = lazy(() => import("./pages/AltaComisionWizard"));
const VerComision = lazy(() => import("./pages/VerComision"));
const EditarComision = lazy(() => import("./pages/EditarComision"));
const Planes = lazy(() => import("./pages/Planes"));
const PlanesAsignaturas = lazy(() => import("./pages/PlanesAsignaturas"));
const Aulas = lazy(() => import("./pages/Aulas"));
const ComisionesAsignaturas = lazy(() => import("./pages/ComisionesAsignaturas"));
const AutoridadesComision = lazy(() => import("./pages/AutoridadesComision"));
const PACorrelativas = lazy(() => import("./pages/PACorrelativas"));
const DatosMedicos = lazy(() => import("./pages/DatosMedicos"));
const Contactos = lazy(() => import("./pages/Contactos"));
const Personas = lazy(() => import("./pages/Personas"));
const EditarPersona = lazy(() => import("./pages/EditarPersona"));
const EditarPlan = lazy(() => import("./pages/EditarPlan"));
const VerPlan = lazy(() => import("./pages/VerPlan"));
const AltaPersonaWizard = lazy(() => import("./pages/AltaPersonaWizard"));
const AltaPlanWizard = lazy(() => import("./pages/AltaPlanWizard"));
const LegajoRangos = lazy(() => import("./pages/LegajoRangos"));
const LegajoSedes = lazy(() => import("./pages/LegajoSedes"));
const Sedes = lazy(() => import("./pages/Sedes"));
const TiposSedes = lazy(() => import("./pages/TiposSedes"));
const TipoRangos = lazy(() => import("./pages/TipoRangos"));
const TiposDocumentos = lazy(() => import("./pages/TiposDocumentos"));
const TiposPlanes = lazy(() => import("./pages/TiposPlanes"));


function App() {
  // Redefinimos los alerts clásicos del navegador para inyectar notificaciones toast estilizadas.
  useEffect(() => {
    const alertOriginal = window.alert;
    window.alert = (mensaje) => {
      toast(String(mensaje || "Operacion realizada"));
    };
    return () => {
      window.alert = alertOriginal;
    };
  }, []);

  return (
    // Envolvemos toda la aplicación en nuestro AuthProvider para dar soporte de sesión a cada página.
    <AuthProvider>
      <div className="relative min-h-screen">
        {/* Contenedor flexible para centrar la marca de agua de forma 100% responsiva */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center p-4">
          <div
            className="w-11/12 max-w-[500px] aspect-square bg-center bg-no-repeat bg-contain opacity-[0.04]"
            style={{ backgroundImage: "url('/logo.jpeg')" }}
          />
        </div>

        {/* Contenido principal por encima del fondo */}
        <div className="relative z-10">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "12px",
                fontWeight: 700,
              },
              success: {
                style: {
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                },
              },
              error: {
                style: {
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                },
              },
            }}
          />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-semibold text-sm">
              Cargando sección...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/legajos" element={<Legajos />} />
              <Route path="/legajos/:id" element={<NuevoLegajo />} />
              <Route path="/legajos/:id/editar" element={<NuevoLegajo />} />
              <Route path="/crearLegajo" element={<NuevoLegajo />} />
              <Route path="/crearLegajo/:id" element={<NuevoLegajo />} />
              <Route path="/config-documentos" element={<ConfigDocumentos />} />
              <Route path="/sedes" element={<Sedes />} />
              <Route path="/tipos-sedes" element={<TiposSedes />} />
              <Route path="/tipo-rangos" element={<TipoRangos />} />
              <Route path="/tipos-documentos" element={<TiposDocumentos />} />
              <Route path="/asignaturas" element={<Asignaturas />} />
              <Route path="/comisiones" element={<Comisiones />} />
              <Route path="/comisiones/alta" element={<AltaComisionWizard />} />
              <Route path="/comisiones/:id" element={<VerComision />} />
              <Route path="/comisiones/:id/editar" element={<EditarComision />} />
              <Route path="/planes" element={<Planes />} />
              <Route path="/planes-asignaturas" element={<PlanesAsignaturas />} />
              <Route path="/tipos-planes" element={<TiposPlanes />} />
              <Route path="/aulas" element={<Aulas />} />
              <Route path="/comisiones-asignaturas" element={<ComisionesAsignaturas />} />
              <Route path="/autoridades-comision" element={<AutoridadesComision />} />
              <Route path="/pa-correlativas" element={<PACorrelativas />} />
              <Route path="/datos-medicos" element={<DatosMedicos />} />
              <Route path="/legajo-rangos" element={<LegajoRangos />} />
              <Route path="/legajo-sedes" element={<LegajoSedes />} />
              <Route path="/contactos" element={<Contactos />} />
              <Route path="/personas" element={<Personas />} />
              <Route path="/alta-persona" element={<AltaPersonaWizard />} />
              <Route path="/personas/:id/editar" element={<EditarPersona />} />
              <Route path="/planes/alta" element={<AltaPlanWizard />} />
              <Route path="/planes/:id" element={<VerPlan />} />
              <Route path="/planes/:id/editar" element={<EditarPlan />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
