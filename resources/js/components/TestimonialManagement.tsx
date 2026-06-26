import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Plus, X, Star, Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  created_at: string
}

export default function TestimonialManagement() {
  const { t } = useLanguage()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      const r = await fetch('/api/admin/testimonials')
      const d = await r.json()
      setItems(d.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setShowAdd(false); setEditing(null); setForm({ name: '', role: '', content: '', rating: 5 }); await fetchItems() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this testimonial?')) return
    try { await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' }); await fetchItems() }
    catch { alert('Delete failed') }
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase()))

  function openEdit(item: Testimonial) { setEditing(item); setForm({ name: item.name, role: item.role || '', content: item.content, rating: item.rating }); setShowAdd(true) }

  if (loading) return <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('testimonialManagement')}</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{items.length} {t('testimonials')}</p></div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ name: '', role: '', content: '', rating: 5 }) }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> {t('addTestimonial')}</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">{t('noTestimonials')}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <div key={item.id} className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900">
              <Quote className="absolute right-3 top-3 h-8 w-8 text-rose-50 dark:text-rose-900/20" />
              <div className="flex items-center gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3">"{item.content}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-xs font-bold text-rose-700 dark:from-rose-900/40 dark:to-red-900/40 dark:text-rose-400">
                  {item.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  {item.role && <p className="text-xs text-gray-500 dark:text-gray-400">{item.role}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20">{t('editTestimonial')}</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">{t('delete')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => { if (!saving) { setShowAdd(false); setEditing(null) } }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? t('editTestimonial') : t('addTestimonial')}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('patientName')} *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label><input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g. Patient" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('testimonialContent')} *</label><textarea rows={4} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('rating')}</label><div className="mt-1 flex gap-1">{Array.from({ length: 5 }).map((_, i) => (<button key={i} type="button" onClick={() => setForm({ ...form, rating: i + 1 })}><Star className={`h-6 w-6 ${i < form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} /></button>))}</div></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">{t('cancel')}</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50">{saving ? 'Saving...' : t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
