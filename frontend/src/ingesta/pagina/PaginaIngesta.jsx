import { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { usarAlmacenIngesta } from '../../almacen'
import { ListaArchivos } from '../componentes/ListaArchivos'
import { VisorPdf } from '../componentes/VisorPdf'
import { TimelineExtraccion } from '../componentes/TimelineExtraccion'
import { ResultadoOcr } from '../componentes/ResultadoOcr'
import { useOcr } from '../hooks/useOcr'

export function PaginaIngesta() {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const { archivosEnCola, agregarArchivos, actualizarEstadoArchivo } = usarAlmacenIngesta()
  const { estado: estadoOcr, error: errorOcr, descargarModelo, procesarPdf } = useOcr()
  const procesandoRef = useRef(false)

  const enDrop = useCallback((archivosAceptados) => {
    const nuevosArchivos = archivosAceptados.map((archivo) => ({
      archivo,
      nombre: archivo.name,
      tamaño: archivo.size,
      estado: 'en_cola',
      progreso: { pct: 0, fase: 'espera' },
    }))
    agregarArchivos(nuevosArchivos)
    // Siempre seleccionar el primer archivo nuevo
    if (nuevosArchivos.length > 0) {
      setArchivoSeleccionado(nuevosArchivos[0])
    }
  }, [agregarArchivos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: enDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  })

  const procesarTodos = useCallback(async () => {
    if (procesandoRef.current) return
    procesandoRef.current = true

    const archivos = usarAlmacenIngesta.getState().archivosEnCola
    for (let i = 0; i < archivos.length; i++) {
      const arch = archivos[i]
      if (arch.estado === 'completado' || arch.estado === 'procesando') continue
      actualizarEstadoArchivo(i, 'procesando', { pct: 5, fase: 'abrir' })
      try {
        const resultados = await procesarPdf(arch.archivo, (prog) => {
          actualizarEstadoArchivo(i, 'procesando', prog)
        })
        actualizarEstadoArchivo(i, 'completado', { pct: 100, fase: 'hecho' }, resultados)
      } catch (err) {
        console.error('Error procesando:', arch.nombre, err)
        actualizarEstadoArchivo(i, 'error', null, null, err.message)
      }
    }
    procesandoRef.current = false
  }, [procesarPdf, actualizarEstadoArchivo])

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="font-encabezado text-2xl font-bold text-[#E2E8F0]">
            Pipeline de Ingesta
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[#64748B] text-sm font-mono">
              PP-OCRv6 · {archivosEnCola.length} archivos
            </span>

            {estadoOcr !== 'listo' ? (
              <button
                type='button'
                onClick={descargarModelo}
                disabled={estadoOcr === 'descargando'}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-all duration-300 disabled:opacity-40"
                style={{
                  background: estadoOcr === 'descargando'
                    ? 'linear-gradient(135deg, #00E5FF44, #FF336644)'
                    : estadoOcr === 'error'
                    ? 'linear-gradient(135deg, #FF3366, #FF3366aa)'
                    : undefined,
                  color: estadoOcr === 'idle' ? '#E2E8F0' : '#0A0C10',
                  border: estadoOcr === 'idle' ? '1px solid #2A3140' : 'none',
                }}
              >
                {estadoOcr === 'idle' && '⬇ Descargar modelo OCR'}
                {estadoOcr === 'descargando' && '⏳ Descargando...'}
                {estadoOcr === 'error' && '⚠ Reintentar'}
              </button>
            ) : archivosEnCola.length > 0 ? (
              <button
                type='button'
                onClick={procesarTodos}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-md transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF, #00E5FFcc)',
                  color: '#0A0C10',
                }}
              >
                ▶ Procesar todo
              </button>
            ) : null}
          </div>
        </div>

        {errorOcr && (
          <div className="mb-4 p-3 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-lg shrink-0">
            <p className="text-[#FF3366] text-xs font-mono">{errorOcr}</p>
          </div>
        )}

        {/* Drop zone: grande si no hay archivos */}
        {archivosEnCola.length === 0 ? (
          <div
            {...getRootProps()}
            className={`flex-1 border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-[#00E5FF] bg-[#00E5FF]/5'
                : 'border-[#2A3140] hover:border-[#64748B]'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DocumentArrowUpIcon className={`w-16 h-16 mb-4 ${isDragActive ? 'text-[#00E5FF]' : 'text-[#64748B]'}`} />
            </motion.div>
            {isDragActive ? (
              <p className="text-[#00E5FF] font-medium">Soltar PDFs aquí</p>
            ) : (
              <>
                <p className="text-[#E2E8F0] font-medium">Arrastrar contratos PDF</p>
                <p className="text-[#64748B] text-sm mt-1">
                  para extraer texto con PaddleOCR v6 en el navegador
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {archivoSeleccionado && (
              <>
                <VisorPdf archivo={archivoSeleccionado} />
                {archivoSeleccionado.estado === 'completado' && archivoSeleccionado.resultados && (
                  <ResultadoOcr resultados={archivoSeleccionado.resultados} nombre={archivoSeleccionado.nombre} />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-96 flex flex-col gap-4 shrink-0">
        <ListaArchivos
          archivos={archivosEnCola}
          seleccionado={archivoSeleccionado}
          onSelect={setArchivoSeleccionado}
        />
        <TimelineExtraccion archivo={archivoSeleccionado} estadoOcr={estadoOcr} />
      </div>
    </div>
  )
}
