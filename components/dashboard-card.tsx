'use client'

import { motion } from 'framer-motion'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  delay?: number
}

export function DashboardCard({ title, value, subtitle, delay = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-white/40">
          {title}
        </span>
        <span className="mt-3 text-4xl font-light tracking-tight text-white">
          {value}
        </span>
        {subtitle && (
          <span className="mt-2 text-sm text-white/50">{subtitle}</span>
        )}
      </div>
    </motion.div>
  )
}
