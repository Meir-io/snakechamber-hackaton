import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { apiGrafo } from '../../api/cliente'
import { TarjetaMetrica } from '../componentes/TarjetaMetrica'
import { GraficoRiesgo } from '../componentes/GraficoRiesgo'

// Fallback igual al de la página de grafo
const FALLBACK = {
  totales: { rojas: 2, naranjas: 0, amarillas: 0 },
  alertas: [
    { rfc: 'BEVZ250808U8K', nombre: 'Valverde-Montaño', riesgo: 'roja', motivo: 'Score IA: 100.0 (GAT/GAE detectado)', conexiones: 89 },
    { rfc: 'WEDO781019YVU', nombre: 'Pedraza, Prieto y Jáquez', riesgo: 'roja', motivo: 'Score IA: 92.7 (GAT/GAE detectado)', conexiones: 49 },
  ],
}

export function PaginaDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'analizar'],
    queryFn: async () => {
      const res = await apiGrafo.analizarGrafo()
      return res.data
    },
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const datos = data || (isError ? FALLBACK : null)
  const totales = datos?.totales || { rojas: 0, naranjas: 0, amarillas: 0 }
  const alertas = datos?.alertas || []
  const totalAlertas = alertas.length
  const indiceRiesgo = totales.rojas + totales.naranjas + totales.amarillas > 0
    ? Math.round((totales.rojas * 100 + totales.naranjas * 50) / (totales.rojas + totales.naranjas + totales.amarillas))
    : 0
  const totalConexiones = alertas.reduce((s, a) => s + (a.conexiones || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-encabezado text-2xl font-bold text-[#E2E8F0]">
            Panel de Control
          </h2>
          <p className="text-[#64748B] text-sm font-mono mt-0.5">
            Análisis GNN · {alertas.length} alertas activas
          </p>
        </div>
        <Link
          to="/grafo"
          className="px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #00E5FF, #00E5FFcc)',
            color: '#0A0C10',
          }}
        >
          Ver grafo completo →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TarjetaMetrica
          titulo="Alertas Activas"
          valor={totalAlertas}
          formato="numero"
          cargando={isLoading}
          peligro={totalAlertas > 5}
        />
        <TarjetaMetrica
          titulo="Riesgo Alto (Rojas)"
          valor={totales.rojas}
          formato="numero"
          cargando={isLoading}
          peligro={totales.rojas > 0}
        />
        <TarjetaMetrica
          titulo="Índice de Riesgo"
          valor={indiceRiesgo}
          formato="porcentaje"
          cargando={isLoading}
          peligro={indiceRiesgo > 60}
        />
        <TarjetaMetrica
          titulo="Conexiones Sospechosas"
          valor={totalConexiones}
          formato="numero"
          cargando={isLoading}
          peligro={totalConexiones > 50}
        />
      </div>

      {/* Grid: gráfico + alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Riesgo */}
        <div className="bg-[#141820] border border-[#2A3140] rounded-[12px] p-5 hover:border-[#00E5FF]/30 transition-all duration-300">
          <h3 className="font-encabezado text-lg font-semibold text-[#E2E8F0] mb-4">
            Distribución de Riesgo
          </h3>
          <GraficoRiesgo
            datos={[
              { municipio: 'Rojas', contratos: totales.rojas, riesgo: 100 },
              { municipio: 'Naranjas', contratos: totales.naranjas, riesgo: 60 },
              { municipio: 'Amarillas', contratos: totales.amarillas, riesgo: 30 },
            ]}
          />
        </div>

        {/* Alertas Recientes del análisis GNN */}
        <div className="bg-[#141820] border border-[#2A3140] rounded-[12px] p-5 hover:border-[#00E5FF]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-encabezado text-lg font-semibold text-[#E2E8F0]">
              Alertas del GNN
            </h3>
            <Link
              to="/grafo"
              className="text-[10px] font-mono text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors"
            >
              Ver en grafo →
            </Link>
          </div>

          {!alertas.length ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto mb-2 text-[#2A3140]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#64748B] text-sm">No hay alertas activas</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {alertas.map((alerta) => (
                <div
                  key={alerta.rfc}
                  className="flex items-center gap-3 p-3 bg-[#0A0C10] rounded-lg border border-[#1E2533] hover:border-[#FF3366]/40 transition-all duration-300"
                >
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    alerta.riesgo === 'roja' ? 'bg-[#dc2626] shadow-[0_0_8px_rgba(220,38,38,0.6)] animate-pulse' :
                    alerta.riesgo === 'naranja' ? 'bg-[#f59e0b]' : 'bg-[#eab308]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E2E8F0] truncate font-medium">{alerta.nombre}</p>
                    <p className="text-[10px] text-[#64748B] font-mono truncate">{alerta.rfc} · {alerta.motivo}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono font-bold ${
                      alerta.riesgo === 'roja' ? 'text-[#dc2626]' : 'text-[#f59e0b]'
                    }`}>
                      {alerta.riesgo}
                    </span>
                    <p className="text-[9px] text-[#64748B] font-mono">{alerta.conexiones} conexiones</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
