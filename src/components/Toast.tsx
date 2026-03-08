import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { C } from '../constants/colors';

interface ToastProps {
  emoji: string;
  title: string;
  desc: string;
  visible: boolean;
}

export default function Toast({ emoji, title, desc, visible }: ToastProps) {
  const translateY = useRef(new Animated.Value(-18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -18, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible && !emoji) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.container}>
        <Text style={styles.ico}>{emoji}</Text>
        <Text style={styles.txt}>
          {title} <Text style={styles.small}>{desc}</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

export function useToast() {
  const [state, setState] = React.useState<{
    emoji: string; title: string; desc: string; visible: boolean;
  }>({ emoji: '', title: '', desc: '', visible: false });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (emoji: string, title: string, desc: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ emoji, title, desc, visible: true });
    timerRef.current = setTimeout(() => {
      setState(s => ({ ...s, visible: false }));
    }, 2600);
  };

  return { toastState: state, showToast };
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    backgroundColor: 'rgba(12,12,26,0.97)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.3)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 20,
  },
  ico: { fontSize: 20 },
  txt: { fontSize: 13, color: C.white, fontWeight: '700', flex: 1 },
  small: { color: C.white45, fontWeight: '400' },
});
