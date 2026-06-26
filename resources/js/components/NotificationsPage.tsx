import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, Info, Calendar, Clock, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Notification {
  id: string
  type: string
  data: { title: string; body: string }
  read_at: string | null
  created_at: string
}

export default function NotificationsPage() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)

  useEffect(() => { fetchNotifications() }, [unreadOnly])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const url = unreadOnly ? '/api/notifications?unread_only=true' : '/api/notifications'
      const r = await fetch(url); const d = await r.json(); setNotifications(d.notifications?.data ?? d.notifications ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    } catch { /* ignore */ }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
    } catch { /* ignore */ }
  }

  async function deleteNotification(id: string) {
    if (!confirm('Delete this notification?')) return
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch { /* ignore */ }
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length

  function getIcon(type: string) {
    if (type.includes('Appointment')) return Calendar
    if (type.includes('Alert') || type.includes('LowStock') || type.includes('Emergency')) return AlertTriangle
    if (type.includes('Bill') || type.includes('Payment')) return CheckCircle2
    return Info
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notifications.length} notifications{unreadCount > 0 ? ` (${unreadCount} unread)` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" checked={unreadOnly} onChange={() => setUnreadOnly(!unreadOnly)}
              className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 dark:border-gray-600" />
            Unread only
          </label>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50">
              <CheckCheck className="h-3.5 w-3.5" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Bell className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{unreadOnly ? 'No unread notifications' : 'You\'re all caught up!'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = getIcon(n.type)
            const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data
            return (
              <div key={n.id} className={`group relative rounded-2xl border p-5 transition-all hover:shadow-md ${
                n.read_at
                  ? 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
                  : 'border-amber-100 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    n.read_at ? 'bg-gray-50 text-gray-400 dark:bg-gray-800' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-sm font-medium ${n.read_at ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {data.title}
                        </h4>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{data.body}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4 shrink-0">
                        {!n.read_at && (
                          <button onClick={() => markAsRead(n.id)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="Mark as read">
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(n.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(n.created_at)}</span>
                      {!n.read_at && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
