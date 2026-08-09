import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ActionButtons({ 
  onView, canView = true, titleView = "Ver",
  onEdit, canEdit = true, titleEdit = "Editar",
  onDelete, canDelete = true, titleDelete = "Eliminar" 
}) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={onView}
          disabled={!canView}
          title={!canView ? "No tenés permisos para esta acción" : titleView}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-transparent border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          disabled={!canEdit}
          title={!canEdit ? "No tenés permisos para esta acción" : titleEdit}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-transparent border border-blue-200 rounded-md hover:bg-blue-50 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={!canDelete}
          title={!canDelete ? "No tenés permisos para esta acción" : titleDelete}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-transparent border border-red-200 rounded-md hover:bg-red-50 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      )}
    </div>
  );
}
