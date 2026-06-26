import { useState, useEffect } from 'react'
import { Search, FlaskConical, Edit3, Trash2, X, ArrowLeft, Plus, User, Stethoscope, Calendar, Activity, Beaker } from "lucide-react"

interface LabTest {
  id: number
  test_name: string
  patient_id: number
  doctor_id: number | null
  test_category: string | null
  sample_type: string | null
  test_date: string
  result_date: string | null
  result: string | null
  normal_range: string | null
  status: string
  notes: string | null
  created_at: string
  patient: { id: number; first_name: string; last_name: string }
  doctor: { id: number; first_name: string; last_name: string } | null
}

const emptyForm = {
  test_name: '', patient_id: '', doctor_id: '', test_category: '', sample_type: '',
  test_date: '', result_date: '', result: '', normal_range: '', status: 'pending', notes: '',
}

const statuses = ['pending', 'in_progress', 'completed', 'cancelled']

function LabTestForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel, patients, doctors }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
  patients: { id: number; first_name: string; last_name: string }[]
  doctors: { id: number; first_name: string; last_name: string }[]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the lab test details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Test Name <span className="text-rose-500">*</span></label>
            <input value={form.test_name} onChange={(e) => setForm({ ...form, test_name: e.target.value })} required placeholder="e.g. Complete Blood Count"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Patient <span className="text-rose-500">*</span></label>
            <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="">Select patient...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Doctor</label>
            <select value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="">-- None --</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Test Category</label>
            <input value={form.test_category} onChange={(e) => setForm({ ...form, test_category: e.target.value })} placeholder="e.g. Hematology"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Sample Type</label>
            <input value={form.sample_type} onChange={(e) => setForm({ ...form, sample_type: e.target.value })} placeholder="e.g. Blood, Urine"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Test Date <span className="text-rose-500">*</span></label>
            <input type="date" value={form.test_date} onChange={(e) => setForm({ ...form, test_date: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Result Date</label>
            <input type="date" value={form.result_date} onChange={(e) => setForm({ ...form, result_date: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Normal Range</label>
            <input value={form.normal_range} onChange={(e) => setForm({ ...form, normal_range: e.target.value })} placeholder="e.g. 4.5-11.0 x10^9/L"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Result</label>
            <textarea value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} rows={2} placeholder="Test results..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any additional notes..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button type="button" onClick={onCancel}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function LaboratoryManagement() {
  const [labTests, setLabTests] = useState<LabTest[]>([])
  const [patients, setPatients] = useState<{ id: number; first_name: string; last_name: string }[]>([])
  const [doctors, setDoctors] = useState<{ id: number; first_name: string; last_name: string }[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<LabTest | null>(null)
  const [editing, setEditing] = useState<LabTest | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchLabTests(); fetchPatients(); fetchDoctors() }, [])

  async function fetchLabTests() {
    try { const r = await fetch('/api/lab-tests'); const d = await r.json(); setLabTests(d.labTests ?? []) } catch { /* ignore */ }
  }

  async function fetchPatients() {
    try { const r = await fetch('/api/patients'); const d = await r.json(); setPatients(d.patients ?? []) } catch { /* ignore */ }
  }

  async function fetchDoctors() {
    try { const r = await fetch('/api/doctors'); const d = await r.json(); setDoctors(d.doctors ?? []) } catch { /* ignore */ }
  }

  function openEdit(t: LabTest) {
    setForm({
      test_name: t.test_name, patient_id: t.patient_id.toString(), doctor_id: t.doctor_id?.toString() || '',
      test_category: t.test_category || '', sample_type: t.sample_type || '',
      test_date: t.test_date, result_date: t.result_date || '',
      result: t.result || '', normal_range: t.normal_range || '', status: t.status, notes: t.notes || '',
    })
    setEditing(t)
  }

  function openAddForm() { setForm(emptyForm); setShowAddForm(true); setSelected(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: Number(form.patient_id), doctor_id: form.doctor_id ? Number(form.doctor_id) : null }
      const res = await fetch(`/api/lab-tests/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setEditing(null); await fetchLabTests() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: Number(form.patient_id), doctor_id: form.doctor_id ? Number(form.doctor_id) : null }
      const res = await fetch('/api/lab-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchLabTests() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this lab test?')) return
    try {
      const res = await fetch(`/api/lab-tests/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchLabTests() }
    } catch { alert('Delete failed') }
  }

  const filtered = labTests.filter((t) => {
    const q = search.toLowerCase()
    return t.test_name.toLowerCase().includes(q) || (t.test_category || '').toLowerCase().includes(q) || (t.sample_type || '').toLowerCase().includes(q)
  })

  const statusColors: Record<string, { bg: string; dot: string }> = {
    pending: { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    in_progress: { bg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    completed: { bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { bg: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
  }

  function DetailView(t: LabTest) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> Back to all lab tests
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-xl font-bold text-purple-700 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-400">
                  <FlaskConical className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.test_name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[t.status]?.bg || 'bg-gray-50 text-gray-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusColors[t.status]?.dot || 'bg-gray-400'}`} />
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(t)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 dark:hover:text-amber-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" /> Patient
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.patient.first_name} {t.patient.last_name}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Stethoscope className="h-3.5 w-3.5" /> Doctor
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.doctor ? `${t.doctor.first_name} ${t.doctor.last_name}` : '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Beaker className="h-3.5 w-3.5" /> Category
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.test_category || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Activity className="h-3.5 w-3.5" /> Sample Type
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.sample_type || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Test Date
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(t.test_date).toLocaleDateString()}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Result Date
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.result_date ? new Date(t.result_date).toLocaleDateString() : '—'}</p>
              </div>
              {t.normal_range && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Activity className="h-3.5 w-3.5" /> Normal Range
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{t.normal_range}</p>
                </div>
              )}
            </div>

            {t.result && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.result}</p>
              </div>
            )}
            {t.notes && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.notes}</p>
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
            <FlaskConical className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No lab tests found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click "Add Lab Test" to create one.</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div key={t.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-purple-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800">
            <button onClick={() => setSelected(t)} className="w-full p-5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400 dark:group-hover:from-purple-900/50 dark:group-hover:to-pink-900/50">
                <FlaskConical className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{t.test_name}</h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Patient: {t.patient.first_name} {t.patient.last_name}</p>
              {t.test_category && <p className="text-xs text-gray-400 dark:text-gray-500">{t.test_category}</p>}
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[t.status]?.bg || 'bg-gray-50 text-gray-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusColors[t.status]?.dot || 'bg-gray-400'}`} />
                {t.status.replace(/_/g, ' ')}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="Edit">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
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
      <LabTestForm
        form={form} setForm={setForm} saving={saving} patients={patients} doctors={doctors}
        onCancel={() => setShowAddForm(false)} onSubmit={handleAdd}
        title="Add New Lab Test" submitLabel="Create Lab Test"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laboratory</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{labTests.length} lab tests</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> Add Lab Test
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tests</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{labTests.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{labTests.filter((t) => t.status === 'pending').length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{labTests.filter((t) => t.status === 'in_progress').length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Completed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{labTests.filter((t) => t.status === 'completed').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder="Search by test name, category or sample type..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 dark:focus:outline-amber-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Lab Test</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <LabTestForm
              form={form} setForm={setForm} saving={saving} patients={patients} doctors={doctors}
              onCancel={() => setEditing(null)} onSubmit={handleSave}
              title="Edit Lab Test" submitLabel="Update Lab Test"
            />
          </div>
        </div>
      )}
    </div>
  )
}
