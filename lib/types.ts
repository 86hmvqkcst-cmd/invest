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
