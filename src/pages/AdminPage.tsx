import { useState } from 'react'
import type { Provider, CellType, DeliveryRoute, CellSource, EvidenceGrade, StudyDesign, CoALevel } from '../types/provider'

const emptyProvider = (): Omit<Provider, 'humanCellsOnly'> => ({
  id: '',
  name: '',
  overview: '',
  location: { country: '', countryCode: '', city: '', coordinates: { lat: 0, lng: 0 } },
  cellTypes: [],
  deliveryRoutes: [],
  cellSource: 'allogeneic',
  effectiveness: {
    communication: { score: 0, confidence: 'none', source: 'unknown' },
    socialSkills:   { score: 0, confidence: 'none', source: 'unknown' },
    behavior:       { score: 0, confidence: 'none', source: 'unknown' },
    selfCare:       { score: 0, confidence: 'none', source: 'unknown' },
  },
  evidence: { gradeLevel: 'unrated', studyDesign: 'none', publications: [], clinicalTrials: [] },
  coa: { level: 'unknown', labCertifications: [], patientDocuments: [], independentlyVerified: false, notes: '' },
  testimonials: {
    aggregateRating: 0, totalReviews: 0,
    ratingBreakdown: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
    featured: [], externalUrl: '',
  },
  cost: { minUSD: 0, maxUSD: 0, includesAccommodation: false, sessionRange: { min: 1, max: 4 }, notes: '' },
  patientsTotal: 0, autismPatientCount: 0, yearsOperating: 0,
  contact: { website: '', email: '', phone: '' },
  dataLastVerified: new Date().toISOString().split('T')[0],
})

const cellTypeOptions: CellType[] = ['MUSE_dezawa', 'umbilical_cord_msc', 'umbilical_cord_blood', 'bone_marrow', 'adipose', 'spinal_cord_derived', 'exosomes', 'fetal', 'placental', 'amniotic', 'hematopoietic']
const routeOptions: DeliveryRoute[] = ['iv', 'intrathecal', 'intranasal', 'intramuscular']

const cellTypeLabels: Record<CellType, string> = {
  MUSE_dezawa: 'MUSE / Dezawa',
  umbilical_cord_msc: 'Umbilical Cord MSC',
  umbilical_cord_blood: 'Cord Blood HSC',
  bone_marrow: 'Bone Marrow MSC',
  adipose: 'Adipose MSC',
  spinal_cord_derived: 'Spinal Cord Derived',
  exosomes: 'Exosomes / EVs',
  fetal: 'Fetal Stem Cells',
  placental: 'Placental MSC',
  amniotic: 'Amniotic Derived',
  hematopoietic: 'Hematopoietic (HSC)',
}

const routeLabels: Record<DeliveryRoute, string> = {
  iv: 'IV Infusion',
  intrathecal: 'Intrathecal (Spinal)',
  intranasal: 'Intranasal',
  intramuscular: 'Intramuscular',
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder }: { value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
    />
  )
}

function Select<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

const domainKeys = ['communication', 'socialSkills', 'behavior', 'selfCare'] as const
const domainLabels: Record<typeof domainKeys[number], string> = {
  communication: 'Communication',
  socialSkills: 'Social Skills',
  behavior: 'Behavior',
  selfCare: 'Self-Care',
}

