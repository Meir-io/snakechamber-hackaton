import { useEffect, useRef } from 'react'
import Graph from 'graphology'
import { useQuery } from '@tanstack/react-query'
import { apiEntidad } from '../../api/cliente'

export function MiniMapa({ rfc }) {
  const contenedorRef = useRef(null)
  const sigmaRef = useRef(null)

  const { data } = useQuery({
    queryKey: ['entidad', rfc, 'minimapa'],
    queryFn: () => apiEntidad.obtenerMiniMapa(rfc),
    enabled: !!rfc,
  })

  useEffect(() => {
    if (!contenedorRef.current || !data?.data) return

    const grafo = new Graph()
    const { nodos, aristas } = data.data

    nodos.forEach((nodo) => {
      grafo.addNode(nodo.id, {
        x: nodo.x || Math.random() * 100,
        y: nodo.y || Math.random() * 100,
        size: nodo.id === rfc ? 12 : 6,
        color: nodo.esEfos ? '#FF3366' : '#00E5FF',
      })
    })

    aristas.forEach((arista) => {
      if (grafo.hasNode(arista.origen) && grafo.hasNode(arista.destino)) {
        grafo.addEdge(arista.origen, arista.destino, {
          size: 1,
          color: '#2A3140',
        })
      }
    })

    return () => {
      grafo.clear()
    }
  }, [data, rfc])

  return (
    <div
      ref={contenedorRef}
      className="h-48 bg-fondo rounded-pequeno border border-borde"
    />
  )
}
