import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard-card'
import { TrendChart } from '@/components/trend-chart'
import { RecordForm } from '@/components/record-form'
import { RecordList } from '@/components/record-list'
import type { Record } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

const STORAGE_KEY = 'investment-journal-records'
const THEME_KEY = 'investment-journal-theme'
const LOCALE_KEY = 'investment-journal-locale'

export default function Home() {
  const [records, setRecords] = useState<Record[]>([])
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [locale, setLocale] = useState<Locale>('zh')

  useEffect(() => {
    setMounted(true)
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRecords(JSON.parse(stored))
      } catch {
        // ignore parse error
      }
    }
    
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme !== null) {
      setIsDark(savedTheme === 'dark')
    }
    
    const savedLocale = localStorage.getItem(LOCALE_KEY)
    if (savedLocale === 'en' || savedLocale === 'zh') {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    }
  }, [records, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
    }
  }, [isDark, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(LOCALE_KEY, locale)
    }
  }, [locale, mounted])

  const t = translations[locale]

  const handleAddRecord = useCallback((newRecord: Omit<Record, 'id' | 'createdAt'>) => {
    const record: Record = {
      ...newRecord,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setRecords((prev) => [...prev, record])
  }, [])

  const handleDeleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayRecords = records.filter(
      (r) => new Date(r.date).toDateString() === today
    ).length

    const totalValue = records.reduce((sum, r) => sum + r.value, 0)
    
    const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)
    const latestEmotion = sortedRecords[0]?.emotion

    let overallChange: number | undefined
    if (records.length >= 2) {
      const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const first = sorted[0].value
      const last = sorted[sorted.length - 1].value
      if (first > 0) {
        overallChange = ((last - first) / first) * 100
      }
    }

    return { todayRecords, totalValue, latestEmotion, overallChange }
  }, [records])

  const getEmotionLabel = (em: string | undefined) => {
    if (!em) return '—'
    return t[em as keyof typeof t] as string || '—'
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="mx-auto max-w-5xl px-6 py-16" />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen transition-colors duration-500 ${
          isDark ? 'bg-[#050505] selection:bg-white/10' : 'bg-[#f5f5f7] selection:bg-black/10'
        }`}
      >
        {/* Ambient background gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full blur-[120px] ${
              isDark ? 'bg-blue-600/[0.03]' : 'bg-blue-400/[0.08]'
            }`} 
          />
          <motion.div 
            animate={{ 
              x: [0, -20, 0],
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full blur-[120px] ${
              isDark ? 'bg-purple-600/[0.03]' : 'bg-purple-400/[0.08]'
            }`} 
          />
        </div>
        
        <div className="relative mx-auto max-w-5xl px-6 py-12 lg:py-16">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 lg:mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                    isDark 
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-white/60' : 'text-black/60'}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </motion.div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.3em] ${
                  isDark ? 'text-white/30' : 'text-black/30'
                }`}>{t.brandName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white/80' 
                      : 'bg-black/[0.05] text-black/60 hover:bg-black/[0.1] hover:text-black/80'
                  }`}
                >
                  {locale === 'zh' ? 'EN' : '中文'}
                </motion.button>
                
                <motion.button
                  onClick={() => setIsDark(!isDark)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-xl p-2.5 transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white/80' 
                      : 'bg-black/[0.05] text-black/60 hover:bg-black/[0.1] hover:text-black/80'
                  }`}
                  aria-label={isDark ? t.lightMode : t.darkMode}
                >
                  {isDark ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
            
            <h1 className={`text-4xl lg:text-5xl font-extralight tracking-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              {t.title}
            </h1>
            <p className={`mt-3 text-sm tracking-wide ${
              isDark ? 'text-white/30' : 'text-black/40'
            }`}>
              {t.subtitle}
            </p>
          </motion.header>

          {/* Dashboard Cards */}
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title={t.today} 
              value={stats.todayRecords} 
              subtitle={t.records} 
              delay={0.1}
              isDark={isDark}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              }
            />
            <DashboardCard 
              title={t.total} 
              value={records.length} 
              subtitle={t.records} 
              delay={0.15}
              isDark={isDark}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              }
            />
            <DashboardCard 
              title={t.totalValue} 
              value={stats.totalValue.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: 0 })} 
              subtitle={t.unitAmount}
              trend={stats.overallChange}
              delay={0.2}
              isDark={isDark}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              }
            />
            <DashboardCard 
              title={t.mood} 
              value={getEmotionLabel(stats.latestEmotion)} 
              subtitle={t.latestStatus} 
              delay={0.25}
              isDark={isDark}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              }
            />
          </div>

          {/* Trend Chart */}
          <div className="mb-8">
            <TrendChart records={records} isDark={isDark} locale={locale} />
          </div>

          {/* Form and List Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecordForm onSubmit={handleAddRecord} isDark={isDark} locale={locale} />
            <RecordList records={records} onDelete={handleDeleteRecord} isDark={isDark} locale={locale} />
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 text-center"
          >
            <p className={`text-[10px] uppercase tracking-[0.2em] ${
              isDark ? 'text-white/15' : 'text-black/20'
            }`}>
              {t.footerText}
            </p>
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
