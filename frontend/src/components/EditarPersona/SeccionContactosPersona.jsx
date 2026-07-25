import React from "react";
import { Phone, Mail } from "lucide-react";
import { Seccion, CampoTexto } from "./SharedPersonaComponents";

export default function SeccionContactosPersona({
  contactos,
  seccionAbierta,
  setSeccionAbierta,
  cambiarContactos,
}) {
  return (
    <Seccion
      id="contactos"
      icono={<Phone size={23} />}
      titulo="Contactos"
      abierta={seccionAbierta === "contactos"}
      onToggle={setSeccionAbierta}
    >
      <CampoTexto
        label="Email"
        name="email"
        type="email"
        value={contactos.email}
        onChange={cambiarContactos}
        placeholder="Ej: persona@email.com"
        icono={<Mail size={20} />}
      />
      <CampoTexto
        label="Celular"
        name="celular"
        value={contactos.celular}
        onChange={cambiarContactos}
        placeholder="Ej: 3415551234"
        icono={<Phone size={20} />}
      />
    </Seccion>
  );
}
