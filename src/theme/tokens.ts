export const defaultTheme = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 14,
  textColor: '#333333',
  cardBg: '#ffffff',
  cardRadius: 8,
  gap: 12,
  headerBg: '#f8f9fa',
  headerText: '#495057',
  activePillBg: '#007bff',
  activePillText: '#ffffff',
  borderColor: '#e9ecef',
  hoverBg: '#f8f9fa',
  todayBorder: '#007bff',
  stickyBg: '#ffffff',
  shadow: '0 2px 4px rgba(0,0,0,0.1)',
} as const;

export type ThemeTokens = typeof defaultTheme;
