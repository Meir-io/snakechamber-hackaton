import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { esquemaFiltroGrafo } from '../../esquemas'
import { usarAlmacenGrafo } from '../../almacen'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function PanelControl() {
  const [abierto, setAbierto] = useState(false)
  const { filtros, actualizarFiltros } = usarAlmacenGrafo()

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(esquemaFiltroGrafo),
    defaultValues: filtros,
  })

  const alEnviar = (datos) => {
    actualizarFiltros(datos)
    setAbierto(false)
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      {abierto ? (
        <div className="w-72 bg-[#141820]/95 backdrop-blur-sm border border-[#2A3140] rounded-lg p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-encabezado text-sm font-semibold text-[#E2E8F0] uppercase tracking-wider">
              Filtros
            </h3>
            <button onClick={() => setAbierto(false)} className="text-[#64748B] hover:text-[#E2E8F0]">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('mostrarSoloEfos')}
                className="w-4 h-4 rounded border-[#2A3140] bg-[#0A0C10] accent-[#00E5FF]"
              />
              <span className="text-sm text-[#E2E8F0]">Solo EFOS</span>
            </label>

            <div>
              <label className="text-[10px] text-[#64748B] uppercase tracking-wider block mb-1.5">
                Monto mínimo
              </label>
              <input
                type="number"
                {...register('montoMinimo', { valueAsNumber: true })}
                className="w-full bg-[#0A0C10] border border-[#2A3140] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] font-mono focus:outline-none focus:border-[#00E5FF]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#64748B] uppercase tracking-wider block mb-1.5">
                Densidad cluster: {watch('densidadCluster')}
              </label>
              <input
                type="range"
                {...register('densidadCluster', { valueAsNumber: true })}
                min="0"
                max="1"
                step="0.1"
                className="w-full accent-[#00E5FF]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] rounded-lg py-2 text-sm font-medium uppercase tracking-wider hover:bg-[#00E5FF]/20 transition-all"
            >
              Aplicar
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setAbierto(true)}
          className="bg-[#141820]/90 backdrop-blur-sm border border-[#2A3140] rounded-lg px-3 py-2 text-xs text-[#64748B] hover:text-[#E2E8F0] transition-colors flex items-center gap-1.5"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filtros
        </button>
      )}
    </div>
  )
}
