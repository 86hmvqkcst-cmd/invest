'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Record } from '@/lib/types'

interface RecordListProps {
  records: Record[]
  onDelete: (id: string) => void
}

const emotionConfig = {
  calm: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  fomo: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  stable: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

export function RecordList({ records, onDelete }: RecordListProps) {
  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative z-10">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-widest text-white/40">
          Journal Entries
        </h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record, index) => {
                const config = emotionConfig[record.emotion]
                return (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-white">{record.asset}</span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color} ${config.bg} ${config.border}`}
                          >
                            {record.emotion}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="text-2xl font-light text-white">{record.value}</span>
                          <span className="text-xs text-white/40">
                            {new Date(record.date).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {record.reason && (
                          <p className="text-sm text-white/50 line-clamp-2">{record.reason}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="rounded-lg p-2 text-white/30 opacity-0 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/60 group-hover:opacity-100"
                        aria-label="Delete record"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
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
                className="py-12 text-center"
              >
                <p className="text-sm text-white/30">暂无记录</p>
                <p className="mt-1 text-xs text-white/20">添加你的第一条投资复盘</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
