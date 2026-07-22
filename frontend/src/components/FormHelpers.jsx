import { ArrowLeft, Save } from "lucide-react";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export function TituloPaso({ icono, titulo }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
      <div className="text-red-700">{icono}</div>
      <h2 className="text-2xl font-extrabold text-slate-800">{titulo}</h2>
    </div>
  );
}

export function CampoTexto({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  disabled = false,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-14 border rounded-xl pr-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 ${
            icon ? "pl-12" : "px-4"
          } ${error ? "border-red-500 focus:ring-red-500" : "border-slate-300"}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function CampoSelect({
  label,
  name,
  value,
  onChange,
  opciones = [],
  getLabel = (opt) => opt.descripcion || `${opt.apellido}, ${opt.nombre} - DNI ${opt.numero_doc}`,
  error,
  icon,
  disabled = false,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-14 border rounded-xl pr-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
            icon ? "pl-12" : "px-4"
          } ${error ? "border-red-500 focus:ring-red-500" : "border-slate-300"}`}
          {...props}
        >
          <option value="">Seleccione una opción</option>
          {opciones.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {getLabel(opt)}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function CampoSelectSimple({ label, name, value, onChange, opciones = [], error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full h-14 border rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
          error ? "border-red-500 focus:ring-red-500" : "border-slate-300"
        }`}
        {...props}
      >
        <option value="">Seleccione una opción</option>
        {opciones.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function CampoSoloLectura({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center text-slate-500 font-semibold">
        {value}
      </div>
    </div>
  );
}

export function CampoCheckbox({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 h-14 pt-6">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={!!checked}
        onChange={onChange}
        className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
      />
      <label htmlFor={name} className="text-sm font-bold text-slate-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
}

export function Acciones({ guardando, texto, onBack }) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={20} />
          Atrás
        </button>
      )}
      <button
        type="submit"
        disabled={guardando}
        className="flex items-center justify-center gap-2 bg-red-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-50"
      >
        <Save size={20} />
        {guardando ? "Guardando..." : texto}
      </button>
    </div>
  );
}

export function Dato({ label, value }) {
  return (
    <div className="text-sm">
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}
