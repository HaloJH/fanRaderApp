import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';
import { C } from '../constants/colors';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'> };

export default function ProfileScreen({ navigation }: Props) {
  const { lang, toggle } = useLang();
  const s = STRINGS[lang].profile;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.subtitle}>{s.subtitle}</Text>
      </View>

      {/* Avatar + profile info */}
      <View style={styles.profileSection}>
        <LinearGradient
          colors={['#FF2D78', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarEmoji}>😊</Text>
        </LinearGradient>
        <Text style={styles.name}>My Fan</Text>
        <Text style={styles.fandom}>💜 BTS ARMY · aespa MY</Text>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        {/* Language toggle */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{s.lang}</Text>
          <View style={styles.langToggle}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'ko' && styles.langBtnActive]}
              onPress={() => lang !== 'ko' && toggle()}
            >
              <Text style={[styles.langBtnTxt, lang === 'ko' && styles.langBtnTxtActive]}>한국어</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
              onPress={() => lang !== 'en' && toggle()}
            >
              <Text style={[styles.langBtnTxt, lang === 'en' && styles.langBtnTxtActive]}>English</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Notifications */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{s.notif}</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: C.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.divider} />

        {/* Location */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{s.location}</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: C.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Version */}
      <Text style={styles.version}>{s.version}</Text>

      <BottomNav
        active="profile"
        onNavigate={screen => navigation.navigate(screen)}
        onNotification={() => navigation.navigate('Alerts')}
        onProfile={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 22, paddingTop: 14, paddingBottom: 14,
  },
  title:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5, lineHeight: 32 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 18 },

  profileSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35, shadowRadius: 30, elevation: 10,
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 6 },
  fandom: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },

  section: {
    marginHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20, paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 16,
  },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#fff', lineHeight: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  langToggle: {
    flexDirection: 'row', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10, padding: 3,
  },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  langBtnActive: { backgroundColor: C.primary },
  langBtnTxt: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.4)', lineHeight: 18 },
  langBtnTxtActive: { color: '#fff' },

  version: {
    textAlign: 'center', marginTop: 32, marginBottom: 100,
    fontSize: 12, color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
});
