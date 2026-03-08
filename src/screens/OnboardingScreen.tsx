import React, { useEffect, useRef } from 'react';
import {
  Animated, Platform, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Onboard'> };

const MINI_RINGS = [
  { size: 56,  delay: 0,    color: 'rgba(255,45,120,0.9)'  },
  { size: 110, delay: 400,  color: 'rgba(255,45,120,0.55)' },
  { size: 170, delay: 800,  color: 'rgba(255,45,120,0.3)'  },
  { size: 240, delay: 1200, color: 'rgba(255,45,120,0.12)' },
];

const FAN_PINS = [
  { emoji: '👩',   top: '24%', left: '10%', badge: 'ARMY',  color: C.primary,   delay: 100  },
  { emoji: '🧑‍🎤',  top: '10%', right:'16%', badge: '94%',   color: C.secondary, delay: 700  },
  { emoji: '👩‍🦱',  bottom:'20%',left:'18%', badge: undefined,color: C.accent,   delay: 400  },
  { emoji: '👨',   bottom:'16%',right:'12%',badge: '87%',   color: C.primary,   delay: 1000 },
  { emoji: '👩‍🦰',  top: '48%', right: '6%',badge: undefined,color: C.secondary, delay: 300  },
] as const;

export default function OnboardingScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].onboarding;

  const ringOpacities = useRef(MINI_RINGS.map(() => new Animated.Value(0))).current;
  const ringScales    = useRef(MINI_RINGS.map(() => new Animated.Value(0.85))).current;
  const pulseAnim     = useRef(new Animated.Value(0)).current;
  const floatAnims    = useRef(FAN_PINS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    MINI_RINGS.forEach((ring, i) => {
      const loop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(ringOpacities[i], { toValue: 1, duration: 1120, useNativeDriver: true }),
            Animated.timing(ringOpacities[i], { toValue: 0, duration: 1680, useNativeDriver: true }),
          ]),
          Animated.timing(ringScales[i], { toValue: 1.04, duration: 2800, useNativeDriver: true }),
        ])
      );
      setTimeout(() => loop.start(), ring.delay);
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    floatAnims.forEach((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      );
      setTimeout(() => loop.start(), FAN_PINS[i].delay);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pinShadow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 40],
  });

  return (
    <View style={styles.container}>
      {/* Hero radar area */}
      <View style={styles.hero}>
        {Platform.OS === 'web' ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, {
              background: 'radial-gradient(ellipse 130% 90% at 50% 45%, #120338 0%, #050510 65%)',
            } as any]}
          />
        ) : (
          <LinearGradient
            colors={['#120338', '#050510']}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.radarWrap}>
          {/* Mini rings */}
          {MINI_RINGS.map((ring, i) => (
            <Animated.View
              key={i}
              style={[
                styles.miniRing,
                {
                  width: ring.size, height: ring.size,
                  borderRadius: ring.size / 2,
                  borderColor: ring.color,
                  marginTop: -(ring.size / 2),
                  marginLeft: -(ring.size / 2),
                  opacity: ringOpacities[i],
                  transform: [{ scale: ringScales[i] }],
                },
              ]}
            />
          ))}

          {/* Fan pins */}
          {FAN_PINS.map((pin, i) => {
            const translateY = floatAnims[i].interpolate({
              inputRange: [0, 1], outputRange: [0, -7],
            });
            return (
              <Animated.View
                key={i}
                style={[styles.fanPin, pin as any, { transform: [{ translateY }] }]}
              >
                <TouchableOpacity onPress={() => navigation.navigate('Match')}>
                  <View style={[styles.pinAv, { borderColor: pin.color }]}>
                    <Text style={styles.pinEmoji}>{pin.emoji}</Text>
                    {pin.badge && (
                      <LinearGradient
                        colors={['#FF2D78', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.pinBadge}
                      >
                        <Text style={styles.pinBadgeTxt}>{pin.badge}</Text>
                      </LinearGradient>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Me pin */}
          <Animated.View style={[styles.mePin, { shadowRadius: pinShadow }]}>
            <LinearGradient
              colors={['#FF2D78', '#E91E8C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <Text style={styles.mePinEmoji}>📍</Text>
          </Animated.View>
        </View>
      </View>

      {/* Bottom CTA */}
      <LinearGradient
        colors={['transparent', '#050510']}
        style={styles.bottom}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.45 }}
      >
        <View style={styles.obTag}>
          <Text style={styles.obTagTxt}>{s.tag}</Text>
        </View>
        <Text style={styles.obTitle}>
          {s.title1}
          <Text style={[styles.obTitleGrad, Platform.OS === 'web' && {
            background: 'linear-gradient(90deg, #FF2D78 0%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          } as any]}>{s.titleHighlight}</Text>
          {s.title2}
        </Text>
        <Text style={styles.obDesc}>{s.desc}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.85}>
          <LinearGradient
            colors={['#FF2D78', '#D91E6A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryTxt}>{s.btnStart}</Text>
            <LinearGradient
              colors={['rgba(255,255,255,0.12)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.btnGhost}>{s.btnSignIn}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  hero: { flex: 1, position: 'relative', overflow: 'hidden' },
  radarWrap: {
    position: 'absolute',
    width: 300, height: 300,
    top: '50%', left: '50%',
    marginTop: -162, marginLeft: -150,
    alignItems: 'center', justifyContent: 'center',
  },
  miniRing: {
    position: 'absolute',
    top: '50%', left: '50%',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.6)',
  },
  fanPin: { position: 'absolute' },
  pinAv: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2.5, backgroundColor: C.bgItemLight,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 8,
  },
  pinEmoji: { fontSize: 22 },
  pinBadge: {
    position: 'absolute', bottom: -5,
    left: '50%', transform: [{ translateX: -16 }],
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 10, minWidth: 32, alignItems: 'center',
    overflow: 'hidden',
  },
  pinBadgeTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },
  mePin: {
    width: 46, height: 46, borderRadius: 23,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF2D78',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 12,
    zIndex: 5,
  },
  mePinEmoji: { fontSize: 22 },

  bottom: {
    paddingTop: 28,
    paddingHorizontal: 26,
    paddingBottom: 38,
  },
  obTag: {
    backgroundColor: C.primary13,
    borderWidth: 1, borderColor: 'rgba(255,45,120,0.3)',
    borderRadius: 20, alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 14,
  },
  obTagTxt: { color: C.primary, fontSize: 12, fontWeight: '700' },
  obTitle: {
    fontSize: 34, fontWeight: '900', color: '#fff',
    lineHeight: 40, letterSpacing: -0.5, marginBottom: 12,
  },
  obTitleGrad: { color: C.primary },
  obDesc: {
    fontSize: 15, color: C.white45,
    lineHeight: 24.75, marginBottom: 28,
  },
  btnPrimary: {
    borderRadius: 18, paddingVertical: 18,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 35,
    elevation: 10,
    marginBottom: 10,
  },
  btnPrimaryTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnGhost: {
    textAlign: 'center', color: C.white35,
    fontSize: 14, paddingVertical: 6,
  },
});
