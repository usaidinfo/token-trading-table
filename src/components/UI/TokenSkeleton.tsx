// components/UI/AppLoadingSkeleton.tsx - CREATE THIS NEW FILE
import React from 'react';

export function AppLoadingSkeleton() {
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700/50 rounded w-20 animate-pulse"></div>
          <div className="flex items-center gap-6">
            <div className="h-6 bg-gray-700/50 rounded w-24 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-700/50 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-700/50 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 divide-x divide-gray-800">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex flex-col h-full">
            <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-700/50 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-700/50 rounded w-8 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-700/50 rounded w-6 animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-2 space-y-2">
              {Array.from({ length: 6 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-black border border-gray-700 rounded-lg p-3 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-700/50 rounded-lg border-2 border-gray-600"></div>
                      <div className="w-20 h-3 bg-gray-700/50 rounded mt-2"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                        <div className="h-3 bg-gray-700/50 rounded w-32"></div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-4 bg-gray-700/50 rounded w-12"></div>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gray-700/50 rounded"></div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-6 bg-gray-700/50 rounded w-14"></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 space-y-1">
                      <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                      <div className="h-3 bg-gray-700/50 rounded w-16"></div>
                      <div className="h-3 bg-gray-700/50 rounded w-18"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}