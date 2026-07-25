import { GitBranch, PlusCircle, Trash2 } from "lucide-react";
import { CampoSelect, Acciones, TituloPaso } from "../FormHelpers";

// Recibimos de la vista padre:
// - texto: mensaje informativo para cuando no hay correlativas o elementos cargados.
const EstadoVacio = ({ texto }) => (
  // Si la colección viene vacía, mostramos una alerta para evitar componentes vacíos.
  <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>
);

// Recibimos de la vista padre:
// - asignaturasCargadas: listado de materias del plan actual para relacionarlas entre sí.
// - nuevaCorrelativa: objeto local de formulario que mapea el ID de la materia origen y la requerida.
// - cambiarCorrelativa: manejador del evento de cambio para los selectores de correlativas.
// - agregarCorrelativa: trigger para guardar la correlatividad en la base de datos.
// - correlativasCargadas: lista de correlativas que ya han sido vinculadas.
// - eliminarCorrelativa: trigger para dar de baja la correlativa.
// - guardando: bandera para animar o bloquear operaciones concurrentes.
// - onBack / onNext: callbacks para avanzar o retroceder de paso.
export default function StepCorrelativas({
  asignaturasCargadas,
  nuevaCorrelativa,
  cambiarCorrelativa,
  agregarCorrelativa,
  correlativasCargadas,
  eliminarCorrelativa,
  guardando,
  onBack,
  onNext,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<GitBranch size={26} />} titulo="Correlativas del plan" />
      {/* Si hay menos de 2 materias registradas, prevenimos la carga de correlativas localmente */}
      {asignaturasCargadas.length < 2 ? (
        <EstadoVacio texto="Necesitas al menos dos asignaturas cargadas para crear correlativas." />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            agregarCorrelativa();
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CampoSelect
              label="Asignatura que requiere"
              name="pa_id"
              value={nuevaCorrelativa.pa_id}
              onChange={cambiarCorrelativa}
              opciones={asignaturasCargadas}
              getLabel={(item) => item.asignatura}
            />
            <CampoSelect
              label="Asignatura requerida"
              name="asignatura_id"
              value={nuevaCorrelativa.asignatura_id}
              onChange={cambiarCorrelativa}
              opciones={asignaturasCargadas}
              getLabel={(item) => item.asignatura}
            />
          </div>
          <div className="flex justify-end">
            {/* Si está guardando, aplicamos opacidad y cursor-not-allowed al botón mediante disabled */}
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
            >
              <PlusCircle size={22} />
              Agregar correlativa
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-extrabold text-slate-800">Correlativas cargadas</h3>
        {correlativasCargadas.length > 0 ? (
          /* Mapeamos el listado de correlativas garantizando un ID único en el atributo key para optimizar React */
          correlativasCargadas.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Para cursar</p>
                  <h4 className="text-lg font-extrabold text-slate-800 mt-1">{item.asignaturaQueRequiere}</h4>
                  <p className="text-slate-600 font-semibold mt-1">Requiere: {item.asignaturaRequerida}</p>
                </div>
                {/* Botón para remover la correlativa de este plan de estudios en memoria */}
                <button
                  type="button"
                  onClick={() => eliminarCorrelativa(item.id)}
                  disabled={guardando}
                  className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="Todavía no cargaste correlativas para este plan." />
        )}
      </div>

      <Acciones guardando={false} texto="Finalizar alta" onBack={onBack} onSubmit={onNext} />
    </section>
  );
}

