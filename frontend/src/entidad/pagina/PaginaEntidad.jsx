import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiEntidad } from '../../api/cliente'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { MiniMapa } from '../componentes/MiniMapa'

export function PaginaEntidad() {
  const { id } = useParams()

  const { data: entidad, isLoading: cargandoEntidad } = useQuery({
    queryKey: ['entidad', id],
    queryFn: () => apiEntidad.obtenerDetalle(id),
    enabled: !!id,
  })

  const { data: contratos } = useQuery({
    queryKey: ['entidad', id, 'contratos'],
    queryFn: () => apiEntidad.obtenerContratos(id),
    enabled: !!id,
  })

  const columnas = [
    { accessorKey: 'fecha', header: 'Fecha', cell: (info) => info.getValue() },
    { accessorKey: 'organismoContratante', header: 'Organismo' },
    { accessorKey: 'numero', header: 'Folio', cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span> },
    {
      accessorKey: 'monto',
      header: 'Monto',
      cell: (info) => (
        <span className="font-mono text-primario">
          ${new Intl.NumberFormat('es-MX').format(info.getValue())}
        </span>
      ),
    },
    {
      accessorKey: 'riesgo',
      header: 'Riesgo',
      cell: (info) => (
        <span className={`px-2 py-1 rounded text-xs font-mono ${
          info.getValue() === 'critico' ? 'bg-peligro/20 text-peligro' :
          info.getValue() === 'alto' ? 'bg-peligro/10 text-peligro' :
          info.getValue() === 'medio' ? 'bg-yellow-500/20 text-yellow-500' :
          'bg-exito/20 text-exito'
        }`}>
          {info.getValue()}
        </span>
      ),
    },
  ]

  const tabla = useReactTable({
    columns: columnas,
    data: contratos?.data || [],
    getCoreRowModel: getCoreRowModel(),
  })

  if (cargandoEntidad) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-superficie rounded w-48 animate-pulse" />
        <div className="h-32 bg-superficie rounded animate-pulse" />
      </div>
    )
  }

  if (!entidad?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-apagado">Selecciona una entidad para ver su perfil</p>
      </div>
    )
  }

  const { data: e } = entidad

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3 space-y-4">
        <div className="tarjeta-metrica">
          <div className="flex items-center gap-3 mb-4">
            {e.esEfos && (
              <span className="flex items-center gap-1.5 bg-peligro/20 text-peligro text-xs px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-peligro animate-pulse" />
                EFOS
              </span>
            )}
          </div>

          <p className="text-xs text-apagado uppercase tracking-wider mb-1">RFC</p>
          <p className="font-mono text-primario text-xl mb-4">{e.rfc}</p>

          <p className="text-xs text-apagado uppercase tracking-wider mb-1">Razón Social</p>
          <p className="text-texto text-sm mb-4">{e.razonSocial}</p>

          {e.fechaConstitucion && (
            <>
              <p className="text-xs text-apagado uppercase tracking-wider mb-1">Constitución</p>
              <p className="font-mono text-texto text-sm">{e.fechaConstitucion}</p>
            </>
          )}
        </div>

        <div className="tarjeta-metrica">
          <h3 className="font-encabezado text-sm font-semibold text-texto mb-3 uppercase tracking-wider">
            Mini Mapa
          </h3>
          <MiniMapa rfc={e.rfc} />
        </div>
      </div>

      <div className="col-span-9">
        <div className="tarjeta-metrica">
          <h3 className="font-encabezado text-lg font-semibold text-texto mb-4">
            Historial de Contratos
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {tabla.getHeaderGroups().map((grupoHeaders) => (
                  <tr key={grupoHeaders.id}>
                    {grupoHeaders.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left text-xs text-apagado uppercase tracking-wider pb-3 border-b border-borde"
                      >
                        {header.isPlaceholder ? null : header.renderHeader()}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {tabla.getRowModel().rows.map((fila) => (
                  <tr
                    key={fila.id}
                    className="border-b border-borde/50 hover:bg-fondo/50 transition-colors cursor-pointer"
                  >
                    {fila.getVisibleCells().map((celda) => (
                      <td key={celda.id} className="py-3 text-sm text-texto">
                        {celda.renderCell()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!contratos?.data?.length && (
            <div className="text-center py-8">
              <p className="text-apagado text-sm">No hay contratos registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
