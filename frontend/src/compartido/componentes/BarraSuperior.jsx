import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usarAlmacenDashboard } from '../../almacen'

export function BarraSuperior() {
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState([])

  const manejarBusqueda = async (e) => {
    e.preventDefault()
    if (!consulta.trim()) return
    // TODO: integrar con API de búsqueda
  }

  return (
    <header className="h-16 bg-superficie border-b border-borde flex items-center px-6 gap-4">
      <form onSubmit={manejarBusqueda} className="flex-1 max-w-xl">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apagado" />
          <input
            type="text"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar RFCs, nombres, contratos..."
            className="w-full bg-fondo border border-borde rounded-pequeno pl-10 pr-4 py-2.5 text-sm text-texto placeholder-apagado focus:outline-none focus:border-primario focus:shadow-brillo-primario transition-all duration-300"
          />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-apagado font-mono">Tlaxcala, MX</p>
          <p className="text-xs text-primario font-mono">En Vivo</p>
        </div>
      </div>
    </header>
  )
}
