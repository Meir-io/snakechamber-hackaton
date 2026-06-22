import { Card, ProgressCircle, Skeleton, Chip } from '@heroui/react'

export function TarjetaMetrica({ titulo, valor, subvalor, formato = 'numero', cargando = false, peligro = false, progreso = null, alerta = false }) {
  const formatearValor = (v, fmt) => {
    if (fmt === 'moneda') {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v)
    }
    if (fmt === 'numero') {
      return new Intl.NumberFormat('es-MX').format(v)
    }
    return v
  }

  if (cargando) {
    return (
      <Card variant="transparent" className="bg-superficie border border-borde rounded-pequeno">
        <Card.Content className="p-5 space-y-3">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card variant="transparent" className="bg-superficie border border-borde rounded-pequeno hover:border-primario/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] transition-all duration-300">
      <Card.Content className="p-5 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-apagado text-xs font-mono uppercase tracking-wider mb-1">
            {titulo}
          </p>
          <div className="flex items-baseline gap-2">
            <p className={`font-encabezado text-3xl font-bold ${peligro ? 'text-peligro' : 'text-texto'}`}>
              {formatearValor(valor, formato)}
            </p>
            {subvalor && (
              <span className={`text-xs font-mono ${peligro ? 'text-peligro' : 'text-exito'}`}>
                {subvalor}
              </span>
            )}
          </div>
          {alerta && (
            <div className="mt-2">
              <Chip color="danger" size="sm" variant="soft">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Alert
                </span>
              </Chip>
            </div>
          )}
        </div>
        {progreso !== null && (
          <ProgressCircle
            aria-label={`${titulo} progress`}
            value={progreso}
            size="lg"
            className={`shrink-0 ${peligro ? '[&_[data-slot=fill-circle]]:stroke-peligro' : ''}`}
          >
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle />
              <ProgressCircle.FillCircle />
            </ProgressCircle.Track>
          </ProgressCircle>
        )}
      </Card.Content>
    </Card>
  )
}
