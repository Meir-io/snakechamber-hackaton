import { Card, Chip } from '@heroui/react'

const clusteresMock = [
  { id: 1, nombre: 'Municipio de Apizaco', clusterId: 'CLT-001', monto: 12400000, alertas: 43, rango: 'high' },
  { id: 2, nombre: 'Secretaria de Obras', clusterId: 'CLT-002', monto: 8300000, alertas: 28, rango: 'high' },
  { id: 3, nombre: 'Municipio de Huamantla', clusterId: 'CLT-003', monto: 5300000, alertas: 15, rango: 'medium' },
]

const formatearMoneda = (v) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v}`
}

export function ClustriesRiesgo({ cargando = false }) {
  return (
    <Card className="bg-superficie border-borde">
      <Card.Header className="px-4 pt-4 pb-0 flex items-center justify-between">
        <Card.Title className="text-sm font-encabezado font-semibold text-peligro uppercase tracking-wider flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peligro opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-peligro"></span>
          </span>
          High Risk Clusters
        </Card.Title>
        <Chip size="sm" variant="soft" color="danger" className="cursor-pointer">
          Investigate All
        </Chip>
      </Card.Header>
      <Card.Content className="p-4 space-y-2">
        {clusteresMock.map((cluster, idx) => (
          <div
            key={cluster.id}
            className="flex items-center gap-3 p-3 bg-fondo rounded-pequeno border border-borde hover:border-peligro/30 transition-all duration-300 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-peligro/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-bold text-peligro">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-texto font-medium truncate">{cluster.nombre}</p>
              <p className="text-xs text-apagado font-mono">{cluster.clusterId}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono font-bold text-peligro">{formatearMoneda(cluster.monto)}</p>
              <p className="text-xs text-apagado font-mono">{cluster.alertas} flagged segs</p>
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  )
}
