import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Record, Locale, PetState } from '@/lib/types'
import { computePetState, computeStreak } from '@/lib/types'

const STORAGE_KEY = 'investment-journal-records'
const LOCALE_KEY = 'investment-journal-locale'

interface RecordsContextValue {
  records: Record[]
  locale: Locale
  setLocale: (l: Locale) => void
  addRecord: (r: Omit<Record, 'id' | 'createdAt'>) => void
  deleteRecord: (id: string) => void
  todayCount: number
  streak: number
  petState: PetState
  trendDirection: 'up' | 'down' | 'flat'
  latestEmotion: string | undefined
}

const RecordsContext = createContext<RecordsContextValue | null>(null)

export function RecordsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<Record[]>([])
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [storedRecords, storedLocale] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(LOCALE_KEY),
        ])
        if (storedRecords) setRecords(JSON.parse(storedRecords))
        if (storedLocale === 'en' || storedLocale === 'zh') setLocaleState(storedLocale)
      } catch {}
      setLoaded(true)
    }
    load()
  }, [])

  useEffect(() => {
    if (!loaded) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records, loaded])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    AsyncStorage.setItem(LOCALE_KEY, l)
  }, [])

  const addRecord = useCallback((r: Omit<Record, 'id' | 'createdAt'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setRecords(prev => [...prev, { ...r, id, createdAt: Date.now() }])
  }, [])

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [])

  const todayCount = useMemo(() => {
    const today = new Date().toDateString()
    return records.filter(r => new Date(r.date).toDateString() === today).length
  }, [records])

  const streak = useMemo(() => computeStreak(records), [records])
  const petState = useMemo(() => computePetState(records), [records])

  const latestEmotion = useMemo(() => {
    return [...records].sort((a, b) => b.createdAt - a.createdAt)[0]?.emotion
  }, [records])

  const trendDirection = useMemo((): 'up' | 'down' | 'flat' => {
    if (records.length < 2) return 'flat'
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const diff = sorted[sorted.length - 1].value - sorted[0].value
    return diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  }, [records])

  return (
    <RecordsContext.Provider value={{
      records, locale, setLocale,
      addRecord, deleteRecord,
      todayCount, streak, petState, trendDirection, latestEmotion,
    }}>
      {children}
    </RecordsContext.Provider>
  )
}

export function useRecords() {
  const ctx = useContext(RecordsContext)
  if (!ctx) throw new Error('useRecords must be used inside RecordsProvider')
  return ctx
}
