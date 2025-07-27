// hooks/useTokenData.ts
import { useEffect } from 'react';
import { useTokenWebSocket } from './useTokenWebSocket';
import { useTimer } from './useTimer';
import { 
  useTokensByCategory, 
  useConnectionStatus, 
  useAllTokens,
  useTokenCounts 
} from './useTypedSelector';
import type { TokenCategory } from '../types/token';


export const useTokenData = () => {
  const { connect, disconnect, retry } = useTokenWebSocket({
    autoConnect: true,
    maxReconnectAttempts: 5,
  });

  const timer = useTimer({
    autoStart: true,
    runInBackground: false,
  });

  const { connected, loading, error } = useConnectionStatus();
  const allTokens = useAllTokens();
  const counts = useTokenCounts();

  return {
    tokens: allTokens,
    counts,
    
    connected,
    loading,
    error,
    
    connect,
    disconnect,
    retry,
    
    timer,
  };
};


export const useCategoryTokens = (category: TokenCategory) => {
  const tokens = useTokensByCategory(category);
  const { connected, loading, error } = useConnectionStatus();
  
  return {
    tokens,
    connected,
    loading,
    error,
  };
};