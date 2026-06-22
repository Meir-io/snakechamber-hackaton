export function ListaAlertas({ alertas }) {
  if (!alertas.length) {
    return (
      <div className="text-center py-8">
        <p className="text-apagado text-sm">No hay alertas recientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {alertas.map((alerta) => (
        <div
          key={alerta.id}
          className="flex items-center gap-3 p-3 bg-fondo rounded-pequeno border border-borde hover:border-peligro/50 transition-all duration-300"
        >
          <div className={`w-2 h-2 rounded-full ${
            alerta.nivel === 'critico' ? 'bg-peligro animate-pulse' :
            alerta.nivel === 'alto' ? 'bg-peligro' :
            alerta.nivel === 'medio' ? 'bg-yellow-500' : 'bg-exito'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-texto truncate">{alerta.mensaje}</p>
            <p className="text-xs text-apagado font-mono">{alerta.fecha}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-mono ${
            alerta.nivel === 'critico' ? 'bg-peligro/20 text-peligro' :
            alerta.nivel === 'alto' ? 'bg-peligro/10 text-peligro' :
            'bg-apagado/20 text-apagado'
          }`}>
            {alerta.nivel}
          </span>
        </div>
      ))}
    </div>
  )
}
