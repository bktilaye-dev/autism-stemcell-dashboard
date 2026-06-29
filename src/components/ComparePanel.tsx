import type { Provider } from '../types/provider'
import { useDashboardStore } from '../store/dashboardStore'
import { EvidenceBadge } from './EvidenceBadge'
import { CertBadge, coaScore } from './CertBadge'
import { CellTypeBadge, RouteBadge } from './CellTypeBadge'
import { StarRating } from './StarRating'
import { RadarChart } from './RadarChart'

interface Props {
  providers: Provider[]
}

const domainKeys = ['communication', 'socialSkills', 'behavior', 'selfCare'] as const

const domainLabels: Record<typeof domainKeys[number], string> = {
  communication: 'Communication',
  socialSkills: 'Social Skills',
  behavior: 'Behavior',
  selfCare: 'Self-Care',
}

export function ComparePanel({ providers }: Props) {
  const { setCompareMode, clearSelected } = useDashboardStore()

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Comparing {providers.length} Providers</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCompareMode(false)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Close Compare
          </button>
          <button
            onClick={clearSelected}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="grid gap-6">
          {/* Radar Chart */}
          <div className="h-80">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Effectiveness Comparison</h3>
            <div className="h-72">
              <RadarChart providers={providers} />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2 pr-4 w-32">Attribute</th>
                  {providers.map((p) => (
                    <th key={p.id} className="text-left text-xs font-semibold text-gray-800 pb-2 pr-6">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Location</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6 text-gray-700">{p.location.city}, {p.location.country}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Cell Types</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6">
                      <div className="flex flex-wrap gap-1">
                        {p.cellTypes.map((t) => <CellTypeBadge key={t} type={t} />)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Delivery</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6">
                      <div className="flex flex-wrap gap-1">
                        {p.deliveryRoutes.map((r) => <RouteBadge key={r} route={r} />)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Cell Source</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6 capitalize text-gray-700">{p.cellSource}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Evidence</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6">
                      <EvidenceBadge grade={p.evidence.gradeLevel} design={p.evidence.studyDesign} compact />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Auth. Score</td>
                  {providers.map((p) => {
                    const score = coaScore(p.coa)
                    return (
                      <td key={p.id} className="py-2.5 pr-6">
                        <div className="space-y-1">
                          <CertBadge coa={p.coa} compact />
                          {score !== null && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 5 ? 'bg-teal-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${score * 10}%` }} />
                              </div>
                              <span className="text-xs text-gray-600">{score.toFixed(1)}/10</span>
                            </div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Publications</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6 text-gray-700">{p.evidence.publications.length}</td>
                  ))}
                </tr>
                {domainKeys.map((key) => (
                  <tr key={key}>
                    <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">{domainLabels[key]}</td>
                    {providers.map((p) => {
                      const d = p.effectiveness[key]
                      return (
                        <td key={p.id} className="py-2.5 pr-6">
                          {d.score > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.score * 10}%` }} />
                              </div>
                              <span className="text-gray-700">{d.score}/10</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">No data</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Rating</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6">
                      <StarRating rating={p.testimonials.aggregateRating} count={p.testimonials.totalReviews} size="sm" />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Cost (USD)</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6 text-gray-700">
                      {p.cost.minUSD > 0
                        ? `$${p.cost.minUSD.toLocaleString()} – $${p.cost.maxUSD.toLocaleString()}`
                        : 'N/A (research only)'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium">Patients Treated</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2.5 pr-6 text-gray-700">{p.patientsTotal.toLocaleString()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
