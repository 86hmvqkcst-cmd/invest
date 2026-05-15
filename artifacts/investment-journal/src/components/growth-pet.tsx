import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import type { PetState } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface GrowthPetProps {
  petState: PetState
  streak: number
  isDark?: boolean
  locale?: Locale
}

const petConfigs = {
  0: {
    coreColor: '#3a3a3a',
    glowColor: 'rgba(80,80,80,0.12)',
    ringColor: 'rgba(80,80,80,0.06)',
    outerRingColor: 'rgba(80,80,80,0.03)',
    coreSize: 48,
    glowSize: 80,
    rings: 0,
    breathScale: [1, 0.96, 1],
    breathDuration: 5,
    particleOpacity: 0,
  },
  1: {
    coreColor: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.15)',
    ringColor: 'rgba(96,165,250,0.08)',
    outerRingColor: 'rgba(96,165,250,0.04)',
    coreSize: 52,
    glowSize: 88,
    rings: 1,
    breathScale: [1, 1.04, 1],
    breathDuration: 4,
    particleOpacity: 0,
  },
  2: {
    coreColor: '#93c5fd',
    glowColor: 'rgba(147,197,253,0.22)',
    ringColor: 'rgba(147,197,253,0.12)',
    outerRingColor: 'rgba(147,197,253,0.06)',
    coreSize: 56,
    glowSize: 96,
    rings: 1,
    breathScale: [1, 1.06, 1],
    breathDuration: 3.5,
    particleOpacity: 0.3,
  },
  3: {
    coreColor: '#bfdbfe',
    glowColor: 'rgba(96,165,250,0.35)',
    ringColor: 'rgba(96,165,250,0.18)',
    outerRingColor: 'rgba(96,165,250,0.08)',
    coreSize: 60,
    glowSize: 108,
    rings: 2,
    breathScale: [1, 1.08, 1],
    breathDuration: 3,
    particleOpacity: 0.5,
  },
  4: {
    coreColor: '#e0f2fe',
    glowColor: 'rgba(56,189,248,0.45)',
    ringColor: 'rgba(56,189,248,0.22)',
    outerRingColor: 'rgba(56,189,248,0.1)',
    coreSize: 64,
    glowSize: 120,
    rings: 3,
    breathScale: [1, 1.1, 1],
    breathDuration: 2.5,
    particleOpacity: 0.7,
  },
  5: {
    coreColor: '#ffffff',
    glowColor: 'rgba(186,230,253,0.55)',
    ringColor: 'rgba(186,230,253,0.28)',
    outerRingColor: 'rgba(186,230,253,0.12)',
    coreSize: 68,
    glowSize: 136,
    rings: 3,
    breathScale: [1, 1.12, 1],
    breathDuration: 2,
    particleOpacity: 1,
  },
}

