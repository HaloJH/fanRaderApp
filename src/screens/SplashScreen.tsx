import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'> };

const RINGS = [
  { size: 90,  delay: 0    },
  { size: 180, delay: 500  },
  { size: 290, delay: 1000 },
  { size: 420, delay: 1500 },
  { size: 570, delay: 2000 },
];

export default function SplashScreen({ navigation }: Props) {
  const ringOpacities = useRef(RINGS.map(() => new Animated.Value(0))).current;
  const ringScales    = useRef(RINGS.map(() => new Animated.Value(0.85))).current;
  const dotOpacities  = useRef([0, 1, 2].map(() => new Animated.Value(0.2))).current;
  const dotScales     = useRef([0, 1, 2].map(() => new Animated.Value(0.7))).current;

  useEffect(() => {
    // Ring animations – staggered loop
    RINGS.forEach((ring, i) => {
      const loop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(ringOpacities[i], { toValue: 1, duration: 1400, useNativeDriver: true }),
            Animated.timing(ringOpacities[i], { toValue: 0, duration: 2100, useNativeDriver: true }),
          ]),
          Animated.timing(ringScales[i], { toValue: 1.04, duration: 3500, useNativeDriver: true }),
        ])
      );
      setTimeout(() => loop.start(), ring.delay);
    });

    // Loading dot bounce
    dotOpacities.forEach((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }),
            Animated.timing(dotScales[i], { toValue: 1, duration: 280, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(anim, { toValue: 0.2, duration: 560, useNativeDriver: true }),
            Animated.timing(dotScales[i], { toValue: 0.7, duration: 560, useNativeDriver: true }),
          ]),
        ])
      );
      setTimeout(() => loop.start(), i * 200);
    });

    const timer = setTimeout(() => navigation.replace('Onboard'), 2400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient colors={['#0C0425', '#050510']} style={styles.container}>
      {RINGS.map((ring, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              width:  ring.size,
              height: ring.size,
              borderRadius: ring.size / 2,
              opacity: ringOpacities[i],
              transform: [{ scale: ringScales[i] }],
            },
          ]}
        />
      ))}

      <View style={styles.content}>
        <LinearGradient colors={['#FF2D78', '#7C3AED']} style={styles.logo}>
          <Text style={styles.logoEmoji}>📡</Text>
        </LinearGradient>
        <Text style={styles.title}>Fan Radar</Text>
        <Text style={styles.subtitle}>K-pop · Connect · IRL</Text>

        <View style={styles.dots}>
          {dotOpacities.map((opacity, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, { opacity, transform: [{ scale: dotScales[i] }] }]}
            />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.5)',
  },
  content: { alignItems: 'center', zIndex: 10 },
  logo: {
    width: 88, height: 88, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#FF2D78',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },
  logoEmoji: { fontSize: 42 },
  title:    { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  subtitle: {
    fontSize: 12, color: 'rgba(255,255,255,0.4)',
    marginTop: 10, letterSpacing: 3,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 30 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: C.primary,
  },
});
