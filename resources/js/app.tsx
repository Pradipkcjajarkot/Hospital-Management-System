import './bootstrap';
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signup';
import Dashboard from '@/pages/dashboard';
import PublicLayout from '@/components/PublicLayout';
import HomePage from '@/components/HomePage';
import DoctorDirectory from '@/components/DoctorDirectory';
import DepartmentPage from '@/components/DepartmentPage';
import BlogList from '@/components/BlogList';
import GalleryPage from '@/components/GalleryPage';
import EventsPage from '@/components/EventsPage';
import ContactPage from '@/components/ContactPage';
import BookingWizard from '@/components/BookingWizard';
import PortalLogin from '@/components/PortalLogin';
import PatientPortal from '@/components/PatientPortal';

import CareersPage from '@/components/CareersPage';

type Page = 'home' | 'doctors' | 'departments' | 'blog' | 'gallery' | 'events' | 'contact' | 'booking' | 'careers' | 'portal_login' | 'portal' | 'landing' | 'login' | 'signup';

declare global {
  interface Window {
    APP_PAGE?: string;
  }
}

const pages: Page[] = ['home', 'doctors', 'departments', 'blog', 'gallery', 'events', 'contact', 'booking', 'careers', 'portal_login', 'portal', 'landing', 'login', 'signup'];

function pageFromPath(): Page {
  const p = window.location.pathname.slice(1) as Page;
  return pages.includes(p) ? p : 'home';
}

function navigate(page: Page) {
  window.history.pushState(null, '', page === 'home' ? '/' : '/' + page);
}

function App() {
  if (window.APP_PAGE === 'dashboard') {
    return <Dashboard />;
  }

  const [page, setPage] = useState<Page>(pageFromPath);
  const [portalToken, setPortalToken] = useState<string | null>(() => localStorage.getItem('portal_token'));

  useEffect(() => {
    const onPop = () => setPage(pageFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = (p: Page) => { setPage(p); navigate(p); };

  const handlePortalLogin = (token: string) => {
    localStorage.setItem('portal_token', token);
    setPortalToken(token);
    go('portal');
  };

  const handlePortalLogout = () => {
    fetch('/api/portal/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${portalToken}` } }).catch(() => {});
    localStorage.removeItem('portal_token');
    setPortalToken(null);
    go('home');
  };

  if (portalToken && page === 'portal') {
    return <PatientPortal token={portalToken} onLogout={handlePortalLogout} />;
  }

  if (page === 'portal_login') {
    return <PortalLogin onLogin={handlePortalLogin} onBack={() => go('home')} />;
  }

  if (page === 'login') {
    return <LoginPage onSignUp={() => go('signup')} onBack={() => go('home')} />;
  }

  if (page === 'signup') {
    return <SignUpPage onLogin={() => go('login')} onBack={() => go('home')} />;
  }

  if (page === 'landing') {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-red-50">
        <header className="flex items-center gap-3 border-b bg-white px-8 py-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800">MediCare Hospital</span>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="max-w-2xl text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-red-100 shadow-inner">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-14 w-14 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-800">Hospital Management System</h1>
            <p className="mb-10 text-lg text-gray-500">Streamline patient care, appointments, and medical records — all in one place.</p>
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Patient Records', desc: 'Secure digital records accessible anytime', icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
                { title: 'Appointments', desc: 'Easy scheduling with real-time availability', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
                { title: 'Billing & Reports', desc: 'Automated invoicing and analytics', icon: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 0 4.5 6h7.5a.75.75 0 0 0 .75-.75v-.75m0 0v-.75a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v.75m0 0v11.25' },
              ].map((feature) => (
                <div key={feature.title} className="rounded-xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => go('home')} className="mr-4 rounded-xl bg-gray-600 px-8 py-3.5 text-base font-medium text-white shadow-lg transition hover:bg-gray-700">Visit Website</button>
            <button onClick={() => go('login')} className="rounded-xl bg-red-600 px-10 py-3.5 text-lg font-medium text-white shadow-lg transition hover:bg-red-700">Login to Dashboard</button>
          </div>
        </main>
        <footer className="border-t bg-white py-4 text-center text-sm text-gray-400">&copy; 2026 MediCare Hospital Management System. All rights reserved.</footer>
      </div>
    );
  }

  const publicPages: Page[] = ['home', 'doctors', 'departments', 'blog', 'gallery', 'events', 'contact', 'booking', 'careers'];
  if (publicPages.includes(page)) {
    return (
      <PublicLayout page={page} setPage={(p) => go(p as Page)} onLogin={() => go('login')}>
        {page === 'home' && <HomePage setPage={(p) => go(p as Page)} />}
        {page === 'doctors' && <DoctorDirectory setPage={(p) => go(p as Page)} />}
        {page === 'departments' && <DepartmentPage />}
        {page === 'blog' && <BlogList setPage={(p) => go(p as Page)} />}
        {page === 'gallery' && <GalleryPage />}
        {page === 'events' && <EventsPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'booking' && <BookingWizard setPage={(p) => go(p as Page)} />}
        {page === 'careers' && <CareersPage setPage={(p) => go(p as Page)} />}
      </PublicLayout>
    );
  }
}

const root = createRoot(document.getElementById('app')!);
root.render(<LanguageProvider><App /></LanguageProvider>);
