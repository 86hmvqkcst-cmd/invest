export interface Record {
  id: string
  date: string
  asset: string
  value: number
  emotion: 'calm' | 'fomo' | 'stable'
  reason: string
  createdAt: number
}

export type Emotion = 'calm' | 'fomo' | 'stable'
