import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated, Platform, StyleSheet,
  Text, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CONFETTI_COLORS } from '../constants/data';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Matched'> };

interface ConfettiParticle {
  left: number;
  size: number;
  color: string;
  anim: Animated.Value;
  rotateAnim: Animated.Value;
  duration: number;
  delay: number;
}

export default function MatchedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const s = STRINGS[lang].matched;
  const { width: winW, height: winH } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && winW >= 768;
  const SW = isDesktop ? 393 : winW;
  const SH = isDesktop ? 852 : winH;

  const emojiScale  = useRef(new Animated.Value(0)).current;
  const heartScale  = useRef(new Animated.Value(1)).current;

  const confetti = useMemo<ConfettiParticle[]>(() =>
    Array.from({ length: 50 }, () => ({
      left:       Math.random() * SW,
      size:       6 + Math.random() * 9,
      color:      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      anim:       new Animated.Value(0),
      rotateAnim: new Animated.Value(0),
      duration:   2000 + Math.random() * 3500,
      delay:      Math.random() * 2000,
    }))
  , []);

  useEffect(() => {
    // Emoji bounce in
    Animated.spring(emojiScale, {
      toValue: 1, useNativeDriver: true,
      tension: 50, friction: 5,
    }).start();

    // Heartbeat
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.18, duration: 750, useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1,    duration: 750, useNativeDriver: true }),
      ])
    ).start();

    // Confetti fall
    confetti.forEach(p => {
      setTimeout(() => {
        Animated.loop(
          Animated.parallel([
            Animated.timing(p.anim, {
              toValue: 1, duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.timing(p.rotateAnim, {
              toValue: 1, duration: p.duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, p.delay);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* Background — radial gradient on web, linear on native */}
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFillObject, {
          background: 'radial-gradient(ellipse at center, #1A0535 0%, #050510 70%)',
        } as any]} />
      ) : (
        <LinearGradient
          colors={['#1A0535', '#050510']}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Confetti — top offset covers phone frame top (Dynamic Island area) */}
      <View
        style={[StyleSheet.absoluteFillObject, { top: isDesktop ? -59 : 0 }]}
        pointerEvents="none"
      >
        {confetti.map((p, i) => {
          const translateY = p.anim.interpolate({
            inputRange: [0, 1], outputRange: [-20, SH + 20],
          });
          const rotate = p.rotateAnim.interpolate({
            inputRange: [0, 1], outputRange: ['0deg', '800deg'],
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 1], outputRange: [1, 0],
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                {
                  left: p.left,
                  width: p.size, height: p.size,
                  backgroundColor: p.color,
                  opacity,
                  transform: [{ translateY }, { rotate }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: emojiScale }] }]}>
          🎊
        </Animated.Text>

        {/* Avatars */}
        <View style={styles.avatars}>
          <LinearGradient colors={['#FF2D78', '#E91E8C']} style={[styles.av, styles.avMe]}>
            <Text style={styles.avEmoji}>😊</Text>
          </LinearGradient>
          <Animated.View style={[styles.heart, { transform: [{ scale: heartScale }] }]}>
            <Text style={styles.heartEmoji}>💜</Text>
          </Animated.View>
          <LinearGradient colors={['#7C3AED', '#4F46E5']} style={[styles.av, styles.avThem]}>
            <Text style={styles.avEmoji}>🧑‍🎤</Text>
          </LinearGradient>
        </View>

        <Text style={[
          styles.matchTitle,
          Platform.OS === 'web' ? {
            background: 'linear-gradient(90deg, #FF2D78, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          } as any : {},
        ]}>It's a Match!</Text>
        <Text style={styles.matchDesc}>
          {s.desc}
          <Text style={styles.matchMeta}>0.8km · 94% compatibility</Text>
        </Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.btnTxt}>{s.btnMsg}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Radar')}>
          <Text style={styles.btnGhost}>{s.btnBack}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  confetti: { position: 'absolute', borderRadius: 3 },

  content: { alignItems: 'center', paddingHorizontal: 30, zIndex: 10 },
  bigEmoji: { fontSize: 78, marginBottom: 20 },

  avatars: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  av: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: C.bg,
  },
  avMe:   { zIndex: 2, shadowColor: C.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 10 },
  avThem: { marginLeft: -22, shadowColor: C.secondary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 10 },
  avEmoji: { fontSize: 38 },

  heart: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 3, marginHorizontal: -14,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 8,
  },
  heartEmoji: { fontSize: 16 },

  matchTitle: {
    fontSize: 38, fontWeight: '900', color: C.primary,
    marginBottom: 12,
  },
  matchDesc: {
    fontSize: 15, color: C.white45, lineHeight: 24,
    textAlign: 'center', marginBottom: 30,
  },
  matchMeta: { fontSize: 13, color: C.white28 },

  btnPrimary: {
    width: '100%', backgroundColor: C.primary,
    borderRadius: 18, paddingVertical: 18,
    alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45, shadowRadius: 35, elevation: 10,
    marginBottom: 10,
  },
  btnTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnGhost: { color: C.white35, fontSize: 14, paddingVertical: 6 },
});
