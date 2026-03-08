import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type ActiveTab = 'Radar' | 'Match' | 'notif' | 'Chat' | 'profile';

interface BottomNavProps {
  active: ActiveTab;
  onNavigate: (screen: 'Radar' | 'Match' | 'Chat') => void;
  onNotification: () => void;
  onProfile: () => void;
}

export default function BottomNav({ active, onNavigate, onNotification, onProfile }: BottomNavProps) {
  const { lang } = useLang();
  const n = STRINGS[lang].nav;

  const tabs = [
    { key: 'Radar'   as const, icon: '📡', label: n.radar },
    { key: 'Match'   as const, icon: '💘', label: n.match },
    { key: 'notif'   as const, icon: '🔔', label: n.notif },
    { key: 'Chat'    as const, icon: '💬', label: n.chat  },
    { key: 'profile' as const, icon: '👤', label: n.me    },
  ];

  const handlePress = (key: typeof tabs[number]['key']) => {
    if (key === 'notif') { onNotification(); return; }
    if (key === 'profile') { onProfile(); return; }
    onNavigate(key as 'Radar' | 'Match' | 'Chat');
  };

  return (
    <View style={styles.container}>
      {/* 배경색을 CSS와 동일하게 맞추기 위해 View로 감싸거나 BlurView 설정 */}
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
      
      {tabs.map(tab => {
        const isOn = tab.key === active;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => handlePress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.icon,
              // 웹과 네이티브 스타일 분기 처리 개선
              Platform.select({
                web: isOn ? styles.webIconOn : styles.webIconOff,
                default: isOn ? styles.iconOn : styles.iconOff
              })
            ]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isOn && styles.labelOn]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 84,
    backgroundColor: 'rgba(6,6,18,0.96)', // CSS의 background 적용
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 18,
    paddingHorizontal: 8,
    zIndex: 50,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  icon: { 
    fontSize: 24,
    textAlign: 'center',
  },
  // 네이티브용 스타일
  iconOff: { 
    opacity: 0.35,
  },
  iconOn: { 
    opacity: 1, 
    transform: [{ scale: 1.1 }] 
  },
  // 웹 전용 필터 스타일 (애니메이션 포함)
  webIconOff: {
    ...Platform.select({
      web: {
        filter: 'grayscale(1) opacity(0.35)',
        transition: 'all 0.2s',
      } as any
    })
  },
  webIconOn: {
    ...Platform.select({
      web: {
        filter: 'none',
        transform: 'scale(1.1)',
        transition: 'all 0.2s',
      } as any
    })
  },
  label: { 
    fontSize: 10, 
    color: 'rgba(255,255,255,0.28)', 
    fontWeight: '700' 
  },
  labelOn: { 
    color: '#FF2D78' 
  },
});
