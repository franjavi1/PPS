import React from "react";
import { Save } from "lucide-react";

// Recibimos de la vista padre:
// - icono: nodo JSX del ícono ilustrativo del paso.
// - titulo: texto de cabecera principal del asistente.
export function TituloPaso({ icono, titulo }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
        {icono}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800">{titulo}</h2>
    </div>
  );
}

// Recibimos de la vista padre:
// - label: etiqueta de texto explicativo.
// - name: atributo name del input.
// - value: valor enlazado del estado.
// - onChange: callback para capturar lo digitado.
// - placeholder: texto de sugerencia.
// - type: tipo de input.
// - icono: ícono interno para el textbox.
export function CampoTexto({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icono,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icono && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-14 border border-slate-300 rounded-xl pr-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            icono ? "pl-12" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

// Recibimos de la vista padre:
// - label: nombre del campo.
// - name: atributo html name.
// - value: valor seleccionado.
// - onChange: callback al seleccionar.
// - opciones: colección de registros de la BD a listar.
// - getLabel: selector de texto para renderizar la opción.
export function CampoSelect({ label, name, value, onChange, opciones, getLabel }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="">Seleccione una opcion</option>
        {/* Mapeamos el listado de opciones asegurando un key único (el id de BD) para optimizar React */}
        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {getLabel(opcion)}
          </option>
        ))}
      </select>
    </div>
  );
}

// Recibimos de la vista padre:
// - label: nombre descriptivo.
// - name: atributo name.
// - value: valor actual.
// - onChange: manejador onChange.
// - opciones: array simple de strings.
export function CampoSelectSimple({ label, name, value, onChange, opciones }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="">Seleccione una opcion</option>
        {/* Mapeamos las opciones utilizando el string como key único */}
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}

// Recibimos de la vista padre:
// - label: texto al lado de la casilla.
// - name: atributo name.
// - checked: boolean flag.
// - onChange: manejador onChange.
export function CampoCheckbox({ label, name, checked, onChange }) {
  return (
    <label className="h-14 flex items-center gap-3 border border-slate-300 rounded-xl px-4 text-slate-700 font-bold">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-red-700"
      />
      {label}
    </label>
  );
}

// Recibimos de la vista padre:
// - label: etiqueta de cabecera.
// - value: texto fijo de sólo lectura.
export function CampoSoloLectura({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="min-h-14 border border-slate-200 rounded-xl px-4 py-4 bg-slate-50 text-slate-700 font-bold">
        {value}
      </div>
    </div>
  );
}

// Recibimos de la vista padre:
// - guardando: flag de submit que bloquea interacciones concurrentes.
// - texto: cadena del botón principal.
// - onBack: callback de acción para volver.
export function Acciones({ guardando, texto, onBack }) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
        >
          Volver
        </button>
      )}
      {/* Si está guardando, inhabilitamos y aplicamos opacidad */}
      <button
        type="submit"
        disabled={guardando}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
      >
        <Save size={22} />
        {guardando ? "Guardando..." : texto}
      </button>
    </div>
  );
}

// Recibimos de la vista padre:
// - icono: nodo JSX para ilustrar el item.
// - titulo: texto de cabecera superior.
// - texto: contenido de la tarjeta.
export function ResumenItem({ icono, titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <div className="text-red-700 mb-3">{icono}</div>
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

