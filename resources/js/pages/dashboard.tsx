import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PatientManagement from '@/components/PatientManagement'
import DoctorManagement from '@/components/DoctorManagement'
import AppointmentManagement from '@/components/AppointmentManagement'
import DepartmentManagement from '@/components/DepartmentManagement'
import RegisterPatient from '@/components/RegisterPatient'
import BedWardManagement from '@/components/BedWardManagement'
import LaboratoryManagement from '@/components/LaboratoryManagement'
import PharmacyManagement from '@/components/PharmacyManagement'
import BillingManagement from '@/components/BillingManagement'
import ReportsAnalytics from '@/components/ReportsAnalytics'
import UserManagement from '@/components/UserManagement'
import SettingsPage from '@/components/SettingsPage'
import NotificationsPage from '@/components/NotificationsPage'
import BlogManagement from '@/components/BlogManagement'
import GalleryManagement from '@/components/GalleryManagement'
import EventManagement from '@/components/EventManagement'
import TestimonialManagement from '@/components/TestimonialManagement'
import ContactManagement from '@/components/ContactManagement'
import CareerManagement from '@/components/CareerManagement'
import OPDManagement from '@/components/OPDManagement'
import MessagingPanel from '@/components/MessagingPanel'
import OtpManagement from '@/components/OtpManagement'
import {
  LayoutDashboard, UserPlus, Users, Stethoscope, CalendarRange, Building2, BedDouble,
  FlaskConical, Pill, Receipt, BarChart3, Settings, Bell, LogOut,
  Menu, Plus, Search, ChevronRight, Activity, Clock,
  CalendarPlus, DoorOpen, FileText, Beaker, ChevronDown, Moon, Sun,
  Image, Star, MessageSquare, Calendar, Briefcase, Shield
} from "lucide-react"

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'registerPatient', label: 'Register Patient', icon: UserPlus },
  { key: 'patients', label: 'Patients', icon: Users },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'appointments', label: 'Appointments', icon: CalendarRange },
  { key: 'departments', label: 'Departments', icon: Building2 },
  { key: 'opd', label: 'OPD', icon: Activity },
  { key: 'bedsWards', label: 'Beds & Wards', icon: BedDouble },
  { key: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { key: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'gallery', label: 'Gallery', icon: Image },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'careers', label: 'Careers', icon: Briefcase },
  { key: 'contacts', label: 'Contacts', icon: MessageSquare },
  { key: 'billingFinance', label: 'Billing & Finance', icon: Receipt },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'otpLogs', label: 'OTP Logs', icon: Shield },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'logout', label: 'Logout', icon: LogOut },
]

