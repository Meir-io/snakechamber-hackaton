import { useState, useCallback, useRef } from 'react'
import { PaddleOCR } from '@paddleocr/paddleocr-js'

const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'
const ORT_VERSION = '1.27.0'

// Pesos de cada fase sobre el progreso total (100%)
const PESOS = {
  abrir:       { start: 0, end: 8 },
  renderizar:  { start: 8, end: 35 },
  ocr:         { start: 35, end: 80 },
  extraer:     { start: 80, end: 95 },
}

function pctEnRango(pctGlobal, inicio, fin) {
  return Math.round(inicio + (fin - inicio) * pctGlobal)
}

export function useOcr() {
  const [estado, setEstado] = useState('idle')
  const [error, setError] = useState(null)
  const ocrRef = useRef(null)
  const pdfjsRef = useRef(null)

  const getPdfjs = useCallback(async () => {
    if (pdfjsRef.current) return pdfjsRef.current
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER
    pdfjsRef.current = pdfjs
    return pdfjs
  }, [])

  const cargarModelo = useCallback(async () => {
    if (ocrRef.current) return ocrRef.current
    setEstado('descargando')
    setError(null)
    try {
      const ocr = await PaddleOCR.create({
        textDetectionModelName: 'PP-OCRv6_tiny_det',
        textRecognitionModelName: 'PP-OCRv6_tiny_rec',
        ortOptions: {
          backend: 'wasm',
          wasmPaths: `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`,
        },
      })
      ocrRef.current = ocr
      setEstado('listo')
      return ocr
    } catch (err) {
      console.error('Error cargando OCR:', err)
      setEstado('error')
      setError(err.message || 'Error al cargar modelo OCR')
      throw err
    }
  }, [])

  /**
   * Procesa un PDF llamando a onProgreso({ pct, fase, pagina, totalPaginas })
   * pct: 0-100 global
   * fase: 'abrir' | 'renderizar' | 'ocr' | 'extraer'
   */
  const procesarPdf = useCallback(async (archivo, onProgreso) => {
    const ocr = ocrRef.current
    if (!ocr) throw new Error('OCR no inicializado')

    const pdfjs = await getPdfjs()
    const arrayBuffer = await archivo.arrayBuffer()

    onProgreso?.({ pct: 2, fase: 'abrir' })
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    const totalPaginas = pdf.numPages
    const resultados = []

    onProgreso?.({ pct: pctEnRango(1, PESOS.abrir.start, PESOS.abrir.end), fase: 'abrir' })

    for (let i = 1; i <= totalPaginas; i++) {
      const avancePagina = (i - 1) / totalPaginas
      const proximaPagina = i / totalPaginas

      // Renderizar página
      onProgreso?.({
        pct: pctEnRango(avancePagina + (0.3 / totalPaginas), PESOS.renderizar.start, PESOS.renderizar.end),
        fase: 'renderizar',
        pagina: i,
        totalPaginas,
      })

      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2.0 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise

      // OCR
      onProgreso?.({
        pct: pctEnRango(avancePagina + (0.6 / totalPaginas), PESOS.ocr.start, PESOS.ocr.end),
        fase: 'ocr',
        pagina: i,
        totalPaginas,
      })

      const [resultado] = await ocr.predict(canvas)

      // Extraer
      onProgreso?.({
        pct: pctEnRango(proximaPagina, PESOS.extraer.start, PESOS.extraer.end),
        fase: 'extraer',
        pagina: i,
        totalPaginas,
      })

      resultados.push({
        pagina: i,
        texto: resultado.items.map((item) => item.text).join('\n'),
        items: resultado.items,
      })
    }

    onProgreso?.({ pct: 100, fase: 'extraer', pagina: totalPaginas, totalPaginas })
    return resultados
  }, [getPdfjs])

  const descargarModelo = useCallback(async () => {
    return await cargarModelo()
  }, [cargarModelo])

  return { estado, error, descargarModelo, procesarPdf }
}
