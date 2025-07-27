// store/store.ts 
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tokenReducer from './tokenSlice';

export interface RootState {
  tokens: ReturnType<typeof tokenReducer>;
}

const persistConfig = {
  key: 'axiom-trade-root',
  version: 1,
  storage,
  whitelist: ['tokens'],
  transforms: [],
  throttle: 100,
};

const tokensPersistConfig = {
  key: 'tokens',
  storage,
  blacklist: ['loading', 'error', 'connected'],
  throttle: 500,
};

const rootReducer = combineReducers({
  tokens: persistReducer(tokensPersistConfig, tokenReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'tokens/processWebSocketMessage',
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['register', 'rehydrate'],
      },
      
      immutableCheck: {
        warnAfter: process.env.NODE_ENV === 'development' ? 32 : 128,
      },
      
      thunk: {
        extraArgument: {},
      },
    }),
  
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Axiom Trade Token Dashboard',
    trace: true,
    traceLimit: 25,
    
    actionSanitizer: (action) => {
      if (action.type === 'tokens/decrementAllTimers') {
        return {
          ...action,
          type: 'tokens/decrementAllTimers [TIMER_TICK]',
        };
      }
      return action;
    },
    
    stateSanitizer: (state: any) => {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          newPairs: state.tokens.newPairs.slice(0, 5),
          finalStretch: state.tokens.finalStretch.slice(0, 5),
          migrated: state.tokens.migrated.slice(0, 5),
        },
      };
    },
  },
  
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({
      autoBatch: true,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;

export const subscribeToStore = (callback: (state: RootState) => void) => {
  return store.subscribe(() => {
    callback(store.getState());
  });
};

export const storeActions = {
  getState: () => store.getState(),
  dispatch: store.dispatch,
  subscribe: store.subscribe,
  clearPersistedData: () => {
    persistor.purge();
  },
  persist: () => {
    persistor.persist();
  },
  pausePersistence: () => {
    persistor.pause();
  },
};

export const storeUtils = {
  getStoreSizeEstimate: (): number => {
    const state = store.getState();
    return JSON.stringify(state).length;
  },

  getTokenCounts: () => {
    const state = store.getState();
    return {
      newPairs: state.tokens.newPairs.length,
      finalStretch: state.tokens.finalStretch.length,
      migrated: state.tokens.migrated.length,
      total: state.tokens.newPairs.length + 
             state.tokens.finalStretch.length + 
             state.tokens.migrated.length,
    };
  },

  isRehydrated: () => {
    return persistor.getState().bootstrapped;
  },

  getPerformanceMetrics: () => {
    const state = store.getState();
    const sizeEstimate = JSON.stringify(state).length;
    
    return {
      stateSizeBytes: sizeEstimate,
      stateSizeKB: Math.round(sizeEstimate / 1024 * 100) / 100,
      tokenCount: storeUtils.getTokenCounts().total,
      lastUpdate: Date.now(),
    };
  },
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__REDUX_STORE__ = store;
  (window as any).__REDUX_PERSISTOR__ = persistor;
  (window as any).__STORE_UTILS__ = storeUtils;
  
  console.log('🏪 Redux Store initialized');
  console.log('📊 Store utils available at window.__STORE_UTILS__');
}

export const safeDispatch = (action: any) => {
  try {
    return store.dispatch(action);
  } catch (error) {
    console.error('Store dispatch error:', error);
    throw error;
  }
};

export default store;