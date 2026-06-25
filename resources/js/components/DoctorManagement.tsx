import { useState, useEffect } from 'react'
import { Search, Edit3, Trash2, X, Phone, Mail, User, ArrowLeft, GraduationCap, Stethoscope, BadgeDollarSign, Clock, MapPin, Plus } from "lucide-react"

interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  specialization: string | null
  qualification: string | null
  license_number: string | null
  department: string | null
  experience_years: number | null
  consultation_fee: number | null
  available_days: string | null
  available_time_start: string | null
  available_time_end: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  status: string
  full_name: string
  created_at: string
}

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '', specialization: '',
  qualification: '', license_number: '', department: '', experience_years: '',
  consultation_fee: '', available_days: '', available_time_start: '',
  available_time_end: '', address: '', city: '', state: '', pincode: '', status: 'active',
}

function DoctorForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Personal Information</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'First Name', key: 'first_name', required: true },
                { label: 'Last Name', key: 'last_name', required: true },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}{f.required && <span className="text-rose-500 ml-0.5">*</span>}</label>
                  <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.required}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
              ))}
              {[
                { label: 'Email', key: 'email', type: 'email', required: true },
                { label: 'Phone', key: 'phone' },
                { label: 'Specialization', key: 'specialization' },
                { label: 'Qualification', key: 'qualification' },
                { label: 'License Number', key: 'license_number' },
                { label: 'Department', key: 'department' },
                { label: 'Experience (years)', key: 'experience_years', type: 'number' },
                { label: 'Consultation Fee', key: 'consultation_fee', type: 'number' },
                { label: 'Available Days', key: 'available_days', placeholder: 'e.g. Mon-Fri' },
                { label: 'Available From', key: 'available_time_start', type: 'time' },
                { label: 'Available To', key: 'available_time_end', type: 'time' },
                { label: 'Status', key: 'status', type: 'select', options: ['active', 'inactive', 'on_leave'] },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}{f.required && <span className="text-rose-500 ml-0.5">*</span>}</label>
                  {f.type === 'select' ? (
                    <select value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                      {f.options.map((o) => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.required} placeholder={(f as any).placeholder || ''}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Address</h3>
            <div className="mt-3">
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {[{ label: 'City', key: 'city' }, { label: 'State', key: 'state' }, { label: 'Pincode', key: 'pincode' }].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
              ))}
            </div>
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

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Doctor | null>(null)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchDoctors() }, [])

  async function fetchDoctors() {
    try {
      const res = await fetch('/api/doctors')
      const data = await res.json()
      setDoctors(data.doctors)
    } catch { /* ignore */ }
  }

  function openEdit(d: Doctor) {
    setForm({
      first_name: d.first_name, last_name: d.last_name, email: d.email,
      phone: d.phone || '', specialization: d.specialization || '',
      qualification: d.qualification || '', license_number: d.license_number || '',
      department: d.department || '', experience_years: d.experience_years?.toString() || '',
      consultation_fee: d.consultation_fee?.toString() || '',
      available_days: d.available_days || '', available_time_start: (d.available_time_start || '').slice(0, 5),
      available_time_end: (d.available_time_end || '').slice(0, 5), address: d.address || '',
      city: d.city || '', state: d.state || '', pincode: d.pincode || '',
      status: d.status,
    })
    setEditing(d)
  }

  function openAddForm() {
    setForm(emptyForm)
    setShowAddForm(true)
    setSelected(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = {
      ...form,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
      consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
    }
    try {
      const res = await fetch(`/api/doctors/${editing!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setEditing(null)
        await fetchDoctors()
      } else {
        const data = await res.json()
        alert(Object.values(data.errors || { message: data.message || 'Error' }).flat().join('\n'))
      }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = {
      ...form,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
      consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
    }
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setShowAddForm(false)
        setForm(emptyForm)
        await fetchDoctors()
      } else {
        const data = await res.json()
        alert(Object.values(data.errors || { message: data.message || 'Error' }).flat().join('\n'))
      }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this doctor?')) return
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (selected?.id === id) setSelected(null)
        await fetchDoctors()
      }
    } catch { alert('Delete failed') }
  }

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase()
    return d.full_name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || (d.phone || '').includes(q) || (d.specialization || '').toLowerCase().includes(q)
  })

  function DetailView(d: Doctor) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> Back to all doctors
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-xl font-bold text-violet-700 dark:from-violet-900/40 dark:to-purple-900/40 dark:text-violet-400">
                  {d.first_name[0]}{d.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {d.full_name}
                      {d.qualification && <span className="ml-1.5 text-base font-normal text-gray-400 dark:text-gray-500">({d.qualification})</span>}
                    </h1>
                    <span className="text-sm text-gray-400 dark:text-gray-500">#{d.id}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {d.email && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {d.email}</span>}
                    {d.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {d.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  d.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  d.status === 'on_leave' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${d.status === 'active' ? 'bg-emerald-500' : d.status === 'on_leave' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                  {d.status.replace('_', ' ')}
                </span>
                <button onClick={() => openEdit(d)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(d.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Stethoscope className="h-3.5 w-3.5" /> Specialization
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.specialization || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <GraduationCap className="h-3.5 w-3.5" /> Qualification
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.qualification || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <BadgeDollarSign className="h-3.5 w-3.5" /> Consultation Fee
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.consultation_fee ? `$${d.consultation_fee}` : '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" /> Availability
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {d.available_days ? `${d.available_days}${d.available_time_start ? ` ${d.available_time_start}-${d.available_time_end || ''}` : ''}` : '—'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{d.department || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">License Number</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{d.license_number || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{d.experience_years ? `${d.experience_years} years` : '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered On</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(d.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {(d.address || d.city || d.state || d.pincode) && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</h3>
                <div className="mt-1 flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{[d.address, d.city, d.state, d.pincode].filter(Boolean).join(', ')}</span>
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
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click "Add Doctor" to register a new doctor.</p>
        </div>
      )
    }

    return (
      <div className="grid gap-3">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-violet-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-800"
          >
            <button
              onClick={() => setSelected(d)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-sm font-bold text-violet-700 dark:from-violet-900/40 dark:to-purple-900/40 dark:text-violet-400">
                {d.first_name[0]}{d.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{d.full_name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{d.id}</span>
                  {d.specialization && <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">• {d.specialization}</span>}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {d.email}</span>
                  {d.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {d.phone}</span>}
                  {d.department && <span>{d.department}</span>}
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                d.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                d.status === 'on_leave' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {d.status.replace('_', ' ')}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400" title="Edit">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(d.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
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
      <DoctorForm
        form={form}
        setForm={setForm}
        saving={saving}
        onCancel={() => setShowAddForm(false)}
        onSubmit={handleAdd}
        title="Add New Doctor"
        submitLabel="Add Doctor"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctors</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{doctors.length} registered doctors</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> Add Doctor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder="Search by name, email, phone or specialization..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-violet-500/25 focus:border-violet-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-violet-500 dark:focus:outline-violet-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Doctor</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <DoctorForm
              form={form}
              setForm={setForm}
              saving={saving}
              onCancel={() => setEditing(null)}
              onSubmit={handleSave}
              title="Edit Doctor"
              submitLabel="Update Doctor"
            />
          </div>
        </div>
      )}
    </div>
  )
}
