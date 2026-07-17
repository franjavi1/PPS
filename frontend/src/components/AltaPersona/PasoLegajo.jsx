import React from "react";
import { FileText } from "lucide-react";
import { TituloPaso, CampoSoloLectura, CampoTexto, Acciones } from "./FormFields";

// Recibimos de la vista padre:
// - legajo: objeto del formulario que almacena el número de legajo asignado.
// - cambiarLegajo: callback para guardar en el estado al tipear.
// - guardarLegajo: callback onSubmit para crear la entidad legajo.
// - guardando: flag booleano de procesamiento concurrente.
// - personaResumen: nombre de la persona dueña del legajo.
// - personaId: ID único de la persona vinculada.
// - onBack: manejador callback para regresar de paso.
export default function PasoLegajo({
  legajo,
  cambiarLegajo,
  guardarLegajo,
  guardando,
  personaResumen,
  personaId,
  onBack,
}) {
  return (
    // Guardamos la entidad de legajo principal y seguimos a contactos
    <form onSubmit={guardarLegajo} className="space-y-6">
      <TituloPaso icono={<FileText size={26} />} titulo="Datos del legajo" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoSoloLectura
          label="Persona creada"
          value={`${personaResumen} - ID ${personaId}`}
        />
        <CampoTexto
          label="Numero de legajo"
          name="numero"
          value={legajo.numero}
          onChange={cambiarLegajo}
          placeholder="Ej: 1001"
        />
      </div>
      <Acciones
        guardando={guardando}
        texto="Crear legajo y seguir"
        onBack={onBack}
      />
    </form>
  );
}

