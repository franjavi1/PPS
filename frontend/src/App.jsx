import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Inicio from "./pages/Inicio";
import Legajos from "./pages/Legajos";
import Asignaturas from "./pages/Asignaturas";
import Comisiones from "./pages/Comisiones";
import AltaComisionWizard from "./pages/AltaComisionWizard";
import VerComision from "./pages/VerComision";
import EditarComision from "./pages/EditarComision";
import Planes from "./pages/Planes";
import PlanesAsignaturas from "./pages/PlanesAsignaturas";
import Aulas from "./pages/Aulas";
import ComisionesAsignaturas from "./pages/ComisionesAsignaturas";
import AutoridadesComision from "./pages/AutoridadesComision";
import PACorrelativas from "./pages/PACorrelativas";
import DatosMedicos from "./pages/DatosMedicos";
import Contactos from "./pages/Contactos";
import Personas from "./pages/Personas";
import EditarPersona from "./pages/EditarPersona";
import EditarPlan from "./pages/EditarPlan";
import VerPlan from "./pages/VerPlan";
import AltaPersonaWizard from "./pages/AltaPersonaWizard";
import AltaPlanWizard from "./pages/AltaPlanWizard";
import LegajoRangos from "./pages/LegajoRangos";
import LegajoSedes from "./pages/LegajoSedes";
import Sedes from "./pages/Sedes";
import TiposSedes from "./pages/TiposSedes";
import TipoRangos from "./pages/TipoRangos";
import TiposDocumentos from "./pages/TiposDocumentos";
import ProtectedRoute from "./components/permisos/ProtectedRoute"
import PublicRoute from "./components/permisos/PublicRoute"


function App() {
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
      <div className="relative min-h-screen">
        {/* Contenedor flexible para centrar la marca de agua de forma 100% responsiva */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center p-4">
          <div
            className="w-11/12 max-w-[500px] aspect-square bg-center bg-no-repeat bg-contain opacity-[0.04]"
            //style={{ backgroundImage: "url('/logo.jpeg')" }}
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
          <Routes>
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
            <Route path="/legajos" element={<ProtectedRoute permissions={["planes.legajos.ver"]}><Legajos /></ProtectedRoute>} />
            <Route path="/sedes" element={<ProtectedRoute permissions={["planes.sedes.ver"]}><Sedes /></ProtectedRoute>} />
            <Route path="/tipos-sedes" element={<ProtectedRoute permissions={["planes.tipos_sedes.ver"]}><TiposSedes /></ProtectedRoute>} />
            <Route path="/tipo-rangos" element={<ProtectedRoute permissions={["planes.rangos_institucionales.ver"]}><TipoRangos /></ProtectedRoute>} />
            <Route path="/tipos-documentos" element={<ProtectedRoute permissions={["planes.tipos_documentos.ver"]}><TiposDocumentos /></ProtectedRoute>} />
            <Route path="/asignaturas" element={<ProtectedRoute permissions={["planes.asignaturas.ver"]}><Asignaturas /></ProtectedRoute>} />
            <Route path="/comisiones" element={<ProtectedRoute permissions={["planes.comisiones.ver"]}><Comisiones /></ProtectedRoute>} />
            <Route path="/comisiones/alta" element={<ProtectedRoute permissions={["planes.comisiones.crear"]}><AltaComisionWizard /></ProtectedRoute>} />
            <Route path="/comisiones/:id" element={<ProtectedRoute permissions={["planes.comisiones.ver"]}><VerComision /></ProtectedRoute>} />
            <Route path="/comisiones/:id/editar" element={<ProtectedRoute permissions={["planes.comisiones.editar"]}><EditarComision /></ProtectedRoute>} />
            <Route path="/planes" element={<ProtectedRoute permissions={["planes.planes.ver"]}><Planes /></ProtectedRoute>} />
            <Route path="/planes-asignaturas" element={<ProtectedRoute permissions={["planes.planes_asignaturas.ver"]}><PlanesAsignaturas /></ProtectedRoute>} />
            <Route path="/aulas" element={<ProtectedRoute permissions={["planes.aulas.ver"]}><Aulas /></ProtectedRoute>} />
            <Route path="/comisiones-asignaturas" element={<ProtectedRoute permissions={["planes.comisiones_asignaturas.ver"]}><ComisionesAsignaturas /></ProtectedRoute>}/>
            <Route path="/autoridades-comision" element={<ProtectedRoute permissions={["planes.autoridades_comision.ver"]}><AutoridadesComision /></ProtectedRoute>}/>
            <Route path="/pa-correlativas" element={<ProtectedRoute permissions={["planes.pa_correlativas.ver"]}><PACorrelativas /></ProtectedRoute>} />
            <Route path="/datos-medicos" element={<ProtectedRoute permissions={["planes.datos_medicos.ver"]}><DatosMedicos /></ProtectedRoute>} />
            <Route path="/legajo-rangos" element={<ProtectedRoute permissions={["planes.legajo_rangos.ver"]}><LegajoRangos /></ProtectedRoute>} />
            <Route path="/legajo-sedes" element={<ProtectedRoute permissions={["planes.legajo_sedes.ver"]}><LegajoSedes /></ProtectedRoute>} />
            <Route path="/contactos" element={<ProtectedRoute permissions={["planes.contactos.ver"]}><Contactos /></ProtectedRoute>} />
            <Route path="/personas" element={<ProtectedRoute permissions={["planes.personas.ver"]}><Personas /></ProtectedRoute>} />
            <Route path="/alta-persona" element={<ProtectedRoute permissions={["planes.personas.crear"]}><AltaPersonaWizard /></ProtectedRoute>} />
            <Route path="/personas/:id"element={<ProtectedRoute permissions={["planes.personas.editar"]}><EditarPersona soloLectura /></ProtectedRoute>}/>
            <Route path="/personas/:id/editar" element={<ProtectedRoute permissions={["planes.personas.editar"]}><EditarPersona /></ProtectedRoute>} />
            <Route path="/planes/alta" element={<ProtectedRoute permissions={["planes.planes.crear"]}><AltaPlanWizard /></ProtectedRoute>} />
            <Route path="/planes/:id" element={<ProtectedRoute permissions={["planes.planes.ver"]}><VerPlan /></ProtectedRoute>} />
            <Route path="/planes/:id/editar" element={<ProtectedRoute permissions={["planes.planes.editar"]}><EditarPlan /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
