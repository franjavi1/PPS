import { Routes, Route, Navigate } from "react-router";
import InicioSesion from "./pages/Login";
import Inicio from "./pages/Inicio";
import Legajos from "./pages/Legajos";
import NuevoLegajo from "./pages/crearLegajo"
import TiposDocumentos from "./pages/TiposDocumentos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<InicioSesion />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/legajos" element={<Legajos />} />
      <Route path="/crearLegajo" element={<NuevoLegajo/>} />
      <Route path="/legajos/:id" element={<NuevoLegajo />} />
      <Route path="/legajos/:id/editar" element={<NuevoLegajo />} />
      <Route path="/tipos-documentos" element={<TiposDocumentos />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
