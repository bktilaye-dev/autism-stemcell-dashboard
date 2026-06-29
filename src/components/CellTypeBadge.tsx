import type { CellType, DeliveryRoute } from '../types/provider'

const cellConfig: Record<CellType, { label: string; classes: string }> = {
  MUSE_dezawa:          { label: 'MUSE / Dezawa', classes: 'bg-purple-100 text-purple-800 border-purple-300' },
  umbilical_cord_msc:   { label: 'Umbilical Cord MSC', classes: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  umbilical_cord_blood: { label: 'Cord Blood HSC', classes: 'bg-blue-100 text-blue-800 border-blue-300' },
  bone_marrow:          { label: 'Bone Marrow MSC', classes: 'bg-amber-100 text-amber-800 border-amber-300' },
  adipose:              { label: 'Adipose MSC', classes: 'bg-lime-100 text-lime-800 border-lime-300' },
  spinal_cord_derived:  { label: 'Spinal Cord Derived', classes: 'bg-red-100 text-red-800 border-red-300' },
  exosomes:             { label: 'Exosomes / EVs', classes: 'bg-pink-100 text-pink-800 border-pink-300' },
  fetal:                { label: 'Fetal Stem Cells', classes: 'bg-orange-100 text-orange-800 border-orange-300' },
  placental:            { label: 'Placental MSC', classes: 'bg-rose-100 text-rose-800 border-rose-300' },
  amniotic:             { label: 'Amniotic Derived', classes: 'bg-sky-100 text-sky-800 border-sky-300' },
  hematopoietic:        { label: 'Hematopoietic (HSC)', classes: 'bg-violet-100 text-violet-800 border-violet-300' },
}

const routeConfig: Record<DeliveryRoute, { label: string; classes: string }> = {
  iv:            { label: 'IV Infusion', classes: 'bg-slate-100 text-slate-700 border-slate-300' },
  intrathecal:   { label: 'Intrathecal (Spinal)', classes: 'bg-rose-100 text-rose-700 border-rose-300' },
  intranasal:    { label: 'Intranasal', classes: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  intramuscular: { label: 'IM Injection', classes: 'bg-teal-100 text-teal-700 border-teal-300' },
}

export function CellTypeBadge({ type }: { type: CellType }) {
  const cfg = cellConfig[type]
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}

export function RouteBadge({ route }: { route: DeliveryRoute }) {
  const cfg = routeConfig[route]
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
