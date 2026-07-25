import { GraduationCap } from "lucide-react";
import { CampoTexto } from "../FormHelpers";

export default function SeccionDatos({
  comision,
  cambiarComision,
}) {
  return (
    <div className="space-y-6 md:col-span-2">
      <CampoTexto
        label="Descripción de la comisión"
        name="descripcion"
        value={comision.descripcion}
        onChange={cambiarComision}
        placeholder="Ej: División A"
        icon={<GraduationCap size={20} />}
      />
    </div>
  );
}
