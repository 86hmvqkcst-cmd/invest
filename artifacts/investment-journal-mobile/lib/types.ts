export type Emotion = 'calm' | 'stable' | 'fomo' | 'greed' | 'fear'
export type Locale = 'zh' | 'en'
export type PetLevel = 0 | 1 | 2 | 3 | 4 | 5

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
    if (dates.has(key)) streak++
    else break
  }
  return streak
}

export const translations = {
  zh: {
    home: '概览',
    add: '记录',
    journal: '日志',
    today: '今日',
    streak: '连续',
    trend: '趋势',
    mood: '情绪',
    companion: '成长伙伴',
    level: '等级',
    growth: '成长率',
    records: '条记录',
    noRecords: '暂无记录',
    startJourney: '开始你的投资记录',
    value: '金额',
    valuePlaceholder: '输入金额',
    emotion: '情绪',
    note: '备注',
    notePlaceholder: '简要备注...',
    asset: '资产',
    assetPlaceholder: '如 BTC、NASDAQ',
    submit: '记录',
    advanced: '详细',
    simple: '简洁',
    recorded: '已记录',
    delete: '删除',
    petLevel0: '休眠',
    petLevel1: '觉醒',
    petLevel2: '成长',
    petLevel3: '进化',
    petLevel4: '升华',
    petLevel5: '顿悟',
    calm: '冷静',
    stable: '稳定',
    fomo: '恐慌',
    greed: '贪婪',
    fear: '恐惧',
    trendUp: '上升',
    trendDown: '下降',
    trendFlat: '平稳',
    streakLabel: '天连续',
    days: '天',
  },
  en: {
    home: 'Home',
    add: 'Add',
    journal: 'Journal',
    today: 'Today',
    streak: 'Streak',
    trend: 'Trend',
    mood: 'Mood',
    companion: 'Companion',
    level: 'Level',
    growth: 'Growth',
    records: 'records',
    noRecords: 'No records yet',
    startJourney: 'Start your journal',
    value: 'Value',
    valuePlaceholder: 'Enter amount',
    emotion: 'Emotion',
    note: 'Note',
    notePlaceholder: 'Brief note...',
    asset: 'Asset',
    assetPlaceholder: 'e.g. BTC, NASDAQ',
    submit: 'Record',
    advanced: 'Advanced',
    simple: 'Simple',
    recorded: 'Recorded',
    delete: 'Delete',
    petLevel0: 'Dormant',
    petLevel1: 'Awakened',
    petLevel2: 'Growing',
    petLevel3: 'Evolving',
    petLevel4: 'Ascending',
    petLevel5: 'Transcendent',
    calm: 'Calm',
    stable: 'Stable',
    fomo: 'FOMO',
    greed: 'Greed',
    fear: 'Fear',
    trendUp: 'Rising',
    trendDown: 'Falling',
    trendFlat: 'Stable',
    streakLabel: 'd streak',
    days: 'd',
  },
}
