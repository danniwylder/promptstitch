export const SACRED_ICONS = {
  invocations: "fas fa-scroll",
  ilk: "fas fa-layer-group", 
  alchemy: "fas fa-flask",
  settings: "fas fa-cog",
  threads: "fas fa-history",
  sigils: "fas fa-star",
  conflux: "fas fa-infinity",
  home: "fas fa-magic",
} as const;

export const MYSTICAL_COLORS = {
  midnight: "#0B1426",
  forest: "#1A2F1A",
  etherealPink: "#FF6B9D",
  neonCyan: "#00FFFF",
  sacredGold: "#FFB347",
  mysticPurple: "#8B5CF6",
  ancientGreen: "#22C55E",
} as const;

export const SACRED_QUOTES = [
  {
    text: "Come in! Come in! The Ritual is about to begin",
    author: "Jim Morrison"
  },
  {
    text: "The most beautiful thing we can experience is the mysterious",
    author: "Albert Einstein"
  },
  {
    text: "Magic is believing in yourself, if you can do that, you can make anything happen",
    author: "Johann Wolfgang von Goethe"
  }
] as const;

export const AI_TARGETS = [
  { id: "chatgpt", name: "ChatGPT", icon: "fas fa-robot" },
  { id: "claude", name: "Claude", icon: "fas fa-brain" },
  { id: "gemini", name: "Gemini", icon: "fas fa-gem" },
  { id: "deepseek", name: "DeepSeek", icon: "fas fa-search" },
  { id: "perplexity", name: "Perplexity", icon: "fas fa-question-circle" },
  { id: "other", name: "Other", icon: "fas fa-magic" },
] as const;
