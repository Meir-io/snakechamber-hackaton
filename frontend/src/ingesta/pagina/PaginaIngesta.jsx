import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { usarAlmacenIngesta } from '../../almacen'
import { ListaArchivos } from '../componentes/ListaArchivos'
import { VisorPdf } from '../componentes/VisorPdf'
import { TimelineExtraccion } from '../componentes/TimelineExtraccion'

export function PaginaIngesta() {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const { archivosEnCola, agregarArchivos } = usarAlmacenIngesta()

  const enDrop = useCallback((archivosAceptados) => {
    const nuevosArchivos = archivosAceptados.map((archivo) => ({
      archivo,
      nombre: archivo.name,
      tamaño: archivo.size,
      estado: 'en_cola',
      progreso: 0,
    }))
    agregarArchivos(nuevosArchivos)
    if (!archivoSeleccionado && nuevosArchivos.length > 0) {
      setArchivoSeleccionado(nuevosArchivos[0])
    }
  }, [agregarArchivos, archivoSeleccionado])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: enDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  })

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-encabezado text-2xl font-bold text-texto">
            Pipeline de Ingesta
          </h2>
          <span className="text-apagado text-sm font-mono">
            OCR: PaddleOCR · {archivosEnCola.length} archivos en cola
          </span>
        </div>

        <div className="flex-1 flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed rounded-mediano flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primario bg-primario/5 shadow-brillo-primario'
                  : 'border-borde hover:border-apagado'
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentArrowUpIcon className={`w-16 h-16 mb-4 ${
                  isDragActive ? 'text-primario' : 'text-apagado'
                }`} />
              </motion.div>
              {isDragActive ? (
                <p className="text-primario font-medium">Soltar PDFs aquí</p>
              ) : (
                <>
                  <p className="text-texto font-medium">Arrastrar contratos PDF</p>
                  <p className="text-apagado text-sm mt-1">
                    para iniciar el pipeline de OCR local
                  </p>
                </>
              )}
            </div>

            {archivoSeleccionado && (
              <VisorPdf archivo={archivoSeleccionado} />
            )}
          </div>

          <div className="w-96 flex flex-col gap-4">
            <ListaArchivos
              archivos={archivosEnCola}
              seleccionado={archivoSeleccionado}
              onSelect={setArchivoSeleccionado}
            />
            <TimelineExtraccion archivo={archivoSeleccionado} />
          </div>
        </div>
      </div>
    </div>
  )
}
