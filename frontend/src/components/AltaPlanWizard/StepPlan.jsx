import { BookOpen } from "lucide-react";
import { CampoTexto, CampoSelect, Acciones, TituloPaso } from "../FormHelpers";

// Recibimos de la vista padre:
// - plan: objeto de datos con los atributos del plan de estudio.
// - cambiarPlan: función manejadora para registrar cambios en los inputs.
// - tiposPlanes: colección con los tipos de plan disponibles en el sistema.
// - guardando: bandera boolean para deshabilitar controles mientras se procesa la API.
// - guardarPlan: callback onSubmit para iniciar la persistencia.
export default function StepPlan({ plan, cambiarPlan, tiposPlanes, guardando, guardarPlan }) {
  return (
    // Disparamos la acción de guardado inicial del plan al enviar el formulario
    <form onSubmit={guardarPlan} className="space-y-6">
      <TituloPaso icono={<BookOpen size={26} />} titulo="Datos del plan de estudio" />
      {/* Grilla responsiva para organizar los campos de captura de datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoSelect
          label="Tipo de plan"
          name="tipo_planes_id_tipo_planes"
          value={plan.tipo_planes_id_tipo_planes}
          onChange={cambiarPlan}
          opciones={tiposPlanes}
          getLabel={(t) => t.descripcion}
          getValue={(t) => t.id_tipo_planes}
        />
        <CampoTexto
          label="Nombre del plan"
          name="nombre"
          value={plan.nombre}
          onChange={cambiarPlan}
          placeholder="Ej: Plan Bomberos 2026"
        />
        <CampoTexto
          label="Resolución ministerial (Nro.)"
          name="resolucion_ministerial"
          type="number"
          value={plan.resolucion_ministerial}
          onChange={cambiarPlan}
          placeholder="Ej: 1250"
        />
        <div className="grid grid-cols-2 gap-4">
          <CampoTexto
            label="Vigencia desde"
            name="vigencia_dde"
            type="date"
            value={plan.vigencia_dde}
            onChange={cambiarPlan}
          />
          <CampoTexto
            label="Vigencia hasta"
            name="vigencia_hta"
            type="date"
            value={plan.vigencia_hta}
            onChange={cambiarPlan}
          />
        </div>
      </div>
      <CampoTexto
        label="Descripción del plan"
        name="descrip"
        value={plan.descrip}
        onChange={cambiarPlan}
        placeholder="Ej: Plan orientado a..."
      />
      {/* Botón de envío que aplica estilos disabled y spinner según el estado del flag guardando */}
      <Acciones guardando={guardando} texto="Crear plan y seguir" />
    </form>
  );
}

