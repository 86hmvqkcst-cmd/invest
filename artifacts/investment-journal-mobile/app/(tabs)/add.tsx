import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/useColors'
import { useRecords } from '@/context/RecordsContext'
import { emotions, translations } from '@/lib/types'
import type { Emotion } from '@/lib/types'

const emotionIcons: Record<Emotion, string> = {
  calm: '○', stable: '◇', fomo: '△', greed: '□', fear: '▽',
}

const emotionAccents: Record<Emotion, string> = {
  calm: '#60a5fa', stable: '#34d399', fomo: '#fb923c', greed: '#fbbf24', fear: '#f87171',
}

export default function AddScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const isWeb = Platform.OS === 'web'
  const { addRecord, locale } = useRecords()
  const t = translations[locale]

  const [value, setValue] = useState('')
  const [emotion, setEmotion] = useState<Emotion>('stable')
  const [note, setNote] = useState('')
  const [asset, setAsset] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [advanced, setAdvanced] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [successScale] = useState(new Animated.Value(1))

  const handleSubmit = useCallback(() => {
    if (!value || isNaN(parseFloat(value))) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    addRecord({
      date,
      asset: asset || '—',
      value: parseFloat(value),
      emotion,
      reason: note,
    })
    setValue('')
    setNote('')
    setAsset('')
    setEmotion('stable')
    setSubmitted(true)
    Animated.sequence([
      Animated.timing(successScale, { toValue: 1.06, duration: 120, useNativeDriver: true }),
      Animated.timing(successScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start()
    setTimeout(() => setSubmitted(false), 1800)
  }, [value, date, asset, emotion, note, addRecord, successScale])

  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top

  const inputStyle = [styles.input, {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.foreground,
    borderRadius: colors.radius * 0.75,
    fontFamily: 'Inter_400Regular',
  }]

  const labelStyle = [styles.label, { color: colors.mutedForeground }]

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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          {locale === 'zh' ? '快速记录' : 'Quick Record'}
        </Text>
        <TouchableOpacity
          onPress={() => setAdvanced(v => !v)}
          style={[styles.modeBtn, { backgroundColor: colors.secondary, borderRadius: 99 }]}
        >
          <Text style={[styles.modeBtnText, { color: colors.mutedForeground }]}>
            {advanced ? t.simple : t.advanced}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        {/* Value input — primary */}
        <View style={styles.field}>
          <Text style={labelStyle}>{t.value.toUpperCase()}</Text>
          <TextInput
            style={[inputStyle, styles.valueInput]}
            value={value}
            onChangeText={setValue}
            placeholder={t.valuePlaceholder}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
        </View>

        {/* Emotion picker */}
        <View style={styles.field}>
          <Text style={labelStyle}>{t.emotion.toUpperCase()}</Text>
          <View style={styles.emotionRow}>
            {emotions.map((em) => (
              <TouchableOpacity
                key={em}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setEmotion(em)
                }}
                style={[
                  styles.emotionBtn,
                  {
                    borderRadius: colors.radius * 0.5,
                    borderWidth: 1,
                    borderColor: emotion === em ? emotionAccents[em] + '60' : colors.border,
                    backgroundColor: emotion === em ? emotionAccents[em] + '15' : colors.input,
                  },
                ]}
              >
                <Text style={[styles.emotionIcon, { color: emotion === em ? emotionAccents[em] : colors.mutedForeground }]}>
                  {emotionIcons[em]}
                </Text>
                <Text style={[styles.emotionLabel, { color: emotion === em ? emotionAccents[em] : colors.mutedForeground }]}>
                  {(t as Record<string, string>)[em]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advanced fields */}
        {advanced && (
          <>
            <View style={styles.fieldRow}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={labelStyle}>{t.asset.toUpperCase()}</Text>
                <TextInput
                  style={inputStyle}
                  value={asset}
                  onChangeText={setAsset}
                  placeholder={t.assetPlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="next"
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={labelStyle}>DATE</Text>
                <TextInput
                  style={inputStyle}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={labelStyle}>{t.note.toUpperCase()}</Text>
              <TextInput
                style={[inputStyle, styles.noteInput]}
                value={note}
                onChangeText={setNote}
                placeholder={t.notePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                multiline
                returnKeyType="done"
              />
            </View>
          </>
        )}

        {/* Submit */}
        <Animated.View style={{ transform: [{ scale: successScale }] }}>
          <TouchableOpacity
            onPress={submitted ? undefined : handleSubmit}
            style={[
              styles.submitBtn,
              {
                borderRadius: colors.radius * 0.75,
                backgroundColor: submitted
                  ? colors.green + '20'
                  : colors.primary,
              },
            ]}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitText, {
              color: submitted ? colors.green : colors.primaryForeground,
              fontFamily: 'Inter_500Medium',
            }]}>
              {submitted ? (locale === 'zh' ? '已记录 ✓' : 'Recorded ✓') : t.submit}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Hint */}
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        {locale === 'zh'
          ? '每日记录，见证成长'
          : 'Record daily, witness growth'}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.5,
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  modeBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  card: {
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'Inter_500Medium',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  valueInput: {
    fontSize: 20,
    paddingVertical: 14,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  emotionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emotionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  emotionIcon: {
    fontSize: 14,
  },
  emotionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
  },
  submitBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 16,
    letterSpacing: 0.5,
  },
})
