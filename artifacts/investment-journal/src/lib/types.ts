export type Emotion = 'calm' | 'stable' | 'fomo' | 'greed' | 'fear'

export interface Record {
  id: string
  date: string
  asset: string
  value: number
  emotion: Emotion
  reason: string
  createdAt: number
}

export const emotions: Emotion[] = ['calm', 'stable', 'fomo', 'greed', 'fear']

export const emotionColors: { [key in Emotion]: { bg: string; text: string; border: string } } = {
  calm: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  stable: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  fomo: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  greed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  fear: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

export const emotionColorsLight: { [key in Emotion]: { bg: string; text: string; border: string } } = {
  calm: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  stable: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  fomo: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  greed: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  fear: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
}

export type PetLevel = 0 | 1 | 2 | 3 | 4 | 5

export interface PetState {
  level: PetLevel
  growthRate: number
  isPositive: boolean
}

export function computePetState(records: Record[]): PetState {
  if (records.length === 0) return { level: 0, growthRate: 0, isPositive: false }
  
  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const first = sorted[0].value
  const last = sorted[sorted.length - 1].value
  
  const growthRate = first > 0 ? ((last - first) / first) * 100 : 0
  const isPositive = growthRate >= 0
  
  let level: PetLevel = 1
  if (growthRate < 0) level = 0
  else if (growthRate < 5) level = 1
  else if (growthRate < 20) level = 2
  else if (growthRate < 50) level = 3
  else if (growthRate < 100) level = 4
  else level = 5
  
  return { level, growthRate, isPositive }
}

export function computeStreak(records: Record[]): number {
  if (records.length === 0) return 0
  const dates = new Set(records.map(r => r.date))
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (dates.has(key)) {
      streak++
    } else {
      break
    }
  }
  return streak
}
