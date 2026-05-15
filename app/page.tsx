'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard-card'
import { TrendChart } from '@/components/trend-chart'
import { RecordForm } from '@/components/record-form'
import { RecordList } from '@/components/record-list'
import { emotionLabels } from '@/lib/types'
import type { Record } from '@/lib/types'

const STORAGE_KEY = 'investment-journal-records'

export default function Home() {
  const [records, setRecords] = useState<Record[]>([])
  const [mounted, setMounted] = useState(false)

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
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    }
  }, [records, mounted])

  const handleAddRecord = (newRecord: Omit<Record, 'id' | 'createdAt'>) => {
    const record: Record = {
      ...newRecord,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setRecords((prev) => [...prev, record])
  }

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayRecords = records.filter(
      (r) => new Date(r.date).toDateString() === today
    ).length

    const totalValue = records.reduce((sum, r) => sum + r.value, 0)
    
    const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt)
    const latestEmotion = sortedRecords[0]?.emotion

    // Calculate overall change
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="mx-auto max-w-5xl px-6 py-16" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-white/10">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-blue-600/[0.03] blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-purple-600/[0.03] blur-[120px]" />
      </div>
      
      <div className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </motion.div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">Investment Journal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-white">
            投资复盘
          </h1>
          <p className="mt-3 text-sm tracking-wide text-white/30">
            长期思考 · 保持理性 · 记录成长
          </p>
        </motion.header>

        {/* Dashboard Cards */}
        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard 
            title="今日" 
            value={stats.todayRecords} 
            subtitle="条记录" 
            delay={0.1}
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
            title="累计" 
            value={records.length} 
            subtitle="条记录" 
            delay={0.15}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            }
          />
          <DashboardCard 
            title="总价值" 
            value={stats.totalValue.toLocaleString('zh-CN', { maximumFractionDigits: 0 })} 
            subtitle="单位金额"
            trend={stats.overallChange}
            delay={0.2}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
          />
          <DashboardCard 
            title="情绪" 
            value={stats.latestEmotion ? emotionLabels[stats.latestEmotion] : '—'} 
            subtitle="最新状态" 
            delay={0.25}
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
          <TrendChart records={records} />
        </div>

        {/* Form and List Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecordForm onSubmit={handleAddRecord} />
          <RecordList records={records} onDelete={handleDeleteRecord} />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/15">
            以纪律投资 · 保持冷静
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
