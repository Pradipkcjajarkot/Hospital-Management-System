import { useState, useEffect } from 'react'
import { Search, CalendarRange, Clock, User, Stethoscope, Edit3, Trash2, X, ArrowLeft, Plus, FileText, MessageSquare } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Patient {
  id: number; first_name: string; last_name: string; full_name: string
}

interface Doctor {
  id: number; first_name: string; last_name: string; full_name: string; specialization: string | null
}

interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  appointment_date: string
  appointment_time: string
  purpose: string | null
  status: string
  notes: string | null
  created_at: string
  patient: Patient
  doctor: Doctor
}

const emptyForm = {
  patient_id: '', doctor_id: '', appointment_date: '', appointment_time: '',
  purpose: '', status: 'scheduled', notes: '',
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  confirmed: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  checked_in: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  no_show: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const statusDots: Record<string, string> = {
  scheduled: 'bg-blue-500',
  confirmed: 'bg-indigo-500',
  checked_in: 'bg-emerald-500',
  completed: 'bg-gray-400',
  cancelled: 'bg-rose-500',
  no_show: 'bg-amber-500',
}

function AppointmentForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel, patients, doctors }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
  patients: Patient[]
  doctors: Doctor[]
}) {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the appointment details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('patient')} <span className="text-rose-500">*</span></label>
              <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                <option value="">{t('selectPatient')}</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('doctors')} <span className="text-rose-500">*</span></label>
              <select value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })} required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                <option value="">{t('selectDoctor')}</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.full_name}{d.specialization ? ` (${d.specialization})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('selectDate')} <span className="text-rose-500">*</span></label>
              <input type="date" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('appointmentTime')} <span className="text-rose-500">*</span></label>
              <input type="time" value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('purpose')}</label>
              <input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. General checkup"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('appointmentStatus')}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                {['scheduled', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('notes')}</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Additional notes..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
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

export default function AppointmentManagement() {
  const { t } = useLanguage()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchAppointments(); fetchPatients(); fetchDoctors() }, [])

  async function fetchAppointments() {
    try { const r = await fetch('/api/appointments'); const d = await r.json(); setAppointments(d.appointments) } catch { /* ignore */ }
  }
  async function fetchPatients() {
    try { const r = await fetch('/api/patients'); const d = await r.json(); setPatients(d.patients) } catch { /* ignore */ }
  }
  async function fetchDoctors() {
    try { const r = await fetch('/api/doctors'); const d = await r.json(); setDoctors(d.doctors) } catch { /* ignore */ }
  }

  function openEdit(a: Appointment) {
    setForm({
      patient_id: a.patient_id.toString(),
      doctor_id: a.doctor_id.toString(),
      appointment_date: a.appointment_date,
      appointment_time: a.appointment_time.slice(0, 5),
      purpose: a.purpose || '',
      status: a.status,
      notes: a.notes || '',
    })
    setEditing(a)
  }

  function openAddForm() {
    setForm(emptyForm)
    setShowAddForm(true)
    setSelected(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/appointments/${editing!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, patient_id: Number(form.patient_id), doctor_id: Number(form.doctor_id) }),
      })
      if (res.ok) { setEditing(null); await fetchAppointments() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, patient_id: Number(form.patient_id), doctor_id: Number(form.doctor_id) }),
      })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchAppointments() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('deleteConfirm'))) return
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchAppointments() }
    } catch { alert('Delete failed') }
  }

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase()
    return a.patient.full_name.toLowerCase().includes(q) || a.doctor.full_name.toLowerCase().includes(q) || (a.purpose || '').toLowerCase().includes(q) || a.status.toLowerCase().includes(q)
  })

  function DetailView(a: Appointment) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> {t('backToAll')}
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                  <CalendarRange className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Appointment #{a.id}
                  </h1>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><CalendarRange className="h-4 w-4" /> {a.appointment_date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {a.appointment_time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusColors[a.status] || statusColors.scheduled}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDots[a.status] || 'bg-gray-400'}`} />
                  {a.status.replace('_', ' ')}
                </span>
                <button onClick={() => openEdit(a)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" /> {t('patient')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{a.patient.full_name}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Stethoscope className="h-3.5 w-3.5" /> {t('doctors')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{a.doctor.full_name}{a.doctor.specialization ? ` (${a.doctor.specialization})` : ''}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="h-3.5 w-3.5" /> {t('purpose')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{a.purpose || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <CalendarRange className="h-3.5 w-3.5" /> {t('userCreated')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {a.notes && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('notes')}</h3>
                <div className="mt-1 flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{a.notes}</span>
                </div>
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
            <CalendarRange className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{t('noAppointments')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('clickAddToCreate')}</p>
        </div>
      )
    }

    return (
      <div className="grid gap-3">
        {filtered.map((a) => (
          <div key={a.id}
            className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <button onClick={() => setSelected(a)} className="flex w-full items-center gap-4 p-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                <CalendarRange className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{a.patient.full_name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{a.id}</span>
                  {a.purpose && <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">• {a.purpose}</span>}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {a.doctor.full_name}</span>
                  <span className="flex items-center gap-1"><CalendarRange className="h-3 w-3" /> {a.appointment_date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.appointment_time}</span>
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[a.status] || statusColors.scheduled}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDots[a.status] || 'bg-gray-400'}`} />
                {a.status.replace('_', ' ')}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400" title="Edit">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(a.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
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
      <AppointmentForm
        form={form}
        setForm={setForm}
        saving={saving}
        onCancel={() => setShowAddForm(false)}
        onSubmit={handleAdd}
        title={t('newAppointment')}
        submitLabel={t('save')}
        patients={patients}
        doctors={doctors}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('appointments')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{appointments.length} total appointments</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> {t('newAppointment')}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder={t('search')}
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:outline-blue-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('editAppointment')}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <AppointmentForm
              form={form}
              setForm={setForm}
              saving={saving}
              onCancel={() => setEditing(null)}
              onSubmit={handleSave}
              title={t('editAppointment')}
              submitLabel={t('save')}
              patients={patients}
              doctors={doctors}
            />
          </div>
        </div>
      )}
    </div>
  )
}
