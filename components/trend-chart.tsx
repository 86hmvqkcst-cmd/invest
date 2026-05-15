'use client'

import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Record } from '@/lib/types'

interface TrendChartProps {
  records: Record[]
}

export function TrendChart({ records }: TrendChartProps) {
  const chartData = records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: record.value,
      asset: record.asset,
    }))

  const totalValue = records.reduce((sum, r) => sum + r.value, 0)
  const avgValue = records.length > 0 ? totalValue / records.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-emerald-500/[0.03]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            价值趋势
          </h3>
          {records.length > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-white/30">均值</span>
              <span className="text-sm font-medium text-white/60">
                {avgValue.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.4)" />
                    <stop offset="50%" stopColor="rgba(96, 165, 250, 0.1)" />
                    <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.6)" />
                    <stop offset="100%" stopColor="rgba(52, 211, 153, 0.6)" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 500 }}
                  width={50}
                  tickFormatter={(value) => value.toLocaleString('zh-CN')}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 10, 10, 0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    padding: '16px 20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  itemStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}
                  formatter={(value: number) => [value.toLocaleString('zh-CN'), '价值']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGradient)"
                  strokeWidth={2.5}
                  fill="url(#valueGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#60a5fa',
                    stroke: 'rgba(96, 165, 250, 0.3)',
                    strokeWidth: 10,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <p className="text-sm text-white/30">暂无数据</p>
              <p className="mt-1.5 text-xs text-white/20">添加记录后显示趋势</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
