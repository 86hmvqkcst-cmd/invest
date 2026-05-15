import React, { useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/useColors'
import { useRecords } from '@/context/RecordsContext'
import { translations } from '@/lib/types'
import PetOrb from '@/components/PetOrb'

const petLevelLabels = {
  zh: ['休眠', '觉醒', '成长', '进化', '升华', '顿悟'],
  en: ['Dormant', 'Awakened', 'Growing', 'Evolving', 'Ascending', 'Transcendent'],
}

function StatCard({
  label,
  value,
  sub,
  accent,
  colors,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
  colors: ReturnType<typeof useColors>
}) {
  return (
    <View style={[styles.statCard, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: colors.radius * 0.75,
    }]}>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.statValue, { color: accent || colors.foreground }]}>{value}</Text>
      {sub ? <Text style={[styles.statSub, { color: colors.mutedForeground }]}>{sub}</Text> : null}
    </View>
  )
}

export default function HomeScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const isWeb = Platform.OS === 'web'
  const { records, locale, setLocale, todayCount, streak, petState, trendDirection, latestEmotion } = useRecords()
  const t = translations[locale]

  const toggleLocale = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }, [locale, setLocale])

  const levelLabel = petLevelLabels[locale][petState.level]

  const trendLabel = trendDirection === 'up'
    ? t.trendUp
    : trendDirection === 'down'
      ? t.trendDown
      : t.trendFlat

  const trendColor = trendDirection === 'up'
    ? colors.green
    : trendDirection === 'down'
      ? colors.red
      : colors.mutedForeground

  const emotionLabel = latestEmotion
    ? (t as Record<string, string>)[latestEmotion] || latestEmotion
    : '—'

  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 16,
          paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brand, { color: colors.mutedForeground }]}>
            INVESTMENT JOURNAL
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {locale === 'zh' ? '投资复盘 Pro' : 'Journal Pro'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleLocale}
          style={[styles.localeBtn, { backgroundColor: colors.secondary, borderRadius: colors.radius * 0.5 }]}
        >
          <Text style={[styles.localeBtnText, { color: colors.mutedForeground }]}>
            {locale === 'zh' ? 'EN' : '中文'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard cards */}
      <View style={styles.statsGrid}>
        <StatCard label={t.today} value={String(todayCount)} sub={t.records} colors={colors} />
        <StatCard
          label={t.streak}
          value={`${streak}${t.days}`}
          accent={streak >= 3 ? colors.blue : undefined}
          colors={colors}
        />
        <StatCard label={t.trend} value={trendLabel} accent={trendColor} colors={colors} />
        <StatCard label={t.mood} value={emotionLabel} colors={colors} />
      </View>

      {/* Pet section */}
      <View style={[styles.petCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <View style={styles.petHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t.companion.toUpperCase()}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: colors.secondary, borderRadius: 99 }]}>
            <Text style={[styles.levelText, { color: colors.mutedForeground }]}>
              {t.level} {petState.level}
            </Text>
          </View>
        </View>

        <View style={styles.orbContainer}>
          <PetOrb petState={petState} size={160} />
        </View>

        <Text style={[styles.petLevelName, {
          color: petState.level >= 2 ? colors.blue : petState.level === 0 ? colors.mutedForeground : colors.foreground,
        }]}>
          {levelLabel}
        </Text>

        <View style={styles.petStats}>
          <View style={[styles.petStatBox, { backgroundColor: colors.secondary, borderRadius: colors.radius * 0.5 }]}>
            <Text style={[styles.petStatLabel, { color: colors.mutedForeground }]}>{t.growth}</Text>
            <Text style={[styles.petStatValue, {
              color: petState.growthRate > 0 ? colors.green : petState.growthRate < 0 ? colors.red : colors.mutedForeground,
            }]}>
              {petState.growthRate > 0 ? '+' : ''}{petState.growthRate.toFixed(1)}%
            </Text>
          </View>
          <View style={[styles.petStatBox, { backgroundColor: colors.secondary, borderRadius: colors.radius * 0.5 }]}>
            <Text style={[styles.petStatLabel, { color: colors.mutedForeground }]}>{t.streak}</Text>
            <Text style={[styles.petStatValue, { color: streak > 0 ? colors.foreground : colors.mutedForeground }]}>
              {streak}<Text style={[styles.petStatUnit, { color: colors.mutedForeground }]}>{t.days}</Text>
            </Text>
          </View>
        </View>

        {streak >= 3 && (
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: colors.orange + '20', borderRadius: 99 }]}>
              <Text style={[styles.badgeText, { color: colors.orange }]}>
                {locale === 'zh' ? '3天连续' : '3-Day Streak'}
              </Text>
            </View>
            {streak >= 7 && (
              <View style={[styles.badge, { backgroundColor: colors.blue + '20', borderRadius: 99 }]}>
                <Text style={[styles.badgeText, { color: colors.blue }]}>
                  {locale === 'zh' ? '坚持一周' : '1 Week'}
                </Text>
              </View>
            )}
            {streak >= 30 && (
              <View style={[styles.badge, { backgroundColor: '#a855f720', borderRadius: 99 }]}>
                <Text style={[styles.badgeText, { color: '#a855f7' }]}>
                  {locale === 'zh' ? '一个月' : '1 Month'}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        {records.length} {t.records} · {locale === 'zh' ? '长期思考 · 保持理性' : 'Think long term · Stay rational'}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brand: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.5,
  },
  localeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  localeBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '44%',
    padding: 16,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.5,
  },
  statSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  petCard: {
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: 'Inter_500Medium',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  orbContainer: {
    marginVertical: 8,
  },
  petLevelName: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  petStats: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 16,
  },
  petStatBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  petStatLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  petStatValue: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
  },
  petStatUnit: {
    fontSize: 11,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
})
