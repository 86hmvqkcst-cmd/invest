'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard-card'
import { TrendChart } from '@/components/trend-chart'
import { RecordForm } from '@/components/record-form'
import { RecordList } from '@/components/record-list'
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

  const todayRecords = records.filter(
    (r) => new Date(r.date).toDateString() === new Date().toDateString()
  ).length

  const latestMood = records.length > 0 
    ? [...records].sort((a, b) => b.createdAt - a.createdAt)[0].emotion
    : '—'

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="mx-auto max-w-4xl px-6 py-16" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-light tracking-tight text-white">
            Investment Journal
          </h1>
          <p className="mt-3 text-sm tracking-wide text-white/40">
            Think long term · Stay rational
          </p>
        </motion.header>

        {/* Dashboard Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <DashboardCard title="Today" value={todayRecords} subtitle="records" delay={0.1} />
          <DashboardCard title="Total" value={records.length} subtitle="records" delay={0.15} />
          <DashboardCard 
            title="Mood" 
            value={latestMood === '—' ? '—' : latestMood.charAt(0).toUpperCase() + latestMood.slice(1)} 
            subtitle="latest state" 
            delay={0.2} 
          />
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <TrendChart records={records} />
        </div>

        {/* Form and List Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <RecordForm onSubmit={handleAddRecord} />
          <RecordList records={records} onDelete={handleDeleteRecord} />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-white/20">
            Built with discipline · Stay calm
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
