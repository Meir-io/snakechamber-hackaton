import { useQuery } from '@tanstack/react-query'
import { apiDashboard } from '../../api/cliente'
import { TarjetaMetrica } from '../componentes/TarjetaMetrica'
import { ListaAlertas } from '../componentes/ListaAlertas'
import { GraficoRiesgo } from '../componentes/GraficoRiesgo'

export function PaginaDashboard() {
  const { data: metricas, isLoading: cargandoMetricas } = useQuery({
    queryKey: ['dashboard', 'metricas'],
    queryFn: () => apiDashboard.obtenerMetricas(),
  })

  const { data: alertas } = useQuery({
    queryKey: ['dashboard', 'alertas'],
    queryFn: () => apiDashboard.obtenerAlertas(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-encabezado text-2xl font-bold text-texto">
          Panel de Control
        </h2>
        <span className="text-apagado text-sm font-mono">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TarjetaMetrica
          titulo="Total Contratos"
          valor={metricas?.data?.totalContratos || 0}
          formato="numero"
          cargando={cargandoMetricas}
        />
        <TarjetaMetrica
          titulo="Monto Total"
          valor={metricas?.data?.montoTotal || 0}
          formato="moneda"
          cargando={cargandoMetricas}
        />
        <TarjetaMetrica
          titulo="Índice de Riesgo"
          valor={metricas?.data?.indiceRiesgo || 0}
          formato="porcentaje"
          cargando={cargandoMetricas}
          peligro={metricas?.data?.indiceRiesgo > 60}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta-metrica">
          <h3 className="font-encabezado text-lg font-semibold text-texto mb-4">
            Distribución de Riesgo
          </h3>
          <GraficoRiesgo datos={alertas?.data || []} />
        </div>

        <div className="tarjeta-metrica">
          <h3 className="font-encabezado text-lg font-semibold text-texto mb-4">
            Alertas Recientes
          </h3>
          <ListaAlertas alertas={alertas?.data || []} />
        </div>
      </div>
    </div>
  )
}
