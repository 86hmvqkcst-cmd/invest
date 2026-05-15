'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Record } from '@/lib/types'
import { emotionLabels } from '@/lib/types'

interface RecordListProps {
  records: Record[]
  onDelete: (id: string) => void
}

const emotionConfig = {
  calm: { color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-400/20', glow: 'shadow-blue-500/20' },
  stable: { color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20', glow: 'shadow-emerald-500/20' },
  fomo: { color: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-400/20', glow: 'shadow-orange-500/20' },
  greedy: { color: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-400/20', glow: 'shadow-yellow-500/20' },
  fearful: { color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-400/20', glow: 'shadow-red-500/20' },
}

export function RecordList({ records, onDelete }: RecordListProps) {
  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)

  const calculateChange = (record: Record) => {
    if (record.previousValue && record.previousValue > 0) {
      return ((record.value - record.previousValue) / record.previousValue) * 100
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03]" />
      <div className="relative z-10">
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
          投资日志 <span className="ml-2 rounded-full bg-white/[0.05] px-2 py-0.5 text-white/30">{records.length}</span>
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record, index) => {
                const config = emotionConfig[record.emotion]
                const change = calculateChange(record)
                return (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
                  >
                    {/* Left accent bar based on emotion */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} opacity-60`} />
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 pl-3">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-base font-medium text-white">{record.asset}</span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${config.color} ${config.bg} ${config.border}`}
                          >
                            {emotionLabels[record.emotion]}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-4 mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extralight tracking-tight text-white">
                              {record.value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                            </span>
                            {change !== null && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-sm font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                              >
                                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
                              </motion.span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-white/35">
                          <span className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {new Date(record.date).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          {record.previousValue && (
                            <span className="text-white/25">
                              前值: {record.previousValue.toLocaleString('zh-CN')}
                            </span>
                          )}
                        </div>
                        
                        {record.reason && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 text-sm leading-relaxed text-white/45 line-clamp-2"
                          >
                            {record.reason}
                          </motion.p>
                        )}
                      </div>
                      
                      <motion.button
                        onClick={() => onDelete(record.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="rounded-xl p-2.5 text-white/20 opacity-0 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                        aria-label="删除记录"
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
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm text-white/30">暂无记录</p>
                <p className="mt-1.5 text-xs text-white/20">添加你的第一条投资复盘</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
