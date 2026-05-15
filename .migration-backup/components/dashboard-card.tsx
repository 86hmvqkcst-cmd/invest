'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: number
  delay?: number
  isDark?: boolean
}

export function DashboardCard({ title, value, subtitle, icon, trend, delay = 0, isDark = true }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-300 ${
        isDark 
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:border-white/[0.12] hover:shadow-2xl hover:shadow-white/[0.02]' 
          : 'border-black/[0.08] bg-white/70 hover:border-black/[0.12] hover:shadow-xl hover:shadow-black/[0.05]'
      }`}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
        isDark ? 'from-white/[0.08]' : 'from-black/[0.03]'
      }`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className={`text-[11px] font-medium uppercase tracking-[0.2em] ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}>
              {title}
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-extralight tracking-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {value}
              </span>
              {trend !== undefined && (
                <span className={`text-sm font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </span>
              )}
            </div>
            {subtitle && (
              <span className={`mt-1.5 text-xs ${isDark ? 'text-white/35' : 'text-black/40'}`}>{subtitle}</span>
            )}
          </div>
          {icon && (
            <div className={`rounded-2xl p-3 ${
              isDark ? 'bg-white/[0.05] text-white/40' : 'bg-black/[0.03] text-black/30'
            }`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
