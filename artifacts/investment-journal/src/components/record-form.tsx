import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Emotion } from '@/lib/types'
import { emotions } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface RecordFormProps {
  onSubmit: (record: Omit<import('@/lib/types').Record, 'id' | 'createdAt'>) => void
  isDark?: boolean
  locale?: Locale
}

const emotionConfig: { [key in Emotion]: { icon: string; activeClass: string } } = {
  calm:   { icon: '○', activeClass: 'border-blue-400/40 bg-blue-500/10 text-blue-400' },
  stable: { icon: '◇', activeClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-400' },
  fomo:   { icon: '△', activeClass: 'border-orange-400/40 bg-orange-500/10 text-orange-400' },
  greed:  { icon: '□', activeClass: 'border-amber-400/40 bg-amber-500/10 text-amber-400' },
  fear:   { icon: '▽', activeClass: 'border-red-400/40 bg-red-500/10 text-red-400' },
}

export function RecordForm({ onSubmit, isDark = true, locale = 'zh' }: RecordFormProps) {
  const t = translations[locale]
  const [advanced, setAdvanced] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [asset, setAsset] = useState('')
  const [value, setValue] = useState('')
  const [emotion, setEmotion] = useState<Emotion>('stable')
  const [reason, setReason] = useState('')
  const [justSubmitted, setJustSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value) return

    onSubmit({
      date,
      asset: asset || '—',
      value: parseFloat(value),
      emotion,
      reason,
    })

    setValue('')
    setAsset('')
    setReason('')
    setEmotion('stable')
    setJustSubmitted(true)
    setTimeout(() => setJustSubmitted(false), 1800)
  }

  const inputBase = isDark
    ? 'w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder-white/20 transition-all duration-200 focus:border-white/[0.18] focus:bg-white/[0.07] focus:outline-none'
    : 'w-full rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 py-3 text-sm text-black placeholder-black/25 transition-all duration-200 focus:border-black/[0.18] focus:bg-white focus:outline-none'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl ${
        isDark
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02]'
          : 'border-black/[0.07] bg-white/70'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className={`text-[10px] font-medium uppercase tracking-[0.22em] ${
          isDark ? 'text-white/35' : 'text-black/40'
        }`}>{t.newRecord}</h3>
        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          className={`rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
            isDark
              ? 'text-white/30 hover:bg-white/[0.05] hover:text-white/50'
              : 'text-black/35 hover:bg-black/[0.04] hover:text-black/55'
          }`}
        >
          {advanced ? t.simpleMode : t.advancedMode}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Value — always visible, primary field */}
        <div>
          <label className={`mb-2 block text-[10px] font-medium uppercase tracking-widest ${
            isDark ? 'text-white/30' : 'text-black/35'
          }`}>{t.value}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.valuePlaceholder}
            step="0.01"
            autoComplete="off"
            className={`${inputBase} text-base`}
          />
        </div>

        {/* Emotion row — always visible */}
        <div>
          <label className={`mb-2 block text-[10px] font-medium uppercase tracking-widest ${
            isDark ? 'text-white/30' : 'text-black/35'
          }`}>{t.emotion}</label>
          <div className="flex gap-2">
            {emotions.map((em) => (
              <motion.button
                key={em}
                type="button"
                onClick={() => setEmotion(em)}
                whileTap={{ scale: 0.93 }}
                className={`flex-1 rounded-xl border py-2.5 text-[11px] font-medium transition-all duration-200 ${
                  emotion === em
                    ? emotionConfig[em].activeClass
                    : isDark
                      ? 'border-white/[0.05] bg-white/[0.02] text-white/30 hover:bg-white/[0.05] hover:text-white/50'
                      : 'border-black/[0.06] bg-transparent text-black/30 hover:bg-black/[0.04] hover:text-black/50'
                }`}
              >
                <span className="block text-center">{emotionConfig[em].icon}</span>
                <span className="mt-0.5 block text-center text-[9px] tracking-wide">
                  {t[em as keyof typeof t] as string}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Advanced fields */}
        <AnimatePresence>
          {advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`mb-2 block text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/35'}`}>{t.date}</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className={`mb-2 block text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/35'}`}>{t.asset}</label>
                  <input type="text" value={asset} onChange={(e) => setAsset(e.target.value)} placeholder={t.assetPlaceholder} className={inputBase} />
                </div>
              </div>
              <div>
                <label className={`mb-2 block text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/35'}`}>{t.reason}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <AnimatePresence mode="wait">
          {justSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium ${
                isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {locale === 'zh' ? '已记录' : 'Recorded'}
            </motion.div>
          ) : (
            <motion.button
              key="submit"
              type="submit"
              whileHover={{ scale: 1.005, y: -1 }}
              whileTap={{ scale: 0.995 }}
              className={`w-full rounded-xl py-3.5 text-sm font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-white/90 text-black hover:bg-white'
                  : 'bg-black/85 text-white hover:bg-black'
              }`}
            >
              {t.submit}
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}
