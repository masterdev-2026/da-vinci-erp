export const theme = {
  brand: {
    blue900: "#0A2540",
    blue700: "#1D4ED8",
    blue500: "#3B82F6",
    red700: "#DC2626",
    red500: "#EF4444",
    red400: "#F87171",
    navy950: "#020617",
    slate900: "#0F172A",
    slate800: "#172033",
    white: "#FFFFFF",
  },

  gradients: {
    hero: "linear-gradient(135deg, #020617 0%, #0A2540 38%, #1D4ED8 72%, #DC2626 100%)",
    sidebarActive: "linear-gradient(135deg, #1D4ED8 0%, #DC2626 100%)",
    cardGlow: "linear-gradient(135deg, rgba(29,78,216,0.14) 0%, rgba(220,38,38,0.10) 100%)",
    subtle: "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.45) 100%)",
  },

  chart: {
    revenue: "#1D4ED8",
    expense: "#DC2626",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
  },

  status: {
    success: {
      bg: "rgba(16,185,129,0.12)",
      text: "#10B981",
      border: "rgba(16,185,129,0.24)",
    },
    danger: {
      bg: "rgba(220,38,38,0.12)",
      text: "#DC2626",
      border: "rgba(220,38,38,0.24)",
    },
    warning: {
      bg: "rgba(245,158,11,0.12)",
      text: "#F59E0B",
      border: "rgba(245,158,11,0.24)",
    },
    info: {
      bg: "rgba(29,78,216,0.12)",
      text: "#1D4ED8",
      border: "rgba(29,78,216,0.24)",
    },
  },

  shadow: {
    soft: "0 20px 60px -28px rgba(15,23,42,0.28)",
    blue: "0 24px 80px -28px rgba(29,78,216,0.35)",
    red: "0 24px 80px -28px rgba(220,38,38,0.28)",
    hero: "0 30px 90px -34px rgba(29,78,216,0.35)",
  },

  radius: {
    sm: "12px",
    md: "16px",
    lg: "22px",
    xl: "28px",
  },
} as const

export type AppTheme = typeof theme