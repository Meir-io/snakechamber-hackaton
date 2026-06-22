import { Outlet } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import { BarraSuperior } from './BarraSuperior'

export function LayoutPrincipal() {
  return (
    <div className="flex h-screen bg-fondo">
      <BarraLateral />
      <div className="flex flex-col flex-1 overflow-hidden">
        <BarraSuperior />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
