// types/token.ts
export interface TokenMetrics {
  growth: number;
  chef: number;
  target: number; 
  other1: number;
  other2: number;
}

export interface TokenData {
  id: string;
  name: string;
  detailedName: string;
  image: string;
  marketCap: number;
  volume: number;
  timer: number;
  timerType: 'seconds' | 'minutes' | 'hours';
  personCount: number;
  webIconActive: boolean;
  searchIconActive: boolean;
  multiPersonIconActive: boolean;
  settingsIconActive: boolean;
  achievementIconActive: boolean;
  crownIconActive: boolean;
  metrics: TokenMetrics;
  bondingPercentage: number;
  solAmount: number;
  lastUpdated: number; 
  priceChange: number;
  isNew?: boolean;
}

export type TokenCategory = 'newPairs' | 'finalStretch' | 'migrated';

export interface TokenState {
  newPairs: TokenData[];
  finalStretch: TokenData[];
  migrated: TokenData[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export interface WebSocketMessage {
  type: 'update' | 'new' | 'migrate' | 'remove';
  category: TokenCategory;
  data: TokenData | TokenData[];
  timestamp: number;
}

export interface TimerConfig {
  newPairs: { min: number, max: number };
  finalStretch: { min: number, max: number };
  migrated: { min: number, max: number };
}