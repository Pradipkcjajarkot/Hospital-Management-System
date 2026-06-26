import { useState, useEffect } from 'react'
import { Building2, Stethoscope, Users } from "lucide-react"

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/departments')
      .then(r => r.json())
      .then(setDepartments)
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Our Departments</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Comprehensive medical care across all specialties</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d: any) => (
            <div key={d.id} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-red-50 text-rose-600 group-hover:from-rose-100 group-hover:to-red-100 dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-400">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{d.name}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{d.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" /> Specialists available</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
