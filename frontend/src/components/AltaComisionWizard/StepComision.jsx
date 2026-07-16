import { GraduationCap } from "lucide-react";
import { TituloPaso, CampoTexto, Acciones } from "../FormHelpers";

export default function StepComision({
  comision,
  cambiarComision,
  guardando,
  guardarComision,
}) {
  return (
    <form onSubmit={guardarComision} className="space-y-6">
      <TituloPaso icono={<GraduationCap size={26} />} titulo="Datos de la comisión" />
      <CampoTexto
        label="Descripción"
        name="descripcion"
        value={comision.descripcion}
        onChange={cambiarComision}
        placeholder="Ej: Comisión A"
        icon={<GraduationCap size={20} />}
      />
      <Acciones guardando={guardando} texto="Crear comisión y seguir" />
    </form>
  );
}
