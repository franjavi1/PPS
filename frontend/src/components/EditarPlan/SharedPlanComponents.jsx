import React from "react";
import { ChevronDown } from "lucide-react";

export function Seccion({ id, icono, titulo, abierta, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <button
        type="button"
        onClick={() => onToggle(abierta ? "" : id)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            {icono}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">{titulo}</h2>
        </div>
        <ChevronDown
          size={22}
          className={`text-slate-500 transition ${abierta ? "rotate-180" : ""}`}
        />
      </button>

      {abierta && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 p-5 bg-white">
          {children}
        </div>
      )}
    </section>
  );
}

export function CampoTexto({
  label,
  name,
  value,
  onChange,
  placeholder,
  icono,
  type = "text",
  maxLength,
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
          maxLength={maxLength}
          className={`w-full h-14 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            icono ? "pl-12" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

export function CampoSelect({
  label,
  name,
  value,
  onChange,
  opciones,
  getValue,
  getLabel,
}) {
  const opcionesSeguras = Array.isArray(opciones) ? opciones : [];

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
      >
        <option value="">Seleccione una opcion</option>
        {opcionesSeguras.map((opcion) => (
          <option key={getValue(opcion)} value={getValue(opcion)}>
            {getLabel(opcion)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CampoSelectSimple({ label, name, value, onChange, opciones }) {
  return (
    <CampoSelect
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      opciones={opciones.map((item) => ({ id: item, label: item }))}
      getValue={(item) => item.id}
      getLabel={(item) => item.label}
    />
  );
}

export function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

export function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold md:col-span-2">
      {texto}
    </div>
  );
}
