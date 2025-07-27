// components/TokenTable.tsx - COMPLETE RESPONSIVE VERSION
import React, { useState } from 'react';
import { TokenColumn } from './TokenColumn';
import { useTokenData } from '../hooks/useTokenData';
import { ChevronDown, Settings, BarChart3, Volume2, VolumeX } from 'lucide-react';
import type { TokenCategory } from '../types/token';

const MobileTokenTabs = () => {
  const [activeTab, setActiveTab] = useState<TokenCategory>('newPairs');
  
  const tabs = [
    { category: 'newPairs' as TokenCategory, title: 'New Pairs', shortTitle: 'New' },
    { category: 'finalStretch' as TokenCategory, title: 'Final Stretch', shortTitle: 'Final' },
    { category: 'migrated' as TokenCategory, title: 'Migrated', shortTitle: 'Migrated' }
  ];

  return (
    <div className="md:hidden h-full flex flex-col">
      <div className="flex-shrink-0 flex border-b border-gray-800 bg-gray-900/50">
        {tabs.map(({ category, title, shortTitle }) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === category
                ? 'text-white bg-gray-800/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
            }`}
          >
            <span className="hidden sm:inline">{title}</span>
            <span className="sm:hidden">{shortTitle}</span>
            {activeTab === category && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex-1 min-h-0">
        <TokenColumn 
          category={activeTab} 
          title={tabs.find(t => t.category === activeTab)?.title || ''}
          className="h-full"
        />
      </div>
    </div>
  );
};

export const TokenTable = () => {
  const { connected, loading, error, retry } = useTokenData();
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-lg mb-4">Connection Error</div>
          <p className="text-gray-400 mb-6 text-sm">Unable to connect to real-time data</p>
          <button 
            onClick={retry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Pulse</h1>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full transition-colors ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-gray-400">
                  {connected ? 'Live' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-400">Display</span>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  <BarChart3 size={14} />
                  <ChevronDown size={14} />
                </button>
              </div>
              
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={18} />
              </button>
              
              <div className="sm:hidden">
                <span className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden">
        {/* Desktop & Tablet: Column Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 h-full divide-x divide-gray-800">
          <TokenColumn 
            category="newPairs" 
            title="New Pairs"
            className="h-full"
          />
          <TokenColumn 
            category="finalStretch" 
            title="Final Stretch"
            className="h-full"
          />
          <TokenColumn 
            category="migrated" 
            title="Migrated"
            className="h-full hidden lg:block"
          />
        </div>
        
        {/* Mobile: Tabbed Layout */}
        <MobileTokenTabs />
      </main>
    </div>
  );
};