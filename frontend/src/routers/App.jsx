import { Routes, Route, Navigate } from "react-router";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import InicioSesion from "../pages/Login";
import Inicio from "../pages/Inicio";

// TiposDocumento
import IndexTiposDocumentoPage from "../pages/tiposDocumento/index";
import CreateTiposDocumentoPage from "../pages/tiposDocumento/create";
import EditTiposDocumentoPage from "../pages/tiposDocumento/edit";
import DeleteTiposDocumentoPage from "../pages/tiposDocumento/delete";
import DetailsTiposDocumentoPage from "../pages/tiposDocumento/details";


import Legajos from "../pages/Legajos";
import NuevoLegajo from "../pages/crearLegajo";
import ConfigDocumentos from "../pages/ConfigDocumentos";
import Asignaturas from "../pages/Asignaturas";
import Comisiones from "../pages/Comisiones";
import AltaComisionWizard from "../pages/AltaComisionWizard";
import VerComision from "../pages/VerComision";
import EditarComision from "../pages/EditarComision";
import Planes from "../pages/Planes";
import PlanesAsignaturas from "../pages/PlanesAsignaturas";
import Aulas from "../pages/Aulas";
import ComisionesAsignaturas from "../pages/ComisionesAsignaturas";
import AutoridadesComision from "../pages/AutoridadesComision";
import PACorrelativas from "../pages/PACorrelativas";
import DatosMedicos from "../pages/DatosMedicos";
import Contactos from "../pages/Contactos";
import Personas from "../pages/Personas";
import EditarPersona from "../pages/EditarPersona";
import EditarPlan from "../pages/EditarPlan";
import VerPlan from "../pages/VerPlan";
import AltaPersonaWizard from "../pages/AltaPersonaWizard";
import AltaPlanWizard from "../pages/AltaPlanWizard";
import LegajoRangos from "../pages/LegajoRangos";
import LegajoSedes from "../pages/LegajoSedes";
import Sedes from "../pages/Sedes";
import TiposSedes from "../pages/TiposSedes";
import TipoRangos from "../pages/TipoRangos";



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
        <Routes>

          {/* Tipos Documento */}
            <Route path="/tipos-documento" element={<IndexTiposDocumentoPage />} />
            <Route path="/tipos-documento/create" element={<CreateTiposDocumentoPage />} />
            <Route path="/tipos-documento/edit/:id" element={<EditTiposDocumentoPage />} />
            <Route path="/tipos-documento/delete/:id" element={<DeleteTiposDocumentoPage />} />
            <Route path="/tipos-documento/details/:id" element={<DetailsTiposDocumentoPage />} />


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
          <Route path="/asignaturas" element={<Asignaturas />} />
          <Route path="/comisiones" element={<Comisiones />} />
          <Route path="/comisiones/alta" element={<AltaComisionWizard />} />
          <Route path="/comisiones/:id" element={<VerComision />} />
          <Route path="/comisiones/:id/editar" element={<EditarComision />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/planes-asignaturas" element={<PlanesAsignaturas />} />
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
      </div>
    </div>
  );
}

export default App;
