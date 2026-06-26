import { useState, useEffect } from 'react'
import { BarChart3, Activity, Users, Stethoscope, BedDouble, Pill, Receipt, TrendingUp, DollarSign, Calendar } from "lucide-react"

interface StatCard {
  label: string
  value: string | number
  icon: typeof BarChart3
  color: string
}

export default function ReportsAnalytics() {
  const [stats, setStats] = useState({
    patients: 0, doctors: 0, appointments: 0, departments: 0,
    beds: 0, occupiedBeds: 0, availableBeds: 0,
    medicines: 0, lowStock: 0,
    bills: 0, totalRevenue: 0, totalPaid: 0, pendingBills: 0,
    labTests: 0, pendingTests: 0, completedTests: 0,
  })

  useEffect(() => {
    async function fetchAllStats() {
      try {
        const [patientsRes, doctorsRes, appsRes, deptsRes, bedsRes, medsRes, billsRes, labsRes] = await Promise.all([
          fetch('/api/patients'), fetch('/api/doctors'), fetch('/api/appointments'), fetch('/api/departments'),
          fetch('/api/beds'), fetch('/api/medicines'), fetch('/api/bills'), fetch('/api/lab-tests'),
        ])
        const patients = (await patientsRes.json()).patients ?? []
        const doctors = (await doctorsRes.json()).doctors ?? []
        const appointments = (await appsRes.json()).appointments ?? []
        const departments = (await deptsRes.json()).departments ?? []
        const beds = (await bedsRes.json()).beds ?? []
        const medicines = (await medsRes.json()).medicines ?? []
        const bills = (await billsRes.json()).bills ?? []
        const labTests = (await labsRes.json()).labTests ?? []

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          departments: departments.length,
          beds: beds.length,
          occupiedBeds: beds.filter((b: any) => b.status === 'occupied').length,
          availableBeds: beds.filter((b: any) => b.status === 'available').length,
          medicines: medicines.length,
          lowStock: medicines.filter((m: any) => m.quantity_in_stock <= m.reorder_level && m.status === 'available').length,
          bills: bills.length,
          totalRevenue: bills.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0),
          totalPaid: bills.reduce((sum: number, b: any) => sum + Number(b.paid_amount), 0),
          pendingBills: bills.filter((b: any) => b.payment_status === 'pending').length,
          labTests: labTests.length,
          pendingTests: labTests.filter((t: any) => t.status === 'pending').length,
          completedTests: labTests.filter((t: any) => t.status === 'completed').length,
        })
      } catch { /* ignore */ }
    }
    fetchAllStats()
  }, [])

  const summaryCards: StatCard[] = [
    { label: 'Total Patients', value: stats.patients, icon: Users, color: 'from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400' },
    { label: 'Total Doctors', value: stats.doctors, icon: Stethoscope, color: 'from-teal-100 to-emerald-100 text-teal-600 dark:from-teal-900/30 dark:to-emerald-900/30 dark:text-teal-400' },
    { label: 'Appointments', value: stats.appointments, icon: Activity, color: 'from-violet-100 to-purple-100 text-violet-600 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-400' },
    { label: 'Departments', value: stats.departments, icon: TrendingUp, color: 'from-orange-100 to-amber-100 text-orange-600 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-amber-400' },
    { label: 'Available Beds', value: stats.availableBeds, icon: BedDouble, color: 'from-cyan-100 to-blue-100 text-cyan-600 dark:from-cyan-900/30 dark:to-blue-900/30 dark:text-cyan-400' },
    { label: 'Occupied Beds', value: stats.occupiedBeds, icon: BedDouble, color: 'from-pink-100 to-rose-100 text-pink-600 dark:from-pink-900/30 dark:to-rose-900/30 dark:text-pink-400' },
    { label: 'Medicines', value: stats.medicines, icon: Pill, color: 'from-emerald-100 to-teal-100 text-emerald-600 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-400' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: Pill, color: 'from-amber-100 to-yellow-100 text-amber-600 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400' },
  ]

  const revenueCards: StatCard[] = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'from-emerald-100 to-green-100 text-emerald-600 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400' },
    { label: 'Total Collected', value: `$${stats.totalPaid.toFixed(2)}`, icon: Receipt, color: 'from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400' },
    { label: 'Total Bills', value: stats.bills, icon: Receipt, color: 'from-gray-100 to-slate-100 text-gray-600 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-400' },
    { label: 'Pending Payments', value: stats.pendingBills, icon: Calendar, color: 'from-rose-100 to-red-100 text-rose-600 dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-400' },
  ]

  const labCards: StatCard[] = [
    { label: 'Total Lab Tests', value: stats.labTests, icon: Activity, color: 'from-purple-100 to-pink-100 text-purple-600 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400' },
    { label: 'Pending Tests', value: stats.pendingTests, icon: Activity, color: 'from-amber-100 to-orange-100 text-amber-600 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400' },
    { label: 'Completed Tests', value: stats.completedTests, icon: Activity, color: 'from-emerald-100 to-green-100 text-emerald-600 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of all hospital operations.</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Hospital Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revenueCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Laboratory</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {labCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">System Health</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {stats.departments} departments, {stats.doctors} doctors, {stats.patients} patients registered.
          {stats.beds > 0 ? ` ${stats.availableBeds} of ${stats.beds} beds available.` : ''}
          {stats.lowStock > 0 ? ` ${stats.lowStock} medicines below reorder level.` : ''}
          {stats.pendingTests > 0 ? ` ${stats.pendingTests} lab tests pending.` : ''}
        </p>
      </div>
    </div>
  )
}
