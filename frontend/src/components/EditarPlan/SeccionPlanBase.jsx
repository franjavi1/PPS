import { CampoTexto, CampoSelect } from "../FormHelpers";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function SeccionPlanBase({ plan, cambiarPlan, tiposPlanes }) {
  return (
    <>
      <CampoSelect
        label="Tipo de plan"
        name="tipo_planes_id_tipo_planes"
        value={plan.tipo_planes_id_tipo_planes}
        onChange={cambiarPlan}
        opciones={tiposPlanes}
        getLabel={(t) => t.descripcion}
      />
      <CampoTexto
        label="Resolución ministerial (Nro.)"
        name="resolucion_ministerial"
        type="number"
        value={plan.resolucion_ministerial}
        onChange={cambiarPlan}
      />
      <CampoTexto
        label="Nombre del plan"
        name="nombre"
        value={plan.nombre}
        onChange={cambiarPlan}
        placeholder="Ej: Plan Bomberos 2026"
      />
      <div className="grid grid-cols-2 gap-4">
        <CampoTexto
          label="Vigencia desde"
          name="vigencia_dde"
          type="date"
          value={plan.vigencia_dde ? String(plan.vigencia_dde).slice(0, 10) : ""}
          onChange={cambiarPlan}
        />
        <CampoTexto
          label="Vigencia hasta"
          name="vigencia_hta"
          type="date"
          value={plan.vigencia_hta ? String(plan.vigencia_hta).slice(0, 10) : ""}
          onChange={cambiarPlan}
        />
      </div>
      <div className="md:col-span-2">
        <CampoTexto
          label="Descripción del plan"
          name="descrip"
          value={plan.descrip}
          onChange={cambiarPlan}
        />
      </div>
    </>
  );
}
