import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  accent?: string
  trend?: 'up' | 'down' | 'flat'
  delay?: number
  isDark?: boolean
  highlight?: boolean
}

export function DashboardCard({
  title, value, subtitle, icon, accent, trend, delay = 0, isDark = true, highlight = false,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
        highlight
          ? isDark
            ? 'border-blue-500/20 bg-gradient-to-br from-blue-500/[0.1] to-blue-500/[0.04]'
            : 'border-blue-400/30 bg-blue-50/80'
          : isDark
            ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:border-white/[0.1]'
            : 'border-black/[0.07] bg-white/70 hover:border-black/[0.12]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[10px] font-medium uppercase tracking-[0.22em] ${
            isDark ? 'text-white/35' : 'text-black/40'
          }`}>{title}</p>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className={`text-2xl font-extralight tracking-tight leading-none ${
              highlight
                ? isDark ? 'text-blue-300' : 'text-blue-600'
                : isDark ? 'text-white' : 'text-black'
            }`}>{value}</span>
            {trend && (
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : isDark ? 'text-white/30' : 'text-black/30'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </span>
            )}
          </div>

          {subtitle && (
            <p className={`mt-1 text-[11px] ${isDark ? 'text-white/25' : 'text-black/35'}`}>{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className={`rounded-xl p-2.5 ${
            highlight
              ? isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-600'
              : isDark ? 'bg-white/[0.05] text-white/35' : 'bg-black/[0.04] text-black/30'
          }`}>
            {icon}
          </div>
        )}
      </div>

      {accent && (
        <div
          className="absolute bottom-0 left-0 h-[2px] rounded-full"
          style={{ background: accent, width: '100%', opacity: 0.4 }}
        />
      )}
    </motion.div>
  )
}
