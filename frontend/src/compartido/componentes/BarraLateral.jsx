import { NavLink } from 'react-router-dom'
import { ChartBarIcon, DocumentMagnifyingGlassIcon, CubeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const navegacion = [
  { nombre: 'Dashboard', ruta: '/', icono: ChartBarIcon },
  { nombre: 'Ingesta', ruta: '/ingesta', icono: DocumentMagnifyingGlassIcon },
  { nombre: 'Grafo', ruta: '/grafo', icono: CubeIcon },
  { nombre: 'Entidades', ruta: '/entidad/demo', icono: BuildingOfficeIcon },
]

export function BarraLateral() {
  return (
    <aside className="w-60 bg-superficie border-r border-borde flex flex-col">
      <div className="p-4 border-b border-borde">
        <h1 className="font-encabezado font-bold text-primario text-lg tracking-wide">
          SNAKECHAMBA
        </h1>
        <p className="text-apagado text-xs font-mono mt-1">Data Flow Edition</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navegacion.map(({ nombre, ruta, icono: Icono }) => (
          <NavLink
            key={ruta}
            to={ruta}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-pequeno text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primario/10 text-primario shadow-brillo-primario'
                  : 'text-apagado hover:text-texto hover:bg-borde/50'
              }`
            }
          >
            <Icono className="w-5 h-5" />
            <span className="uppercase tracking-wider">{nombre}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-borde">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-exito animate-pulse" />
          <span className="text-apagado text-xs font-mono">OCR: PaddleOCR</span>
        </div>
      </div>
    </aside>
  )
}
