import type { Provider } from '../types/provider'
import { EvidenceBadge } from './EvidenceBadge'
import { CertDetail } from './CertBadge'
import { CellTypeBadge, RouteBadge } from './CellTypeBadge'
import { StarRating } from './StarRating'
import { TestimonialCard } from './TestimonialCard'
import { useDashboardStore } from '../store/dashboardStore'

interface Props {
  provider: Provider
}

function DomainBar({ label, score, confidence }: { label: string; score: number; confidence: string }) {
  const pct = (score / 10) * 100
  const color =
    confidence === 'high' ? 'bg-green-500' :
    confidence === 'medium' ? 'bg-yellow-500' :
    confidence === 'low' ? 'bg-orange-400' : 'bg-gray-300'

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{score > 0 ? `${score}/10` : 'No data'}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function ProviderDetail({ provider }: Props) {
  const { setActiveDetail } = useDashboardStore()

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setActiveDetail(null)} />
      <div className="relative bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{provider.name}</h2>
            <p className="text-sm text-gray-500">{provider.location.city}, {provider.location.country}</p>
          </div>
          <button
            onClick={() => setActiveDetail(null)}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold leading-none mt-0.5"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Overview */}
          <p className="text-sm text-gray-700 leading-relaxed">{provider.overview}</p>

          {/* Badges */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cell Types</h3>
            <div className="flex flex-wrap gap-1.5">
              {provider.cellTypes.map((t) => <CellTypeBadge key={t} type={t} />)}
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Delivery Routes</h3>
            <div className="flex flex-wrap gap-1.5">
              {provider.deliveryRoutes.map((r) => <RouteBadge key={r} route={r} />)}
            </div>
            <div className="mt-3">
              <EvidenceBadge grade={provider.evidence.gradeLevel} design={provider.evidence.studyDesign} />
            </div>
          </div>

          {/* Effectiveness */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Effectiveness by Domain</h3>
            <div className="space-y-3">
              <DomainBar label="Communication" score={provider.effectiveness.communication.score} confidence={provider.effectiveness.communication.confidence} />
              <DomainBar label="Social Skills" score={provider.effectiveness.socialSkills.score} confidence={provider.effectiveness.socialSkills.confidence} />
              <DomainBar label="Behavior" score={provider.effectiveness.behavior.score} confidence={provider.effectiveness.behavior.confidence} />
              <DomainBar label="Self-Care" score={provider.effectiveness.selfCare.score} confidence={provider.effectiveness.selfCare.confidence} />
            </div>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />High confidence</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />Medium</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />No data</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{provider.patientsTotal.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total patients treated</div>
            </div>
            {provider.autismPatientCount && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{provider.autismPatientCount.toLocaleString()}</div>
                <div className="text-xs text-blue-600">Autism patients</div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{provider.evidence.publications.length}</div>
              <div className="text-xs text-gray-500">Publications</div>
            </div>
            {provider.yearsOperating && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{provider.yearsOperating}</div>
                <div className="text-xs text-gray-500">Years operating</div>
              </div>
            )}
          </div>

          {/* Cost */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cost</h3>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              {provider.cost.minUSD > 0 ? (
                <>
                  <div className="text-xl font-bold text-gray-900">
                    ${provider.cost.minUSD.toLocaleString()} – ${provider.cost.maxUSD.toLocaleString()} USD
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {provider.cost.sessionRange.min}–{provider.cost.sessionRange.max} sessions
                    {provider.cost.includesAccommodation && ' · Includes accommodation'}
                  </div>
                  {provider.cost.notes && <p className="text-xs text-gray-600 mt-1.5">{provider.cost.notes}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-500">Not commercially available for autism</p>
              )}
            </div>
          </div>

          {/* Certificate of Authenticity */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Certificate of Authenticity</h3>
            <CertDetail coa={provider.coa} />
          </div>

          {/* Publications */}
          {provider.evidence.publications.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Published Studies</h3>
              <div className="space-y-2">
                {provider.evidence.publications.map((pub, i) => (
                  <div key={i} className="bg-gray-50 rounded p-3 border border-gray-200 text-sm">
                    <div className="font-medium text-gray-800">{pub.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {pub.journal} · {pub.year}{pub.sampleSize ? ` · n=${pub.sampleSize}` : ''}
                    </div>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        View publication →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Testimonials</h3>
            {provider.testimonials.aggregateRating > 0 && (
              <div className="mb-3">
                <StarRating rating={provider.testimonials.aggregateRating} count={provider.testimonials.totalReviews} />
              </div>
            )}
            {provider.testimonials.featured.length > 0 ? (
              <div className="space-y-3">
                {provider.testimonials.featured.map((t, i) => (
                  <TestimonialCard key={i} testimonial={t} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No testimonials recorded yet.</p>
            )}
            {provider.testimonials.externalUrl && (
              <a
                href={provider.testimonials.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                Read more reviews →
              </a>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact</h3>
            <div className="space-y-1 text-sm">
              <a href={provider.contact.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">{provider.contact.website}</a>
              {provider.contact.email && <div className="text-gray-700">{provider.contact.email}</div>}
              {provider.contact.phone && <div className="text-gray-700">{provider.contact.phone}</div>}
            </div>
          </div>

          <p className="text-xs text-gray-400">Data last verified: {provider.dataLastVerified}</p>
        </div>
      </div>
    </div>
  )
}
