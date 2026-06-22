import { motion, AnimatePresence } from 'framer-motion'

export function TimelineExtraccion({ archivo }) {
  const pasos = [
    { id: 1, nombre: 'Carga PDF', estado: 'completado' },
    { id: 2, nombre: 'Conversión a imágenes', estado: archivo?.estado === 'procesando' ? 'activo' : 'pendiente' },
    { id: 3, nombre: 'OCR PaddleOCR', estado: 'pendiente' },
    { id: 4, nombre: 'Extracción datos', estado: 'pendiente' },
    { id: 5, nombre: 'Validación Zod', estado: 'pendiente' },
  ]

  return (
    <div className="tarjeta-metrica flex-1">
      <h3 className="font-encabezado text-sm font-semibold text-texto mb-4 uppercase tracking-wider">
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
              <div className={`w-2 h-2 rounded-full ${
                paso.estado === 'completado' ? 'bg-exito' :
                paso.estado === 'activo' ? 'bg-primario animate-pulse' :
                'bg-borde'
              }`} />
              <div className="flex-1 flex items-center gap-2">
                <span className={`text-sm font-mono ${
                  paso.estado === 'activo' ? 'text-primario' :
                  paso.estado === 'completado' ? 'text-exito' :
                  'text-apagado'
                }`}>
                  {paso.nombre}
                </span>
                {paso.estado === 'activo' && (
                  <motion.div
                    className="h-0.5 bg-primario rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
