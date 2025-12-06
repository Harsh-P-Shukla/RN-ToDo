export type ThemeMode = 'light' | 'dark';

export const paletteDark = {
  bg: '#050914',
  card: 'rgba(255,255,255,0.07)',
  cardBorder: 'rgba(255,255,255,0.12)',
  textPrimary: '#e7ecf5',
  textSecondary: '#9fb1d0',
  accent: '#7c3aed',
  accentSoft: '#a78bfa',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  divider: 'rgba(255,255,255,0.08)',
  glow: '#22d3ee',
  aura: 'rgba(124,58,237,0.22)',
  gradientPrimary: ['#7c3aed', '#22d3ee'],
  gradientSecondary: ['#14b8a6', '#22d3ee'],
};

export const paletteLight = {
  bg: '#f2f5ff',
  card: '#ffffff',
  cardBorder: 'rgba(15,23,42,0.12)',
  textPrimary: '#0f172a',
  textSecondary: '#4b5563',
  accent: '#7c3aed',
  accentSoft: '#5b21b6',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#d97706',
  info: '#0ea5e9',
  softBg: '#e8ecff',
  mutedCard: '#f8f9ff',
  divider: 'rgba(15,23,42,0.12)',
  glow: '#22d3ee',
  aura: 'rgba(14,165,233,0.22)',
  gradientPrimary: ['#8b5cf6', '#22d3ee'],
  gradientSecondary: ['#14b8a6', '#22d3ee'],
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 18,
  },
};

export const getTheme = (mode: ThemeMode) => ({
  palette: mode === 'light' ? paletteLight : paletteDark,
  radius,
  shadow,
});
