import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';
import BottomNav from '../components/BottomNav';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Alerts'> };

const BADGE_COLORS: Record<string, [string, string]> = {
  '💘': ['#FF2D78', '#E91E8C'],
  '⭐': ['#F59E0B', '#D97706'],
  '📡': ['#7C3AED', '#4F46E5'],
  '💬': ['#0EA5E9', '#0284C7'],
  '🎤': ['#10B981', '#059669'],
};

export default function AlertsScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].alerts;

  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(s.items.flatMap((item, i) => item.read ? [String(i)] : []))
  );

  const markAllRead = () => setReadIds(new Set(s.items.map((_, i) => String(i))));
  const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]));

  const items = s.items.map((item, i) => ({ ...item, id: String(i), read: readIds.has(String(i)) }));
  const unreadCount = items.filter(it => !it.read).length;

  const renderItem = ({ item }: { item: typeof items[number] }) => {
    const colors = BADGE_COLORS[item.icon] ?? ['#7C3AED', '#4F46E5'];
    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        activeOpacity={0.75}
        onPress={() => markRead(item.id)}
      >
        {!item.read && <View style={styles.unreadBar} />}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.iconWrap}
        >
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </LinearGradient>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={[styles.badgeWrap, { borderColor: colors[0] + '55' }]}>
              <Text style={[styles.badgeTxt, { color: colors[0] }]}>{item.badge}</Text>
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.body}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.subtitle}>{s.subtitle}</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markBtn} onPress={markAllRead}>
            <Text style={styles.markBtnTxt}>{s.markRead}</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>{s.empty}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav
        active="notif"
        onNavigate={screen => navigation.navigate(screen)}
        onNotification={() => {}}
        onProfile={() => navigation.navigate('Profile')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 22, paddingTop: 14, paddingBottom: 14,
  },
  title:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5, lineHeight: 32 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 18 },
  markBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  markBtnTxt: { fontSize: 12, fontWeight: '700', color: C.primary },

  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100, gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18, padding: 14, overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: 'rgba(255,45,120,0.06)',
    borderColor: 'rgba(255,45,120,0.15)',
  },
  unreadBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: C.primary, borderRadius: 3,
  },

  iconWrap: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  iconEmoji: { fontSize: 22 },

  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badgeWrap: {
    borderWidth: 1, borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  badgeTxt: { fontSize: 10, fontWeight: '700' },
  timeText: { fontSize: 11, color: 'rgba(255,255,255,0.28)' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.6)', lineHeight: 19 },
  cardTitleUnread: { color: '#fff', fontWeight: '700' },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 17 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
});
