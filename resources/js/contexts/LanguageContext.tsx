import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import en from '../translations/en'
import ne from '../translations/ne'

type Lang = 'en' | 'ne'
type T = Record<string, string>

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const translations: Record<Lang, T> = { en, ne }

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'en'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  function setLang(l: Lang) {
    setLangState(l)
    try {
      const fd = new FormData()
      fd.append('language', l)
      fetch('/api/settings/language', { method: 'POST', body: fd })
    } catch {}
  }

  function t(key: string, vars?: Record<string, string | number>): string {
    const val = translations[lang][key] || en[key] || key
    if (!vars) return val
    return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
