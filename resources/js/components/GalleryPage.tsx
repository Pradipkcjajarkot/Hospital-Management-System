import { useState, useEffect } from 'react'
import { ImageIcon } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('photoGallery')}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">A glimpse into our facilities and events</p>
        </div>
        {items.length === 0 ? (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">{t('noGallery')}</div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item: any) => (
              <button key={item.id} onClick={() => setSelected(item)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.caption || ''}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.querySelector('.fallback')?.classList.remove('hidden') }}
                  />
                ) : null}
                <div className={`fallback ${item.image_url ? 'hidden' : ''} flex h-full w-full flex-col items-center justify-center text-gray-400`}>
                  <ImageIcon className="h-10 w-10" />
                  <span className="mt-2 text-xs">{item.caption || 'Gallery Image'}</span>
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">&times;</button>
            {selected.image_url ? (
              <img src={selected.image_url} alt={selected.caption || ''} className="max-h-[70vh] w-full object-contain" />
            ) : null}
            {selected.caption && <div className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">{selected.caption}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
