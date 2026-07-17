import { ShieldCheck } from "lucide-react";
import { TituloPaso, CampoTexto, CampoCheckbox, Acciones } from "../FormHelpers";

// Recibimos de la vista padre:
// - usuario: objeto de formulario para crear el rol de acceso.
// - cambiarUsuario: callback de cambio para los inputs y checkboxes.
// - guardarUsuario: callback onSubmit para finalizar la creación del usuario.
// - onBack: manejador callback para volver al paso de datos asociados.
export default function StepUsuario({
  usuario,
  cambiarUsuario,
  guardarUsuario,
  onBack,
}) {
  return (
    // Enviamos los datos para crear el usuario en el microservicio correspondiente
    <form onSubmit={guardarUsuario} className="space-y-6">
      <TituloPaso icono={<ShieldCheck size={26} />} titulo="Usuario de acceso" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoTexto
          label="Rol solicitado"
          name="rol"
          value={usuario.rol}
          onChange={cambiarUsuario}
          placeholder="Ej: bombero"
        />
        <CampoCheckbox
          label="Solicitar usuario al microservicio Login"
          name="crear_usuario"
          checked={usuario.crear_usuario}
          onChange={cambiarUsuario}
        />
      </div>
      {/* Mensaje aclaratorio de estado mock preventivo */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-yellow-800 font-semibold">
        Este paso queda en modo pendiente/mock hasta conectar el microservicio de usuarios.
      </div>
      <Acciones guardando={false} texto="Finalizar alta" onBack={onBack} />
    </form>
  );
}

