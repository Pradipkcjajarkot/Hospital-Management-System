import { useState, useEffect } from 'react'
import { Search, BedDouble, Edit3, Trash2, X, ArrowLeft, Plus, User, MapPin, DollarSign, Calendar, Activity } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Bed {
  id: number
  ward_name: string
  ward_type: string
  bed_number: string
  bed_type: string
  floor: string | null
  rate_per_day: string
  status: string
  patient_id: number | null
  assigned_at: string | null
  notes: string | null
  created_at: string
  patient: { id: number; first_name: string; last_name: string } | null
}

const emptyForm = {
  ward_name: '', ward_type: 'general', bed_number: '', bed_type: 'standard',
  floor: '', rate_per_day: '0', status: 'available',
  patient_id: '', assigned_at: '', notes: '',
}

const wardTypes = ['general', 'private', 'icu', 'maternity', 'pediatric', 'emergency', 'operation_theatre']
const bedTypes = ['standard', 'electric', 'icu', 'bariatric', 'pediatric']
const statuses = ['available', 'occupied', 'maintenance', 'reserved']

function BedForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel, patients }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
  patients: { id: number; first_name: string; last_name: string }[]
}) {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the bed details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('wardName')} <span className="text-rose-500">*</span></label>
            <input value={form.ward_name} onChange={(e) => setForm({ ...form, ward_name: e.target.value })} required placeholder="e.g. General Ward A"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('bedNumber')} <span className="text-rose-500">*</span></label>
            <input value={form.bed_number} onChange={(e) => setForm({ ...form, bed_number: e.target.value })} required placeholder="e.g. B-101"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('wardType')}</label>
            <select value={form.ward_type} onChange={(e) => setForm({ ...form, ward_type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {wardTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('bedType')}</label>
            <select value={form.bed_type} onChange={(e) => setForm({ ...form, bed_type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {bedTypes.map((t) => <option key={t} value={t}>{t.replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('floor')}</label>
            <input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="e.g. 3rd Floor"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('ratePerDay')} ($) <span className="text-rose-500">*</span></label>
            <input type="number" step="0.01" min="0" value={form.rate_per_day} onChange={(e) => setForm({ ...form, rate_per_day: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('bedStatus')}</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('patient')}</label>
            <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="">{t('none')}</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('assignedDate')}</label>
            <input type="date" value={form.assigned_at} onChange={(e) => setForm({ ...form, assigned_at: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('notes')}</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any additional notes..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button type="button" onClick={onCancel}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600">
            {t('cancel')}
          </button>
          <button type="submit" disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            {saving ? t('saving') : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function BedWardManagement() {
  const { t } = useLanguage()
  const [beds, setBeds] = useState<Bed[]>([])
  const [patients, setPatients] = useState<{ id: number; first_name: string; last_name: string }[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Bed | null>(null)
  const [editing, setEditing] = useState<Bed | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchBeds(); fetchPatients() }, [])

  async function fetchBeds() {
    try { const r = await fetch('/api/beds'); const d = await r.json(); setBeds(d.beds ?? []) } catch { /* ignore */ }
  }

  async function fetchPatients() {
    try { const r = await fetch('/api/patients'); const d = await r.json(); setPatients(d.patients ?? []) } catch { /* ignore */ }
  }

  function openEdit(b: Bed) {
    setForm({
      ward_name: b.ward_name, ward_type: b.ward_type, bed_number: b.bed_number, bed_type: b.bed_type,
      floor: b.floor || '', rate_per_day: b.rate_per_day, status: b.status,
      patient_id: b.patient_id?.toString() || '', assigned_at: b.assigned_at || '', notes: b.notes || '',
    })
    setEditing(b)
  }

  function openAddForm() { setForm(emptyForm); setShowAddForm(true); setSelected(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: form.patient_id ? Number(form.patient_id) : null, rate_per_day: Number(form.rate_per_day) }
      const res = await fetch(`/api/beds/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setEditing(null); await fetchBeds() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: form.patient_id ? Number(form.patient_id) : null, rate_per_day: Number(form.rate_per_day) }
      const res = await fetch('/api/beds', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchBeds() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('deleteConfirm'))) return
    try {
      const res = await fetch(`/api/beds/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchBeds() }
    } catch { alert('Delete failed') }
  }

  const filtered = beds.filter((b) => {
    const q = search.toLowerCase()
    return b.ward_name.toLowerCase().includes(q) || b.bed_number.toLowerCase().includes(q) || b.ward_type.toLowerCase().includes(q) || (b.floor || '').toLowerCase().includes(q)
  })

  const summary = {
    total: beds.length,
    available: beds.filter((b) => b.status === 'available').length,
    occupied: beds.filter((b) => b.status === 'occupied').length,
    maintenance: beds.filter((b) => b.status === 'maintenance').length,
  }

  function DetailView(b: Bed) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> {t('backToAll')}
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-xl font-bold text-cyan-700 dark:from-cyan-900/40 dark:to-blue-900/40 dark:text-cyan-400">
                  <BedDouble className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{b.bed_number} — {b.ward_name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      b.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : b.status === 'occupied' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : b.status === 'maintenance' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        b.status === 'available' ? 'bg-emerald-500'
                        : b.status === 'occupied' ? 'bg-blue-500'
                        : b.status === 'maintenance' ? 'bg-amber-500'
                        : 'bg-gray-400'
                      }`} />
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(b)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 dark:hover:text-amber-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" /> {t('wardType')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white capitalize">{b.ward_type.replace(/_/g, ' ')}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <BedDouble className="h-3.5 w-3.5" /> {t('bedType')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white capitalize">{b.bed_type.replace(/_/g, ' ')}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" /> {t('floor')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{b.floor || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-3.5 w-3.5" /> {t('ratePerDay')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${Number(b.rate_per_day).toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" /> {t('assignedPatient')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {b.patient ? `${b.patient.first_name} ${b.patient.last_name}` : '—'}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Assigned Date
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{b.assigned_at ? new Date(b.assigned_at).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {b.notes && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('notes')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{b.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function ListView() {
    if (filtered.length === 0) {
      return (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
            <BedDouble className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{t('noBeds')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('clickAddToCreate')}</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div key={b.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-cyan-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800">
            <button onClick={() => setSelected(b)} className="w-full p-5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600 group-hover:from-cyan-200 group-hover:to-blue-200 transition-colors dark:from-cyan-900/30 dark:to-blue-900/30 dark:text-cyan-400 dark:group-hover:from-cyan-900/50 dark:group-hover:to-blue-900/50">
                <BedDouble className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{b.bed_number} — {b.ward_name}</h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">{b.ward_type.replace(/_/g, ' ')} / {b.bed_type.replace(/_/g, ' ')}</p>
              {b.floor && <p className="text-xs text-gray-400 dark:text-gray-500">{b.floor}</p>}
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                b.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : b.status === 'occupied' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : b.status === 'maintenance' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  b.status === 'available' ? 'bg-emerald-500'
                  : b.status === 'occupied' ? 'bg-blue-500'
                  : b.status === 'maintenance' ? 'bg-amber-500'
                  : 'bg-gray-400'
                }`} />
                {b.status}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="Edit">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (showAddForm) {
    return (
      <BedForm
        form={form} setForm={setForm} saving={saving} patients={patients}
        onCancel={() => setShowAddForm(false)} onSubmit={handleAdd}
        title={t('addBed')} submitLabel={t('save')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('bedWardTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{beds.length} beds</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> {t('addBed')}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('totalBeds')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t('userActive')}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.available}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{t('occupied')}</p>
          <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.occupied}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">{t('maintenance')}</p>
          <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{summary.maintenance}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder="Search by ward name, bed number, type or floor..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 dark:focus:outline-amber-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('editBed')}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <BedForm
              form={form} setForm={setForm} saving={saving} patients={patients}
              onCancel={() => setEditing(null)} onSubmit={handleSave}
              title={t('editBed')} submitLabel={t('save')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
