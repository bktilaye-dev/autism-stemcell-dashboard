import type { TestimonialEntry } from '../types/provider'
import { StarRating } from './StarRating'

interface Props {
  testimonial: TestimonialEntry
}

const domainLabels: Record<string, string> = {
  communication: 'Communication',
  socialSkills: 'Social Skills',
  behavior: 'Behavior',
  selfCare: 'Self-Care',
}

export function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <StarRating rating={testimonial.rating} size="sm" />
        <div className="flex items-center gap-2 shrink-0">
          {testimonial.verified && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
              Verified
            </span>
          )}
          <span className="text-xs text-gray-400">{testimonial.date}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
      {(testimonial.childAgeAtTreatment || testimonial.domainsImproved?.length) && (
        <div className="mt-2 flex flex-wrap gap-1 items-center">
          {testimonial.childAgeAtTreatment && (
            <span className="text-xs text-gray-500">Age at treatment: {testimonial.childAgeAtTreatment}</span>
          )}
          {testimonial.domainsImproved?.map((d) => (
            <span key={d} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
              {domainLabels[d] ?? d}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
