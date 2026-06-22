import { Card, Chip } from '@heroui/react'

export function ListaAlertas({ alertas }) {
  if (!alertas.length) {
    return (
      <Card variant="transparent" className="bg-[#141820] border border-[#2A3140] rounded-lg">
        <Card.Content className="p-5">
          <div className="text-center py-6">
            <svg className="w-10 h-10 mx-auto mb-2 text-[#2A3140]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#64748B] text-sm">No hay alertas recientes</p>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {alertas.map((alerta) => (
        <div
          key={alerta.id}
          className="flex items-center gap-3 p-3 bg-[#141820] rounded-lg border border-[#2A3140] hover:border-[#FF3366]/40 transition-all duration-300"
        >
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            alerta.nivel === 'critico' ? 'bg-[#FF3366] shadow-[0_0_8px_rgba(255,51,102,0.6)] animate-pulse' :
            alerta.nivel === 'alto' ? 'bg-[#FF6633]' :
            alerta.nivel === 'medio' ? 'bg-[#FFB800]' : 'bg-[#00FFAA]'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#E2E8F0] truncate">{alerta.mensaje}</p>
            <p className="text-xs text-[#64748B] font-mono">{alerta.fecha}</p>
          </div>
          <Chip
            size="sm"
            variant="soft"
            color={
              alerta.nivel === 'critico' || alerta.nivel === 'alto' ? 'danger' :
              alerta.nivel === 'medio' ? 'warning' : 'success'
            }
            className="shrink-0"
          >
            {alerta.nivel}
          </Chip>
        </div>
      ))}
    </div>
  )
}
