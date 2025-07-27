// hooks/useTokenWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setConnectionStatus,
  setError,
  setLoading,
  decrementAllTimers,
  processWebSocketMessage,
  resetTokens,
  selectConnectionStatus,
} from '../store/tokenSlice';
import { mockWebSocket } from '../utils/mockWebSocket';
import { WebSocketMessage } from '../types/token';


interface UseTokenWebSocketOptions {
  autoConnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  useExponentialBackoff?: boolean;
}


interface UseTokenWebSocketReturn {
  connect: () => void;
  disconnect: () => void;
  connected: boolean;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Custom hook for managing WebSocket connection and real-time token updates
 * 
 * @param options Configuration options for the WebSocket connection
 * @returns Object with connection controls and status
 */
export const useTokenWebSocket = (
  options: UseTokenWebSocketOptions = {}
): UseTokenWebSocketReturn => {
  const {
    autoConnect = true,
    maxReconnectAttempts = 5,
    reconnectDelay = 2000,
    useExponentialBackoff = true,
  } = options;

  const dispatch = useDispatch();
  const { connected, loading, error } = useSelector(selectConnectionStatus);

  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageUnsubscribeRef = useRef<(() => void) | null>(null);
  const isConnectingRef = useRef(false);

  const getReconnectDelay = useCallback((): number => {
    if (!useExponentialBackoff) {
      return reconnectDelay;
    }

    const exponentialDelay = reconnectDelay * Math.pow(2, reconnectAttempts.current);
    const jitter = Math.random() * 1000;
    const maxDelay = 30000;

    return Math.min(exponentialDelay + jitter, maxDelay);
  }, [reconnectDelay, useExponentialBackoff]);


  const startTimerInterval = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      dispatch(decrementAllTimers());
    }, 1000);
  }, [dispatch]);


  const stopTimerInterval = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    try {
      if (!message.type || !message.category || !message.timestamp) {
        console.warn('Invalid WebSocket message received:', message);
        return;
      }

      dispatch(processWebSocketMessage(message));
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      dispatch(setError('Failed to process real-time update'));
    }
  }, [dispatch]);


  const connect = useCallback(async () => {
    if (isConnectingRef.current || connected) {
      return;
    }

    isConnectingRef.current = true;
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      mockWebSocket.connect();

      const unsubscribe = mockWebSocket.onMessage(handleWebSocketMessage);
      messageUnsubscribeRef.current = unsubscribe;

      dispatch(setConnectionStatus(true));
      
      startTimerInterval();

      reconnectAttempts.current = 0;

      console.log('WebSocket connected successfully');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      dispatch(setError('Failed to connect to real-time data'));
      
      scheduleReconnection();
    } finally {
      isConnectingRef.current = false;
    }
  }, [connected, dispatch, handleWebSocketMessage, startTimerInterval]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopTimerInterval();

    if (messageUnsubscribeRef.current) {
      messageUnsubscribeRef.current();
      messageUnsubscribeRef.current = null;
    }

    mockWebSocket.disconnect();

    dispatch(setConnectionStatus(false));
    dispatch(setLoading(false));

    isConnectingRef.current = false;
    reconnectAttempts.current = 0;
  }, [dispatch, stopTimerInterval]);


  const scheduleReconnection = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      dispatch(setError(`Failed to connect after ${maxReconnectAttempts} attempts`));
      dispatch(setLoading(false));
      return;
    }

    reconnectAttempts.current++;
    const delay = getReconnectDelay();

    console.log(
      `Scheduling reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts} in ${delay}ms`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [maxReconnectAttempts, getReconnectDelay, connect, dispatch]);


  const retry = useCallback(() => {
    reconnectAttempts.current = 0;
    disconnect();
    
    setTimeout(() => {
      connect();
    }, 100);
  }, [connect, disconnect]);


  useEffect(() => {
    if (autoConnect && !connected && !isConnectingRef.current) {
      connect();
    }
  }, [autoConnect, connected, connect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab hidden - WebSocket remains active');
      } else {
        if (!connected && !isConnectingRef.current) {
          console.log('Tab visible - reconnecting if needed');
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connected, connect]);

  return {
    connect,
    disconnect,
    connected,
    loading,
    error,
    retry,
  };
};