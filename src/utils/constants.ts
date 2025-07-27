// utils/constants.ts

export const TIMER_CONFIG = {
  newPairs: {
    min: 5,   
    max: 30,
  },
  finalStretch: {
    min: 4 * 3600, 
    max: 12 * 3600,
  },
  migrated: {
    min: 5 * 60,  
    max: 35 * 60,
  },
} as const;

export const WEBSOCKET_CONFIG = {
  updateInterval: 3000,      
  timerInterval: 1000,        
  reconnectDelay: 2000,       
  maxReconnectAttempts: 5,   
  messageTimeout: 5000,     
} as const;

export const TOKEN_LIMITS = {
  maxPerCategory: 20,         
  initialLoadCount: 8,        
} as const;

export const COLORS = {
  positive: 'text-green-400',
  negative: 'text-red-400',
  neutral: 'text-gray-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
  urgent: 'text-orange-400',
} as const;

export const BG_COLORS = {
  positive: 'bg-green-500/10',
  negative: 'bg-red-500/10',
  neutral: 'bg-gray-500/10',
  warning: 'bg-yellow-500/10',
  urgent: 'bg-orange-500/10',
} as const;

export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  priceUpdate: 1000,          
  cardHover: 200,         
  shimmer: 2000,     
} as const;

export const FORMAT_THRESHOLDS = {
  urgentTimer: {
    seconds: 10,              
    minutes: 2,             
    hours: 1,              
  },
  neutralPercentage: 0.1,  
  bigNumber: 1000,          
} as const;

export const ICON_TYPES = {
  person: 'person',
  web: 'web',
  search: 'search',
  multiPerson: 'multiPerson',
  settings: 'settings',
  achievement: 'achievement',
  crown: 'crown',
  chef: 'chef',
  target: 'target',
  copy: 'copy',
  external: 'external',
} as const;

export const METRIC_TYPES = {
  growth: 'growth',
  chef: 'chef',
  target: 'target',
  other1: 'other1',
  other2: 'other2',
} as const;

export const CARD_STATES = {
  normal: 'normal',
  hover: 'hover',
  active: 'active',
  loading: 'loading',
  error: 'error',
  new: 'new',
  expiring: 'expiring',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
} as const;

export const DATA_CONFIG = {
  staleTime: 30000,         
  cacheTime: 300000,    
  refetchInterval: 60000,   
} as const;

export const PERFORMANCE = {
  maxRenderTime: 100,         
  debounceDelay: 300,         
  throttleDelay: 100,        
} as const;

export const DEFAULT_IMAGES = [
  '/photo1.png',
  '/photo2.png',
  '/photo3.png',
  '/photo4.png',
  '/photo5.png',
  '/photo6.png',
  '/photo7.png',
  '/photo8.png',
  '/photo9.png',
  '/photo10.png',
] as const;

export const TOKEN_NAMES = [
  { name: 'tot', detail: 'The Great Atraction' },
  { name: 'NDI6900', detail: 'National Debt Index 6900' },
  { name: '$SWAL', detail: 'Sorry we are late' },
  { name: 'PET', detail: 'cutie pussy cat' },
  { name: 'crashy', detail: 'Crashy the almost gone' },
  { name: 'INNO', detail: 'InnoWeb3' },
  { name: 'BART', detail: 'BART' },
  { name: 'GIGA', detail: 'GIGA SAYLOR' },
  { name: 'VINA', detail: 'VINA - AI Grok Companion' },
  { name: 'OKS', detail: 'One Of A Kind Sentences' },
  { name: 'FNP', detail: 'FNP Virgin gramma' },
  { name: 'MEMECHASE', detail: 'MEMECHASE' },
  { name: 'STEVE', detail: 'First Trench Assistant' },
  { name: 'inu', detail: 'im not useless' },
  { name: 'Bonkiez', detail: 'Bonkiez' },
  { name: 'Tiotlon', detail: 'Tiotlon' },
  { name: 'SENDSHOT', detail: 'SENDSHOT' },
  { name: 'IMPEROOTER', detail: 'imperooterxbt' },
  { name: 'Lambu', detail: 'Wen Lambu?' },
  { name: 'TRSAH', detail: 'TrsahCoin' },
  { name: 'PMTS', detail: 'Prometheus GPT' },
  { name: 'VTIFC', detail: 'Venus the Two Faced Cat' },
  { name: 'MEMELESS', detail: 'MEMELESS COIN' },
  { name: 'FARTNET', detail: 'FartNET' },
  { name: 'PAPERBONK', detail: 'Bonk SketchTube' },
  { name: 'NOUN', detail: 'nouns.fun' },
] as const;

export const MARKET_CAP_RANGES = {
  min: 1000,     
  max: 1000000,  
} as const;

export const VOLUME_RANGES = {
  min: 100,      
  max: 500000,    
} as const;

export const METRIC_RANGES = {
  growth: { min: -100, max: 100 },    
  chef: { min: -100, max: 100 },       
  target: { min: 0, max: 100 },    
  other: { min: 0, max: 50 },     
  bonding: { min: 0, max: 100 },   
} as const;

export const PERSON_COUNT_RANGE = {
  min: 1,
  max: 500,
} as const;

export const STORAGE_KEYS = {
  tokenData: 'axiom-trade-tokens',
  userPreferences: 'axiom-trade-prefs',
  connectionStatus: 'axiom-trade-connection',
} as const;

export const ERROR_MESSAGES = {
  connectionFailed: 'Failed to connect to real-time data',
  dataLoadFailed: 'Failed to load token data',
  updateFailed: 'Failed to update token information',
  invalidData: 'Invalid token data received',
  networkError: 'Network connection error',
} as const;

export const SUCCESS_MESSAGES = {
  connected: 'Connected to real-time data',
  dataLoaded: 'Token data loaded successfully',
  updated: 'Token data updated',
} as const;

export const FEATURE_FLAGS = {
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
  enableDetailedLogging: process.env.NODE_ENV === 'development',
  enableAnimations: true,
  enableWebSocket: true,
  enablePersistence: true,
} as const;

export type ColorKey = keyof typeof COLORS;
export type BgColorKey = keyof typeof BG_COLORS;
export type IconType = typeof ICON_TYPES[keyof typeof ICON_TYPES];
export type MetricType = typeof METRIC_TYPES[keyof typeof METRIC_TYPES];
export type CardState = typeof CARD_STATES[keyof typeof CARD_STATES];
export type TokenName = typeof TOKEN_NAMES[number]['name'];
export type DefaultImage = typeof DEFAULT_IMAGES[number];