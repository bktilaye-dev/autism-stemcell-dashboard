import type { CoALevel, CertificateOfAuthenticity } from '../types/provider'

const levelConfig: Record<CoALevel, { label: string; classes: string; score: number; icon: string }> = {
  full:     { label: 'Full CoA', classes: 'bg-green-100 text-green-800 border-green-400', score: 10, icon: '✓✓' },
  partial:  { label: 'Partial CoA', classes: 'bg-teal-100 text-teal-800 border-teal-400', score: 7, icon: '✓' },
  lab_only: { label: 'Lab Certified', classes: 'bg-blue-100 text-blue-800 border-blue-400', score: 5, icon: '⬡' },
  claimed:  { label: 'Claimed', classes: 'bg-yellow-100 text-yellow-800 border-yellow-400', score: 3, icon: '?' },
  none:     { label: 'None', classes: 'bg-red-100 text-red-700 border-red-300', score: 0, icon: '✗' },
  unknown:  { label: 'Unknown', classes: 'bg-gray-100 text-gray-500 border-gray-300', score: 0, icon: '–' },
}

export function coaScore(coa: CertificateOfAuthenticity): number | null {
  if (coa.level === 'unknown') return null
  const base = levelConfig[coa.level].score
  const verifiedBonus = coa.independentlyVerified ? 1 : 0
  const certBonus = coa.labCertifications.length >= 2 ? 0.5 : 0
  return Math.min(10, base + verifiedBonus + certBonus)
}

interface Props {
  coa: CertificateOfAuthenticity
  compact?: boolean
}

export function CertBadge({ coa, compact }: Props) {
  const cfg = levelConfig[coa.level]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.classes}`}>
      <span>{cfg.icon}</span>
      {cfg.label}
      {!compact && coa.independentlyVerified && (
        <span className="opacity-70">· Verified</span>
      )}
    </span>
  )
}

export function CertDetail({ coa }: { coa: CertificateOfAuthenticity }) {
  const score = coaScore(coa)
  const cfg = levelConfig[coa.level]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <CertBadge coa={coa} />
        {score !== null && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 5 ? 'bg-teal-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${score * 10}%` }} />
            </div>
            <span className="text-sm font-semibold text-gray-700">{score.toFixed(1)}/10</span>
          </div>
        )}
      </div>

      {coa.labCertifications.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Lab Certifications</p>
          <div className="flex flex-wrap gap-1">
            {coa.labCertifications.map((c) => (
              <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-300">{c}</span>
            ))}
          </div>
        </div>
      )}

      {coa.patientDocuments.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Documents provided to patient</p>
          <ul className="space-y-0.5">
            {coa.patientDocuments.map((d) => (
              <li key={d} className="text-xs text-gray-700 flex items-center gap-1.5">
                <span className="text-green-500">✓</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {coa.independentlyVerified && (
        <p className="text-xs text-green-700 flex items-center gap-1">
          <span>✓</span> Quality independently verified via peer-reviewed publications
        </p>
      )}

      {coa.notes && <p className="text-xs text-gray-600 leading-relaxed">{coa.notes}</p>}

      <div className="bg-gray-50 rounded p-2.5 text-xs text-gray-600 border border-gray-200 space-y-1">
        <p className="font-medium text-gray-700">Scoring breakdown (0–10)</p>
        <p>Base level ({cfg.label}): {cfg.score} pts</p>
        {coa.independentlyVerified && <p>Independently verified: +1 pt</p>}
        {coa.labCertifications.length >= 2 && <p>Multiple lab certifications: +0.5 pts</p>}
        {score !== null && <p className="font-semibold text-gray-800">Total: {score.toFixed(1)}</p>}
      </div>
    </div>
  )
}
