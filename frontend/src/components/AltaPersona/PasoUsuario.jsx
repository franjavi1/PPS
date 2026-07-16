import React from "react";
import { ShieldCheck } from "lucide-react";
import { TituloPaso, CampoTexto, CampoCheckbox, Acciones } from "./FormFields";

export default function PasoUsuario({
  usuario,
  cambiarUsuario,
  guardarUsuario,
  onBack,
}) {
  return (
    <form onSubmit={guardarUsuario} className="space-y-6">
      <TituloPaso
        icono={<ShieldCheck size={26} />}
        titulo="Usuario de acceso"
      />
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-yellow-800 font-semibold">
        Este paso queda en modo pendiente/mock hasta conectar el
        microservicio de usuarios.
      </div>
      <Acciones
        guardando={false}
        texto="Finalizar alta"
        onBack={onBack}
      />
    </form>
  );
}
