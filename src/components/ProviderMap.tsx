import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { useState } from 'react'
import type { Provider } from '../types/provider'
import { useDashboardStore } from '../store/dashboardStore'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const cellTypeColor: Record<string, string> = {
  MUSE_dezawa: '#7c3aed',
  umbilical_cord_msc: '#0891b2',
  umbilical_cord_blood: '#2563eb',
  bone_marrow: '#b45309',
  adipose: '#65a30d',
  spinal_cord_derived: '#dc2626',
  exosomes: '#db2777',
  fetal: '#ea580c',
  placental: '#be123c',
  amniotic: '#0284c7',
  hematopoietic: '#7c3aed',
}

function getPinColor(provider: Provider): string {
  const primary = provider.cellTypes[0]
  return cellTypeColor[primary] ?? '#6b7280'
}

interface Props {
  providers: Provider[]
}

export function ProviderMap({ providers }: Props) {
  const { selectedIds, toggleSelected, setActiveDetail } = useDashboardStore()
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  return (
    <div className="relative w-full h-full bg-slate-50 rounded-lg overflow-hidden">
      {tooltip && (
        <div
          className="absolute z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ left: tooltip.x + 8, top: tooltip.y - 28 }}
        >
          {tooltip.name}
        </div>
      )}
      <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth={0.3}
                  style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                />
              ))
            }
          </Geographies>

          {providers.map((provider) => {
            const { lat, lng } = provider.location.coordinates
            const color = getPinColor(provider)
            const isSelected = selectedIds.includes(provider.id)

            return (
              <Marker
                key={provider.id}
                coordinates={[lng, lat]}
                onClick={() => {
                  toggleSelected(provider.id)
                  setActiveDetail(provider.id)
                }}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect()
                  if (rect) {
                    setTooltip({ name: provider.name, x: e.clientX - rect.left, y: e.clientY - rect.top })
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={isSelected ? 8 : 6}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={0.9}
                  style={{ cursor: 'pointer' }}
                />
                {isSelected && (
                  <circle r={12} fill="none" stroke={color} strokeWidth={2} opacity={0.4} />
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded p-2 text-xs space-y-1 border border-gray-200">
        {Object.entries(cellTypeColor).map(([type, color]) => {
          const labels: Record<string, string> = {
            MUSE_dezawa: 'MUSE / Dezawa',
            umbilical_cord_msc: 'Umbilical MSC',
            umbilical_cord_blood: 'Cord Blood',
            bone_marrow: 'Bone Marrow',
            adipose: 'Adipose',
            spinal_cord_derived: 'Spinal Derived',
            exosomes: 'Exosomes / EVs',
            fetal: 'Fetal Stem Cells',
            placental: 'Placental MSC',
            amniotic: 'Amniotic',
            hematopoietic: 'Hematopoietic',
          }
          const hasProviders = providers.some((p) => p.cellTypes.includes(type as any))
          if (!hasProviders) return null
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              <span className="text-gray-600">{labels[type]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
