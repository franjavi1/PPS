import { Routes, Route, Navigate } from "react-router";
import InicioSesion from "./pages/Login";
import Inicio from "./pages/Inicio";
import Legajos from "./pages/Legajos";
import NuevoLegajo from "./pages/crearLegajo";
import ConfigDocumentos from "./pages/ConfigDocumentos";
import Asignaturas from "./pages/Asignaturas";

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Contenedor flexible para centrar la marca de agua de forma 100% responsiva */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
        <div
          className="w-11/12 max-w-[500px] aspect-square bg-center bg-no-repeat bg-contain opacity-[0.04]"
          style={{ backgroundImage: "url('/logo.jpeg')" }}
        />
      </div>

      {/* Contenido principal por encima del fondo */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/legajos" element={<Legajos />} />
          <Route path="/crearLegajo" element={<NuevoLegajo />} />
          <Route path="/config-documentos" element={<ConfigDocumentos />} />
          <Route path="/asignaturas" element={<Asignaturas />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;