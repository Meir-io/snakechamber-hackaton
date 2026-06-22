import { CheckCircleIcon, DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function ListaArchivos({ archivos, seleccionado, onSelect }) {
  if (!archivos.length) {
    return (
      <div className="tarjeta-metrica h-48 flex items-center justify-center">
        <p className="text-apagado text-sm text-center">
          No hay archivos en la cola
        </p>
      </div>
    )
  }

  return (
    <div className="tarjeta-metrica flex-1 overflow-hidden">
      <h3 className="font-encabezado text-sm font-semibold text-texto mb-3 uppercase tracking-wider">
        Cola de Procesamiento
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {archivos.map((archivo, indice) => (
          <div
            key={indice}
            onClick={() => onSelect(archivo)}
            className={`flex items-center gap-3 p-2.5 rounded-pequeno cursor-pointer transition-all duration-300 ${
              seleccionado === archivo
                ? 'bg-primario/10 border border-primario/30'
                : 'bg-fondo border border-borde hover:border-apagado'
            }`}
          >
            <DocumentIcon className="w-5 h-5 text-apagado flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-texto truncate">{archivo.nombre}</p>
              <p className="text-xs text-apagado font-mono">
                {(archivo.tamaño / 1024).toFixed(1)} KB
              </p>
            </div>
            {archivo.estado === 'completado' && (
              <CheckCircleIcon className="w-5 h-5 text-exito" />
            )}
            {archivo.estado === 'error' && (
              <XCircleIcon className="w-5 h-5 text-peligro" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
