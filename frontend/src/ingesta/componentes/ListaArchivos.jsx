import { CheckCircleIcon, DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function ListaArchivos({ archivos, seleccionado, onSelect }) {
  if (!archivos.length) {
    return (
      <div className="bg-[#141820] border border-[#2A3140] rounded-[12px] p-5 flex items-center justify-center min-h-[12rem]">
        <p className="text-[#64748B] text-sm text-center">
          No hay archivos en la cola
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#141820] border border-[#2A3140] rounded-[12px] p-4 flex-1 overflow-hidden">
      <h3 className="font-encabezado text-sm font-semibold text-[#E2E8F0] mb-3 uppercase tracking-wider">
        Cola de Procesamiento
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {archivos.map((archivo, indice) => (
          <div
            key={indice}
            onClick={() => onSelect(archivo)}
            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
              seleccionado === archivo
                ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/30'
                : 'bg-[#0A0C10] border border-[#2A3140] hover:border-[#64748B]'
            }`}
          >
            <DocumentIcon className="w-5 h-5 text-[#64748B] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#E2E8F0] truncate">{archivo.nombre}</p>
              <p className="text-xs text-[#64748B] font-mono">
                {(archivo.tamaño / 1024).toFixed(1)} KB
              </p>
              {archivo.estado === 'procesando' && (() => {
                const p = archivo.progreso
                const pct = typeof p === 'object' ? p.pct : (p ?? 0)
                return (
                  <div className="mt-1 space-y-0.5">
                    <div className="h-1 bg-[#1E2533] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00E5FF] rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-mono text-[#64748B]">
                      {typeof p === 'object' && p.fase
                        ? p.pagina && p.totalPaginas
                          ? `${p.fase} · pág ${p.pagina}/${p.totalPaginas}`
                          : p.fase
                        : `${pct}%`}
                    </p>
                  </div>
                )
              })()}
              {archivo.error && (
                <p className="text-xs text-[#FF3366] font-mono mt-0.5 truncate">{archivo.error}</p>
              )}
            </div>
            {archivo.estado === 'completado' && (
              <CheckCircleIcon className="w-5 h-5 text-[#00FFAA] shrink-0" />
            )}
            {archivo.estado === 'error' && (
              <XCircleIcon className="w-5 h-5 text-[#FF3366] shrink-0" />
            )}
            {archivo.estado === 'procesando' && (() => {
              const p = archivo.progreso
              const pct = typeof p === 'object' ? p.pct : (p ?? 0)
              return <span className="text-[10px] font-mono text-[#00E5FF] shrink-0">{pct}%</span>
            })()}
          </div>
        ))}
      </div>
    </div>
  )
}
