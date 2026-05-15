'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Emotion, Record } from '@/lib/types'
import { emotionLabels } from '@/lib/types'

interface RecordFormProps {
  onSubmit: (record: Omit<Record, 'id' | 'createdAt'>) => void
}

const emotions: { value: Emotion; label: string; icon: string }[] = [
  { value: 'calm', label: '冷静', icon: '🧘' },
  { value: 'stable', label: '稳定', icon: '⚖️' },
  { value: 'fomo', label: '恐慌', icon: '😰' },
  { value: 'greedy', label: '贪婪', icon: '🤑' },
  { value: 'fearful', label: '恐惧', icon: '😨' },
]

export function RecordForm({ onSubmit }: RecordFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [asset, setAsset] = useState('')
  const [value, setValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')
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
      previousValue: previousValue ? parseFloat(previousValue) : undefined,
      emotion,
      reason,
    })

    setAsset('')
    setValue('')
    setPreviousValue('')
    setReason('')
    setEmotion('stable')
    setIsExpanded(false)
  }

  const inputClass =
    'w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 backdrop-blur-sm transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-white/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            添加记录
          </h3>
          <motion.button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl px-3 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/60"
          >
            {isExpanded ? '收起' : '展开更多'}
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">资产</label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder="如: BTC / 纳指100"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">当前价值</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">上期价值</label>
              <input
                type="number"
                value={previousValue}
                onChange={(e) => setPreviousValue(e.target.value)}
                placeholder="可选"
                step="0.01"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">情绪状态</label>
            <div className="flex flex-wrap gap-2">
              {emotions.map((em) => (
                <motion.button
                  key={em.value}
                  type="button"
                  onClick={() => setEmotion(em.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    emotion === em.value
                      ? em.value === 'calm'
                        ? 'border-blue-400/40 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/10'
                        : em.value === 'stable'
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10'
                          : em.value === 'fomo'
                            ? 'border-orange-400/40 bg-orange-500/15 text-orange-300 shadow-lg shadow-orange-500/10'
                            : em.value === 'greedy'
                              ? 'border-yellow-400/40 bg-yellow-500/15 text-yellow-300 shadow-lg shadow-yellow-500/10'
                              : 'border-red-400/40 bg-red-500/15 text-red-300 shadow-lg shadow-red-500/10'
                      : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/60'
                  }`}
                >
                  <span className="mr-1.5">{em.icon}</span>
                  {em.label}
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
                <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">复盘思考</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="记录你的交易逻辑和反思..."
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
            className="w-full rounded-2xl bg-gradient-to-r from-white to-white/90 py-4 text-sm font-semibold text-black shadow-xl shadow-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
          >
            保存记录
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
