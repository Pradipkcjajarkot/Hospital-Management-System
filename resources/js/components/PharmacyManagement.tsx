import { useState, useEffect } from 'react'
import { Search, Pill, Edit3, Trash2, X, ArrowLeft, Plus, DollarSign, Calendar, Activity, Package, AlertTriangle } from "lucide-react"

interface Medicine {
  id: number
  medicine_name: string
  brand: string | null
  generic_name: string | null
  category: string | null
  unit: string
  price_per_unit: string
  quantity_in_stock: number
  reorder_level: number
  status: string
  expiry_date: string | null
  description: string | null
  created_at: string
}

const emptyForm = {
  medicine_name: '', brand: '', generic_name: '', category: '', unit: 'tablet',
  price_per_unit: '0', quantity_in_stock: '0', reorder_level: '10',
  status: 'available', expiry_date: '', description: '',
}

const unitOptions = ['tablet', 'capsule', 'ml', 'mg', 'g', 'mcg', 'ampoule', 'vial', 'bottle', 'tube', 'inhaler', 'patch']
const statuses = ['available', 'out_of_stock', 'discontinued']

function MedicineForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel }: {
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
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the medicine details below.</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Medicine Name <span className="text-rose-500">*</span></label>
            <input value={form.medicine_name} onChange={(e) => setForm({ ...form, medicine_name: e.target.value })} required placeholder="e.g. Paracetamol"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Brand</label>
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Tylenol"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Generic Name</label>
            <input value={form.generic_name} onChange={(e) => setForm({ ...form, generic_name: e.target.value })} placeholder="e.g. Acetaminophen"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Analgesic"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Unit <span className="text-rose-500">*</span></label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Price Per Unit ($) <span className="text-rose-500">*</span></label>
            <input type="number" step="0.01" min="0" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Quantity in Stock <span className="text-rose-500">*</span></label>
            <input type="number" min="0" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Reorder Level <span className="text-rose-500">*</span></label>
            <input type="number" min="0" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} required
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
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Expiry Date</label>
            <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Medicine description..."
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

export default function PharmacyManagement() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Medicine | null>(null)
  const [editing, setEditing] = useState<Medicine | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => { fetchMedicines() }, [])

  async function fetchMedicines() {
    try { const r = await fetch('/api/medicines'); const d = await r.json(); setMedicines(d.medicines ?? []) } catch { /* ignore */ }
  }

  function openEdit(m: Medicine) {
    setForm({
      medicine_name: m.medicine_name, brand: m.brand || '', generic_name: m.generic_name || '',
      category: m.category || '', unit: m.unit, price_per_unit: m.price_per_unit,
      quantity_in_stock: m.quantity_in_stock.toString(), reorder_level: m.reorder_level.toString(),
      status: m.status, expiry_date: m.expiry_date || '', description: m.description || '',
    })
    setEditing(m)
  }

  function openAddForm() { setForm(emptyForm); setShowAddForm(true); setSelected(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, price_per_unit: Number(form.price_per_unit), quantity_in_stock: Number(form.quantity_in_stock), reorder_level: Number(form.reorder_level) }
      const res = await fetch(`/api/medicines/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setEditing(null); await fetchMedicines() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, price_per_unit: Number(form.price_per_unit), quantity_in_stock: Number(form.quantity_in_stock), reorder_level: Number(form.reorder_level) }
      const res = await fetch('/api/medicines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchMedicines() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this medicine?')) return
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchMedicines() }
    } catch { alert('Delete failed') }
  }

  const filtered = medicines.filter((m) => {
    const q = search.toLowerCase()
    return m.medicine_name.toLowerCase().includes(q) || (m.brand || '').toLowerCase().includes(q) || (m.generic_name || '').toLowerCase().includes(q) || (m.category || '').toLowerCase().includes(q)
  })

  const lowStock = medicines.filter((m) => m.quantity_in_stock <= m.reorder_level && m.status === 'available')

  function DetailView(m: Medicine) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> Back to all medicines
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-xl font-bold text-emerald-700 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400">
                  <Pill className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{m.medicine_name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      m.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : m.status === 'out_of_stock' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        m.status === 'available' ? 'bg-emerald-500'
                        : m.status === 'out_of_stock' ? 'bg-red-500'
                        : 'bg-gray-400'
                      }`} />
                      {m.status.replace(/_/g, ' ')}
                    </span>
                    {m.quantity_in_stock <= m.reorder_level && m.status === 'available' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" /> Low Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(m)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 dark:hover:text-amber-400" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Package className="h-3.5 w-3.5" /> Brand
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.brand || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Package className="h-3.5 w-3.5" /> Generic Name
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.generic_name || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Activity className="h-3.5 w-3.5" /> Category
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.category || '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Package className="h-3.5 w-3.5" /> Unit
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.unit}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-3.5 w-3.5" /> Price Per Unit
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${Number(m.price_per_unit).toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Package className="h-3.5 w-3.5" /> Quantity in Stock
                </div>
                <p className={`mt-1 text-sm font-medium ${m.quantity_in_stock <= m.reorder_level ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                  {m.quantity_in_stock} {m.unit}s
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="h-3.5 w-3.5" /> Reorder Level
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.reorder_level}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Expiry Date
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{m.expiry_date ? new Date(m.expiry_date).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {m.description && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
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
            <Pill className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No medicines found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click "Add Medicine" to create one.</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-emerald-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800">
            <button onClick={() => setSelected(m)} className="w-full p-5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-400 dark:group-hover:from-emerald-900/50 dark:group-hover:to-teal-900/50">
                <Pill className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{m.medicine_name}</h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{(m.brand || m.generic_name || '')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{m.quantity_in_stock} {m.unit}s — ${Number(m.price_per_unit).toFixed(2)}/unit</p>
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                m.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : m.status === 'out_of_stock' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  m.status === 'available' ? 'bg-emerald-500'
                  : m.status === 'out_of_stock' ? 'bg-red-500'
                  : 'bg-gray-400'
                }`} />
                {m.status.replace(/_/g, ' ')}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={() => openEdit(m)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="Edit">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
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
      <MedicineForm
        form={form} setForm={setForm} saving={saving}
        onCancel={() => setShowAddForm(false)} onSubmit={handleAdd}
        title="Add New Medicine" submitLabel="Create Medicine"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{medicines.length} medicines</p>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> Add Medicine
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Medicines</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{medicines.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{medicines.filter((m) => m.status === 'available').length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Low Stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{lowStock.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">{medicines.filter((m) => m.status === 'out_of_stock').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder="Search by name, brand, generic name or category..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 dark:focus:outline-amber-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Medicine</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <MedicineForm
              form={form} setForm={setForm} saving={saving}
              onCancel={() => setEditing(null)} onSubmit={handleSave}
              title="Edit Medicine" submitLabel="Update Medicine"
            />
          </div>
        </div>
      )}
    </div>
  )
}
