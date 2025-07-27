// hooks/useTypedRedux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useMemo } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import {
  selectTokensByCategory,
  selectConnectionStatus,
  selectAllTokens,
  selectTokenCounts,
} from '../store/tokenSlice';
import type { TokenCategory, TokenData } from '../types/token';


export const useAppDispatch = () => useDispatch<AppDispatch>();


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useTokensByCategory = (category: TokenCategory): TokenData[] => {
  return useAppSelector(state => selectTokensByCategory(state, category));
};

export const useConnectionStatus = () => {
  return useAppSelector(selectConnectionStatus);
};

export const useAllTokens = () => {
  return useAppSelector(selectAllTokens);
};

export const useTokenCounts = () => {
  return useAppSelector(selectTokenCounts);
};


export const useTokenById = (tokenId: string): TokenData | undefined => {
  return useAppSelector(state => {
    const allTokens = selectAllTokens(state);
    
    for (const category of ['newPairs', 'finalStretch', 'migrated'] as const) {
      const token = allTokens[category].find(t => t.id === tokenId);
      if (token) return token;
    }
    
    return undefined;
  });
};


interface TokenFilters {
  category?: TokenCategory;
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  maxVolume?: number;
  hasPositiveGrowth?: boolean;
  isNew?: boolean;
  sortBy?: 'marketCap' | 'volume' | 'timer' | 'growth';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export const useFilteredTokens = (filters: TokenFilters = {}): TokenData[] => {
  const {
    category,
    minMarketCap,
    maxMarketCap,
    minVolume,
    maxVolume,
    hasPositiveGrowth,
    isNew,
    sortBy,
    sortOrder = 'desc',
    limit,
  } = filters;

  return useAppSelector(state => {
    let tokens: TokenData[] = [];

    if (category) {
      tokens = selectTokensByCategory(state, category);
    } else {
      const allTokens = selectAllTokens(state);
      tokens = [
        ...allTokens.newPairs,
        ...allTokens.finalStretch,
        ...allTokens.migrated,
      ];
    }

    let filteredTokens = tokens.filter(token => {
      if (minMarketCap !== undefined && token.marketCap < minMarketCap) return false;
      if (maxMarketCap !== undefined && token.marketCap > maxMarketCap) return false;
      if (minVolume !== undefined && token.volume < minVolume) return false;
      if (maxVolume !== undefined && token.volume > maxVolume) return false;
      if (hasPositiveGrowth !== undefined && (token.metrics.growth > 0) !== hasPositiveGrowth) return false;
      if (isNew !== undefined && Boolean(token.isNew) !== isNew) return false;
      
      return true;
    });

    if (sortBy) {
      filteredTokens.sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (sortBy) {
          case 'marketCap':
            aValue = a.marketCap;
            bValue = b.marketCap;
            break;
          case 'volume':
            aValue = a.volume;
            bValue = b.volume;
            break;
          case 'timer':
            aValue = a.timer;
            bValue = b.timer;
            break;
          case 'growth':
            aValue = a.metrics.growth;
            bValue = b.metrics.growth;
            break;
          default:
            return 0;
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    if (limit !== undefined) {
      filteredTokens = filteredTokens.slice(0, limit);
    }

    return filteredTokens;
  });
};

export const useTokenAnalytics = () => {
  return useAppSelector(state => {
    const allTokens = selectAllTokens(state);
    const counts = selectTokenCounts(state);
    
    const allTokensFlat = [
      ...allTokens.newPairs,
      ...allTokens.finalStretch,
      ...allTokens.migrated,
    ];

    if (allTokensFlat.length === 0) {
      return {
        counts,
        totalMarketCap: 0,
        totalVolume: 0,
        averageGrowth: 0,
        positiveGrowthCount: 0,
        negativeGrowthCount: 0,
        newTokensCount: 0,
        averageTimer: 0,
        topGainer: null,
        topLoser: null,
      };
    }

    const totalMarketCap = allTokensFlat.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume = allTokensFlat.reduce((sum, token) => sum + token.volume, 0);
    const averageGrowth = allTokensFlat.reduce((sum, token) => sum + token.metrics.growth, 0) / allTokensFlat.length;
    const positiveGrowthCount = allTokensFlat.filter(token => token.metrics.growth > 0).length;
    const negativeGrowthCount = allTokensFlat.filter(token => token.metrics.growth < 0).length;
    const newTokensCount = allTokensFlat.filter(token => token.isNew).length;
    const averageTimer = allTokensFlat.reduce((sum, token) => sum + token.timer, 0) / allTokensFlat.length;

    const sortedByGrowth = [...allTokensFlat].sort((a, b) => b.metrics.growth - a.metrics.growth);
    const topGainer = sortedByGrowth[0];
    const topLoser = sortedByGrowth[sortedByGrowth.length - 1];

    return {
      counts,
      totalMarketCap,
      totalVolume,
      averageGrowth: Math.round(averageGrowth * 100) / 100,
      positiveGrowthCount,
      negativeGrowthCount,
      newTokensCount,
      averageTimer: Math.round(averageTimer),
      topGainer,
      topLoser,
    };
  });
};

export const useExpiringTokens = (thresholdSeconds: number = 30): TokenData[] => {
  return useAppSelector(state => {
    const allTokens = selectAllTokens(state);
    const allTokensFlat = [
      ...allTokens.newPairs,
      ...allTokens.finalStretch,
      ...allTokens.migrated,
    ];

    return allTokensFlat.filter(token => token.timer <= thresholdSeconds && token.timer > 0);
  });
};

export const useRecentlyUpdatedTokens = (maxAgeMs: number = 5000): TokenData[] => {
  return useAppSelector(state => {
    const allTokens = selectAllTokens(state);
    const allTokensFlat = [
      ...allTokens.newPairs,
      ...allTokens.finalStretch,
      ...allTokens.migrated,
    ];

    const now = Date.now();
    return allTokensFlat.filter(token => now - token.lastUpdated <= maxAgeMs);
  });
};


export const useTokenCalculations = (category?: TokenCategory) => {
  const tokens = category ? useTokensByCategory(category) : useAllTokens();
  
  return useMemo(() => {
    const tokenArray = category 
      ? tokens as TokenData[]
      : Object.values(tokens as Record<string, TokenData[]>).flat();

    if (tokenArray.length === 0) {
      return {
        totalValue: 0,
        averageGrowth: 0,
        volatilityScore: 0,
        trendScore: 0,
      };
    }

    const totalValue = tokenArray.reduce((sum, token) => sum + token.marketCap, 0);
    const growthValues = tokenArray.map(token => token.metrics.growth);
    const averageGrowth = growthValues.reduce((sum, growth) => sum + growth, 0) / growthValues.length;
    
    const growthVariance = growthValues.reduce((sum, growth) => sum + Math.pow(growth - averageGrowth, 2), 0) / growthValues.length;
    const volatilityScore = Math.sqrt(growthVariance);
    
    const trendScore = tokenArray.reduce((sum, token, index) => {
      const weight = 1 / (index + 1);
      return sum + (token.metrics.growth * weight);
    }, 0) / tokenArray.length;

    return {
      totalValue: Math.round(totalValue),
      averageGrowth: Math.round(averageGrowth * 100) / 100,
      volatilityScore: Math.round(volatilityScore * 100) / 100,
      trendScore: Math.round(trendScore * 100) / 100,
    };
  }, [tokens, category]);
};