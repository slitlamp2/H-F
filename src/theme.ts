/**
 * 애터미 CI 가이드(PANTONE 2995C 등)를 따른 앱 팔레트.
 * 공식 로고·전용 서체는 쓰지 않고, 공개된 브랜드 색과 메디컬 화이트 톤만 입힌다.
 */
export const colors = {
  primary: '#00B5EF',
  primaryDark: '#0094C4',
  primaryLight: '#E6F7FD',
  onPrimary: '#FFFFFF',
  background: '#F3FAFD',
  card: '#FFFFFF',
  text: '#333333',
  textMuted: '#6E6E6E',
  textSubtle: '#999DA0',
  border: '#E2EEF3',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  overlay: 'rgba(0, 37, 54, 0.42)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 20,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#00B5EF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;
