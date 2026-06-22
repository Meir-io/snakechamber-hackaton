import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function VisorPdf({ archivo }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (archivo?.archivo) {
      const urlObj = URL.createObjectURL(archivo.archivo)
      setUrl(urlObj)
      return () => URL.revokeObjectURL(urlObj)
    }
  }, [archivo])

  if (!url) {
    return (
      <div className="h-64 bg-superficie rounded-mediano border border-borde flex items-center justify-center">
        <p className="text-apagado text-sm">Selecciona un PDF para previsualizar</p>
      </div>
    )
  }

  return (
    <div className="h-64 bg-superficie rounded-mediano border border-borde overflow-hidden relative">
      <iframe
        src={url}
        className="w-full h-full"
        title="Vista previa del PDF"
      />
      {archivo.estado === 'procesando' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primario/20 via-primario/40 to-primario/20"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}
