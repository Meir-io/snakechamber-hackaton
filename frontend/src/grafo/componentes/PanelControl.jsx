import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { esquemaFiltroGrafo } from '../../esquemas'
import { usarAlmacenGrafo } from '../../almacen'

export function PanelControl() {
  const [abierto, setAbierto] = useState(true)
  const { filtros, actualizarFiltros } = usarAlmacenGrafo()

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(esquemaFiltroGrafo),
    defaultValues: filtros,
  })

  const alEnviar = (datos) => {
    actualizarFiltros(datos)
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="absolute top-4 right-4 bg-superficie/90 backdrop-blur-sm border border-borde rounded-pequeno px-3 py-2 text-xs text-apagado hover:text-texto transition-colors"
      >
        Filtros
      </button>
    )
  }

  return (
    <div className="absolute top-4 right-4 w-80 bg-superficie/95 backdrop-blur-sm rounded-mediano border border-borde p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-encabezado text-sm font-semibold text-texto uppercase tracking-wider">
          Filtros GNN
        </h3>
        <button
          onClick={() => setAbierto(false)}
          className="text-apagado hover:text-texto text-xs"
        >
          Cerrar
        </button>
      </div>

      <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('mostrarSoloEfos')}
            className="w-4 h-4 rounded border-borde bg-fondo text-primario focus:ring-primario"
          />
          <span className="text-sm text-texto">Mostrar solo EFOS</span>
        </label>

        <div>
          <label className="text-xs text-apagado uppercase tracking-wider block mb-2">
            Monto mínimo
          </label>
          <input
            type="number"
            {...register('montoMinimo', { valueAsNumber: true })}
            className="w-full bg-fondo border border-borde rounded-pequeno px-3 py-2 text-sm text-texto font-mono focus:outline-none focus:border-primario"
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-xs text-apagado uppercase tracking-wider block mb-2">
            Densidad cluster: {watch('densidadCluster')}
          </label>
          <input
            type="range"
            {...register('densidadCluster', { valueAsNumber: true })}
            min="0"
            max="1"
            step="0.1"
            className="w-full accent-primario"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primario/10 border border-primario/30 text-primario rounded-pequeno py-2 text-sm font-medium uppercase tracking-wider hover:bg-primario/20 transition-all duration-300"
        >
          Aplicar Filtros
        </button>
      </form>
    </div>
  )
}
