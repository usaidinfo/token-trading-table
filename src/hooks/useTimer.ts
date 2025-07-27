// hooks/useTimer.ts
import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from './useTypedSelector';
import { decrementAllTimers } from '../store/tokenSlice';
import { WEBSOCKET_CONFIG } from '../utils/constants';


interface UseTimerOptions {
  autoStart?: boolean;
  interval?: number;
  runInBackground?: boolean;
}


interface UseTimerReturn {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  restart: () => void;
}


export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
  const {
    autoStart = true,
    interval = WEBSOCKET_CONFIG.timerInterval,
    runInBackground = false,
  } = options;

  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const lastTickRef = useRef<number>(Date.now());


  const tick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTick = now - lastTickRef.current;
    
    if (timeSinceLastTick >= interval - 50) {
      dispatch(decrementAllTimers());
      lastTickRef.current = now;
    }
  }, [dispatch, interval]);


  const start = useCallback(() => {
    if (isRunningRef.current || intervalRef.current) {
      return; 
    }

    isRunningRef.current = true;
    lastTickRef.current = Date.now();
    
    intervalRef.current = setInterval(tick, interval);
  }, [tick, interval]);


  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRunningRef.current = false;
  }, []);


  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);


  useEffect(() => {
    if (!runInBackground) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (isRunningRef.current) {
            stop();
          }
        } else {
          if (autoStart) {
            start();
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [runInBackground, autoStart, start, stop]);


  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);


  useEffect(() => {
    const handleFocus = () => {
      if (autoStart && !document.hidden) {
        start();
      }
    };

    const handleBlur = () => {
      if (!runInBackground) {
        stop();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [autoStart, runInBackground, start, stop]);

  return {
    isRunning: isRunningRef.current,
    start,
    stop,
    restart,
  };
};


interface UseTokenTimerOptions {
  onExpire?: () => void;
  autoStart?: boolean;
}

interface UseTokenTimerReturn {
  timeRemaining: number;
  isExpired: boolean;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: (newTime?: number) => void;
}

export const useTokenTimer = (
  initialTime: number,
  options: UseTokenTimerOptions = {}
): UseTokenTimerReturn => {
  const { onExpire, autoStart = false } = options;
  
  const timeRef = useRef(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const isExpiredRef = useRef(false);

  const start = useCallback(() => {
    if (isRunningRef.current || isExpiredRef.current) {
      return;
    }

    isRunningRef.current = true;
    
    intervalRef.current = setInterval(() => {
      timeRef.current -= 1;
      
      if (timeRef.current <= 0) {
        timeRef.current = 0;
        isExpiredRef.current = true;
        isRunningRef.current = false;
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);
  }, [onExpire]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  const reset = useCallback((newTime?: number) => {
    stop();
    timeRef.current = newTime ?? initialTime;
    isExpiredRef.current = false;
  }, [initialTime, stop]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    timeRemaining: timeRef.current,
    isExpired: isExpiredRef.current,
    isRunning: isRunningRef.current,
    start,
    stop,
    reset,
  };
};