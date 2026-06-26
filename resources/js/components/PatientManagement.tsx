import { useState, useEffect } from 'react'
import { Search, Edit3, Trash2, X, Phone, Mail, User, PhoneCall, AlertTriangle, ArrowLeft } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Patient {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  dob: string | null
  gender: string | null
  blood_group: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_history: string | null
  allergies: string | null
  status: string
  full_name: string
  created_at: string
}

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '', dob: '', gender: '',
  blood_group: '', address: '', city: '', state: '', pincode: '',
  emergency_contact_name: '', emergency_contact_phone: '',
  medical_history: '', allergies: '', status: 'active',
}

export default function PatientManagement() {
  const { t } = useLanguage()
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Patient | null>(null)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchPatients() }, [])

  async function fetchPatients() {
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      setPatients(data.patients)
    } catch { /* ignore */ }
  }

  function openEdit(p: Patient) {
    setForm({
      first_name: p.first_name, last_name: p.last_name, email: p.email || '',
      phone: p.phone || '', dob: p.dob || '', gender: p.gender || '',
      blood_group: p.blood_group || '', address: p.address || '', city: p.city || '',
      state: p.state || '', pincode: p.pincode || '',
      emergency_contact_name: p.emergency_contact_name || '',
      emergency_contact_phone: p.emergency_contact_phone || '',
      medical_history: p.medical_history || '', allergies: p.allergies || '',
      status: p.status,
    })
    setEditing(p)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/patients/${editing!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setEditing(null)
        await fetchPatients()
      } else {
        const data = await res.json()
        alert(Object.values(data.errors || { message: data.message || t('error') }).flat().join('\n'))
      }
    } catch { alert(t('updateFailed')) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('deleteConfirm'))) return
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (selected?.id === id) setSelected(null)
        await fetchPatients()
      }
    } catch { alert(t('deleteFailed')) }
  }

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    return p.full_name.toLowerCase().includes(q) || (p.email?.toLowerCase() || '').includes(q) || (p.phone || '').includes(q)
  })

  function DetailView(p: Patient) {
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
                  {p.first_name[0]}{p.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{p.full_name}</h1>
                    <span className="text-sm text-gray-400 dark:text-gray-500">#{p.id}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {p.email && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {p.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  p.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  p.status === 'discharged' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : p.status === 'discharged' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  {p.status === 'active' ? t('active') : p.status === 'discharged' ? t('discharged') : t('inactive')}
                </span>
                <button onClick={() => openEdit(p)}                 className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400" title={t('edit')}>
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title={t('delete')}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('patientGender')}</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white capitalize">{p.gender || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('dateOfBirth')}</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{p.dob || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('patientBloodGroup')}</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{p.blood_group || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('registeredOn')}</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {p.address && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('address')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.address}{p.pincode ? ` - ${p.pincode}` : ''}</p>
                {(p.city || p.state) && <p className="text-sm text-gray-500 dark:text-gray-500">{[p.city, p.state].filter(Boolean).join(', ')}</p>}
              </div>
            )}

            {(p.emergency_contact_name || p.emergency_contact_phone) && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('emergencyContact')}</h3>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {p.emergency_contact_name && <span className="flex items-center gap-1.5"><PhoneCall className="h-4 w-4" /> {p.emergency_contact_name}</span>}
                  {p.emergency_contact_phone && <span>{p.emergency_contact_phone}</span>}
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {p.medical_history && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('medicalHistory')}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.medical_history}</p>
                </div>
              )}
              {p.allergies && (
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300"><AlertTriangle className="h-4 w-4" /> {t('allergies')}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.allergies}</p>
                </div>
              )}
            </div>
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
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{t('noPatients')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('registerNewPatient')}</p>
        </div>
      )
    }

    return (
      <div className="grid gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <button
              onClick={() => setSelected(p)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                {p.first_name[0]}{p.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{p.full_name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{p.id}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {p.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {p.email}</span>}
                  {p.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {p.phone}</span>}
                  {p.gender && <span className="capitalize">{p.gender}</span>}
                  {p.blood_group && <span>{p.blood_group}</span>}
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                p.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                p.status === 'discharged' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {p.status === 'active' ? t('active') : p.status === 'discharged' ? t('discharged') : t('inactive')}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button
                onClick={() => openEdit(p)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                title={t('edit')}
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400"
                title={t('delete')}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('patients')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{patients.length} {t('registeredPatients')}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text" placeholder={t('search')}
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:outline-blue-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('editPatient')}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: t('patientFirstName'), key: 'first_name', required: true },
                  { label: t('patientLastName'), key: 'last_name', required: true },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}{f.required && <span className="text-rose-500 ml-0.5">*</span>}</label>
                    <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.required}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                  </div>
                ))}
                {[
                  { label: t('patientEmail'), key: 'email', type: 'email' },
                  { label: t('patientPhone'), key: 'phone' },
                  { label: t('dateOfBirth'), key: 'dob', type: 'date' },
                  { label: t('patientGender'), key: 'gender', type: 'select', options: ['', 'male', 'female', 'other'], labels: { 'male': t('male'), 'female': t('female'), 'other': t('other') } },
                  { label: t('patientBloodGroup'), key: 'blood_group', type: 'select', options: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
                  { label: t('userStatus'), key: 'status', type: 'select', options: ['active', 'inactive', 'discharged'], labels: { 'active': t('active'), 'inactive': t('inactive'), 'discharged': t('discharged') } },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                        {f.options.map((o) => <option key={o} value={o}>{o ? ((f as any).labels?.[o] || o) : t('select')}</option>)}
                      </select>
                    ) : (
                      <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('address')}</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[{ label: t('city'), key: 'city' }, { label: t('state'), key: 'state' }, { label: t('pincode'), key: 'pincode' }].map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('emergencyContactName')}</label>
                  <input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('emergencyContactPhone')}</label>
                  <input value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                  </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('medicalHistory')}</label>
                  <textarea value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('allergies')}</label>
                  <textarea value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-500/25 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">{t('cancel')}</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600">
                  {saving ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
