// store/tokenSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenData, TokenState, TokenCategory, WebSocketMessage } from '../types/token';


const initialState: TokenState = {
  newPairs: [],
  finalStretch: [],
  migrated: [],
  loading: true,
  error: null,
  connected: false,
};
``

const updateTokenInArray = (tokens: TokenData[], updatedToken: TokenData): TokenData[] => {
  const existingIndex = tokens.findIndex(token => token.id === updatedToken.id);
  
  if (existingIndex >= 0) {
    return tokens.map((token, index) => 
      index === existingIndex ? { ...token, ...updatedToken } : token
    );
  }
  
  return [updatedToken, ...tokens];
};


const removeTokenFromArray = (tokens: TokenData[], tokenId: string): TokenData[] => {
  return tokens.filter(token => token.id !== tokenId);
};

const decrementTimers = (tokens: TokenData[]): TokenData[] => {
  return tokens
    .map(token => ({
      ...token,
      timer: Math.max(0, token.timer - 1),
    }))
    .filter(token => token.timer > 0);
};


const limitArraySize = (tokens: TokenData[], maxSize: number): TokenData[] => {
  return tokens.length > maxSize ? tokens.slice(0, maxSize) : tokens;
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      state.loading = !action.payload;
      
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      
      if (action.payload) {
        state.connected = false;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },


    setTokens: (state, action: PayloadAction<{ category: TokenCategory; tokens: TokenData[] }>) => {
      const { category, tokens } = action.payload;
      state[category] = limitArraySize(tokens, 20);
      state.loading = false;
    },

    updateToken: (state, action: PayloadAction<{ category: TokenCategory; token: TokenData }>) => {
      const { category, token } = action.payload;
      state[category] = limitArraySize(
        updateTokenInArray(state[category], token),
        20
      );
    },

    addTokens: (state, action: PayloadAction<{ category: TokenCategory; tokens: TokenData[] }>) => {
      const { category, tokens } = action.payload;
      
      let updatedTokens = state[category];
      tokens.forEach(token => {
        updatedTokens = updateTokenInArray(updatedTokens, token);
      });
      
      state[category] = limitArraySize(updatedTokens, 20);
    },

    removeToken: (state, action: PayloadAction<{ category: TokenCategory; tokenId: string }>) => {
      const { category, tokenId } = action.payload;
      state[category] = removeTokenFromArray(state[category], tokenId);
    },

    decrementAllTimers: (state) => {
      const expiredNewPairs = state.newPairs.filter(token => token.timer <= 1);
      const expiredFinalStretch = state.finalStretch.filter(token => token.timer <= 1);
      
      state.newPairs = decrementTimers(state.newPairs);
      state.finalStretch = decrementTimers(state.finalStretch);
      state.migrated = decrementTimers(state.migrated);

      expiredNewPairs.forEach(token => {
        const migratedToken: TokenData = {
          ...token,
          timer: Math.floor(Math.random() * (12 * 3600 - 4 * 3600)) + 4 * 3600,
          timerType: 'hours',
          id: `finalStretch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        state.finalStretch = limitArraySize(
          updateTokenInArray(state.finalStretch, migratedToken),
          20
        );
      });

      expiredFinalStretch.forEach(token => {
        const migratedToken: TokenData = {
          ...token,
          timer: Math.floor(Math.random() * (35 * 60 - 5 * 60)) + 5 * 60,
          timerType: 'minutes',
          id: `migrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        state.migrated = limitArraySize(
          updateTokenInArray(state.migrated, migratedToken),
          20
        );
      });
    },

    processWebSocketMessage: (state, action: PayloadAction<WebSocketMessage>) => {
      const { type, category, data, timestamp } = action.payload;

      const currentTime = Date.now();
      if (currentTime - timestamp > 5000) {
        return;
      }

      switch (type) {
        case 'update':
          if (Array.isArray(data)) {
            let updatedTokens = state[category];
            data.forEach(token => {
              updatedTokens = updateTokenInArray(updatedTokens, token);
            });
            state[category] = limitArraySize(updatedTokens, 20);
          } else {
            state[category] = limitArraySize(
              updateTokenInArray(state[category], data),
              20
            );
          }
          break;

        case 'new':
          if (Array.isArray(data)) {
            let updatedTokens = state[category];
            data.forEach(token => {
              token.isNew = true;
              updatedTokens = updateTokenInArray(updatedTokens, token);
            });
            state[category] = limitArraySize(updatedTokens, 20);
          } else {
            data.isNew = true;
            state[category] = limitArraySize(
              updateTokenInArray(state[category], data),
              20
            );
          }
          break;

        case 'remove':
          if (Array.isArray(data)) {
            data.forEach(token => {
              state[category] = removeTokenFromArray(state[category], token.id);
            });
          } else {
            state[category] = removeTokenFromArray(state[category], data.id);
          }
          break;

        case 'migrate':
          if (!Array.isArray(data)) {
            state[category] = removeTokenFromArray(state[category], data.id);
          }
          break;
      }
    },

    resetTokens: (state) => {
      state.newPairs = [];
      state.finalStretch = [];
      state.migrated = [];
      state.loading = true;
      state.error = null;
    },
  },
});

export const {
  setConnectionStatus,
  setError,
  setLoading,
  setTokens,
  updateToken,
  addTokens,
  removeToken,
  decrementAllTimers,
  processWebSocketMessage,
  resetTokens,
} = tokenSlice.actions;

export default tokenSlice.reducer;

export const selectTokensByCategory = (state: { tokens: TokenState }, category: TokenCategory) => 
  state.tokens[category];

export const selectConnectionStatus = (state: { tokens: TokenState }) => ({
  connected: state.tokens.connected,
  loading: state.tokens.loading,
  error: state.tokens.error,
});

export const selectAllTokens = (state: { tokens: TokenState }) => ({
  newPairs: state.tokens.newPairs,
  finalStretch: state.tokens.finalStretch,
  migrated: state.tokens.migrated,
});

export const selectTokenCounts = (state: { tokens: TokenState }) => ({
  newPairs: state.tokens.newPairs.length,
  finalStretch: state.tokens.finalStretch.length,
  migrated: state.tokens.migrated.length,
  total: state.tokens.newPairs.length + state.tokens.finalStretch.length + state.tokens.migrated.length,
});