import { Card, Chip, Skeleton } from '@heroui/react'

const archivosMock = [
  { id: 1, nombre: 'CDI-TLX-2023-089_.pdf', paginas: 12, estado: 'exitoso' },
  { id: 2, nombre: 'INV-SALID-992_.pdf', paginas: 4, estado: 'exitoso' },
  { id: 3, nombre: 'SCANNED_DOC_081.pdf', paginas: 0, estado: 'fallido', razon: 'Unreadable document / Low DPI' },
]

const iconoEstado = {
  exitoso: (
    <svg className="w-4 h-4 text-exito" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  fallido: (
    <svg className="w-4 h-4 text-peligro" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
}

export function ListaIngesta({ cargando = false }) {
  if (cargando) {
    return (
      <Card className="bg-superficie border-borde">
        <Card.Content className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-2 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card className="bg-superficie border-borde">
      <Card.Header className="px-4 pt-4 pb-0 flex items-center justify-between">
        <Card.Title className="text-sm font-encabezado font-semibold text-texto uppercase tracking-wider">
          Ingestion Stream
        </Card.Title>
        <Chip size="sm" variant="soft" color="accent" className="cursor-pointer">
          View Pipeline
        </Chip>
      </Card.Header>
      <Card.Content className="p-4 space-y-2">
        {archivosMock.map((archivo) => (
          <div
            key={archivo.id}
            className="flex items-center gap-3 p-3 bg-fondo rounded-pequeno border border-borde hover:border-primario/30 transition-all duration-300"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              archivo.estado === 'exitoso' ? 'bg-exito/10' : 'bg-peligro/10'
            }`}>
              {iconoEstado[archivo.estado]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-texto font-mono truncate">{archivo.nombre}</p>
              <p className="text-xs text-apagado font-mono">
                {archivo.estado === 'fallido' ? archivo.razon : `Parsed: ${archivo.paginas} pages`}
              </p>
            </div>
            <Chip
              size="sm"
              color={archivo.estado === 'exitoso' ? 'success' : 'danger'}
              variant="soft"
            >
              {archivo.estado === 'exitoso' ? 'SUCCESS' : 'FAILED'}
            </Chip>
          </div>
        ))}
      </Card.Content>
    </Card>
  )
}
