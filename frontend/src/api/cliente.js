import axios from 'axios'

const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiDashboard = {
  obtenerMetricas: () => clienteApi.get('/api/dashboard/metricas'),
  obtenerAlertas: () => clienteApi.get('/api/dashboard/alertas'),
  buscarGlobal: (consulta) => clienteApi.get('/api/buscar', { params: { q: consulta } }),
}

export const apiIngesta = {
  subirPdf: (archivo) => {
    const formData = new FormData()
    formData.append('archivo', archivo)
    return clienteApi.post('/api/ingesta/subir', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  procesarPdf: (id) => clienteApi.post(`/api/ingesta/procesar/${id}`),
  obtenerResultado: (id) => clienteApi.get(`/api/ingesta/resultado/${id}`),
}

export const apiGrafo = {
  obtenerNodos: (filtros) => clienteApi.get('/api/grafo/nodos', { params: filtros }),
  obtenerAristas: (filtros) => clienteApi.get('/api/grafo/aristas', { params: filtros }),
  obtenerCluster: (id) => clienteApi.get(`/api/grafo/cluster/${id}`),
  analizarGrafo: () => clienteApi.get('/analizar_grafo'),
}

export const apiEntidad = {
  obtenerDetalle: (id) => clienteApi.get(`/api/entidad/${id}`),
  obtenerContratos: (rfc) => clienteApi.get(`/api/entidad/${rfc}/contratos`),
  obtenerMiniMapa: (rfc) => clienteApi.get(`/api/entidad/${rfc}/minimapa`),
}

export default clienteApi
