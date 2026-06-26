import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/public/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date())
  const past = events.filter((e) => new Date(e.event_date) < new Date())

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('events')}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Health camps, workshops, and community programs</p>
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">{t('upcomingEvents')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {upcoming.map((e: any) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">Past Events</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {past.map((e: any) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

        {events.length === 0 && (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">{t('noEvents')}</div>
        )}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 text-center dark:bg-rose-900/30">
        <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{new Date(event.event_date).getDate()}</span>
        <span className="text-xs font-medium text-rose-500 uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
          {event.event_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.event_time}</span>}
          {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>}
        </div>
      </div>
    </div>
  )
}
