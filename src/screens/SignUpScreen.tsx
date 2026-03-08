import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'> };

export default function SignUpScreen({ navigation }: Props) {
  const { lang } = useLang();
  const s = STRINGS[lang].signUp;
  const next = () => navigation.navigate('Groups');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <View style={styles.stepTag}>
          <Text style={styles.stepTagTxt}>Step 1 of 3</Text>
        </View>

        <Text style={styles.h1}>{s.h1}</Text>
        <Text style={styles.sub}>{s.sub}</Text>

        <View style={styles.promo}>
          <Text style={styles.promoTitle}>{s.promoTitle}</Text>
          <Text style={styles.promoSub}>{s.promoSub}</Text>
        </View>

        <SocialButton emoji="🍎" label={s.apple}  onPress={next} />
        <SocialButton emoji="🔵" label={s.google} onPress={next} />

        <View style={styles.divider}>
          <View style={styles.divLine} />
          <Text style={styles.divText}>{s.or}</Text>
          <View style={styles.divLine} />
        </View>

        <SocialButton emoji="📧" label={s.email} onPress={next} />

        <View style={{ flex: 1 }} />
        <Text style={styles.terms}>
          {s.terms}<Text style={styles.underline}>{s.tos}</Text>{s.termsAnd}
          <Text style={styles.underline}>{s.pp}</Text>{s.termsEnd}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SocialButton({ emoji, label, onPress }: { emoji: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.socialEmoji}>{emoji}</Text>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28 },

  stepTag: {
    backgroundColor: C.primary14,
    borderWidth: 1, borderColor: 'rgba(255,45,120,0.3)',
    borderRadius: 20, alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16,
  },
  stepTagTxt: { color: C.primary, fontSize: 12, fontWeight: '700' },

  h1: { fontSize: 27, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  sub: { fontSize: 15, color: C.white40, marginTop: 6, marginBottom: 28 },

  promo: {
    backgroundColor: C.primary08,
    borderWidth: 1, borderColor: 'rgba(255,45,120,0.2)',
    borderRadius: 18, padding: 15, marginBottom: 24,
  },
  promoTitle: { fontSize: 13, fontWeight: '800', color: C.primary, marginBottom: 3 },
  promoSub: { fontSize: 13, color: C.white45 },

  socialBtn: {
    backgroundColor: C.white06,
    borderWidth: 1.5, borderColor: C.white10,
    borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, marginTop: 12,
  },
  socialEmoji: { fontSize: 22 },
  socialLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },

  divider: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginVertical: 22,
  },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  divText: { fontSize: 12, color: C.white25 },

  terms: {
    textAlign: 'center', fontSize: 12,
    color: C.white25, marginTop: 20,
  },
  underline: { textDecorationLine: 'underline' },
});
