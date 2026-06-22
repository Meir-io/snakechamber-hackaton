import { create } from 'zustand'

export const usarAlmacenDashboard = create((set) => ({
  metricas: {
    totalContratos: 0,
    montoTotal: 0,
    indiceRiesgo: 0,
    efosDetectados: 0,
  },
  alertas: [],
  cargando: false,
  error: null,

  actualizarMetricas: (metricas) => set({ metricas }),
  agregarAlerta: (alerta) => set((estado) => ({
    alertas: [alerta, ...estado.alertas].slice(0, 50),
  })),
  limpiarAlertas: () => set({ alertas: [] }),
}))

export const usarAlmacenIngesta = create((set) => ({
  archivosEnCola: [],
  procesando: false,
  progresoActual: 0,
  resultados: [],

  agregarArchivos: (archivos) => set((estado) => ({
    archivosEnCola: [...estado.archivosEnCola, ...archivos],
  })),
  eliminarArchivo: (indice) => set((estado) => ({
    archivosEnCola: estado.archivosEnCola.filter((_, i) => i !== indice),
  })),
  actualizarEstadoArchivo: (indice, estado, progreso, resultados, errorMsg) =>
    set((state) => {
      const archivos = [...state.archivosEnCola]
      if (archivos[indice]) {
        // progreso puede ser { pct, fase, pagina, totalPaginas } o un número simple
        const norm = typeof progreso === 'object' && progreso !== null
          ? progreso
          : { pct: progreso ?? archivos[indice].progreso?.pct ?? 0 }
        archivos[indice] = {
          ...archivos[indice],
          estado,
          progreso: norm,
          resultados,
          error: errorMsg,
        }
      }
      return { archivosEnCola: archivos }
    }),
  iniciarProcesamiento: () => set({ procesando: true, progresoActual: 0 }),
  actualizarProgreso: (progreso) => set({ progresoActual: progreso }),
  completarProcesamiento: (resultado) => set((estado) => ({
    procesando: false,
    progresoActual: 100,
    resultados: [...estado.resultados, resultado],
  })),
  limpiarCola: () => set({ archivosEnCola: [], progresoActual: 0 }),
}))

export const usarAlmacenGrafo = create((set) => ({
  nodos: [],
  aristas: [],
  nodoSeleccionado: null,
  filtros: {
    mostrarSoloEfos: false,
    montoMinimo: 0,
    densidadCluster: 0.5,
  },
  cargando: false,

  actualizarGrafo: (nodos, aristas) => set({ nodos, aristas }),
  seleccionarNodo: (nodo) => set({ nodoSeleccionado: nodo }),
  actualizarFiltros: (filtros) => set((estado) => ({
    filtros: { ...estado.filtros, ...filtros },
  })),
}))