function PetOrb({ petState, isDark }: { petState: PetState; isDark: boolean }) {
  const config = petConfigs[petState.level]
  const controls = useAnimationControls()

  useEffect(() => {
    controls.start({
      scale: config.breathScale,
      transition: {
        duration: config.breathDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    })
  }, [petState.level, controls, config.breathScale, config.breathDuration])

  const shakeAnimation = !petState.isPositive && petState.level === 0
    ? { x: [0, -3, 3, -3, 3, 0] }
    : {}

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outermost ambient glow */}
      {petState.level >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{ duration: config.breathDuration * 1.3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full"
          style={{
            width: config.glowSize * 1.8,
            height: config.glowSize * 1.8,
            background: `radial-gradient(circle, ${config.outerRingColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Outer ring */}
      {config.rings >= 3 && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border"
          style={{
            width: config.glowSize * 1.5,
            height: config.glowSize * 1.5,
            borderColor: config.ringColor,
            borderWidth: 1,
          }}
        />
      )}

      {/* Middle ring */}
      {config.rings >= 2 && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border"
          style={{
            width: config.glowSize * 1.25,
            height: config.glowSize * 1.25,
            borderColor: config.ringColor,
            borderWidth: 1,
          }}
        />
      )}

      {/* Inner ring */}
      {config.rings >= 1 && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border"
          style={{
            width: config.glowSize,
            height: config.glowSize,
            borderColor: config.ringColor,
            borderWidth: 1,
          }}
        />
      )}

      {/* Glow halo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: config.breathDuration, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full"
        style={{
          width: config.coreSize * 2.2,
          height: config.coreSize * 2.2,
          background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Core orb */}
      <motion.div
        animate={controls}
        initial={shakeAnimation as never}
        className="relative z-10 rounded-full"
        style={{
          width: config.coreSize,
          height: config.coreSize,
          background: petState.level === 0
            ? `radial-gradient(circle at 35% 35%, #555, #222)`
            : `radial-gradient(circle at 35% 35%, ${config.coreColor}, ${config.glowColor.replace('0.', '0.0').replace(', 0.', ', 0.0')})`,
          boxShadow: petState.level > 0
            ? `0 0 ${config.coreSize * 0.6}px ${config.glowColor}, 0 0 ${config.coreSize * 1.2}px ${config.ringColor}`
            : 'none',
        }}
      >
        {/* Core inner highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '40%',
            top: '18%',
            left: '18%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Floating particles (level 2+) */}
      {petState.level >= 2 && (
        <>
          {[...Array(petState.level + 1)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                background: config.coreColor,
                opacity: config.particleOpacity * 0.6,
              }}
              animate={{
                x: [0, Math.cos(i * 72 * Math.PI / 180) * (config.coreSize * 0.8), 0],
                y: [0, Math.sin(i * 72 * Math.PI / 180) * (config.coreSize * 0.8), 0],
                opacity: [0, config.particleOpacity * 0.7, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

export function GrowthPet({ petState, streak, isDark = true, locale = 'zh' }: GrowthPetProps) {
  const t = translations[locale]

  const levelLabels = [
    t.petLevel0, t.petLevel1, t.petLevel2,
    t.petLevel3, t.petLevel4, t.petLevel5,
  ]

  const statusLabels = [
    t.petStatusDormant, t.petStatusBase, t.petStatusGrowing,
    t.petStatusEvolving, t.petStatusAdvanced, t.petStatusPeak,
  ]

  const config = petConfigs[petState.level]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative flex flex-col items-center overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl ${
        isDark
          ? 'border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.02]'
          : 'border-black/[0.08] bg-white/70'
      }`}
    >
      {/* Background ambient glow tied to pet level */}
      {petState.level >= 1 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${config.glowColor.replace(/[\d.]+\)$/, '0.08)')} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Header */}
      <div className="relative z-10 mb-2 flex w-full items-center justify-between">
        <span className={`text-[10px] font-medium uppercase tracking-[0.25em] ${
          isDark ? 'text-white/30' : 'text-black/30'
        }`}>{t.growthCompanion}</span>
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
          isDark ? 'bg-white/[0.05] text-white/50' : 'bg-black/[0.05] text-black/50'
        }`}>
          <span className="opacity-60">{t.petLevelLabel}</span>
          <span>{petState.level}</span>
        </div>
      </div>

      {/* Pet orb */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <PetOrb petState={petState} isDark={isDark} />
      </div>

      {/* Level name */}
      <motion.div
        key={petState.level}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        <p className={`text-base font-light tracking-wider ${
          petState.level === 0
            ? isDark ? 'text-white/30' : 'text-black/30'
            : isDark ? 'text-white/80' : 'text-black/80'
        }`}
          style={petState.level >= 2 ? { color: config.coreColor } : undefined}
        >
          {levelLabels[petState.level]}
        </p>
        <p className={`mt-1.5 text-[11px] ${isDark ? 'text-white/30' : 'text-black/35'}`}>
          {statusLabels[petState.level]}
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="relative z-10 mt-5 flex w-full gap-3">
        {/* Growth rate */}
        <div className={`flex-1 rounded-2xl p-3 text-center ${
          isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
        }`}>
          <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-white/25' : 'text-black/30'}`}>
            {t.petGrowthRate}
          </p>
          <p className={`mt-1.5 text-sm font-light ${
            petState.growthRate > 0 ? 'text-emerald-400' : petState.growthRate < 0 ? 'text-red-400' : isDark ? 'text-white/50' : 'text-black/50'
          }`}>
            {petState.growthRate > 0 ? '+' : ''}{petState.growthRate.toFixed(1)}%
          </p>
        </div>

        {/* Streak */}
        <div className={`flex-1 rounded-2xl p-3 text-center ${
          isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
        }`}>
          <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-white/25' : 'text-black/30'}`}>
            {t.streak}
          </p>
          <p className={`mt-1.5 text-sm font-light ${streak > 0 ? (isDark ? 'text-white/80' : 'text-black/80') : (isDark ? 'text-white/30' : 'text-black/30')}`}>
            {streak}<span className="text-[10px] ml-0.5 opacity-60">{t.streakDays}</span>
          </p>
        </div>
      </div>

      {/* Achievement badges */}
      {streak >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 mt-4 w-full"
        >
          <div className={`flex flex-wrap gap-1.5`}>
            {streak >= 3 && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                isDark ? 'bg-orange-500/10 text-orange-400/80' : 'bg-orange-100 text-orange-600'
              }`}>{t.achievementStreak3}</span>
            )}
            {streak >= 7 && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                isDark ? 'bg-blue-500/10 text-blue-400/80' : 'bg-blue-100 text-blue-600'
              }`}>{t.achievementStreak7}</span>
            )}
            {streak >= 30 && (
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                isDark ? 'bg-purple-500/10 text-purple-400/80' : 'bg-purple-100 text-purple-600'
              }`}>{t.achievementStreak30}</span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
