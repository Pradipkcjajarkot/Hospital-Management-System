import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Plus, X, FileText, Calendar, User } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  status: string
  slug: string
  created_at: string
}

export default function BlogManagement() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: '', author: '', status: 'draft' })

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    try {
      const r = await fetch('/api/admin/blog-posts')
      const d = await r.json()
      setPosts(d.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const url = editing ? `/api/admin/blog-posts/${editing.id}` : '/api/admin/blog-posts'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setShowAdd(false); setEditing(null); setForm({ title: '', content: '', excerpt: '', category: '', author: '', status: 'draft' }); await fetchPosts() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post?')) return
    try { await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE' }); await fetchPosts() }
    catch { alert('Delete failed') }
  }

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()))

  function openEdit(post: Post) { setEditing(post); setForm({ title: post.title, content: post.content, excerpt: post.excerpt || '', category: post.category || '', author: post.author || '', status: post.status || 'draft' }); setShowAdd(true) }

  if (loading) return <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('blogManagement')}</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{posts.length} {t('posts')}</p></div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ title: '', content: '', excerpt: '', category: '', author: '', status: 'draft' }) }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> {t('addPost')}</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">{t('noPosts')}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(post => (
            <div key={post.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{post.status === 'published' ? t('published') : t('draft')}</span>
                    {post.category && <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{post.category}</span>}
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white line-clamp-1">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt || post.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    {post.author && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(post)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20">{t('editPost')}</button>
                <button onClick={() => handleDelete(post.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">{t('delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => { if (!saving) { setShowAdd(false); setEditing(null) } }}>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? t('editPost') : t('addPost')}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('postTitle')} *</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('postCategory')}</label><input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label><input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('postContent')} *</label><textarea rows={6} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('postStatus')}</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"><option value="draft">{t('draft')}</option><option value="published">{t('published')}</option></select></div>
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
