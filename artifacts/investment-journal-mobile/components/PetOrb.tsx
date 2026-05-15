import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import type { PetState } from '@/lib/types'

interface PetOrbProps {
  petState: PetState
  size?: number
}

const configs = {
  0: { coreColor: '#2a2a2a', glowColor: 'rgba(60,60,60,0.15)', ringOpacity: 0, coreSize: 48, breathAmp: 0.03, breathDuration: 5000 },
  1: { coreColor: '#3b82f6', glowColor: 'rgba(59,130,246,0.18)', ringOpacity: 0.15, coreSize: 52, breathAmp: 0.04, breathDuration: 4000 },
  2: { coreColor: '#60a5fa', glowColor: 'rgba(96,165,250,0.28)', ringOpacity: 0.25, coreSize: 56, breathAmp: 0.06, breathDuration: 3500 },
  3: { coreColor: '#93c5fd', glowColor: 'rgba(147,197,253,0.38)', ringOpacity: 0.35, coreSize: 60, breathAmp: 0.08, breathDuration: 3000 },
  4: { coreColor: '#bfdbfe', glowColor: 'rgba(191,219,254,0.48)', ringOpacity: 0.45, coreSize: 64, breathAmp: 0.1, breathDuration: 2500 },
  5: { coreColor: '#ffffff', glowColor: 'rgba(219,234,254,0.55)', ringOpacity: 0.55, coreSize: 68, breathAmp: 0.12, breathDuration: 2000 },
}

function AnimatedOrb({ petState, size = 160 }: PetOrbProps) {
  const config = configs[petState.level]
  const scale = useSharedValue(1)
  const rotate = useSharedValue(0)
  const outerRotate = useSharedValue(0)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1 + config.breathAmp, { duration: config.breathDuration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
    rotate.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    )
    outerRotate.value = withRepeat(
      withTiming(-360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    )
  }, [petState.level])

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))

  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRotate.value}deg` }],
  }))

  const containerSize = size
  const glowSize = config.coreSize * 2.4
  const ringSize = config.coreSize * 1.8
  const outerRingSize = config.coreSize * 2.3

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Outer ambient glow */}
      {petState.level >= 2 && (
        <View style={[styles.glow, {
          width: glowSize * 1.4,
          height: glowSize * 1.4,
          borderRadius: glowSize * 0.7,
          backgroundColor: config.glowColor,
        }]} />
      )}

      {/* Outer ring */}
      {petState.level >= 3 && (
        <Animated.View style={[outerRingStyle, styles.ring, {
          width: outerRingSize,
          height: outerRingSize,
          borderRadius: outerRingSize / 2,
          borderColor: config.glowColor,
          opacity: config.ringOpacity * 0.7,
        }]} />
      )}

      {/* Middle ring */}
      {petState.level >= 1 && (
        <Animated.View style={[ringStyle, styles.ring, {
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderColor: config.glowColor,
          opacity: config.ringOpacity,
        }]} />
      )}

      {/* Glow halo */}
      <View style={[styles.glow, {
        width: glowSize,
        height: glowSize,
        borderRadius: glowSize / 2,
        backgroundColor: config.glowColor,
      }]} />

      {/* Core orb */}
      <Animated.View style={[coreStyle, styles.core, {
        width: config.coreSize,
        height: config.coreSize,
        borderRadius: config.coreSize / 2,
        backgroundColor: config.coreColor,
        shadowColor: config.coreColor,
        shadowOpacity: petState.level > 0 ? 0.6 : 0,
        shadowRadius: config.coreSize * 0.5,
        shadowOffset: { width: 0, height: 0 },
        elevation: petState.level * 4,
      }]}>
        {/* Inner highlight */}
        <View style={styles.highlight} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  core: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    top: '18%',
    left: '18%',
    width: '35%',
    height: '35%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
})

export default AnimatedOrb
