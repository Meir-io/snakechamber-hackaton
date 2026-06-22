import { useEffect, useRef, useState } from 'react'
import Graph from 'graphology'
import { SigmaContainer, useSigma, useRegisterEvents } from '@react-sigma/core'
import { useQuery } from '@tanstack/react-query'
import { apiGrafo } from '../../api/cliente'
import { PanelControl } from '../componentes/PanelControl'
import { PanelDetalles } from '../componentes/PanelDetalles'
import { usarAlmacenGrafo } from '../../almacen'

function GrafoInteractivo() {
  const sigma = useSigma()
  const { nodoSeleccionado, seleccionarNodo, filtros } = usarAlmacenGrafo()

  useRegisterEvents({
    clickNode: (event) => {
      seleccionarNodo(event.node)
    },
  })

  useEffect(() => {
    const grafo = sigma.getGraph()
    if (nodoSeleccionado) {
      sigma.getCamera().animate(
        { x: grafo.getNodeAttribute(nodoSeleccionado, 'x'), y: grafo.getNodeAttribute(nodoSeleccionado, 'y') },
        { duration: 500 }
      )
    }
  }, [nodoSeleccionado, sigma])

  return null
}

function CargadorGrafo() {
  const sigma = useSigma()
  const { actualizarGrafo } = usarAlmacenGrafo()
  const { data, isLoading } = useQuery({
    queryKey: ['grafo', 'datos'],
    queryFn: async () => {
      const [nodosRes, aristasRes] = await Promise.all([
        apiGrafo.obtenerNodos(),
        apiGrafo.obtenerAristas(),
      ])
      return { nodos: nodosRes.data, aristas: aristasRes.data }
    },
  })

  useEffect(() => {
    if (!data) return
    const grafo = sigma.getGraph()

    grafo.clear()

    data.nodos.forEach((nodo) => {
      grafo.addNode(nodo.id, {
        x: nodo.x || Math.random() * 100,
        y: nodo.y || Math.random() * 100,
        size: Math.max(8, Math.min(32, nodo.volumen / 1000)),
        label: nodo.nombre,
        color: nodo.esEfos ? '#FF3366' : '#00E5FF',
      })
    })

    data.aristas.forEach((arista) => {
      if (grafo.hasNode(arista.origen) && grafo.hasNode(arista.destino)) {
        grafo.addEdge(arista.origen, arista.destino, {
          size: Math.max(1, Math.min(4, arista.monto / 100000)),
          color: '#2A3140',
        })
      }
    })

    actualizarGrafo(data.nodos, data.aristas)
  }, [data, sigma, actualizarGrafo])

  return null
}

export function PaginaGrafo() {
  const { nodoSeleccionado } = usarAlmacenGrafo()

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <PanelDetalles nodoId={nodoSeleccionado} />

      <div className="flex-1 relative rounded-mediano overflow-hidden border border-borde">
        <SigmaContainer
          style={{ height: '100%', background: '#0A0C10' }}
          settings={{
            renderEdgeLabels: false,
            defaultEdgeColor: '#2A3140',
            labelFont: 'Space Grotesk',
            labelSize: 12,
            labelColor: { color: '#E2E8F0' },
          }}
        >
          <CargadorGrafo />
          <GrafoInteractivo />
        </SigmaContainer>

        <PanelControl />

        <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-superficie/90 backdrop-blur-sm rounded-full px-4 py-2 border border-borde">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primario" />
            <span className="text-xs text-apagado">Verificado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-peligro" />
            <span className="text-xs text-apagado">EFOS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-borde" />
            <span className="text-xs text-apagado">Contrato</span>
          </div>
        </div>
      </div>
    </div>
  )
}
