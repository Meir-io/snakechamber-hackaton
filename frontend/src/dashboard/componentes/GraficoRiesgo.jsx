import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const datosMock = [
  { municipio: 'Tlaxcala', contratos: 45, riesgo: 72 },
  { municipio: 'Apizaco', contratos: 32, riesgo: 58 },
  { municipio: 'Chiautempan', contratos: 28, riesgo: 45 },
  { municipio: 'Huamantla', contratos: 21, riesgo: 38 },
  { municipio: 'San Pablo', contratos: 18, riesgo: 25 },
]

const TooltipPersonalizado = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-superficie border border-borde rounded-pequeno p-3 shadow-lg">
        <p className="text-texto font-medium text-sm">{label}</p>
        <p className="text-primario font-mono text-xs">
          Contratos: {payload[0].value}
        </p>
        <p className="text-peligro font-mono text-xs">
          Riesgo: {payload[1]?.value || 0}%
        </p>
      </div>
    )
  }
  return null
}

export function GraficoRiesgo({ datos = datosMock }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="municipio"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#2A3140' }}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#2A3140' }}
          />
          <Tooltip content={<TooltipPersonalizado />} />
          <Bar dataKey="contratos" fill="#00E5FF" radius={[2, 2, 0, 0]} />
          <Bar dataKey="riesgo" fill="#FF3366" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
