import React from "react";
import { BookOpen, Hash, FileText, CalendarDays } from "lucide-react";
import { Seccion, CampoSelect, CampoTexto } from "./SharedPlanComponents";

export default function SeccionDatosPlan({
  plan,
  tiposPlanes,
  seccionAbierta,
  setSeccionAbierta,
  cambiarPlan,
}) {
  return (
    <Seccion
      id="plan"
      icono={<BookOpen size={23} />}
      titulo="Datos del plan"
      abierta={seccionAbierta === "plan"}
      onToggle={setSeccionAbierta}
    >
      <CampoSelect
        label="Tipo de plan"
        name="tipo_planes_id_tipo_planes"
        value={plan.tipo_planes_id_tipo_planes}
        onChange={cambiarPlan}
        opciones={tiposPlanes}
        getValue={(tipo) => tipo.id_tipo_planes}
        getLabel={(tipo) => tipo.descripcion}
      />
      <CampoTexto
        label="Resolucion ministerial"
        name="resolucion_ministerial"
        type="number"
        value={plan.resolucion_ministerial}
        onChange={cambiarPlan}
        placeholder="Ej: 2026001"
        icono={<Hash size={20} />}
      />
      <CampoTexto
        label="Nombre"
        name="nombre"
        value={plan.nombre}
        onChange={cambiarPlan}
        placeholder="Ej: Plan de Formacion Inicial"
        icono={<FileText size={20} />}
      />
      <CampoTexto
        label="Descripcion"
        name="descrip"
        value={plan.descrip}
        onChange={cambiarPlan}
        placeholder="Breve descripcion"
        icono={<FileText size={20} />}
      />
      <CampoTexto
        label="Vigencia desde"
        name="vigencia_dde"
        type="date"
        value={plan.vigencia_dde}
        onChange={cambiarPlan}
        icono={<CalendarDays size={20} />}
      />
      <CampoTexto
        label="Vigencia hasta"
        name="vigencia_hta"
        type="date"
        value={plan.vigencia_hta}
        onChange={cambiarPlan}
        icono={<CalendarDays size={20} />}
      />
    </Seccion>
  );
}
