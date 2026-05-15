export type Emotion = 'calm' | 'stable' | 'fomo' | 'greedy' | 'fearful'

export interface Record {
  id: string
  date: string
  asset: string
  value: number
  previousValue?: number
  emotion: Emotion
  reason: string
  createdAt: number
}

export const emotionLabels: { [key in Emotion]: string } = {
  calm: '冷静',
  stable: '稳定',
  fomo: '恐慌',
  greedy: '贪婪',
  fearful: '恐惧',
}
