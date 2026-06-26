import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Plus, X, Image as ImageIcon, Upload } from "lucide-react"

interface GalleryItem {
  id: number
  image_url: string
  caption: string
  album: string
  created_at: string
}

export default function GalleryManagement() {
  const { t } = useLanguage()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ image_url: '', image_path: '', title: '', caption: '', album: '' })
  const [preview, setPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      const r = await fetch('/api/admin/gallery', { credentials: 'include' })
      const d = await r.json()
      setItems(d.galleryItems ?? d.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image_url) { alert('Please upload an image first'); return }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/gallery/${editing.id}` : '/api/admin/gallery'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), credentials: 'include' })
      if (res.ok) { setShowAdd(false); setEditing(null); setForm({ image_url: '', image_path: '', title: '', caption: '', album: '' }); setPreview(''); await fetchItems() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this image?')) return
    try { await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', credentials: 'include' }); await fetchItems() }
    catch { alert('Delete failed') }
  }

  const filtered = items.filter(i => i.caption?.toLowerCase().includes(search.toLowerCase()) || i.album?.toLowerCase().includes(search.toLowerCase()))

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd, credentials: 'include' })
      if (!res.ok) { alert('Upload failed'); return }
      const data = await res.json()
      setForm(f => ({ ...f, image_url: data.url, image_path: data.path }))
      setPreview(data.url)
    } catch { alert('Upload failed') }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  function openEdit(item: GalleryItem) { setEditing(item); setForm({ image_url: item.image_url, image_path: '', title: '', caption: item.caption || '', album: item.album || '' }); setPreview(item.image_url); setShowAdd(true) }

  if (loading) return <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('galleryManagement')}</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{items.length} {t('images')}</p></div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ image_url: '', image_path: '', title: '', caption: '', album: '' }); setPreview('') }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> {t('addImage')}</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">{t('noImages')}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => (
            <div key={item.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.caption || ''} className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" /></div>
                )}
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-white line-clamp-2">{item.caption}</p>
                <div className="mt-1 flex gap-2">
                  <button onClick={() => openEdit(item)} className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/30">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-500/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-red-500/80">Delete</button>
                </div>
              </div>
              {item.album && <div className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">{item.album}</div>}
            </div>
          ))}
        </div>
      )}

      {(showAdd) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => { if (!saving) { setShowAdd(false); setEditing(null) } }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? t('editImage') : t('addImage')}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('uploadImage')} *</label>
                <div className="mt-1 flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-rose-400 hover:text-rose-600 transition-colors dark:border-gray-600 dark:text-gray-400 dark:hover:border-rose-500">
                    <Upload className="h-5 w-5" />
                    {uploading ? 'Uploading...' : 'Choose from Desktop'}
                  </button>
                  {form.image_url && !uploading && (
                    <button type="button" onClick={() => { setForm({ ...form, image_url: '' }); setPreview('') }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
                {uploading && <div className="mt-2 h-32 w-full rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse flex items-center justify-center text-sm text-gray-400">Uploading...</div>}
                {preview && !uploading && <img src={preview} alt="Preview" className="mt-2 h-32 w-full rounded-xl object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                {!form.image_url && !uploading && <p className="mt-1 text-xs text-gray-400">Supports: JPG, PNG, GIF, WebP (max 5MB)</p>}
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('imageTitle')}</label><input type="text" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Album</label><input type="text" value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g. Facilities, Events" /></div>
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
