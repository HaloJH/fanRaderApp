import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
  View, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GROUPS } from '../constants/data';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Groups'> };

export default function GroupsScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].groups;
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 2]));

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.stepLabel}>1 / 3</Text>
      </View>

      {/* Content */}
      <View style={styles.titleWrap}>
        <Text style={styles.h1}>{s.h1}</Text>
        <Text style={styles.sub}>{s.sub}</Text>
      </View>

      <FlatList
        data={GROUPS}
        keyExtractor={(_, i) => String(i)}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const sel = selected.has(index);
          return (
            <TouchableOpacity
              style={[styles.chip, sel && styles.chipSel]}
              onPress={() => toggle(index)}
              activeOpacity={0.75}
            >
              {sel && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkTxt}>✓</Text>
                </View>
              )}
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.chipName}>{item.name}</Text>
              <Text style={styles.chipFandom}>{item.fandom}</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <Text style={styles.selCount}>
            {selected.size === 0
              ? s.empty
              : <Text><Text style={styles.selBold}>{selected.size}{s.countBoldSuffix}</Text>{s.countText}</Text>
            }
          </Text>
        }
      />

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Style')}>
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
    height: '100%',
    backgroundColor: C.primary,
    borderRadius: 2,
  },
  stepLabel: { fontSize: 12, color: C.white35, minWidth: 30 },

  titleWrap: { paddingHorizontal: 22 },
  h1: { fontSize: 27, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: C.white40, marginTop: 4, marginBottom: 20 },

  grid: { paddingHorizontal: 22, paddingBottom: 20 },
  row: { gap: 11, marginBottom: 11 },

  chip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 8,
    alignItems: 'center', position: 'relative',
  },
  chipSel: {
    backgroundColor: C.primary14,
    borderColor: C.primary,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18, shadowRadius: 22, elevation: 6,
  },
  checkBadge: {
    position: 'absolute', top: 7, right: 7,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  checkTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  emoji:     { fontSize: 28, marginBottom: 5 },
  chipName:  { fontSize: 12, fontWeight: '800', color: '#fff' },
  chipFandom:{ fontSize: 10, color: C.white35, marginTop: 2 },

  selCount: {
    fontSize: 13, color: C.white45,
    textAlign: 'center', paddingVertical: 12,
  },
  selBold: { color: C.primary, fontWeight: '700' },

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
