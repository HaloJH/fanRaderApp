import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, Easing, ScrollView, Platform,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MAP_PINS, FILTER_CHIPS } from '../constants/data';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';
import BottomNav from '../components/BottomNav';
import Toast, { useToast } from '../components/Toast';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Radar'> };

const { width: SW } = Dimensions.get('window');
const RADAR_R = Math.min(SW * 0.55, 250); // covers outermost concentric ring

export default function RadarScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { toastState, showToast } = useToast();
  const { lang } = useLang();
  const s = STRINGS[lang].radar;

  const [onlineCount, setOnlineCount] = useState(247);
  const [nearbyCount, setNearbyCount] = useState(23);
  const [activeFilter, setActiveFilter] = useState('all');

  // Radar sweep animation
  const sweepAnim = useRef(new Animated.Value(0)).current;

  // Blink dot
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for center dot
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Sonar outer ring
  const sonarAnim = useRef(new Animated.Value(0)).current;

  // Fan pin animations
  const pinScales      = useRef(MAP_PINS.map(() => new Animated.Value(0))).current;
  const pinOpacities   = useRef(MAP_PINS.map(() => new Animated.Value(0))).current;
  const pinFloats      = useRef(MAP_PINS.map(() => new Animated.Value(0))).current;
  const pinRingScales  = useRef(MAP_PINS.map(() => new Animated.Value(0.8))).current;
  const pinRingOpacs   = useRef(MAP_PINS.map(() => new Animated.Value(0.9))).current;

  useEffect(() => {
    // Initial toast
    setTimeout(() => showToast('📡', 'Fan Radar', s.initToastMsg), 800);

    // Radar sweep
    Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1, duration: 3200,
        easing: Easing.linear, useNativeDriver: false,
      })
    ).start();

    // Sonar outer ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(sonarAnim, {
          toValue: 1, duration: 2800,
          easing: Easing.out(Easing.ease), useNativeDriver: true,
        }),
        Animated.timing(sonarAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(sonarAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Center pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Pin pop-in, float, and ring pulse
    MAP_PINS.forEach((pin, i) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(pinScales[i], {
            toValue: 1, useNativeDriver: true,
            tension: 60, friction: 7,
          }),
          Animated.timing(pinOpacities[i], { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(pinFloats[i], { toValue: 1, duration: 1500 + i * 100, useNativeDriver: true }),
            Animated.timing(pinFloats[i], { toValue: 0, duration: 1500 + i * 100, useNativeDriver: true }),
          ])
        ).start();

        // Ring pulse: scale out + fade out, then reset
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(pinRingScales[i], { toValue: 1.8, duration: 2200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
              Animated.timing(pinRingOpacs[i],  { toValue: 0,   duration: 2200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(pinRingScales[i], { toValue: 0.8, duration: 0, useNativeDriver: true }),
              Animated.timing(pinRingOpacs[i],  { toValue: 0.9, duration: 0, useNativeDriver: true }),
            ]),
          ])
        ).start();
      }, pin.delay);
    });

    // Online counter fluctuation
    const counterInterval = setInterval(() => {
      setOnlineCount(c => Math.max(232, Math.min(268, c + Math.round(Math.random() * 6) - 3)));
    }, 2800);

    return () => clearInterval(counterInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sweepRotate = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const goToMatch = (emoji: string, pct: number, grp: string) => {
    showToast(emoji, `${pct}% Match!`, `${grp} ${s.fanFound}`);
    setTimeout(() => navigation.navigate('Match'), 1100);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.title}>📡 Fan Radar</Text>
          <Text style={styles.subtitle}>{s.subtitle}</Text>
        </View>
        <View style={styles.onlineBadge}>
          <Animated.View style={[styles.onlineDot, { opacity: blinkAnim }]} />
          <Text style={styles.onlineText}>{onlineCount}{s.onlineSuffix}</Text>
        </View>
      </View>

      {/* Radar Map */}
      <View style={styles.radarMap}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFillObject, {
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, #090220 0%, #050510 65%)',
          } as any]} />
        ) : (
          <LinearGradient
            colors={['#090220', '#050510']}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {/* Grid */}
        <View style={styles.grid} pointerEvents="none">
          {Array.from({ length: 24 }, (_, i) => (
            <View key={`h${i}`} style={[styles.gridLine, { top: i * 38, left: 0, right: 0, height: 1 }]} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <View key={`v${i}`} style={[styles.gridLine, { left: i * 38, top: 0, bottom: 0, width: 1 }]} />
          ))}
        </View>

        {/* Sonar outer ring */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 520, height: 520,
            borderRadius: 260,
            borderWidth: 1.5,
            borderColor: 'rgba(255,45,120,0.25)',
            marginTop: -260, marginLeft: -260,
            transform: [{
              scale: sonarAnim.interpolate({
                inputRange: [0, 1], outputRange: [0.45, 1.25],
              }),
            }],
            opacity: sonarAnim.interpolate({
              inputRange: [0, 0.25, 1], outputRange: [0.9, 0.55, 0],
            }),
          }}
        />

        {/* Concentric rings – radial mask fades rings at edges on web */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            Platform.OS === 'web' ? {
              WebkitMaskImage: 'radial-gradient(circle at center, black 22%, transparent 76%)',
              maskImage: 'radial-gradient(circle at center, black 22%, transparent 76%)',
            } as any : undefined,
          ]}
        >
          {([96, 194, 306, 430] as const).map((size, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: size, height: size,
                borderRadius: size / 2,
                borderWidth: 1,
                borderColor: `rgba(255,45,120,${[0.5, 0.28, 0.16, 0.07][i]})`,
                marginTop: -(size / 2),
                marginLeft: -(size / 2),
              }}
            />
          ))}
        </View>

        {/* Cross lines */}
        <View style={styles.crossH} pointerEvents="none" />
        <View style={styles.crossV} pointerEvents="none" />

        {/* Range labels */}
        {[
          { lbl: '500m', r: 56 },
          { lbl: '1km',  r: 105 },
          { lbl: '2km',  r: 161 },
        ].map(({ lbl, r }, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -r, transform: [{ translateX: -14 }] }}
          >
            <Text style={styles.rlabel}>{lbl}</Text>
          </View>
        ))}

        {/* Sweep */}
        <View style={styles.sweepContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.sweepInner,
              { transform: [{ rotate: sweepRotate }] },
              Platform.OS === 'web' && {
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,45,120,.28) 28deg, rgba(255,45,120,.14) 58deg, transparent 75deg)',
              } as any,
            ]}
          >
            {Platform.OS !== 'web' && (
              <LinearGradient
                colors={['rgba(255,45,120,0.28)', 'rgba(255,45,120,0.10)', 'rgba(255,45,120,0)']}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFillObject}
              />
            )}
          </Animated.View>
        </View>

        {/* Fan pins */}
        {MAP_PINS.map((pin, i) => {
          const translateY = pinFloats[i].interpolate({
            inputRange: [0, 1], outputRange: [0, -7],
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.mapPin,
                {
                  top: `${pin.topPct * 100}%`,
                  left: `${pin.leftPct * 100}%`,
                  opacity: pinOpacities[i],
                  transform: [
                    { scale: pinScales[i] },
                    { translateY },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.pinRing,
                  {
                    borderColor: pin.color,
                    transform: [{ scale: pinRingScales[i] }],
                    opacity: pinRingOpacs[i],
                  },
                ]}
              />
              <TouchableOpacity onPress={() => goToMatch(pin.emoji, pin.pct, pin.grp)}>
                <View style={[styles.pinAv, { borderColor: pin.color }]}>
                  <Text style={styles.pinEmoji}>{pin.emoji}</Text>
                  <LinearGradient
                    colors={['#FF2D78', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pinBadge}
                  >
                    <Text style={styles.pinBadgeTxt}>{pin.pct}%</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Center - Me */}
        <View style={styles.centerWrap}>
          <LinearGradient colors={['#FF2D78', '#E91E8C']} style={styles.centerDot}>
            <Text style={styles.centerEmoji}>😊</Text>
          </LinearGradient>
          <View style={styles.centerLabel}>
            <Text style={styles.centerLabelTxt}>{s.centerLabel}</Text>
          </View>
        </View>
      </View>

      {/* Bottom overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(5,5,16,0.97)']}
        style={styles.bottomOverlay}
        pointerEvents="box-none"
      >
        <Text style={styles.radarCount}>
          {s.radarCountPre}<Text style={styles.radarCountBold}>{nearbyCount}</Text>{s.radarCountSuf}
        </Text>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip.key}
              style={[styles.fchip, activeFilter === chip.key && styles.fchipOn]}
              onPress={() => {
                setActiveFilter(chip.key);
                setNearbyCount(Math.floor(Math.random() * 22) + 8);
              }}
            >
              <Text style={[styles.fchipTxt, activeFilter === chip.key && styles.fchipTxtOn]}>
                {chip.key === 'all' ? s.filterAll : chip.key === 'concert' ? s.filterConcert : chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <BottomNav
        active="Radar"
        onNavigate={s => navigation.navigate(s)}
        onNotification={() => navigation.navigate('Alerts')}
        onProfile={() => navigation.navigate('Profile')}
      />

      <Toast {...toastState} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingBottom: 14,
    position: 'relative', zIndex: 10,
  },
  title:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: C.white40, marginTop: 2 },

  onlineBadge: {
    backgroundColor: C.green13,
    borderWidth: 1, borderColor: C.green30,
    borderRadius: 20, paddingVertical: 7, paddingHorizontal: 13,
    flexDirection: 'row', alignItems: 'center', gap: 7,
  },
  onlineDot:  { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green },
  onlineText: { fontSize: 12, color: C.green, fontWeight: '700' },

  radarMap: { flex: 1, position: 'relative', overflow: 'hidden', marginBottom: 84 },

  grid: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,45,120,0.035)',
  },

  crossH: {
    position: 'absolute', top: '50%', left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(255,45,120,0.08)',
  },
  crossV: {
    position: 'absolute', left: '50%', top: 0, bottom: 0,
    width: 1, backgroundColor: 'rgba(255,45,120,0.08)',
  },

  rlabelWrap: {
    position: 'absolute', left: '50%',
    transform: [{ translateX: -12 }],
  },
  rlabel: {
    fontSize: 9, color: 'rgba(255,45,120,0.4)', fontWeight: '700',
  },

  sweepContainer: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: RADAR_R * 2, height: RADAR_R * 2,
    marginTop: -RADAR_R, marginLeft: -RADAR_R,
    borderRadius: RADAR_R,
    overflow: 'hidden',
  },
  sweepInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADAR_R,
  },

  mapPin: { position: 'absolute', zIndex: 20 },
  pinAv: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2.5, backgroundColor: C.bgItem,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.55, shadowRadius: 18, elevation: 8,
  },
  pinRing: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: C.primary,
    top: -7, left: -7,
  },
  pinEmoji: { fontSize: 22 },
  pinBadge: {
    position: 'absolute', bottom: -5,
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 10, minWidth: 30, alignItems: 'center',
    left: '50%', transform: [{ translateX: -15 }],
    overflow: 'hidden',
  },
  pinBadgeTxt: { color: '#fff', fontSize: 9, fontWeight: '900' },

  centerWrap: {
    position: 'absolute', top: '50%', left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    alignItems: 'center', zIndex: 15,
  },
  centerDot: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65, shadowRadius: 32, elevation: 12,
  },
  centerEmoji: { fontSize: 22 },
  centerLabel: {
    marginTop: 7,
    backgroundColor: C.primary15,
    paddingHorizontal: 9, paddingVertical: 2,
    borderRadius: 10,
  },
  centerLabelTxt: { fontSize: 10, color: C.primary, fontWeight: '800' },

  bottomOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: 14, paddingHorizontal: 18, paddingBottom: 96,
    zIndex: 30,
  },
  radarCount: {
    textAlign: 'center', fontSize: 14, color: C.white55,
    marginBottom: 10,
  },
  radarCountBold: { color: C.primary, fontSize: 18, fontWeight: '700' },
  filterRow: { gap: 8, paddingBottom: 2 },
  fchip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: C.white14,
  },
  fchipOn: {
    backgroundColor: C.primary18,
    borderColor: C.primary,
  },
  fchipTxt:   { fontSize: 13, fontWeight: '700', color: C.white },
  fchipTxtOn: { color: C.primary },
});
