import { useQuery } from '@tanstack/react-query'
import { apiEntidad } from '../../api/cliente'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { usarAlmacenGrafo } from '../../almacen'

export function PanelDetalles({ nodoId }) {
  const { seleccionarNodo } = usarAlmacenGrafo()

  const { data: entidad, isLoading } = useQuery({
    queryKey: ['entidad', nodoId],
    queryFn: () => apiEntidad.obtenerDetalle(nodoId),
    enabled: !!nodoId,
  })

  return (
    <AnimatePresence>
      {nodoId && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-80 bg-superficie/95 backdrop-blur-sm rounded-mediano border border-borde p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-encabezado text-sm font-semibold text-texto uppercase tracking-wider">
              Detalle Entidad
            </h3>
            <button
              onClick={() => seleccionarNodo(null)}
              className="text-apagado hover:text-texto"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-8 bg-borde rounded animate-pulse" />
              <div className="h-4 bg-borde rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-borde rounded w-1/2 animate-pulse" />
            </div>
          ) : entidad?.data ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-apagado uppercase tracking-wider">RFC</p>
                <p className="font-mono text-primario text-lg">{entidad.data.rfc}</p>
              </div>

              <div>
                <p className="text-xs text-apagado uppercase tracking-wider">Razón Social</p>
                <p className="text-texto text-sm">{entidad.data.razonSocial}</p>
              </div>

              {entidad.data.esEfos && (
                <div className="bg-peligro/10 border border-peligro/30 rounded-pequeno p-3">
                  <p className="text-peligro text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-peligro animate-pulse" />
                    EFOS Detectado
                  </p>
                  <p className="text-peligro/70 text-xs mt-1">
                    Empresa fantasma identificada por el SAT
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-fondo rounded-pequeno p-3 border border-borde">
                  <p className="text-xs text-apagado">Contratos</p>
                  <p className="font-mono text-texto text-lg">{entidad.data.totalContratos}</p>
                </div>
                <div className="bg-fondo rounded-pequeno p-3 border border-borde">
                  <p className="text-xs text-apagado">Monto Total</p>
                  <p className="font-mono text-texto text-lg">
                    ${new Intl.NumberFormat('es-MX').format(entidad.data.montoTotal)}
                  </p>
                </div>
              </div>

              <button className="w-full bg-primario/10 border border-primario/30 text-primario rounded-pequeno py-2 text-sm font-medium uppercase tracking-wider hover:bg-primario/20 transition-all duration-300">
                Ver Perfil Completo
              </button>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
