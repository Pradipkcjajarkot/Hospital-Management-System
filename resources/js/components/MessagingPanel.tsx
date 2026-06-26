import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Search, Plus, X, Send, ChevronRight, User, Loader2 } from "lucide-react"

interface Conversation { id: number; patient_id: number; doctor_id: number | null; subject: string; last_message_at: string; created_at: string; patient: { full_name: string; email: string } | null; doctor: { full_name: string } | null; unread_count: number; messages?: Message[]; }
interface Message { id: number; conversation_id: number; sender_type: string; sender_id: number; message: string; is_read: boolean; created_at: string; }
interface Patient { id: number; full_name: string; email: string; phone: string; }

export default function MessagingPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  async function fetchConversations() { const r = await fetch('/api/messages/conversations'); const d = await r.json(); setConversations(d.conversations || []); }
  async function fetchPatients() { const r = await fetch('/api/patients'); const d = await r.json(); setPatients(d.patients || []); }

  useEffect(() => { fetchConversations(); fetchPatients() }, [])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [selected?.messages])

  async function openConversation(c: Conversation) {
    const res = await fetch(`/api/messages/conversations/${c.id}`)
    const d = await res.json()
    setSelected(d.conversation)
    fetchConversations()
  }

  async function handleReply() {
    if (!replyText.trim() || !selected) return
    setSending(true)
    try {
      const res = await fetch(`/api/messages/conversations/${selected.id}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: replyText }) })
      if (res.ok) { const d = await res.json(); setSelected(d.conversation); setReplyText(''); fetchConversations() }
    } catch { }
    finally { setSending(false) }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4 sm:flex-row">
      <div className={`w-full shrink-0 space-y-3 overflow-y-auto sm:w-80 ${selected && !showNew ? 'hidden sm:block' : ''}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
          <button onClick={() => { setShowNew(true); setSelected(null) }} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /></button>
        </div>
        {conversations.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No conversations yet.</p>
        ) : conversations.map((c) => (
          <button key={c.id} onClick={() => openConversation(c)} className={`w-full rounded-2xl border p-4 text-left transition-all ${selected?.id === c.id ? 'border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-900/20' : 'border-gray-200 bg-white hover:border-rose-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-700'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{c.subject}</p>
                <p className="truncate text-xs text-gray-500">{c.patient?.full_name || 'Unknown'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ''}</p>
              </div>
              {c.unread_count > 0 && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{c.unread_count}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className={`flex-1 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col ${!selected && !showNew ? 'hidden sm:flex' : ''}`}>
        {selected ? (
          <>
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden"><ChevronRight className="h-5 w-5 rotate-180" /></button>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selected.subject}</h3>
                    <p className="text-xs text-gray-500">{selected.patient?.full_name} &middot; {selected.patient?.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="hidden sm:block text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selected.messages?.map((m) => (
                <div key={m.id} className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.sender_type === 'admin' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'}`}>
                    <p>{m.message}</p>
                    <p className={`mt-1 text-[10px] ${m.sender_type === 'admin' ? 'text-rose-200' : 'text-gray-400'}`}>{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex gap-2">
                <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()} placeholder="Type your reply..." className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <button onClick={handleReply} disabled={sending || !replyText.trim()} className="rounded-xl bg-rose-600 px-4 py-2.5 text-white hover:bg-rose-700 disabled:opacity-50 transition-all"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        ) : showNew ? (
          <NewConversationForm patients={patients} onDone={() => { setShowNew(false); fetchConversations() }} onCancel={() => setShowNew(false)} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 dark:text-gray-500"><MessageSquare className="mb-2 h-12 w-12" /><p className="text-sm">Select a conversation or start a new one</p></div>
        )}
      </div>
    </div>
  )
}

function NewConversationForm({ patients, onDone, onCancel }: { patients: Patient[]; onDone: () => void; onCancel: () => void }) {
  const [patientId, setPatientId] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/messages/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_id: patientId, subject, message }) })
      if (res.ok) onDone()
      else alert('Failed')
    } catch { alert('Failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">New Conversation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Patient *</label>
          <select required value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="">Select patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>)}
          </select>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject *</label><input required value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label><textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="flex items-center gap-3">
          <button disabled={saving} className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Cancel</button>
        </div>
      </form>
    </div>
  )
}