import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard-card'
import { TrendChart } from '@/components/trend-chart'
import { RecordForm } from '@/components/record-form'
import { RecordList } from '@/components/record-list'
import { GrowthPet } from '@/components/growth-pet'
import type { Record } from '@/lib/types'
import { computePetState, computeStreak } from '@/lib/types'
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
      try { setRecords(JSON.parse(stored)) } catch { /* ignore */ }
    }
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme !== null) setIsDark(savedTheme === 'dark')
    const savedLocale = localStorage.getItem(LOCALE_KEY)
    if (savedLocale === 'en' || savedLocale === 'zh') setLocale(savedLocale)
  }, [])

  useEffect(() => { if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(records)) }, [records, mounted])
  useEffect(() => { if (mounted) localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light') }, [isDark, mounted])
  useEffect(() => { if (mounted) localStorage.setItem(LOCALE_KEY, locale) }, [locale, mounted])

  const t = translations[locale]

  const handleAddRecord = useCallback((newRecord: Omit<Record, 'id' | 'createdAt'>) => {
    setRecords(prev => [...prev, { ...newRecord, id: crypto.randomUUID(), createdAt: Date.now() }])
  }, [])

  const handleDeleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayCount = records.filter(r => new Date(r.date).toDateString() === today).length
    const latestEmotion = [...records].sort((a, b) => b.createdAt - a.createdAt)[0]?.emotion
    return { todayCount, latestEmotion }
  }, [records])

  const petState = useMemo(() => computePetState(records), [records])
  const streak = useMemo(() => computeStreak(records), [records])

  const trendDirection = useMemo(() => {
    if (records.length < 2) return 'flat' as const
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const diff = sorted[sorted.length - 1].value - sorted[0].value
    return diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'flat' as const
  }, [records])

  const getEmotionLabel = (em: string | undefined) => {
    if (!em) return '—'
    return t[em as keyof typeof t] as string || '—'
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className={`min-h-screen transition-colors duration-500 ${
          isDark ? 'bg-[#070707]' : 'bg-[#f4f4f6]'
        }`}
      >
        {/* Ambient gradients */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -left-[15%] -top-[30%] h-[70%] w-[55%] rounded-full blur-[130px] ${
              isDark ? 'bg-blue-700/[0.04]' : 'bg-blue-400/[0.07]'
            }`}
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -bottom-[30%] -right-[15%] h-[65%] w-[50%] rounded-full blur-[130px] ${
              isDark ? 'bg-indigo-700/[0.04]' : 'bg-purple-400/[0.06]'
            }`}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-10 lg:py-14">
          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isDark
                      ? 'bg-gradient-to-br from-blue-500/25 to-indigo-500/25'
                      : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </motion.div>
                <div>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${
                    isDark ? 'text-white/50' : 'text-black/50'
                  }`}>{t.brandName}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70'
                      : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1] hover:text-black/70'
                  }`}
                >
                  {locale === 'zh' ? 'EN' : '中文'}
                </button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`rounded-lg p-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70'
                      : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1] hover:text-black/70'
                  }`}
                  aria-label="toggle theme"
                >
                  {isDark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h1 className={`text-3xl font-extralight tracking-tight lg:text-4xl ${
                isDark ? 'text-white' : 'text-black'
              }`}>{t.title}</h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-white/25' : 'text-black/35'}`}>{t.subtitle}</p>
            </div>
          </motion.header>

          {/* ── Main grid ── */}
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">

            {/* Left column */}
            <div className="flex flex-col gap-5">

              {/* Dashboard cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <DashboardCard
                  title={t.today}
                  value={stats.todayCount}
                  subtitle={t.records}
                  delay={0.1}
                  isDark={isDark}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  }
                />
                <DashboardCard
                  title={t.streakLabel}
                  value={`${streak}${t.streakDays}`}
                  subtitle={streak >= 3 ? (streak >= 7 ? '⚡' : '🔥') : ''}
                  delay={0.15}
                  isDark={isDark}
                  highlight={streak >= 3}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  }
                />
                <DashboardCard
                  title={t.growthTrend}
                  value={records.length < 2 ? '—' : trendDirection === 'up' ? t.trendUp : trendDirection === 'down' ? t.trendDown : t.trendFlat}
                  trend={records.length >= 2 ? trendDirection : undefined}
                  delay={0.2}
                  isDark={isDark}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  }
                />
              </div>

              {/* Trend chart */}
              <TrendChart records={records} isDark={isDark} locale={locale} />

              {/* Form + List */}
              <div className="grid gap-5 sm:grid-cols-2">
                <RecordForm onSubmit={handleAddRecord} isDark={isDark} locale={locale} />
                <RecordList records={records} onDelete={handleDeleteRecord} isDark={isDark} locale={locale} />
              </div>
            </div>

            {/* Right column — Growth Pet */}
            <div className="lg:sticky lg:top-10 lg:self-start">
              <GrowthPet
                petState={petState}
                streak={streak}
                isDark={isDark}
                locale={locale}
              />
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-14 text-center"
          >
            <p className={`text-[10px] uppercase tracking-[0.2em] ${
              isDark ? 'text-white/12' : 'text-black/20'
            }`}>{t.footerText}</p>
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
