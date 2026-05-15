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

const emotionIcons: { [key in Emotion]: string } = {
  calm: '○',
  stable: '◇',
  fomo: '△',
  greed: '□',
  fear: '▽',
}

export function RecordForm({ onSubmit, isDark = true, locale = 'zh' }: RecordFormProps) {
  const t = translations[locale]
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [asset, setAsset] = useState('')
  const [value, setValue] = useState('')
  const [emotion, setEmotion] = useState<Emotion>('stable')
  const [reason, setReason] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset || !value) return

    onSubmit({
      date,
      asset,
      value: parseFloat(value),
      emotion,
      reason,
    })

    setAsset('')
    setValue('')
    setReason('')
    setEmotion('stable')
    setIsExpanded(false)
  }

  const getEmotionLabel = (em: Emotion) => {
    return t[em as keyof typeof t] as string
  }

  const inputClass = isDark
    ? 'w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 backdrop-blur-sm transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-white/10'
    : 'w-full rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-3.5 text-sm text-black placeholder-black/30 backdrop-blur-sm transition-all duration-300 focus:border-black/20 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl ${
        isDark 
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02]' 
          : 'border-black/[0.08] bg-white/70'
      }`}
    >
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03]' 
          : 'bg-gradient-to-br from-blue-500/[0.02] via-transparent to-purple-500/[0.02]'
      }`} />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className={`text-[11px] font-medium uppercase tracking-[0.2em] ${
            isDark ? 'text-white/40' : 'text-black/40'
          }`}>
            {t.newRecord}
          </h3>
          <motion.button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            whileTap={{ scale: 0.95 }}
            className={`rounded-xl px-3 py-1.5 text-xs transition-colors ${
              isDark 
                ? 'text-white/40 hover:bg-white/[0.05] hover:text-white/60' 
                : 'text-black/40 hover:bg-black/[0.05] hover:text-black/60'
            }`}
          >
            {isExpanded ? (locale === 'zh' ? '收起' : 'Collapse') : (locale === 'zh' ? '展开' : 'Expand')}
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`mb-2.5 block text-[11px] font-medium uppercase tracking-wider ${
                isDark ? 'text-white/40' : 'text-black/40'
              }`}>{t.date}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-2.5 block text-[11px] font-medium uppercase tracking-wider ${
                isDark ? 'text-white/40' : 'text-black/40'
              }`}>{t.asset}</label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder={t.assetPlaceholder}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={`mb-2.5 block text-[11px] font-medium uppercase tracking-wider ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}>{t.value}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t.valuePlaceholder}
              step="0.01"
              className={inputClass}
            />
          </div>

          <div>
            <label className={`mb-2.5 block text-[11px] font-medium uppercase tracking-wider ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}>{t.emotion}</label>
            <div className="flex flex-wrap gap-2">
              {emotions.map((em) => (
                <motion.button
                  key={em}
                  type="button"
                  onClick={() => setEmotion(em)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    emotion === em
                      ? em === 'calm'
                        ? 'border-blue-400/40 bg-blue-500/15 text-blue-400 shadow-lg shadow-blue-500/10'
                        : em === 'stable'
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
                          : em === 'fomo'
                            ? 'border-orange-400/40 bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-500/10'
                            : em === 'greed'
                              ? 'border-amber-400/40 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10'
                              : 'border-red-400/40 bg-red-500/15 text-red-400 shadow-lg shadow-red-500/10'
                      : isDark
                        ? 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/60'
                        : 'border-black/[0.08] bg-black/[0.02] text-black/40 hover:bg-black/[0.05] hover:text-black/60'
                  }`}
                >
                  <span className="mr-1.5 opacity-60">{emotionIcons[em]}</span>
                  {getEmotionLabel(em)}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {(isExpanded || reason) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={`mb-2.5 block text-[11px] font-medium uppercase tracking-wider ${
                  isDark ? 'text-white/40' : 'text-black/40'
                }`}>{t.reason}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full rounded-2xl py-4 text-sm font-semibold shadow-xl transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-r from-white to-white/90 text-black shadow-white/10 hover:shadow-2xl hover:shadow-white/20' 
                : 'bg-gradient-to-r from-black to-black/90 text-white shadow-black/10 hover:shadow-2xl hover:shadow-black/20'
            }`}
          >
            {t.submit}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
