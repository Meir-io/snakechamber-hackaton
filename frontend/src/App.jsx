import { Routes, Route } from 'react-router-dom'
import { PaginaDashboard } from './dashboard/pagina/PaginaDashboard'
import { PaginaIngesta } from './ingesta/pagina/PaginaIngesta'
import { PaginaGrafo } from './grafo/pagina/PaginaGrafo'
import { PaginaEntidad } from './entidad/pagina/PaginaEntidad'
import { LayoutPrincipal } from './compartido/componentes/LayoutPrincipal'

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/ingesta" element={<PaginaIngesta />} />
        <Route path="/grafo" element={<PaginaGrafo />} />
        <Route path="/entidad/:id" element={<PaginaEntidad />} />
      </Route>
    </Routes>
  )
}
