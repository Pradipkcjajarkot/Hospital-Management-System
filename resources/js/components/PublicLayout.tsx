import { useState, useEffect } from 'react'
import { Menu, X, HeartPulse, Phone, Mail, MapPin, LogIn, CalendarCheck } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

interface PublicLayoutProps {
  page: string
  setPage: (p: string) => void
  onLogin: () => void
  children: React.ReactNode
}

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'Doctors', page: 'doctors' },
  { label: 'Departments', page: 'departments' },
  { label: 'Blog', page: 'blog' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'Events', page: 'events' },
  { label: 'Careers', page: 'careers' },
  { label: 'Contact', page: 'contact' },
]

export default function PublicLayout({ page, setPage, onLogin, children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logo, setLogo] = useState('')
  const { t } = useLanguage()

  const navLabel: Record<string, string> = {
    home: t('dashboard'),
    doctors: t('doctors'),
    departments: t('departments'),
    blog: t('blog'),
    gallery: t('gallery'),
    events: t('events'),
    careers: t('careers'),
    contact: t('contactUs'),
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/public/home').then(r => r.json()).then(d => {
      if (d.settings?.hospital_logo) setLogo(d.settings.hospital_logo)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-md dark:bg-gray-950/95' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button onClick={() => { setPage('home'); setMobileOpen(false) }} className="flex items-center gap-2.5">
            {logo ? (
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/30 shadow-sm ring-1 ring-rose-200/50">
                <img src={logo} alt="Hospital Logo" className="h-full w-full object-cover" />
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{t('hospitalName')}</span>
              </>
            )}
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button key={item.page} onClick={() => setPage(item.page)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  page === item.page ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}>
                {navLabel[item.page]}
              </button>
            ))}
            <button onClick={() => setPage('booking')} className="ml-3 flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all dark:bg-rose-500 dark:hover:bg-rose-600">
              <CalendarCheck className="h-4 w-4" /> {t('bookAppointment')}
            </button>
            <button onClick={onLogin} className="ml-2 flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <LogIn className="h-4 w-4" /> {t('login')}
            </button>
          </nav>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
            <nav className="mt-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <button key={item.page} onClick={() => { setPage(item.page); setMobileOpen(false) }}
                  className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium ${
                    page === item.page ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}>
                  {navLabel[item.page]}
                </button>
              ))}
              <button onClick={() => { setPage('booking'); setMobileOpen(false) }} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white">
                <CalendarCheck className="h-4 w-4" /> {t('bookAppointment')}
              </button>
              <button onClick={() => { setPage('portal_login'); setMobileOpen(false) }} className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                Patient Portal
              </button>
              <button onClick={() => { onLogin(); setMobileOpen(false) }} className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300">
                <LogIn className="h-4 w-4" /> {t('login')}
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                {logo ? (
                  <img src={logo} alt="Hospital Logo" className="h-10 w-auto max-w-[160px] object-contain" />
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600">
                      <HeartPulse className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{t('hospitalName')}</span>
                  </>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t('hospitalName')} offers quality healthcare services with compassion and excellence.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{t('quickLinks')}</h4>
              <ul className="mt-3 space-y-2">
                {['Home', 'Doctors', 'Departments', 'Gallery', 'Blog', 'Events', 'Contact', 'Careers'].map((link) => (
                  <li key={link}>
                    <button onClick={() => setPage(link.toLowerCase())} className="text-sm text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400">{link}</button>
                  </li>
                ))}
                <li><button onClick={() => setPage('portal_login')} className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium">Patient Portal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Services</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>Emergency Care</li>
                <li>Outpatient Services</li>
                <li>Inpatient Care</li>
                <li>Laboratory & Diagnostics</li>
                <li>Pharmacy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{t('contactUs')}</h4>
              <ul className="mt-3 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" /> 123 Medical Center Blvd</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-rose-500" /> +1 234 567 890</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-rose-500" /> info@medicare.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {t('hospitalName')}. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  )
}
