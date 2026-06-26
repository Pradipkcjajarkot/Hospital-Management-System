import { useState, useEffect } from 'react'
import { Calendar, User, ArrowRight, ChevronLeft } from "lucide-react"

export default function BlogList({ setPage, pageParams }: { setPage: (p: string, params?: any) => void, pageParams?: any }) {
  const [posts, setPosts] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const slug = pageParams?.slug

  useEffect(() => {
    if (slug) {
      fetch(`/api/public/blog/${slug}`)
        .then(r => r.json())
        .then(setSelected)
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      fetch('/api/public/blog')
        .then(r => r.json())
        .then(setPosts)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
      </div>
    )
  }

  if (selected) {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <button onClick={() => { setPage('blog'); setSelected(null) }} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 dark:text-gray-400">
            <ChevronLeft className="h-4 w-4" /> Back to Blog
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selected.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {selected.author && <span className="flex items-center gap-1"><User className="h-4 w-4" /> {selected.author}</span>}
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(selected.created_at).toLocaleDateString()}</span>
            {selected.category && <span className="rounded-full bg-rose-50 px-3 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">{selected.category}</span>}
          </div>
          <div className="mt-8 text-gray-700 leading-relaxed dark:text-gray-300 whitespace-pre-wrap break-words">{selected.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Our Blog</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Health tips, medical insights, and hospital updates</p>
        </div>
        {posts.length === 0 ? (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">No posts published yet.</div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <div key={post.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {post.category && (
                  <span className="inline-block rounded-full bg-rose-50 px-3 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">{post.category}</span>
                )}
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt || post.content}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  <button onClick={() => setSelected(post)} className="flex items-center gap-1 font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400">
                    Read More <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
