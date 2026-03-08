import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { C } from '../constants/colors';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../constants/strings';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'> };

interface Message {
  id: string;
  text: string;
  type: 'rcv' | 'snt';
  time: string;
}

function getNowTime(timePeriod: string) {
  const d = new Date();
  return `${timePeriod} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ChatScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const s = STRINGS[lang].chat;

  const [messages, setMessages] = useState<Message[]>(() =>
    s.initMsgs.map((m, i) => ({ ...m, id: String(i + 1) }))
  );
  const [suggests, setSuggests] = useState([s.suggestConcert, s.suggestPoka, s.suggestMeet]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const addMessage = (text: string, type: 'snt' | 'rcv') => {
    const msg: Message = { id: Date.now().toString(), text, type, time: getNowTime(s.timePeriod) };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMsg = () => {
    const txt = input.trim();
    if (!txt) return;
    setInput('');
    addMessage(txt, 'snt');
    setTimeout(() => {
      const replies = s.autoReplies;
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addMessage(reply, 'rcv');
    }, 1000 + Math.random() * 600);
  };

  const sendSuggest = (text: string) => {
    setSuggests(prev => prev.filter(sg => sg !== text));
    addMessage(text, 'snt');
    setTimeout(() => addMessage(s.autoReply, 'rcv'), 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgWrap, item.type === 'snt' ? styles.msgRight : styles.msgLeft]}>
      {item.type === 'snt' ? (
        <LinearGradient
          colors={['#FF2D78', '#E91E8C']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleSnt]}
        >
          <Text style={styles.bubbleTxt}>{item.text}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleRcv]}>
          <Text style={styles.bubbleTxt}>{item.text}</Text>
        </View>
      )}
      <Text style={[styles.msgTime, item.type === 'snt' && { textAlign: 'right' }]}>
        {item.time}
      </Text>
    </View>
  );

  const matchIntro = (
    <View style={styles.matchIntro}>
      <Text style={styles.miTitle}>{s.matchIntroTitle}</Text>
      <Text style={styles.miSub}>{s.matchIntroSub}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.chatAv}
        >
          <Text style={styles.chatAvEmoji}>🧑‍🎤</Text>
          <View style={styles.onlineDot} />
        </LinearGradient>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>Sophie K.</Text>
          <Text style={styles.chatMeta}>💜 BTS, aespa · UCLA · 0.8km</Text>
        </View>
        <View style={styles.chatBtns}>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnEmoji}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnEmoji}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({
          ios: undefined,
          android: 'height',
          default: undefined,
        })}
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: 0,
        })}
      >
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            ListHeaderComponent={matchIntro}
            contentContainerStyle={styles.msgList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
          />

          <View style={styles.inputArea}>
            {suggests.length > 0 && (
              <ScrollView
                horizontal
                style={styles.suggestsScroll}
                contentContainerStyle={styles.suggests}
                showsHorizontalScrollIndicator={false}
              >
                {suggests.map(sg => (
                  <TouchableOpacity key={sg} style={styles.suggestChip} onPress={() => sendSuggest(sg)}>
                    <Text style={styles.suggestTxt}>{sg}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={[
              styles.inputRow,
              {
                paddingBottom: isKeyboardVisible ? 12 : Math.max(insets.bottom + 16, 28),
              },
            ]}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={s.placeholder}
                placeholderTextColor="rgba(255,255,255,0.28)"
                onSubmitEditing={sendMsg}
                returnKeyType="send"
                inputMode="text"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={sendMsg}>
                <LinearGradient
                  colors={['#FF2D78', '#E91E8C']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.sendBtn}
                >
                  <Text style={styles.sendEmoji}>➤</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 13, paddingHorizontal: 18, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: C.bg,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18 },
  chatAv: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  chatAvEmoji: { fontSize: 24 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 6.5,
    backgroundColor: '#22C55E',
    borderWidth: 2.5, borderColor: C.bg,
  },
  chatInfo: { flex: 1, minWidth: 0 },
  chatName: { fontSize: 17, fontWeight: '800', color: '#fff' },
  chatMeta: { fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 },
  chatBtns: { flexDirection: 'row', gap: 9 },
  chatBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  chatBtnEmoji: { fontSize: 17 },

  msgList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 11 },

  matchIntro: {
    backgroundColor: 'rgba(255,45,120,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,45,120,0.2)',
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16,
    alignItems: 'center', marginBottom: 2,
  },
  miTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 3 },
  miSub: { fontSize: 12, color: 'rgba(255,255,255,0.38)' },

  msgWrap: { maxWidth: '76%', gap: 4 },
  msgLeft:  { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20 },
  bubbleRcv: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderBottomLeftRadius: 6,
  },
  bubbleSnt: { borderBottomRightRadius: 6 },
  bubbleTxt: { fontSize: 15, color: '#fff', lineHeight: 22 },
  msgTime: { fontSize: 11, color: 'rgba(255,255,255,0.28)', paddingHorizontal: 4 },

  inputArea: { backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  suggestsScroll: { flexGrow: 0 },
  suggests: { gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
  suggestChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  suggestTxt: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 9, paddingHorizontal: 14, paddingTop: 10,
  },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24, paddingHorizontal: 18,
    paddingVertical: 12, color: '#fff', fontSize: 15,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  sendEmoji: { fontSize: 18, color: '#fff' },
});
