import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/useColors'
import { useRecords } from '@/context/RecordsContext'
import { translations } from '@/lib/types'
import type { Record as JournalRecord, Emotion } from '@/lib/types'
import { Feather } from '@expo/vector-icons'

function RecordItem({ item, onDelete, locale, colors }: {
  item: JournalRecord
  onDelete: (id: string) => void
  locale: string
  colors: ReturnType<typeof useColors>
}) {
  const t = translations[locale as 'zh' | 'en']
  const emotionAccents: { [key in Emotion]: string } = {
    calm: colors.blue, stable: colors.green, fomo: colors.orange, greed: colors.amber, fear: colors.red,
  }
  const accentColor = emotionAccents[item.emotion]
  const emotionLabel = (t as Record<string, string>)[item.emotion] || item.emotion

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(
      locale === 'zh' ? '删除记录' : 'Delete Record',
      locale === 'zh' ? '确认删除这条记录？' : 'Delete this record?',
      [
        { text: locale === 'zh' ? '取消' : 'Cancel', style: 'cancel' },
        { text: locale === 'zh' ? '删除' : 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
      ]
    )
  }

  return (
    <View style={[styles.recordItem, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: colors.radius * 0.75,
    }]}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.recordContent}>
        <View style={styles.recordTop}>
          <View style={styles.recordLeft}>
            {item.asset && item.asset !== '—' && (
              <Text style={[styles.assetName, { color: colors.foreground }]}>
                {item.asset}
              </Text>
            )}
            <View style={[styles.emotionTag, {
              backgroundColor: accentColor + '18',
              borderRadius: 99,
            }]}>
              <Text style={[styles.emotionTagText, { color: accentColor }]}>
                {emotionLabel}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="trash-2" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={styles.recordBottom}>
          <Text style={[styles.recordValue, { color: colors.foreground }]}>
            {item.value.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.recordDate, { color: colors.mutedForeground }]}>
            {new Date(item.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {item.reason ? (
          <Text style={[styles.recordNote, { color: colors.mutedForeground }]} numberOfLines={1}>
            {item.reason}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

export default function JournalScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const isWeb = Platform.OS === 'web'
  const { records, deleteRecord, locale } = useRecords()
  const t = translations[locale]

  const sorted = [...records].sort((a, b) => b.createdAt - a.createdAt)
  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        scrollEnabled={!!sorted.length}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: topPad + 16,
            paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100,
          },
        ]}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={[styles.pageTitle, { color: colors.foreground }]}>
              {locale === 'zh' ? '投资日志' : 'Journal'}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.secondary, borderRadius: 99 }]}>
              <Text style={[styles.countText, { color: colors.mutedForeground }]}>
                {records.length}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={32} color={colors.mutedForeground} style={{ opacity: 0.4 }} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              {t.noRecords}
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              {t.startJourney}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <RecordItem
            item={item}
            onDelete={deleteRecord}
            locale={locale}
            colors={colors}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {},
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  recordItem: {
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    opacity: 0.7,
  },
  recordContent: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  recordTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  assetName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  emotionTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  emotionTagText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  recordBottom: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  recordValue: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.5,
  },
  recordDate: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  recordNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    opacity: 0.6,
  },
})
