export const GROUPS = [
  { emoji: '💜', name: 'BTS',        fandom: 'ARMY'    },
  { emoji: '🌸', name: 'BLACKPINK',  fandom: 'BLINK'   },
  { emoji: '⚡', name: 'aespa',      fandom: 'MY'      },
  { emoji: '🐣', name: 'NewJeans',   fandom: 'Bunnies' },
  { emoji: '🍭', name: 'TWICE',      fandom: 'ONCE'    },
  { emoji: '🦋', name: 'SEVENTEEN',  fandom: 'CARAT'   },
  { emoji: '🔥', name: 'Stray Kids', fandom: 'STAY'    },
  { emoji: '🌙', name: 'IVE',        fandom: 'DIVE'    },
  { emoji: '✨', name: 'ILLIT',       fandom: 'LLIT'    },
] as const;

export interface MapPin {
  emoji: string;
  topPct: number;   // 0-1
  leftPct: number;  // 0-1
  pct: number;
  grp: string;
  color: string;
  delay: number;
}

export const MAP_PINS: MapPin[] = [
  { emoji: '👩',   topPct: 0.26, leftPct: 0.20, pct: 94, grp: 'BTS',       color: '#FF2D78', delay: 700  },
  { emoji: '🧑‍🎤',  topPct: 0.16, leftPct: 0.57, pct: 87, grp: 'aespa',     color: '#7C3AED', delay: 1300 },
  { emoji: '👩‍🦱',  topPct: 0.60, leftPct: 0.17, pct: 76, grp: 'BLACKPINK', color: '#FF2D78', delay: 1900 },
  { emoji: '🧑',   topPct: 0.70, leftPct: 0.60, pct: 91, grp: 'BTS',       color: '#FF2D78', delay: 1000 },
  { emoji: '👩‍🦰',  topPct: 0.40, leftPct: 0.74, pct: 82, grp: 'NewJeans',  color: '#00D4FF', delay: 1600 },
  { emoji: '👦',   topPct: 0.33, leftPct: 0.38, pct: 79, grp: 'TWICE',     color: '#FF6B35', delay: 2200 },
  { emoji: '👧',   topPct: 0.53, leftPct: 0.44, pct: 88, grp: 'IVE',       color: '#7C3AED', delay: 800  },
];

export const FAN_STYLES = [
  { emoji: '🎪', name: 'Concert Goer',   desc: '공연·팬미팅 같이 갈 동반자를 찾아요 🎫' },
  { emoji: '📱', name: 'Digital Fan',    desc: '온라인 응원, 스트리밍, 투표 함께해요'    },
  { emoji: '🃏', name: 'Merch Collector',desc: '포카 교환, 굿즈 공동구매 같이 해요'      },
  { emoji: '☕', name: 'Casual Listener', desc: '가볍게 K-pop 얘기 나눌 친구 원해요'     },
] as const;

export const AUTO_REPLIES = [
  '완전 좋아요! 🎉',
  '저도 그 생각 하고 있었어요!',
  '진짜요?? 대박 😆',
  '🎵 좋아요! 언제 시간 돼요?',
  '헐 너무 좋다!! 설레ㅠㅠ',
  '오 그거 저도 관심 있어요!',
] as const;

export const CONFETTI_COLORS = [
  '#FF2D78', '#7C3AED', '#FFD700', '#00D4FF', '#FF6B35', '#00DC78',
] as const;

export const FILTER_CHIPS = [
  { label: '🎵 전체',      key: 'all'      },
  { label: '💜 BTS',       key: 'bts'      },
  { label: '🌸 BLACKPINK', key: 'bp'       },
  { label: '⚡ aespa',     key: 'aespa'    },
  { label: '🐣 NewJeans',  key: 'nj'       },
  { label: '🎪 콘서트 동행', key: 'concert' },
] as const;
