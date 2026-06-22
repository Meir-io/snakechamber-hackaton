export function TarjetaMetrica({ titulo, valor, formato = 'numero', cargando = false, peligro = false }) {
  const formatearValor = (valor, formato) => {
    if (formato === 'moneda') {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
    }
    if (formato === 'porcentaje') {
      return `${valor.toFixed(1)}%`
    }
    return new Intl.NumberFormat('es-MX').format(valor)
  }

  if (cargando) {
    return (
      <div className="tarjeta-metrica animate-pulse">
        <div className="h-4 bg-borde rounded w-24 mb-3" />
        <div className="h-12 bg-borde rounded w-32" />
      </div>
    )
  }

  return (
    <div className={`tarjeta-metrica ${peligro ? 'border-peligro shadow-brillo-peligro' : ''}`}>
      <p className="text-apagado text-sm font-medium mb-1 uppercase tracking-wider">
        {titulo}
      </p>
      <p className={`font-encabezado text-4xl font-bold ${peligro ? 'text-peligro' : 'text-texto'}`}>
        {formatearValor(valor, formato)}
      </p>
    </div>
  )
}
