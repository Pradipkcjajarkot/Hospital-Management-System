import { useState, useEffect } from 'react'
import { Search, Building2, Edit3, Trash2, X, ArrowLeft, Plus, Phone, Mail, MapPin, User } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Department {
  id: number
  name: string
  description: string | null
  head_of_department: string | null
  location: string | null
  phone: string | null
  email: string | null
  status: string
  created_at: string
}

const emptyForm = {
  name: '', description: '', head_of_department: '', location: '', phone: '', email: '', status: 'active',
}

function DepartmentForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
}) {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the department details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('departmentName')} <span className="text-rose-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Cardiology"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('departmentDescription')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Department description..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('departmentHead')}</label>
            <input value={form.head_of_department} onChange={(e) => setForm({ ...form, head_of_department: e.target.value })} placeholder="e.g. Dr. John Smith"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('location')}</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. 3rd Floor, East Wing"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +1 234 567 890"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('email')}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. cardiology@hospital.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{t('userStatus')}</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="active">{t('userActive')}</option>
              <option value="inactive">{t('userInactive')}</option>
            </select>
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

export default function DepartmentManagement() {
  const { t } = useLanguage()
  const [departments, setDepartments] = useState<Department[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Department | null>(null)
  const [editing, setEditing] = useState<Department | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchDepartments() }, [])

  async function fetchDepartments() {
    try { const r = await fetch('/api/departments'); const d = await r.json(); setDepartments(d.departments) } catch { /* ignore */ }
  }

  function openEdit(d: Department) {
    setForm({
      name: d.name, description: d.description || '', head_of_department: d.head_of_department || '',
      location: d.location || '', phone: d.phone || '', email: d.email || '', status: d.status,
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
    try {
      const res = await fetch(`/api/departments/${editing!.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { setEditing(null); await fetchDepartments() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/departments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchDepartments() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this department?')) return
    try {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchDepartments() }
    } catch { alert('Delete failed') }
  }

  const filtered = departments.filter((d) => {
    const q = search.toLowerCase()
    return d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q) || (d.head_of_department || '').toLowerCase().includes(q) || (d.location || '').toLowerCase().includes(q)
  })

  function DetailView(d: Department) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> Back to all departments
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-xl font-bold text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-400">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{d.name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      d.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${d.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(d)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 dark:hover:text-amber-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(d.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {d.head_of_department && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <User className="h-3.5 w-3.5" /> {t('departmentHead')}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.head_of_department}</p>
                </div>
              )}
              {d.location && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3.5 w-3.5" /> {t('location')}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.location}</p>
                </div>
              )}
              {d.phone && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Phone className="h-3.5 w-3.5" /> {t('phone')}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.phone}</p>
                </div>
              )}
              {d.email && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Mail className="h-3.5 w-3.5" /> {t('email')}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{d.email}</p>
                </div>
              )}
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Building2 className="h-3.5 w-3.5" /> {t('userCreated')}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(d.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {d.description && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('departmentDescription')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{d.description}</p>
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
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{t('noDepartments')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('clickAddToCreate')}</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-amber-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-800">
            <button onClick={() => setSelected(d)} className="w-full p-5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400 dark:group-hover:from-amber-900/50 dark:group-hover:to-orange-900/50">
                <Building2 className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{d.name}</h4>
              {d.head_of_department && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('headColon')} {d.head_of_department}</p>}
              {d.location && <p className="text-xs text-gray-400 dark:text-gray-500">{d.location}</p>}
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                d.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${d.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                {d.status}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="Edit">
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
      <DepartmentForm
        form={form} setForm={setForm} saving={saving}
        onCancel={() => setShowAddForm(false)} onSubmit={handleAdd}
        title={t('addDepartment')} submitLabel={t('save')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{departments.length} departments</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> {t('addDepartment')}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder={t('search')}
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 dark:focus:outline-amber-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('editDepartment')}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <DepartmentForm
              form={form} setForm={setForm} saving={saving}
              onCancel={() => setEditing(null)} onSubmit={handleSave}
              title={t('editDepartment')} submitLabel={t('save')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
