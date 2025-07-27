// providers/index.tsx - UPDATED VERSION
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { AppLoadingSkeleton } from '../components/UI/TokenSkeleton';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoadingSkeleton />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}