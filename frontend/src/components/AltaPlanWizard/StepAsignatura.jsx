import { BookMarked } from "lucide-react";
import { CampoSelect, Acciones, TituloPaso } from "../FormHelpers";

// Recibimos de la vista padre:
// - texto: cadena descriptiva para mostrar en el cartel del estado vacío.
const EstadoVacio = ({ texto }) => (
  // Si la colección viene vacía, mostramos un mensaje amigable en lugar de una grilla rota.
  <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>
);

// Recibimos de la vista padre:
// - asignaturaPlan: objeto del formulario local que mapea la asignatura a asociar.
// - cambiarAsignaturaPlan: manejador para actualizar campos select.
// - asignaturas: lista global de materias.
// - rangos: lista global de rangos jerárquicos.
// - sedes: lista global de sedes.
// - guardando: flag de carga del submit.
// - guardarAsignatura: manejador del submit del paso.
// - asignaturasCargadas: lista de materias ya guardadas en este plan.
// - onBack: acción para retroceder al paso anterior.
export default function StepAsignatura({
  asignaturaPlan,
  cambiarAsignaturaPlan,
  asignaturas,
  rangos,
  sedes,
  guardando,
  guardarAsignatura,
  asignaturasCargadas,
  onBack,
}) {
  return (
    <form onSubmit={guardarAsignatura} className="space-y-6">
      <TituloPaso icono={<BookMarked size={26} />} titulo="Asociar asignatura al plan" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CampoSelect
          label="Asignatura"
          name="asignatura_id"
          value={asignaturaPlan.asignatura_id}
          onChange={cambiarAsignaturaPlan}
          opciones={asignaturas}
          getLabel={(item) => item.nombre}
        />
        <CampoSelect
          label="Rango mínimo"
          name="rango_minimo_id"
          value={asignaturaPlan.rango_minimo_id}
          onChange={cambiarAsignaturaPlan}
          opciones={rangos}
          getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
        />
        <CampoSelect
          label="Sede de dictado"
          name="sedes_id"
          value={asignaturaPlan.sedes_id}
          onChange={cambiarAsignaturaPlan}
          opciones={sedes}
          getLabel={(item) => item.nombre}
        />
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-xl font-extrabold text-slate-800">Asignaturas asociadas en este plan</h3>
        {asignaturasCargadas.length > 0 ? (
          <div className="space-y-2">
            {/* Mapeamos el listado de asignaturas cargadas asegurando un key único para optimizar el ciclo de render de React */}
            {asignaturasCargadas.map((item, index) => (
              <div key={item.id || index} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
                <p className="text-slate-880 font-extrabold">{item.asignatura}</p>
                <p className="text-slate-500 font-semibold mt-1">Sede: {item.sede || "-"} | Rango: {item.rango || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <EstadoVacio texto="Todavía no agregaste asignaturas a este plan." />
        )}
      </div>

      {/* Disparamos la acción de avanzar a condiciones. Si no hay materias asociadas ni seleccionada, deshabilitamos el botón */}
      <Acciones
        guardando={guardando}
        texto="Guardar y seguir a condiciones"
        onBack={onBack}
        deshabilitado={asignaturasCargadas.length === 0 && !asignaturaPlan.asignatura_id}
      />
    </form>
  );
}

