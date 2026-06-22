import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { usarAlmacenIngesta } from '../../almacen'

export function VisorPdf({ archivo }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (archivo?.archivo) {
      const urlObj = URL.createObjectURL(archivo.archivo)
      setUrl(urlObj)
      return () => URL.revokeObjectURL(urlObj)
    }
  }, [archivo])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((archivosAceptados) => {
      const nuevos = archivosAceptados.map((a) => ({
        archivo: a,
        nombre: a.name,
        tamaño: a.size,
        estado: 'en_cola',
        progreso: { pct: 0, fase: 'espera' },
      }))
      usarAlmacenIngesta.getState().agregarArchivos(nuevos)
    }, []),
    accept: { 'application/pdf': ['.pdf'] },
  })

  if (!url) {
    return (
      <div className="bg-[#141820] border border-[#2A3140] rounded-lg flex items-center justify-center min-h-[200px]">
        <p className="text-[#64748B] text-sm">Selecciona un PDF para previsualizar</p>
      </div>
    )
  }

  // Extraer info del progreso
  const prog = archivo?.progreso
  const pct = prog?.pct ?? 0
  const fase = prog?.fase ?? ''
  const pagina = prog?.pagina
  const total = prog?.totalPaginas
  const paginaStr = pagina && total ? `${pagina}/${total}` : ''

  const label = !fase || fase === 'espera' ? ''
    : fase === 'abrir' ? 'Abriendo PDF...'
    : fase === 'renderizar' ? `Renderizando pág ${paginaStr}`
    : fase === 'ocr' ? `OCR pág ${paginaStr}`
    : fase === 'extraer' ? `Extrayendo pág ${paginaStr}`
    : `Procesando... ${pct}%`

  return (
    <div className="bg-[#141820] border border-[#2A3140] rounded-lg overflow-hidden relative flex-1 min-h-[300px]">
      <iframe src={url} className="w-full h-full absolute inset-0" title="Vista previa del PDF" />

      {/* Barra flotante con nombre */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto bg-[#0A0C10]/80 backdrop-blur-sm border border-[#2A3140] rounded-md px-2.5 py-1">
          <span className="text-[#94A3B8] text-xs font-mono">{archivo.nombre}</span>
        </div>
        {archivo.estado === 'completado' && (
          <div className="pointer-events-auto bg-[#00FFAA]/10 border border-[#00FFAA]/30 rounded-md px-2.5 py-1">
            <span className="text-[#00FFAA] text-[10px] font-mono">✓ Completado</span>
          </div>
        )}
      </div>

      {/* Overlay + barra de progreso */}
      {archivo.estado === 'procesando' && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 via-[#00E5FF]/20 to-[#00E5FF]/10 z-20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="flex items-center justify-between px-3 py-1 bg-[#0A0C10]/80 backdrop-blur-sm">
              <span className="text-[#94A3B8] text-[10px] font-mono">{label}</span>
              <span className="text-[#00E5FF] text-[10px] font-mono font-bold">{pct}%</span>
            </div>
            <div className="h-1 bg-[#1E2533]">
              <div className="h-full bg-[#00E5FF] transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </>
      )}

      {/* Zona de drop pequeña */}
      <div
        {...getRootProps()}
        className={`absolute bottom-3 right-3 z-20 pointer-events-auto transition-all duration-200 ${
          isDragActive
            ? 'bg-[#00E5FF]/20 border-[#00E5FF] scale-110'
            : 'bg-[#0A0C10]/70 border-[#2A3140] hover:bg-[#0A0C10]/90 hover:border-[#64748B]'
        } border rounded-md px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer`}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="w-3.5 h-3.5 text-[#64748B]" />
        <span className="text-[#94A3B8] text-[10px] font-mono whitespace-nowrap">
          {isDragActive ? 'Soltar' : 'Agregar PDF'}
        </span>
      </div>
    </div>
  )
}
