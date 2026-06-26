import { useState, useEffect } from 'react'
import { Search, X, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ContactManagement() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      const r = await fetch('/api/contacts')
      const d = await r.json()
      setItems(d.data ?? d.contacts ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function markRead(id: number) {
    try { await fetch(`/api/contacts/${id}/read`, { method: 'POST' }); setItems(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c)) }
    catch { /* ignore */ }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch { alert('Delete failed') }
  }

  const filtered = items.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  const unread = filtered.filter(c => !c.is_read)
  const read = filtered.filter(c => c.is_read)

  if (loading) return <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" /></div>

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 dark:text-gray-400">&larr; Back to Messages</button>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.subject}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">From {selected.name} &lt;{selected.email}&gt;</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(selected.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20">Delete</button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {selected.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {selected.phone}</span>}
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {selected.email}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {new Date(selected.created_at).toLocaleString()}</span>
          </div>
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap dark:bg-gray-800 dark:text-gray-300">{selected.message}</div>
          <div className="mt-4">
            <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-all">Reply via Email</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{items.length} total ({unread.length} unread)</p></div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">No messages found.</div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-rose-600 dark:text-rose-400">Unread</h3>
              <div className="space-y-3">
                {unread.map(item => <ContactCard key={item.id} item={item} onSelect={() => { setSelected(item); if (!item.is_read) markRead(item.id) }} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
          {read.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Read</h3>
              <div className="space-y-3">
                {read.map(item => <ContactCard key={item.id} item={item} onSelect={() => setSelected(item)} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ContactCard({ item, onSelect, onDelete }: { item: Contact; onSelect: () => void; onDelete: (id: number) => void }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer transition-all dark:border-gray-800 dark:bg-gray-900" onClick={onSelect}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.is_read ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
        {item.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-gray-900 dark:text-white ${!item.is_read ? 'font-bold' : ''}`}>{item.name}</span>
          {!item.is_read && <span className="h-2 w-2 rounded-full bg-rose-500" />}
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.subject}</p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.message}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>
          <span>{new Date(item.created_at).toLocaleString()}</span>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDelete(item.id) }} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400">&times;</button>
    </div>
  )
}
