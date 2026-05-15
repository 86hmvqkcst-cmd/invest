import { motion, AnimatePresence } from 'framer-motion'
import type { Record, Emotion } from '@/lib/types'
import { emotionColors, emotionColorsLight } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface RecordListProps {
  records: Record[]
  onDelete: (id: string) => void
  isDark?: boolean
  locale?: Locale
}

export function RecordList({ records, onDelete, isDark = true, locale = 'zh' }: RecordListProps) {
  const t = translations[locale]
  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)
  const colors = isDark ? emotionColors : emotionColorsLight

  const getEmotionLabel = (em: Emotion) => t[em as keyof typeof t] as string

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl ${
        isDark
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02]'
          : 'border-black/[0.07] bg-white/70'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-[10px] font-medium uppercase tracking-[0.22em] ${
          isDark ? 'text-white/35' : 'text-black/40'
        }`}>{t.journalRecords}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${
          isDark ? 'bg-white/[0.05] text-white/25' : 'bg-black/[0.04] text-black/35'
        }`}>{records.length}</span>
      </div>

      <div className="custom-scrollbar max-h-[480px] space-y-2 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {sortedRecords.length > 0 ? (
            sortedRecords.map((record, idx) => {
              const col = colors[record.emotion]
              return (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -16 }}
                  transition={{ duration: 0.25, delay: idx * 0.025 }}
                  className={`group relative overflow-hidden rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                    isDark
                      ? 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]'
                      : 'border-black/[0.05] bg-white/40 hover:border-black/[0.1] hover:bg-white/70'
                  }`}
                >
                  <div className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-full ${col.bg}`} />
                  <div className="flex items-start justify-between gap-3 pl-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                          {record.asset === '—' ? '' : record.asset}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide ${col.text} ${col.bg} ${col.border}`}>
                          {getEmotionLabel(record.emotion)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-3">
                        <span className={`text-lg font-extralight ${isDark ? 'text-white' : 'text-black'}`}>
                          {record.value.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[11px] ${isDark ? 'text-white/25' : 'text-black/30'}`}>
                          {new Date(record.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {record.reason && (
                        <p className={`mt-1.5 line-clamp-1 text-xs ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                          {record.reason}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(record.id)}
                      className={`mt-0.5 rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100 ${
                        isDark ? 'text-white/20 hover:bg-red-500/10 hover:text-red-400' : 'text-black/20 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-14 text-center"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-white/15' : 'text-black/15'}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p className={`text-xs ${isDark ? 'text-white/25' : 'text-black/30'}`}>{t.noRecords}</p>
              <p className={`mt-1 text-[11px] ${isDark ? 'text-white/15' : 'text-black/20'}`}>{t.startJourney}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
