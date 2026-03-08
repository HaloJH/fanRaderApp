import 'react-native-gesture-handler';
import React from 'react';
import { Platform, useWindowDimensions, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';

const PHONE_W = 393;
const PHONE_H = 852;

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  return (
    <LanguageProvider>
      {isDesktop ? (
        <View style={styles.desktop}>
          {/* 배경 글로우 */}
          <View style={styles.glow} pointerEvents="none" />

          {/* 폰 프레임 */}
          <View style={styles.phoneFrame}>
            {/* 다이나믹 아일랜드 */}
            <View style={styles.dynamicIslandWrap} pointerEvents="none">
              <View style={styles.dynamicIsland} />
            </View>

            {/* 앱 콘텐츠 */}
            <View style={styles.phoneScreen}>
              <StatusBar style="light" />
              <AppNavigator />
            </View>

            {/* 홈 인디케이터 */}
            <View style={styles.homeIndicatorWrap}>
              <View style={styles.homeIndicator} />
            </View>
          </View>

          {/* 하단 레이블 + 데모 네비게이션 */}
          <Text style={styles.demoLabel}>DEMO NAVIGATION</Text>
          <View style={styles.demoNav}>
            {([
              { label: '🚀 온보딩',      screen: 'Onboard' },
              { label: '💜 그룹 선택',   screen: 'Groups'  },
              { label: '📡 레이더 지도', screen: 'Radar'   },
              { label: '💘 AI 매칭',     screen: 'Match'   },
              { label: '🔔 알림',        screen: 'Alerts'  },
              { label: '💬 채팅',        screen: 'Chat'    },
              { label: '👤 프로필',      screen: 'Profile' },
            ] as const).map(({ label, screen }) => (
              <TouchableOpacity
                key={screen}
                style={styles.demoBtn}
                onPress={() => navigationRef.isReady() && navigationRef.navigate(screen)}
              >
                <Text style={styles.demoBtnTxt}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
          <StatusBar style="light" />
          <AppNavigator />
        </>
      )}
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    backgroundColor: '#08081a',
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  glow: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      background: 'radial-gradient(ellipse at center, rgba(255,45,120,0.12) 0%, transparent 70%)',
    } : {}),
  } as any,
  phoneFrame: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: 50,
    backgroundColor: '#050510',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 60px rgba(255,45,120,0.04)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 40 },
      shadowOpacity: 0.7,
      shadowRadius: 60,
      elevation: 30,
    }),
    position: 'relative',
  } as any,
  dynamicIslandWrap: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  dynamicIsland: {
    width: 126,
    height: 37,
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  phoneScreen: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 48,
    paddingTop: 59,
  } as any,
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  demoLabel: {
    marginTop: 24,
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '500',
  },
  demoNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    maxWidth: 500,
  },
  demoBtn: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  demoBtnTxt: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
  },
});
