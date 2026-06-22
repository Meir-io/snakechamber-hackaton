import { motion, AnimatePresence } from 'framer-motion'

export function TimelineExtraccion({ archivo, estadoOcr }) {
  const pasos = [
    { id: 1, nombre: 'Descargar modelo OCR', estado: estadoOcr === 'listo' ? 'completado' : estadoOcr === 'descargando' ? 'activo' : estadoOcr === 'error' ? 'error' : 'pendiente' },
    { id: 2, nombre: 'Carga PDF', estado: archivo?.estado === 'completado' || archivo?.estado === 'procesando' ? 'completado' : archivo ? 'activo' : 'pendiente' },
    { id: 3, nombre: 'Renderizar páginas (pdf.js)', estado: archivo?.estado === 'procesando' && archivo?.progreso > 20 ? 'activo' : archivo?.estado === 'completado' ? 'completado' : 'pendiente' },
    { id: 4, nombre: 'OCR por página (PP-OCRv5)', estado: archivo?.estado === 'procesando' && archivo?.progreso > 50 ? 'activo' : archivo?.estado === 'completado' ? 'completado' : 'pendiente' },
    { id: 5, nombre: 'Extracción de datos', estado: archivo?.estado === 'procesando' && archivo?.progreso > 80 ? 'activo' : archivo?.estado === 'completado' ? 'completado' : 'pendiente' },
  ]

  return (
    <div className="bg-[#141820] border border-[#2A3140] rounded-[12px] p-4 flex-1">
      <h3 className="font-encabezado text-sm font-semibold text-[#E2E8F0] mb-4 uppercase tracking-wider">
        Stream de Extracción
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {pasos.map((paso, indice) => (
            <motion.div
              key={paso.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: indice * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                paso.estado === 'completado' ? 'bg-[#00FFAA] shadow-[0_0_6px_rgba(0,255,170,0.5)]' :
                paso.estado === 'activo' ? 'bg-[#00E5FF] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]' :
                paso.estado === 'error' ? 'bg-[#FF3366]' :
                'bg-[#2A3140]'
              }`} />
              <div className="flex-1 flex items-center gap-2">
                <span className={`text-sm font-mono ${
                  paso.estado === 'activo' ? 'text-[#00E5FF]' :
                  paso.estado === 'completado' ? 'text-[#00FFAA]' :
                  paso.estado === 'error' ? 'text-[#FF3366]' :
                  'text-[#64748B]'
                }`}>
                  {paso.nombre}
                </span>
                {paso.estado === 'activo' && (
                  <motion.div
                    className="h-0.5 bg-[#00E5FF] rounded-full flex-1 max-w-[60px]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                {paso.estado === 'completado' && (
                  <svg className="w-3.5 h-3.5 text-[#00FFAA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
