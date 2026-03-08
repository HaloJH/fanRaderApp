import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FAN_STYLES } from '../constants/data';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Style'> };

export default function StyleScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].style;
  const [selected, setSelected] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
        <Text style={styles.stepLabel}>2 / 3</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{s.h1}</Text>
        <Text style={styles.sub}>{s.sub}</Text>

        {FAN_STYLES.map((style, i) => {
          const sel = selected === i;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, sel && styles.optionSel]}
              onPress={() => setSelected(i)}
              activeOpacity={0.75}
            >
              <View style={[styles.optIcon, sel && styles.optIconSel]}>
                <Text style={styles.optEmoji}>{style.emoji}</Text>
              </View>
              <View style={styles.optInfo}>
                <Text style={styles.optName}>{style.name}</Text>
                <Text style={styles.optDesc}>{s.fanStyleDescs[i]}</Text>
              </View>
              <View style={[styles.radio, sel && styles.radioSel]}>
                {sel && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Location')}>
          <Text style={styles.btnTxt}>{s.next}</Text>
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

  scroll: { flex: 1, paddingHorizontal: 22 },
  h1: { fontSize: 27, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: C.white40, marginTop: 4, marginBottom: 26 },

  option: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 11,
  },
  optionSel: {
    backgroundColor: C.primary10, borderColor: C.primary,
  },
  optIcon: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: C.primary13,
    alignItems: 'center', justifyContent: 'center',
  },
  optIconSel: { backgroundColor: C.primary22 },
  optEmoji: { fontSize: 26 },
  optInfo: { flex: 1 },
  optName: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 3 },
  optDesc: { fontSize: 13, color: C.white40, lineHeight: 18 },

  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSel: {
    borderColor: C.primary,
    backgroundColor: C.primary20,
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: C.primary,
  },

  bottomAction: {
    paddingHorizontal: 22, paddingBottom: 38, paddingTop: 14,
    backgroundColor: C.bg,
  },
  btnPrimary: {
    backgroundColor: C.primary, borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45, shadowRadius: 35, elevation: 10,
  },
  btnTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