const summaryCards = [
  { label: 'Total Patients', value: '1,284', change: '+12%', trend: 'up', icon: Users, color: 'from-blue-500 to-blue-600' },
  { label: 'Total Doctors', value: '48', change: '+2 this month', trend: 'up', icon: Stethoscope, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Appointments', value: '3,672', change: '+18%', trend: 'up', icon: CalendarRange, color: 'from-violet-500 to-violet-600' },
  { label: 'Admissions', value: '856', change: '+8%', trend: 'up', icon: DoorOpen, color: 'from-amber-500 to-amber-600' },
  { label: 'Total Staff', value: '215', change: '+5 new', trend: 'up', icon: Users, color: 'from-indigo-500 to-indigo-600' },
  { label: 'Available Beds', value: '142', change: '24 occupied', trend: 'down', icon: BedDouble, color: 'from-teal-500 to-teal-600' },
  { label: "Today's Revenue", value: '$12,480', change: '+$1,200', trend: 'up', icon: Receipt, color: 'from-rose-500 to-rose-600' },
]

const sectionContent: Record<string, { title: string; items: string[] }> = {
  Patients: { title: 'Patient Management', items: ['New Patient Registration', 'Patient List', 'Patient History', 'Discharge Patients'] },
  Doctors: { title: 'Doctor Management', items: ['Doctor List', 'Department-wise Doctors', 'Doctor Schedule', 'Doctor Availability'] },
  Appointments: { title: 'Appointment Management', items: ["Today's Appointments", 'Upcoming Appointments', 'Pending Appointments', 'Cancelled Appointments'] },
  'Beds & Wards': { title: 'Bed & Ward Management', items: ['Total Beds', 'Occupied Beds', 'Available Beds', 'Ward Information'] },
  'Billing & Finance': { title: 'Billing & Finance', items: ['Patient Bills', 'Payments Received', 'Pending Payments', 'Revenue Report'] },
  Pharmacy: { title: 'Pharmacy', items: ['Medicine Inventory', 'Low Stock Medicines', 'Medicine Sales'] },
  Laboratory: { title: 'Laboratory', items: ['Lab Test Requests', 'Test Results', 'Pending Reports'] },
  Blog: { title: 'Blog Management', items: ['All Posts', 'Published Posts', 'Draft Posts', 'Categories'] },
  Gallery: { title: 'Gallery Management', items: ['All Images', 'Add New Image', 'Albums'] },
  Events: { title: 'Event Management', items: ['Upcoming Events', 'Past Events', 'All Events', 'Add New Event'] },
  Testimonials: { title: 'Testimonial Management', items: ['All Testimonials', 'Add New Testimonial'] },
  Careers: { title: 'Career Management', items: ['Job Listings', 'Applications'] },
  OPD: { title: 'OPD Management', items: ['New Registration', 'Waiting Patients', 'In Consultation', 'Completed'] },
  Contacts: { title: 'Contact Management', items: ['All Messages', 'Unread Messages', 'Feedback'] },
  Reports: { title: 'Reports & Analytics', items: ['Daily Report', 'Monthly Report', 'Patient Statistics', 'Revenue Chart'] },
  Notifications: { title: 'Notifications', items: ['New Appointments', 'Emergency Alerts', 'Low Medicine Stock Alerts', 'Important Announcements'] },
  Messages: { title: 'Messages', items: ['Inbox', 'Patient Conversations', 'Sent Messages'] },
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  profile_photo_path: string | null
}

declare global {
  interface Window {
    APP_USER: User
  }
}

const user = window.APP_USER

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const appointments = [
  { time: '10:00 AM', patient: 'John Doe', doctor: 'Dr. Sarah Wilson', dept: 'Cardiology', status: 'checked-in' as const },
  { time: '11:30 AM', patient: 'Jane Smith', doctor: 'Dr. Michael Chen', dept: 'Orthopedics', status: 'waiting' as const },
  { time: '02:00 PM', patient: 'Bob Wilson', doctor: 'Dr. Emily Brown', dept: 'Neurology', status: 'scheduled' as const },
  { time: '03:30 PM', patient: 'Alice Johnson', doctor: 'Dr. David Lee', dept: 'Pediatrics', status: 'scheduled' as const },
]

const activities = [
  { text: 'New patient Sarah Johnson admitted to Ward 3A', time: '10 min ago', type: 'admission' as const },
  { text: 'Dr. Williams completed surgery #2045', time: '25 min ago', type: 'surgery' as const },
  { text: 'Lab results for Patient #1283 ready', time: '45 min ago', type: 'lab' as const },
  { text: 'Pharmacy restocked 5 medicines', time: '1 hour ago', type: 'pharmacy' as const },
]

const statusStyles: Record<string, string> = {
  'checked-in': 'bg-emerald-100 text-emerald-700',
  waiting: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
}

const activityIcons: Record<string, typeof Activity> = {
  admission: UserPlus,
  surgery: Stethoscope,
  lab: Beaker,
  pharmacy: Pill,
}

export default function Dashboard() {
  const { t } = useLanguage()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(user.profile_photo_path ? `/storage/${user.profile_photo_path}` : null)
  const [uploading, setUploading] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [unreadCount, setUnreadCount] = useState(0)
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => { fetchUnreadCount(); fetchLogo(); const interval = setInterval(fetchUnreadCount, 30000); return () => clearInterval(interval) }, [])

  async function fetchUnreadCount() {
    try { const r = await fetch('/api/notifications/unread-count'); const d = await r.json(); setUnreadCount(d.count ?? 0) } catch { /* ignore */ }
  }

  async function fetchLogo() {
    try { const r = await fetch('/api/settings'); const d = await r.json(); const s = d.settings ?? {}; if (s.hospital_logo) setLogoUrl(s.hospital_logo) } catch { /* ignore */ }
  }
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)
    try {
      const res = await fetch('/api/upload-profile-photo', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) setPhotoUrl(data.url)
      else alert(data.message || 'Upload failed')
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleLogout() {
    window.location.href = '/'
  }

  function renderContent() {
    if (active === 'dashboard') {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}. Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                    <p className={`mt-1 text-xs font-medium ${card.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {card.change}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Appointments</h3>
                <button className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors dark:text-rose-400 dark:hover:text-rose-300">View All</button>
              </div>
              <div className="space-y-3">
                {appointments.map((apt, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 hover:bg-gray-100 transition-colors dark:bg-gray-800/50 dark:hover:bg-gray-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.patient}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{apt.doctor} • {apt.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{apt.time}</p>
                      <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[apt.status]}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                <button className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors dark:text-rose-400 dark:hover:text-rose-300">View All</button>
              </div>
              <div className="space-y-3">
                {activities.map((act, i) => {
                  const Icon = activityIcons[act.type] || Activity
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl p-3 hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 shrink-0 mt-0.5 dark:bg-rose-900/30 dark:text-rose-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{act.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5 dark:text-gray-500">{act.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Register Patient', target: 'registerPatient', icon: UserPlus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50' },
                { label: 'Book Appointment', target: 'appointments', icon: CalendarPlus, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50' },
                { label: 'Admit Patient', target: 'bedsWards', icon: DoorOpen, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50' },
                { label: 'Create Bill', target: 'billingFinance', icon: FileText, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' },
                { label: 'Lab Request', target: 'laboratory', icon: Beaker, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50' },
                { label: 'New Event', target: 'events', icon: Calendar, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button key={action.label} onClick={() => setActive(action.target)} className={`flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${action.color}`}>
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    if (active === 'registerPatient') {
      return <RegisterPatient />
    }

    if (active === 'patients') {
      return <PatientManagement />
    }

    if (active === 'doctors') {
      return <DoctorManagement />
    }

    if (active === 'appointments') {
      return <AppointmentManagement />
    }

    if (active === 'departments') {
      return <DepartmentManagement />
    }

    if (active === 'opd') {
      return <OPDManagement />
    }

    if (active === 'bedsWards') {
      return <BedWardManagement />
    }

    if (active === 'laboratory') {
      return <LaboratoryManagement />
    }

    if (active === 'pharmacy') {
      return <PharmacyManagement />
    }

    if (active === 'blog') {
      return <BlogManagement />
    }

    if (active === 'gallery') {
      return <GalleryManagement />
    }

    if (active === 'events') {
      return <EventManagement />
    }

    if (active === 'testimonials') {
      return <TestimonialManagement />
    }

    if (active === 'contacts') {
      return <ContactManagement />
    }

    if (active === 'careers') {
      return <CareerManagement />
    }

    if (active === 'billingFinance') {
      return <BillingManagement />
    }

    if (active === 'reports') {
      return <ReportsAnalytics />
    }

    if (active === 'users') {
      return <UserManagement />
    }

    if (active === 'settings') {
      return <SettingsPage />
    }

    if (active === 'notifications') {
      return <NotificationsPage />
    }

    if (active === 'otpLogs') {
      return <OtpManagement />
    }

    if (active === 'messages') {
      return <MessagingPanel />
    }

    if (active === 'logout') {
      handleLogout()
      return null
    }

    const section = sectionContent[active]
    if (!section) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 text-rose-600 mb-4 dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-400">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{active}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This section is under development.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and organize all related records.</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all dark:bg-rose-500 dark:hover:bg-rose-600">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <button key={item} className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm hover:shadow-lg hover:border-rose-100 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-900/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-red-50 text-rose-600 group-hover:from-rose-100 group-hover:to-red-100 transition-colors dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-400 dark:group-hover:from-rose-900/50 dark:group-hover:to-red-900/50">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-900 dark:text-white">{item}</span>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click to manage</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-rose-500 transition-colors dark:text-gray-600 dark:group-hover:text-rose-400" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:transition-all md:duration-300 md:ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarOpen ? 'md:w-64' : 'md:w-16'} bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0f2847] border-r border-blue-900/40 shadow-2xl`}>
        <div className={`flex h-16 items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} border-b border-blue-900/30`}>
          <button onClick={() => { const isMobile = window.innerWidth < 768; isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setSidebarOpen(!sidebarOpen) }} className="shrink-0 rounded-lg p-1.5 text-blue-300/60 hover:bg-blue-800/40 hover:text-blue-200 transition-colors" title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <Menu className="h-5 w-5" />
          </button>
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 animate-fade-in">
              {logoUrl ? (
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shadow-sm">
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                </div>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white tracking-tight">MediCare</span>
                    <p className="text-[10px] text-blue-400/70 -mt-0.5">Hospital Management</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {sidebarOpen && (
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400/60">Main</p>
          )}
            {menuItems.slice(0, 6).map((item) => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white shadow-sm border border-blue-500/25 shadow-blue-500/5'
                    : 'text-blue-200/60 hover:bg-blue-800/30 hover:text-blue-100 hover:border-blue-700/30 border border-transparent'
                } ${!sidebarOpen && 'justify-center px-0'}`}
                title={!sidebarOpen ? t(item.key) : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                {sidebarOpen && <span>{t(item.key)}</span>}
                {isActive && sidebarOpen && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />}
              </button>
            )
          })}

          {sidebarOpen && (
            <div className="mt-5 mb-1 flex items-center gap-2 px-3">
              <div className="h-px flex-1 bg-blue-900/30" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400/60">Management</p>
              <div className="h-px flex-1 bg-blue-900/30" />
            </div>
          )}
          {menuItems.slice(6, 17).map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white shadow-sm border border-blue-500/25 shadow-blue-500/5'
                    : 'text-blue-200/60 hover:bg-blue-800/30 hover:text-blue-100 hover:border-blue-700/30 border border-transparent'
                } ${!sidebarOpen && 'justify-center px-0'}`}
                title={!sidebarOpen ? t(item.key) : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                {sidebarOpen && <span>{t(item.key)}</span>}
                {isActive && sidebarOpen && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />}
              </button>
            )
          })}

          {sidebarOpen && (
            <div className="mt-5 mb-1 flex items-center gap-2 px-3">
              <div className="h-px flex-1 bg-blue-900/30" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400/60">System</p>
              <div className="h-px flex-1 bg-blue-900/30" />
            </div>
          )}
          {menuItems.slice(17).map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            const isLogout = item.key === 'logout'
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (isLogout) { handleLogout(); return }
                  setActive(item.key)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white shadow-sm border border-blue-500/25 shadow-blue-500/5'
                    : isLogout
                      ? 'text-red-400/60 hover:bg-red-950/30 hover:text-red-400 hover:border-red-800/30 border border-transparent'
                      : 'text-blue-200/60 hover:bg-blue-800/30 hover:text-blue-100 hover:border-blue-700/30 border border-transparent'
                } ${!sidebarOpen && 'justify-center px-0'}`}
                title={!sidebarOpen ? t(item.key) : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{t(item.key)}</span>}
                {isActive && sidebarOpen && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />}
              </button>
            )
          })}
        </div>

        {sidebarOpen && (
          <div className="border-t border-blue-900/30 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-blue-900/20 p-2.5 border border-blue-800/20">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-semibold text-white ring-2 ring-blue-800/50 shadow-lg">
                {photoUrl ? (
                  <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-100 truncate">{user.name}</p>
                <p className="text-[10px] text-blue-300/50 truncate">{user.email}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            </div>
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-3 sm:px-6 dark:border-blue-900/30 dark:bg-[#0b1a30]/95">
            <button onClick={() => setMobileMenuOpen(true)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors md:hidden dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-36 sm:w-48 md:w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-rose-300 focus:bg-white focus:ring-1 focus:ring-rose-200 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-rose-500 dark:focus:bg-gray-800 dark:focus:ring-rose-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setActive('Notifications')} className="relative rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-sm font-semibold text-rose-700 ring-2 ring-white shadow-sm dark:ring-gray-700">
                  {photoUrl ? (
                    <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400 dark:text-gray-500" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setProfileOpen(false); fileInputRef.current?.click() }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:bg-gray-700/50">
                        Upload Photo
                      </button>
                      <button onClick={() => { setProfileOpen(false); setActive('Settings') }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:bg-gray-700/50">
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-50 pt-1 dark:border-gray-700">
                      <button onClick={() => { setProfileOpen(false); handleLogout() }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors dark:text-rose-400 dark:hover:bg-rose-900/20">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 dark:text-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
