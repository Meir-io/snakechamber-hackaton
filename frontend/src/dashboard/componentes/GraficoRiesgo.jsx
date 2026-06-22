const fallbackDatos = [
  { municipio: 'Tlaxcala', contratos: 45, riesgo: 72 },
  { municipio: 'Apizaco', contratos: 32, riesgo: 58 },
  { municipio: 'Chiautempan', contratos: 28, riesgo: 45 },
  { municipio: 'Huamantla', contratos: 21, riesgo: 38 },
  { municipio: 'San Pablo', contratos: 18, riesgo: 25 },
]

const COLOR_CTOS = '#00E5FF'
const COLOR_RIESGO = '#FF3366'

export function GraficoRiesgo({ datos }) {
  const datosReales = datos?.length ? datos : fallbackDatos
  const maxValor = Math.max(...datosReales.map((d) => Math.max(d.contratos, d.riesgo)))
  const ALTURA = 120

  return (
    <div className="space-y-3">
      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-[#94A3B8]">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLOR_CTOS }} />
          Contratos
        </span>
        <span className="flex items-center gap-1.5 text-[#94A3B8]">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLOR_RIESGO }} />
          Riesgo %
        </span>
      </div>

      {/* Contenedor de barras con altura fija */}
      <div className="grid grid-cols-5 gap-4" style={{ height: `${ALTURA + 24}px` }}>
        {datosReales.map((d, i) => (
          <div key={d.municipio} className="relative flex flex-col items-center justify-end">
            {/* Las dos barras lado a lado */}
            <div className="flex items-end gap-0.5 w-full justify-center">
              <div
                className="rounded-t-sm transition-all duration-500"
                style={{
                  width: '14px',
                  height: `${Math.max((d.contratos / maxValor) * ALTURA, 4)}px`,
                  background: `linear-gradient(180deg, ${COLOR_CTOS}, ${COLOR_CTOS}99)`,
                  boxShadow: `0 0 6px ${COLOR_CTOS}44`,
                }}
              />
              <div
                className="rounded-t-sm transition-all duration-500"
                style={{
                  width: '14px',
                  height: `${Math.max((d.riesgo / maxValor) * ALTURA, 4)}px`,
                  background: `linear-gradient(180deg, ${COLOR_RIESGO}, ${COLOR_RIESGO}99)`,
                  boxShadow: `0 0 6px ${COLOR_RIESGO}44`,
                }}
              />
            </div>
            {/* Label */}
            <span className="text-[#8892A6] text-[10px] font-mono truncate w-full text-center mt-2">
              {d.municipio}
            </span>
          </div>
        ))}
      </div>

      {/* Data cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {datosReales.map((d) => (
          <div
            key={d.municipio}
            className="bg-[#0A0C10] border border-[#1E2533] rounded-md p-2 hover:border-[#2A3140] transition-colors"
          >
            <p className="text-[#E2E8F0] text-xs font-medium truncate">{d.municipio}</p>
            <div className="flex gap-2 mt-0.5 text-[10px] font-mono">
              <span style={{ color: COLOR_CTOS }}>{d.contratos} ctos</span>
              <span style={{ color: COLOR_RIESGO }}>{d.riesgo}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
