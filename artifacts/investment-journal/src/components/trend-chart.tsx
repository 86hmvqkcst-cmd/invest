import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import type { Record } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface TrendChartProps {
  records: Record[]
  isDark?: boolean
  locale?: Locale
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, isDark, t }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
      isDark
        ? 'border-white/[0.08] bg-black/90'
        : 'border-black/[0.06] bg-white/95'
    }`}>
      <p className={`mb-1 text-[10px] uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>{label}</p>
      <p className={`text-sm font-light ${isDark ? 'text-white' : 'text-black'}`}>
        {Number(payload[0].value).toLocaleString()} <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>{t.valueTrend}</span>
      </p>
    </div>
  )
}

export function TrendChart({ records, isDark = true, locale = 'zh' }: TrendChartProps) {
  const t = translations[locale]

  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
      value: r.value,
    }))

  const values = chartData.map(d => d.value)
  const minVal = values.length ? Math.min(...values) : 0
  const maxVal = values.length ? Math.max(...values) : 0
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
  const isPositive = values.length >= 2 ? values[values.length - 1] >= values[0] : true

  const strokeColor = isPositive
    ? isDark ? '#60a5fa' : '#3b82f6'
    : isDark ? '#f87171' : '#ef4444'

  const gradientStart = isPositive
    ? isDark ? 'rgba(96,165,250,0.25)' : 'rgba(59,130,246,0.2)'
    : isDark ? 'rgba(248,113,113,0.2)' : 'rgba(239,68,68,0.15)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl ${
        isDark
          ? 'border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent'
          : 'border-black/[0.07] bg-white/70'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className={`text-[10px] font-medium uppercase tracking-[0.22em] ${
            isDark ? 'text-white/35' : 'text-black/40'
          }`}>{t.trendChart}</h3>
          {records.length > 0 && (
            <p className={`mt-1 text-xs ${isDark ? 'text-white/25' : 'text-black/30'}`}>
              {minVal.toLocaleString()} – {maxVal.toLocaleString()}
            </p>
          )}
        </div>
        {records.length > 1 && (
          <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] ${
            isPositive
              ? isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-400/30 bg-emerald-50 text-emerald-600'
              : isDark ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-red-400/30 bg-red-50 text-red-500'
          }`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{isPositive ? t.trendUp : t.trendDown}</span>
          </div>
        )}
      </div>

      <div className="h-56">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientStart} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.3)', fontSize: 10 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.3)', fontSize: 10 }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              {records.length >= 3 && (
                <ReferenceLine
                  y={avg}
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                  strokeDasharray="4 4"
                />
              )}
              <Tooltip
                content={(props) => <CustomTooltip {...props} isDark={isDark} t={t} />}
                cursor={{ stroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', strokeWidth: 1 }}
              />
              <Area
                type="monotoneX"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill="url(#trendGradient)"
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, stroke: 'transparent', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-white/20' : 'text-black/20'}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-white/25' : 'text-black/35'}`}>{t.noData}</p>
              <p className={`mt-1 text-xs ${isDark ? 'text-white/15' : 'text-black/25'}`}>{t.addFirstRecord}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
