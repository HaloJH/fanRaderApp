import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Location'> };

const RANGES = [
  { icon: '🏫', label: 'School Range',  val: '0.5km' },
  { icon: '🏘️',  label: 'Neighborhood', val: '2km'   },
  { icon: '🏙️',  label: 'City Wide',    val: '10km'  },
];

export default function LocationScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].location;
  const start = () => navigation.navigate('Radar');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.stepLabel}>3 / 3</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.locIcon}>
          <Text style={styles.locEmoji}>📍</Text>
        </View>
        <Text style={styles.h1}>{s.h1}</Text>
        <Text style={styles.desc}>
          {s.desc1}
          <Text style={styles.highlight}>{s.descHighlight}</Text>
          {s.desc2}
        </Text>

        {/* Range table */}
        <View style={styles.table}>
          {RANGES.map((r, i) => (
            <View key={i} style={[styles.row, i < RANGES.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{r.icon} {r.label}</Text>
              <Text style={styles.rowVal}>{r.val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.btnPrimary} onPress={start}>
          <Text style={styles.btnTxt}>{s.allow}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={start}>
          <Text style={styles.btnGhost}>{s.skip}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 16,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: C.white08,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18 },
  progressBar: {
    flex: 1, height: 4,
    backgroundColor: C.white10, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: C.primary, borderRadius: 2,
  },
  stepLabel: { fontSize: 12, color: C.white35, minWidth: 30 },

  hero: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32,
  },
  locIcon: {
    width: 104, height: 104, borderRadius: 32,
    backgroundColor: C.primary10,
    borderWidth: 2, borderColor: 'rgba(255,45,120,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18, shadowRadius: 50, elevation: 10,
  },
  locEmoji: { fontSize: 52 },
  h1: {
    fontSize: 27, fontWeight: '900', color: '#fff',
    letterSpacing: -0.5, textAlign: 'center',
  },
  desc: {
    fontSize: 15, color: C.white45, lineHeight: 26,
    marginVertical: 12, marginBottom: 28, textAlign: 'center',
  },
  highlight: { color: C.primary, fontWeight: '700' },

  table: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, paddingHorizontal: 20, width: '100%',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 9,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowLabel: { fontSize: 14, color: C.white55 },
  rowVal:   { fontSize: 13, fontWeight: '800', color: C.primary },

  bottomAction: {
    paddingHorizontal: 22, paddingBottom: 38, paddingTop: 14,
  },
  btnPrimary: {
    backgroundColor: C.primary, borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45, shadowRadius: 35, elevation: 10,
    marginBottom: 10,
  },
  btnTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnGhost: {
    textAlign: 'center', color: C.white35,
    fontSize: 14, paddingVertical: 6,
  },
});
