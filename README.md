# 📡 Fan Radar

> 근처 K-pop 팬을 찾아 연결해주는 팬 매칭 앱 데모
> A K-pop fan matching app demo — find fans near you

[![React Native](https://img.shields.io/badge/React_Native-Expo-blue)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-lightgrey)](https://expo.dev)

---

## 주요 기능 / Features

- **📡 레이더 지도** — 반경 내 K-pop 팬 실시간 탐색
- **💘 AI 매칭** — 좋아하는 아티스트·스타일 기반 팬 매칭
- **💬 채팅** — 매칭된 팬과 1:1 대화
- **🔔 알림** — 새 매칭·슈퍼라이크·근처 팬 알림
- **🌐 KO / EN 언어 전환** — 한국어/영어 실시간 전환
- **PWA 지원** — 모바일 홈 화면에 앱으로 추가 가능

---

## 기술 스택 / Tech Stack

| 항목 | 사용 기술 |
|------|-----------|
| Framework | React Native + Expo (Web / iOS / Android) |
| Language | TypeScript |
| Navigation | @react-navigation/native-stack |
| Styling | StyleSheet + expo-linear-gradient + expo-blur |
| State | React useState + Context API |
| Deployment | Vercel (PWA) |

---

## 시작하기 / Getting Started

### 사전 요구사항
- Node.js 18+
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/HaloJH/fanRaderApp.git
cd fanRaderApp

# 패키지 설치
npm install

# 웹 개발 서버 실행
npm run web

# 웹 빌드 (PWA)
npm run build:web
```

---

## 프로젝트 구조 / Project Structure

```
src/
├── components/
│   ├── BottomNav.tsx       # 하단 탭 네비게이션
│   └── Toast.tsx           # 토스트 알림
├── constants/
│   ├── colors.ts           # 컬러 팔레트
│   ├── data.ts             # 더미 데이터
│   └── strings.ts          # KO/EN 번역 문자열
├── context/
│   └── LanguageContext.tsx # 언어 전환 Context
├── navigation/
│   └── AppNavigator.tsx    # 스택 네비게이터
└── screens/
    ├── OnboardingScreen.tsx
    ├── SignUpScreen.tsx
    ├── GroupsScreen.tsx
    ├── StyleScreen.tsx
    ├── LocationScreen.tsx
    ├── RadarScreen.tsx
    ├── MatchScreen.tsx
    ├── MatchedScreen.tsx
    ├── ChatScreen.tsx
    ├── AlertsScreen.tsx
    └── ProfileScreen.tsx
```

---

## 라이선스 / License

This project is for demo/portfolio purposes only.
