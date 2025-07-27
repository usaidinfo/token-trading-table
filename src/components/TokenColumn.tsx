// components/TokenColumn.tsx 
import { useEffect, memo } from 'react';
import { TokenCard } from './TokenCard';
import { ErrorBoundary } from './UI/ErrorBoundary';
import { useCategoryTokens } from '../hooks/useTokenData';
import { useAppDispatch } from '../hooks/useTypedSelector';
import { addTokens } from '../store/tokenSlice';
import { mockWebSocket } from '../utils/mockWebSocket';
import type { TokenCategory } from '../types/token';

interface TokenColumnProps {
  category: TokenCategory;
  title: string;
  className?: string;
}

export const TokenColumn = memo(({ category, title, className = '' }: TokenColumnProps) => {
  const { tokens, loading } = useCategoryTokens(category);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tokens.length < 3) {
      const newTokens = Array.from({ length: 5 }, () => {
        const tokenInfo = mockWebSocket.generateToken(category);
        return tokenInfo;
      });
      
      dispatch(addTokens({ category, tokens: newTokens }));
    }
  }, [tokens.length, category, dispatch]);

  return (
    <ErrorBoundary>
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-black">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="flex items-center gap-1 text-sm text-yellow-400">
              <span>⚡</span>
              <span>{tokens.length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1 text-blue-400 hover:text-blue-300">
              <span className="text-sm">≡</span>
            </button>
            <button className="text-xs px-1 py-0.5 bg-blue-600 text-white rounded">P1</button>
            <button className="text-xs px-1 py-0.5 text-gray-400 hover:text-white">P2</button>
            <button className="text-xs px-1 py-0.5 text-gray-400 hover:text-white">P3</button>
            <button className="p-1 text-gray-400 hover:text-white">
              <span className="text-sm">⚙</span>
            </button>
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            height: 'calc(100vh - 140px)', 
            maxHeight: 'calc(100vh - 140px)'
          }}
        >
          {loading ? (
            <div className="p-2 space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 h-24 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {tokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
});