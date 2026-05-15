'use client'

import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
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
    }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative z-10">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-widest text-white/40">
          Value Trend
        </h3>
        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.3)" />
                    <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 16px',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
                  itemStyle={{ color: 'rgba(255,255,255,0.9)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(96, 165, 250, 0.8)"
                  strokeWidth={2}
                  fill="url(#valueGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#60a5fa',
                    stroke: 'rgba(96, 165, 250, 0.3)',
                    strokeWidth: 8,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/30">暂无数据，添加记录后显示趋势</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
