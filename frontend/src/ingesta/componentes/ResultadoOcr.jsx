import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ResultadoOcr({ resultados, nombre }) {
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
  const [altura, setAltura] = useState(200)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const startHRef = useRef(0)

  const pagina = resultados.find((r) => r.pagina === paginaSeleccionada) || resultados[0]

  const onMouseDown = useCallback((e) => {
    draggingRef.current = true
    startYRef.current = e.clientY
    startHRef.current = containerRef.current?.offsetHeight ?? 200
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return
      const diff = e.clientY - startYRef.current
      setAltura(Math.max(100, startHRef.current + diff))
    }
    const onUp = () => {
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141820] border border-[#2A3140] rounded-lg overflow-hidden shrink-0"
      style={{ height: `${altura}px` }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A3140] shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00FFAA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#E2E8F0] text-sm font-medium">Texto extraído</span>
            <span className="text-[#64748B] text-[10px] font-mono">
              {resultados.length} páginas · {resultados.reduce((s, r) => s + r.items.length, 0)} bloques
            </span>
          </div>
          <span className="text-[#64748B] text-[10px] font-mono">{nombre}</span>
        </div>

        {/* Navegación de páginas */}
        {resultados.length > 1 && (
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[#1E2533] overflow-x-auto shrink-0">
            {resultados.map((r) => (
              <button
                key={r.pagina}
                type="button"
                onClick={() => setPaginaSeleccionada(r.pagina)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                  paginaSeleccionada === r.pagina
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                    : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1E2533]'
                }`}
              >
                {r.pagina}
              </button>
            ))}
          </div>
        )}

        {/* Items de la página - scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={paginaSeleccionada}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              {pagina?.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span
                    className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: item.score > 0.9 ? '#00FFAA'
                        : item.score > 0.7 ? '#FFB800'
                        : '#FF3366',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E2E8F0] font-mono break-words">{item.text}</p>
                    <p className="text-[#64748B] text-[9px] font-mono mt-0.5">
                      confianza: {Math.round(item.score * 100)}% · {item.poly ? `${item.poly.length} pts` : ''}
                    </p>
                  </div>
                </div>
              ))}
              {pagina?.items.length === 0 && (
                <p className="text-[#64748B] text-xs text-center py-4">No se detectó texto en esta página</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mango de resize */}
        <div
          onMouseDown={onMouseDown}
          className="shrink-0 h-4 flex items-center justify-center cursor-row-resize border-t border-[#2A3140] bg-[#1E2533] hover:bg-[#2A3140] transition-colors group"
        >
          <div className="flex items-center gap-1">
            <span className="block w-6 h-0.5 rounded-full bg-[#4A5568] group-hover:bg-[#64748B] transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