export function AdminPage() {
  const [form, setForm] = useState(emptyProvider())
  const [exported, setExported] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  function handleExport() {
    const record: Provider = { ...form, humanCellsOnly: true, id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
    const json = JSON.stringify(record, null, 2)
    setExported(json)

    // Save to localStorage as draft
    const existing = JSON.parse(localStorage.getItem('stemcell-admin-drafts') || '[]')
    const updated = [...existing.filter((p: Provider) => p.id !== record.id), record]
    localStorage.setItem('stemcell-admin-drafts', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleCopyJSON() {
    if (exported) navigator.clipboard.writeText(exported)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add / Edit Provider</h1>
            <p className="text-sm text-gray-500 mt-1">Fill in what you know. All fields are optional except Name.</p>
          </div>
          <a href="/" className="text-sm text-blue-600 hover:underline">← Back to dashboard</a>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
            <div className="grid gap-4">
              <Field label="Provider Name *">
                <Input value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. Stem Cell Institute" />
              </Field>
              <Field label="Overview" hint="Brief description of the provider and their approach">
                <Textarea value={form.overview} onChange={(v) => set('overview', v)} rows={4} />
              </Field>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country">
                <Input value={form.location.country} onChange={(v) => set('location', { ...form.location, country: v })} placeholder="Panama" />
              </Field>
              <Field label="Country Code (2-letter ISO)" hint="e.g. US, JP, IN, MX">
                <Input value={form.location.countryCode} onChange={(v) => set('location', { ...form.location, countryCode: v.toUpperCase().slice(0, 2) })} placeholder="PA" />
              </Field>
              <Field label="City">
                <Input value={form.location.city} onChange={(v) => set('location', { ...form.location, city: v })} placeholder="Panama City" />
              </Field>
              <div />
              <Field label="Latitude" hint="Decimal degrees (e.g. 8.9936)">
                <Input type="number" value={form.location.coordinates.lat} onChange={(v) => set('location', { ...form.location, coordinates: { ...form.location.coordinates, lat: parseFloat(v) || 0 } })} />
              </Field>
              <Field label="Longitude" hint="Decimal degrees (e.g. -79.5197)">
                <Input type="number" value={form.location.coordinates.lng} onChange={(v) => set('location', { ...form.location, coordinates: { ...form.location.coordinates, lng: parseFloat(v) || 0 } })} />
              </Field>
            </div>
          </section>

          {/* Cell Types & Routes */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Treatment Type</h2>
            <div className="space-y-4">
              <Field label="Stem Cell Types (select all that apply)">
                <div className="flex flex-wrap gap-2 mt-1">
                  {cellTypeOptions.map((t) => (
                    <label key={t} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${form.cellTypes.includes(t) ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                      <input type="checkbox" className="sr-only" checked={form.cellTypes.includes(t)} onChange={() => set('cellTypes', toggleArrayItem(form.cellTypes, t))} />
                      {cellTypeLabels[t]}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Delivery Routes (select all that apply)">
                <div className="flex flex-wrap gap-2 mt-1">
                  {routeOptions.map((r) => (
                    <label key={r} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${form.deliveryRoutes.includes(r) ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                      <input type="checkbox" className="sr-only" checked={form.deliveryRoutes.includes(r)} onChange={() => set('deliveryRoutes', toggleArrayItem(form.deliveryRoutes, r))} />
                      {routeLabels[r]}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Cell Source">
                <Select<CellSource>
                  value={form.cellSource}
                  onChange={(v) => set('cellSource', v)}
                  options={[
                    { value: 'allogeneic', label: 'Allogeneic (donor cells)' },
                    { value: 'autologous', label: "Autologous (patient's own cells)" },
                    { value: 'both', label: 'Both options available' },
                  ]}
                />
              </Field>
            </div>
          </section>

          {/* Effectiveness */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Effectiveness (0–10 per domain)</h2>
            <div className="space-y-4">
              {domainKeys.map((key) => (
                <div key={key} className="grid grid-cols-3 gap-3 items-start">
                  <Field label={domainLabels[key]}>
                    <input
                      type="range" min={0} max={10} step={0.5}
                      value={form.effectiveness[key].score}
                      onChange={(e) => set('effectiveness', { ...form.effectiveness, [key]: { ...form.effectiveness[key], score: parseFloat(e.target.value) } })}
                      className="w-full accent-blue-500"
                    />
                    <span className="text-sm text-gray-600">{form.effectiveness[key].score}/10</span>
                  </Field>
                  <Field label="Confidence">
                    <Select
                      value={form.effectiveness[key].confidence}
                      onChange={(v: any) => set('effectiveness', { ...form.effectiveness, [key]: { ...form.effectiveness[key], confidence: v } })}
                      options={[
                        { value: 'none', label: 'None / No data' },
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                      ]}
                    />
                  </Field>
                  <Field label="Source">
                    <Select
                      value={form.effectiveness[key].source}
                      onChange={(v: any) => set('effectiveness', { ...form.effectiveness, [key]: { ...form.effectiveness[key], source: v } })}
                      options={[
                        { value: 'unknown', label: 'Unknown' },
                        { value: 'patient_survey', label: 'Patient Survey' },
                        { value: 'provider_report', label: 'Provider Report' },
                        { value: 'published_study', label: 'Published Study' },
                      ]}
                    />
                  </Field>
                </div>
              ))}
            </div>
          </section>

          {/* Evidence */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Evidence Quality</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Overall Evidence Grade">
                <Select<EvidenceGrade>
                  value={form.evidence.gradeLevel}
                  onChange={(v) => set('evidence', { ...form.evidence, gradeLevel: v })}
                  options={[
                    { value: 'unrated', label: 'Unrated / Research only' },
                    { value: 'very_low', label: 'Very Low' },
                    { value: 'low', label: 'Low' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'high', label: 'High' },
                  ]}
                />
              </Field>
              <Field label="Best Study Design">
                <Select<StudyDesign>
                  value={form.evidence.studyDesign}
                  onChange={(v) => set('evidence', { ...form.evidence, studyDesign: v })}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'anecdotal', label: 'Anecdotal' },
                    { value: 'case_series', label: 'Case Series' },
                    { value: 'observational', label: 'Observational Study' },
                    { value: 'non_randomized_trial', label: 'Non-Randomized Trial' },
                    { value: 'RCT', label: 'Randomized Controlled Trial (RCT)' },
                  ]}
                />
              </Field>
            </div>
          </section>

          {/* Certificate of Authenticity */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Certificate of Authenticity</h2>
            <div className="space-y-4">
              <Field label="CoA Level" hint="What documentation does this clinic actually provide?">
                <Select<CoALevel>
                  value={form.coa.level}
                  onChange={(v) => set('coa', { ...form.coa, level: v })}
                  options={[
                    { value: 'unknown', label: 'Unknown — no data found' },
                    { value: 'claimed', label: 'Claimed — clinic says GMP/ISO but unverified' },
                    { value: 'lab_only', label: 'Lab Certified — certified lab, unclear if patient gets CoA' },
                    { value: 'partial', label: 'Partial CoA — certified lab + some docs to patient' },
                    { value: 'full', label: 'Full CoA — certified lab + full docs to patient' },
                    { value: 'none', label: 'None — no quality documentation' },
                  ]}
                />
              </Field>
              <Field label="Lab Certifications (comma-separated)" hint="e.g. ISO 9001:2015, GMP, GLP">
                <Input
                  value={form.coa.labCertifications.join(', ')}
                  onChange={(v) => set('coa', { ...form.coa, labCertifications: v.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="ISO 9001:2015, GMP, GLP"
                />
              </Field>
              <Field label="Patient Documents (comma-separated)" hint="Documents actually given to patient">
                <Input
                  value={form.coa.patientDocuments.join(', ')}
                  onChange={(v) => set('coa', { ...form.coa, patientDocuments: v.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="Lot number, Viability %, Sterility report, Donor screening"
                />
              </Field>
              <Field label="Independently Verified">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.coa.independentlyVerified}
                    onChange={(e) => set('coa', { ...form.coa, independentlyVerified: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">Quality verified by peer-reviewed publications or independent audits</span>
                </label>
              </Field>
              <Field label="CoA Notes">
                <Textarea value={form.coa.notes} onChange={(v) => set('coa', { ...form.coa, notes: v })} rows={2} />
              </Field>
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Testimonials</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Aggregate Rating (0–5)">
                <input
                  type="range" min={0} max={5} step={0.1}
                  value={form.testimonials.aggregateRating}
                  onChange={(e) => set('testimonials', { ...form.testimonials, aggregateRating: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400"
                />
                <span className="text-sm text-gray-600">{form.testimonials.aggregateRating.toFixed(1)} / 5</span>
              </Field>
              <Field label="Total Reviews">
                <Input type="number" value={form.testimonials.totalReviews} onChange={(v) => set('testimonials', { ...form.testimonials, totalReviews: parseInt(v) || 0 })} />
              </Field>
              <Field label="External Reviews URL" hint="Google, Trustpilot, or forum link">
                <Input value={form.testimonials.externalUrl ?? ''} onChange={(v) => set('testimonials', { ...form.testimonials, externalUrl: v })} placeholder="https://..." />
              </Field>
            </div>
          </section>

          {/* Cost */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Cost</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min Cost (USD)">
                <Input type="number" value={form.cost.minUSD} onChange={(v) => set('cost', { ...form.cost, minUSD: parseInt(v) || 0 })} />
              </Field>
              <Field label="Max Cost (USD)">
                <Input type="number" value={form.cost.maxUSD} onChange={(v) => set('cost', { ...form.cost, maxUSD: parseInt(v) || 0 })} />
              </Field>
              <Field label="Min Sessions">
                <Input type="number" value={form.cost.sessionRange.min} onChange={(v) => set('cost', { ...form.cost, sessionRange: { ...form.cost.sessionRange, min: parseInt(v) || 1 } })} />
              </Field>
              <Field label="Max Sessions">
                <Input type="number" value={form.cost.sessionRange.max} onChange={(v) => set('cost', { ...form.cost, sessionRange: { ...form.cost.sessionRange, max: parseInt(v) || 1 } })} />
              </Field>
              <div className="col-span-2">
                <Field label="Cost Notes">
                  <Input value={form.cost.notes ?? ''} onChange={(v) => set('cost', { ...form.cost, notes: v })} placeholder="e.g. Includes accommodation, travel not included" />
                </Field>
              </div>
            </div>
          </section>

          {/* Numbers */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Patient Numbers</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Patients Treated">
                <Input type="number" value={form.patientsTotal} onChange={(v) => set('patientsTotal', parseInt(v) || 0)} />
              </Field>
              <Field label="Autism Patients Specifically">
                <Input type="number" value={form.autismPatientCount ?? 0} onChange={(v) => set('autismPatientCount', parseInt(v) || 0)} />
              </Field>
              <Field label="Years Operating">
                <Input type="number" value={form.yearsOperating ?? 0} onChange={(v) => set('yearsOperating', parseInt(v) || 0)} />
              </Field>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Contact</h2>
            <div className="grid gap-3">
              <Field label="Website">
                <Input value={form.contact.website} onChange={(v) => set('contact', { ...form.contact, website: v })} placeholder="https://..." />
              </Field>
              <Field label="Email">
                <Input value={form.contact.email ?? ''} onChange={(v) => set('contact', { ...form.contact, email: v })} placeholder="info@clinic.com" />
              </Field>
              <Field label="Phone">
                <Input value={form.contact.phone ?? ''} onChange={(v) => set('contact', { ...form.contact, phone: v })} placeholder="+1-555-000-0000" />
              </Field>
            </div>
          </section>

          {/* Export */}
          <section className="border-t border-gray-200 pt-4">
            <button
              onClick={handleExport}
              disabled={!form.name.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Generate JSON Record
            </button>
            {saved && <p className="text-center text-sm text-green-600 mt-2">Saved to browser storage</p>}
          </section>

          {exported && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Generated JSON</h3>
                <button onClick={handleCopyJSON} className="text-xs text-blue-600 hover:underline">Copy to clipboard</button>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Copy this record and paste it into <code className="bg-gray-100 px-1 rounded">src/data/providers.json</code> to add it to the dashboard permanently.
              </p>
              <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-auto max-h-96 leading-relaxed">
                {exported}
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
