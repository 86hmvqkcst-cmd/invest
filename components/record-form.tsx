'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Emotion, Record } from '@/lib/types'

interface RecordFormProps {
  onSubmit: (record: Omit<Record, 'id' | 'createdAt'>) => void
}

const emotions: { value: Emotion; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'stable', label: 'Stable' },
  { value: 'fomo', label: 'FOMO' },
]

export function RecordForm({ onSubmit }: RecordFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [asset, setAsset] = useState('')
  const [value, setValue] = useState('')
  const [emotion, setEmotion] = useState<Emotion>('stable')
  const [reason, setReason] = useState('')

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
  }

  const inputClass =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/20 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative z-10">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-widest text-white/40">
          New Record
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs text-white/50">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-white/50">Asset</label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder="e.g. NASDAQ100"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs text-white/50">Value</label>
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
              <label className="mb-2 block text-xs text-white/50">Emotion</label>
              <div className="flex gap-2">
                {emotions.map((em) => (
                  <button
                    key={em.value}
                    type="button"
                    onClick={() => setEmotion(em.value)}
                    className={`flex-1 rounded-xl border px-3 py-3 text-xs font-medium transition-all duration-200 ${
                      emotion === em.value
                        ? em.value === 'calm'
                          ? 'border-blue-500/50 bg-blue-500/20 text-blue-400'
                          : em.value === 'fomo'
                            ? 'border-red-500/50 bg-red-500/20 text-red-400'
                            : 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.05]'
                    }`}
                  >
                    {em.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/50">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why did you make this trade?"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90"
          >
            Add Record
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
