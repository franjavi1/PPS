import { BookOpenCheck, Tag, Hash, PlusCircle } from "lucide-react";
import { TituloPaso, CampoTexto, CampoSelect, CampoSelectSimple, Acciones } from "../FormHelpers";

// Recibimos de la vista padre:
// - texto: cadena descriptiva para el estado vacío.
const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

// Recibimos de la vista padre:
// - comisionAsignatura: objeto del formulario local con los datos de asignación de la materia.
// - cambiarComisionAsignatura: callback para actualizar los campos al tipear/seleccionar.
// - planesAsignaturas: colección de planes asignaturas habilitados en el sistema.
// - aulas: colección de aulas físicas habilitadas.
// - agregarComisionAsignatura: callback para vincular y guardar en el backend.
// - comisionesAsignaturasCargadas: listado de asignaturas asociadas en este wizard.
// - mapas: objeto con diccionarios de mapeo legibles por ID.
// - guardando: bandera para inhabilitar componentes en la carga.
// - onBack / onNext: callbacks para controlar el flujo de pasos.
export default function StepAsignaturas({
  comisionAsignatura,
  cambiarComisionAsignatura,
  planesAsignaturas,
  aulas,
  agregarComisionAsignatura,
  comisionesAsignaturasCargadas,
  mapas,
  guardando,
  onBack,
  onNext,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<BookOpenCheck size={26} />} titulo="Asignaturas de la comisión" />
      {/* Grilla responsiva de tres columnas para configurar los campos del cupo y aula */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CampoSelect
          label="Plan asignatura"
          name="plan_asignaturas_id"
          value={comisionAsignatura.plan_asignaturas_id}
          onChange={cambiarComisionAsignatura}
          opciones={planesAsignaturas}
          getLabel={(item) => mapas.planesAsignaturas[item.id]}
        />
        <CampoSelect
          label="Aula"
          name="aula_id"
          value={comisionAsignatura.aula_id}
          onChange={cambiarComisionAsignatura}
          opciones={aulas}
          getLabel={(item) => item.aula}
        />
        <CampoTexto
          label="Nombre"
          name="nombre"
          value={comisionAsignatura.nombre}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: Comisión A - Incendios"
          icon={<Tag size={20} />}
        />
        <CampoTexto
          label="Modalidad"
          name="modalidad"
          value={comisionAsignatura.modalidad}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: Presencial"
          icon={<BookOpenCheck size={20} />}
        />
        <CampoTexto
          label="Cupo máximo"
          name="cupo_maximo"
          type="number"
          value={comisionAsignatura.cupo_maximo}
          onChange={cambiarComisionAsignatura}
          placeholder="Ej: 30"
          icon={<Hash size={20} />}
        />
        <CampoSelectSimple
          label="Estado"
          name="estado"
          value={comisionAsignatura.estado}
          onChange={cambiarComisionAsignatura}
          opciones={["Activo", "Inactivo"]}
        />
      </div>
      <div className="flex justify-end">
        {/* Deshabilitamos preventivamente si ya se está guardando */}
        <button
          type="button"
          onClick={agregarComisionAsignatura}
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
        >
          <PlusCircle size={22} />
          Agregar asignatura
        </button>
      </div>

      {comisionesAsignaturasCargadas.length === 0 ? (
        <EstadoVacio texto="Todavía no agregaste asignaturas." />
      ) : (
        <div className="space-y-3">
          {/* Mapeamos el listado de materias asociadas aplicando un key único */}
          {comisionesAsignaturasCargadas.map((item, index) => (
            <div key={item.id_comision_asignatura || index} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <p className="text-slate-800 font-extrabold">{item.nombre}</p>
              <p className="text-slate-500 font-semibold mt-1">
                {item.planAsignatura || "-"} - Aula {item.aula || "-"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Controlamos el botón continuar para inhabilitarlo si no hay ninguna asignatura asociada */}
      <Acciones
        guardando={false}
        texto="Continuar"
        onBack={onBack}
        onSubmit={onNext}
        deshabilitado={comisionesAsignaturasCargadas.length === 0}
      />
    </section>
  );
}
