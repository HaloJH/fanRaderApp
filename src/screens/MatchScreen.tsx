import React, { useRef } from 'react';
import {
  Animated, PanResponder, Platform, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import BottomNav from '../components/BottomNav';
import Toast, { useToast } from '../components/Toast';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Match'> };

export default function MatchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { toastState, showToast } = useToast();
  const { lang } = useLang();
  const s = STRINGS[lang].match;

  const pan = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const cardRotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-22deg', '0deg', '22deg'],
  });
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, 80, 160], outputRange: [0, 0.8, 1],
  });
  const passOpacity = pan.x.interpolate({
    inputRange: [-160, -80, 0], outputRange: [1, 0.8, 0],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > 80)       likeCard();
        else if (dx < -80) passCard();
        else resetCard();
      },
    })
  ).current;

  const likeCard = () => {
    Animated.parallel([
      Animated.timing(pan.x, { toValue: 400, duration: 420, useNativeDriver: false }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start(() => {
      navigation.navigate('Matched');
      pan.setValue({ x: 0, y: 0 });
      cardOpacity.setValue(1);
    });
  };

  const passCard = () => {
    Animated.parallel([
      Animated.timing(pan.x, { toValue: -400, duration: 420, useNativeDriver: false }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start(() => {
      showToast('👋', s.passTitle, s.passMsg);
      pan.setValue({ x: 0, y: 0 });
      cardOpacity.setValue(1);
    });
  };

  const resetCard = () => {
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  };

  const superLike = () => showToast('⭐', s.superTitle, s.superMsg);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.subtitle}>{s.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsEmoji}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {/* Shadow cards */}
        <View style={styles.cardShadow2} />
        <View style={styles.cardShadow1} />

        {/* Main swipeable card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate: cardRotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Card background gradient */}
          <LinearGradient
            colors={['#0F0F24', '#130A28']}
            start={{ x: 0.65, y: 0 }} end={{ x: 0.35, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Card glows */}
          <View style={[styles.cardGlow1, Platform.OS === 'web' ? { filter: 'blur(70px)' } as any : undefined]} />
          <View style={[styles.cardGlow2, Platform.OS === 'web' ? { filter: 'blur(60px)' } as any : undefined]} />

          {/* Match score */}
          <LinearGradient colors={['#FF2D78', '#FF6835']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.matchScore}>
            <Text style={styles.scoreNum}>94%</Text>
            <Text style={styles.scoreLbl}>MATCH</Text>
          </LinearGradient>

          {/* Avatar */}
          <LinearGradient colors={['#FF2D78', '#7C3AED']} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑‍🎤</Text>
          </LinearGradient>

          <Text style={styles.cardName}>Sophie K.</Text>
          <Text style={styles.cardMeta}>{s.cardMeta}</Text>

          {/* Badges */}
          <View style={styles.badges}>
            <View style={[styles.badge, styles.badgeDist]}>
              <Text style={[styles.badgeTxt, { color: '#67E8F9' }]}>📍 0.8km</Text>
            </View>
            <View style={[styles.badge, styles.badgeStyle]}>
              <Text style={[styles.badgeTxt, { color: '#FF88B0' }]}>🎪 Concert Goer</Text>
            </View>
          </View>

          {/* Interests */}
          <View style={styles.interests}>
            <Text style={styles.interestTitle}>{s.interestTitle}</Text>
            <View style={styles.tags}>
              {[
                { label: '💜 BTS',  color: '#FF88B0', bg: C.primary14, border: C.primary28 },
                { label: '⚡ aespa', color: '#FF88B0', bg: C.primary14, border: C.primary28 },
                { label: s.tagConcert,      color: '#67E8F9', bg: C.accent10, border: C.accent20 },
                { label: s.tagPokaExchange, color: '#A78BFA', bg: C.secondary14, border: C.secondary28 },
                { label: s.tagFancam,       color: '#67E8F9', bg: C.accent10, border: C.accent20 },
              ].map((tag, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: tag.bg, borderColor: tag.border }]}>
                  <Text style={[styles.tagTxt, { color: tag.color }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Like / Pass overlays */}
          <Animated.View style={[styles.overlay, styles.overlayLike, { opacity: likeOpacity }]}>
            <Text style={styles.overlayTxt}>LIKE 💜</Text>
          </Animated.View>
          <Animated.View style={[styles.overlay, styles.overlayPass, { opacity: passOpacity }]}>
            <Text style={styles.overlayTxt}>PASS ✕</Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Swipe hint */}
      <Text style={styles.swipeHint}>{s.swipeHint}</Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={passCard}>
          <Text style={[styles.actionEmoji, { fontSize: 26 }]}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={likeCard}>
          <LinearGradient
            colors={['#FF2D78', '#E91E8C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.actionBtn, styles.likeBtn]}
          >
            <Text style={[styles.actionEmoji, { fontSize: 32 }]}>💜</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.superBtn]} onPress={superLike}>
          <Text style={[styles.actionEmoji, { fontSize: 26 }]}>⭐</Text>
        </TouchableOpacity>
      </View>

      <BottomNav
        active="Match"
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
    paddingHorizontal: 22, paddingBottom: 16,
  },
  title:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: C.white35, marginTop: 2 },
  settingsBtn: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: C.white07,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsEmoji: { fontSize: 20 },

  cardStack: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 18,
  },
  cardShadow2: {
    position: 'absolute',
    width: '83%', height: 460,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    transform: [{ translateY: 18 }, { scaleX: 0.93 }, { scaleY: 0.93 }],
  },
  cardShadow1: {
    position: 'absolute',
    width: '87%', height: 460,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    transform: [{ translateY: 9 }, { scaleX: 0.965 }, { scaleY: 0.965 }],
  },
  card: {
    width: '90%', height: 460,
    borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.65, shadowRadius: 65, elevation: 20,
    position: 'relative',
  },
  cardGlow1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.secondary,
    top: -60, right: -50,
    opacity: 0.35,
  },
  cardGlow2: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: C.primary,
    bottom: -40, left: -40,
    opacity: 0.2,
  },
  matchScore: {
    position: 'absolute', top: 18, right: 18,
    borderRadius: 16, paddingVertical: 10, paddingHorizontal: 15,
    alignItems: 'center', zIndex: 5,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 22, elevation: 8,
  },
  scoreNum: { fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 30 },
  scoreLbl: {
    fontSize: 9, color: 'rgba(255,255,255,0.75)', fontWeight: '700',
    letterSpacing: 1.5, marginTop: 2,
  },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginTop: 36, marginBottom: 14,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 44,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.14)',
    elevation: 10,
  },
  avatarEmoji: { fontSize: 48 },
  cardName: { textAlign: 'center', fontSize: 22, fontWeight: '900', color: '#fff', paddingHorizontal: 18 },
  cardMeta: { textAlign: 'center', fontSize: 13, color: C.white40, marginTop: 4 },

  badges: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 10 },
  badge: {
    paddingVertical: 5, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center',
  },
  badgeDist:  { backgroundColor: C.accent12, borderColor: C.accent28 },
  badgeStyle: { backgroundColor: C.primary12, borderColor: C.primary28 },
  badgeTxt: { fontSize: 12, fontWeight: '700' },

  interests: { marginHorizontal: 18, marginTop: 18 },
  interestTitle: {
    fontSize: 10, color: C.white28, fontWeight: '800',
    letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1,
  },
  tagTxt: { fontSize: 12, fontWeight: '700' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
  },
  overlayLike: {
    backgroundColor: 'rgba(0,200,100,0.18)',
    borderWidth: 3, borderColor: 'rgba(0,200,100,0.55)',
  },
  overlayPass: {
    backgroundColor: 'rgba(255,50,50,0.18)',
    borderWidth: 3, borderColor: 'rgba(255,50,50,0.5)',
  },
  overlayTxt: {
    fontSize: 38, fontWeight: '900', color: '#fff',
    letterSpacing: 5,
    transform: [{ rotate: '-14deg' }],
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },

  swipeHint: {
    textAlign: 'center', fontSize: 12, color: C.white25,
    marginTop: 4, paddingHorizontal: 22,
  },
  actions: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 18, paddingTop: 16, paddingBottom: 100, paddingHorizontal: 22,
  },
  actionBtn: {
    borderRadius: 999, alignItems: 'center', justifyContent: 'center',
  },
  passBtn: {
    width: 62, height: 62,
    backgroundColor: C.white07,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
  },
  likeBtn: {
    width: 76, height: 76,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55, shadowRadius: 35, elevation: 10,
  },
  superBtn: {
    width: 62, height: 62,
    backgroundColor: C.secondary20,
    borderWidth: 1.5, borderColor: C.secondary40,
  },
  actionEmoji: { fontSize: 28 },
});
