import { Hash, BookMarked, Building2, ClipboardList } from "lucide-react";
import { CampoTexto, Acciones, TituloPaso } from "../FormHelpers";

// Recibimos de la vista padre:
// - asignaturaPlan: objeto del formulario que representa la asignatura y sus condiciones.
// - cambiarAsignaturaPlan: manejador para guardar el valor digitado en el estado local.
// - guardando: bandera para deshabilitar controles y animar spinner.
// - guardarCondiciones: manejador onSubmit para persistir las condiciones configuradas.
// - onBack: manejador de acción para retroceder en el asistente.
export default function StepCondiciones({
  asignaturaPlan,
  cambiarAsignaturaPlan,
  guardando,
  guardarCondiciones,
  onBack,
}) {
  return (
    // Disparamos la acción de guardar las condiciones definidas de la asignatura
    <form onSubmit={guardarCondiciones} className="space-y-6">
      <TituloPaso icono={<ClipboardList size={26} />} titulo="Condiciones de la asignatura" />
      {/* Grilla responsiva de tres columnas para los parámetros de aprobación y regímenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CampoTexto
          label="Porcentaje presentismo (%)"
          name="presentismo_porc"
          type="number"
          value={asignaturaPlan.presentismo_porc}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 80"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Regularizacion prom."
          name="regularizacion_prom"
          type="number"
          step="0.01"
          value={asignaturaPlan.regularizacion_prom}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 6"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Final aprobacion"
          name="final_aprobacion"
          type="number"
          value={asignaturaPlan.final_aprobacion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 7"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Duracion"
          name="duracion"
          type="number"
          step="0.01"
          value={asignaturaPlan.duracion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 120"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Regimen"
          name="regimen"
          value={asignaturaPlan.regimen}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: Anual"
          icon={<BookMarked size={20} />}
        />
        <CampoTexto
          label="Modalidad"
          name="modalidad"
          value={asignaturaPlan.modalidad}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: Presencial"
          icon={<Building2 size={20} />}
        />
      </div>
      <Acciones guardando={guardando} texto="Guardar condiciones y seguir" onBack={onBack} />
    </form>
  );
}
