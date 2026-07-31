// frontend\src\components\navegacion\tituloMenuDesplegable.jsx
function TituloMenuDesplegable({ title }) {
  return (
    <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-700">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {title}
      </p>
    </div>
  );
}

export default TituloMenuDesplegable;