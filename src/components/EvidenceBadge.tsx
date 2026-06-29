import type { EvidenceGrade, StudyDesign } from '../types/provider'

const gradeConfig: Record<EvidenceGrade, { label: string; classes: string }> = {
  high:     { label: 'High Evidence', classes: 'bg-green-100 text-green-800 border-green-300' },
  moderate: { label: 'Moderate Evidence', classes: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  low:      { label: 'Low Evidence', classes: 'bg-orange-100 text-orange-800 border-orange-300' },
  very_low: { label: 'Very Low', classes: 'bg-red-100 text-red-700 border-red-300' },
  unrated:  { label: 'Unrated', classes: 'bg-gray-100 text-gray-600 border-gray-300' },
}

const designLabel: Record<StudyDesign, string> = {
  RCT: 'RCT',
  non_randomized_trial: 'Trial',
  observational: 'Observational',
  case_series: 'Case Series',
  anecdotal: 'Anecdotal',
  none: 'None',
}

interface Props {
  grade: EvidenceGrade
  design?: StudyDesign
  compact?: boolean
}

export function EvidenceBadge({ grade, design, compact }: Props) {
  const cfg = gradeConfig[grade]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
      {!compact && design && design !== 'none' && (
        <span className="opacity-70">· {designLabel[design]}</span>
      )}
    </span>
  )
}
