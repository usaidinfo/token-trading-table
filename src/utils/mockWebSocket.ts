// utils/mockWebSocket.ts
import { TokenData, TokenCategory, WebSocketMessage, TimerConfig } from '../types/token';

const TOKEN_NAMES = [
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
  { name: 'NOUN', detail: 'nouns.fun' }
];

const TIMER_CONFIG: TimerConfig = {
  newPairs: { min: 5, max: 30 },
  finalStretch: { min: 4 * 3600, max: 12 * 3600 },
  migrated: { min: 5 * 60, max: 35 * 60 } 
};

class MockWebSocket {
  private listeners: ((message: WebSocketMessage) => void)[] = [];
  private connected = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private timerInterval: NodeJS.Timeout | null = null;
  
  connect() {
    this.connected = true;
    this.startUpdates();
    this.startTimers();
    
    setTimeout(() => {
      this.emitMessage({
        type: 'update',
        category: 'newPairs',
        data: this.generateInitialTokens('newPairs', 8),
        timestamp: Date.now()
      });
      
      this.emitMessage({
        type: 'update',
        category: 'finalStretch',
        data: this.generateInitialTokens('finalStretch', 6),
        timestamp: Date.now()
      });
      
      this.emitMessage({
        type: 'update',
        category: 'migrated',
        data: this.generateInitialTokens('migrated', 10),
        timestamp: Date.now()
      });
    }, 500);
  }
  
  disconnect() {
    this.connected = false;
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
  
  onMessage(callback: (message: WebSocketMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  private emitMessage(message: WebSocketMessage) {
    this.listeners.forEach(listener => listener(message));
  }
  
  private startUpdates() {
    this.updateInterval = setInterval(() => {
      if (!this.connected) return;
      
      const categories: TokenCategory[] = ['newPairs', 'finalStretch', 'migrated'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      if (Math.random() < 0.3) {
        this.emitMessage({
          type: 'new',
          category: randomCategory,
          data: this.generateToken(randomCategory),
          timestamp: Date.now()
        });
      } else {
        const updatedToken = this.generateToken(randomCategory);
        updatedToken.priceChange = (Math.random() - 0.5) * 20;
        
        this.emitMessage({
          type: 'update',
          category: randomCategory,
          data: updatedToken,
          timestamp: Date.now()
        });
      }
    }, Math.random() * 3000 + 2000);
  }
  
  private startTimers() {
    this.timerInterval = setInterval(() => {
      if (!this.connected) return;
      
 
      this.emitMessage({
        type: 'update',
        category: 'newPairs', 
        data: [],
        timestamp: Date.now()
      });
    }, 1000);
  }
  
  private generateInitialTokens(category: TokenCategory, count: number): TokenData[] {
    const tokens: TokenData[] = [];
    for (let i = 0; i < count; i++) {
      tokens.push(this.generateToken(category));
    }
    return tokens;
  }
  
  generateToken(category: TokenCategory): TokenData {
    const tokenInfo = TOKEN_NAMES[Math.floor(Math.random() * TOKEN_NAMES.length)];
    const imageNum = Math.floor(Math.random() * 10) + 1;
    
    const timerConfig = TIMER_CONFIG[category];
    const timer = Math.floor(Math.random() * (timerConfig.max - timerConfig.min)) + timerConfig.min;
    
    let timerType: 'seconds' | 'minutes' | 'hours';
    if (category === 'newPairs') timerType = 'seconds';
    else if (category === 'finalStretch') timerType = 'hours';
    else timerType = 'minutes';
    
    return {
      id: `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tokenInfo.name,
      detailedName: tokenInfo.detail,
      image: `/photo${imageNum}.png`,
      marketCap: Math.floor(Math.random() * 1000000) + 1000, 
      volume: Math.floor(Math.random() * 500000) + 100,
      timer,
      timerType,
      personCount: Math.floor(Math.random() * 500) + 1,
      webIconActive: Math.random() > 0.5,
      searchIconActive: Math.random() > 0.7,
      multiPersonIconActive: Math.random() > 0.6,
      settingsIconActive: Math.random() > 0.8,
      achievementIconActive: Math.random() > 0.9,
      crownIconActive: Math.random() > 0.95,
      metrics: {
        growth: Math.floor(Math.random() * 200) - 100, 
        chef: Math.floor(Math.random() * 200) - 100,
        target: Math.floor(Math.random() * 100),
        other1: Math.floor(Math.random() * 50),
        other2: Math.floor(Math.random() * 50)
      },
      bondingPercentage: Math.floor(Math.random() * 100),
      solAmount: 0, 
      lastUpdated: Date.now(),
      priceChange: 0,
      isNew: Math.random() < 0.1 
    };
  }
}

export const mockWebSocket = new MockWebSocket();