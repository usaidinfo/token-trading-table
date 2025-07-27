// components/TokenCard.tsx 
import { useState, useCallback, useMemo, memo  } from 'react';
import { Icon } from './UI/Icon';
import { MetricChip } from './UI/MetricChip';
import { Timer } from './UI/Timer';
import { formatCurrency, formatNumber, formatAddress } from '../utils/formatters';
import type { TokenData } from '../types/token';
import { Tooltip } from './UI/Tooltip';
import { Modal } from './UI/Modal';
import { Popover } from './UI/Popover';
import { Copy, MoreVertical } from 'lucide-react';

interface TokenCardProps {
  token: TokenData;
  className?: string;
}

export const TokenCard = memo(({ token, className = '' }: TokenCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
const [showModal, setShowModal] = useState(false);

  const formattedValues = useMemo(() => ({
    marketCap: formatCurrency(token.marketCap),
    volume: formatCurrency(token.volume),
    address: formatAddress(token.id),
    personCount: formatNumber(token.personCount)
  }), [token.marketCap, token.volume, token.id, token.personCount]);

  const randomValues = useMemo(() => ({
  multiPersonCount: Math.floor(Math.random() * 50),
  feeValue: Math.floor(Math.random() * 10),
  txValue: Math.floor(Math.random() * 100)
}), [token.id]);

  const handleCopyAddress = useCallback(() => {
  navigator.clipboard.writeText(token.id);
}, [token.id]);

const MoreOptionsContent = () => (
  <div className="p-2 space-y-1 w-40">
    <button onClick={() => setShowModal(true)} className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded">
      View Details
    </button>
    <button onClick={handleCopyAddress} className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded">
      Copy Address
    </button>
  </div>
);

const TokenDetailsModal = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <img src={token.image} alt={token.name} className="w-20 h-20 rounded-lg border-2 border-blue-600" />
      <div>
        <h3 className="text-2xl font-bold text-white">{token.name}</h3>
        <p className="text-gray-400">{token.detailedName}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-gray-400 text-sm">Market Cap</div>
        <div className="text-blue-400 text-xl font-bold">{formattedValues.marketCap}</div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-gray-400 text-sm">Volume</div>
        <div className="text-blue-400 text-xl font-bold">{formattedValues.volume}</div>
      </div>
    </div>
  </div>
);

  return (
    <>
    <div
      className={`
        relative bg-black border border-gray-700 rounded-lg p-3
        transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/10
        group cursor-pointer overflow-hidden
        ${token.isNew ? 'ring-1 ring-yellow-500/30' : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setShowModal(true)}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
  <Popover 
    trigger={
      <button onClick={(e) => e.stopPropagation()} className="p-1 text-gray-400 hover:text-white bg-black/80 rounded">
        <MoreVertical size={14} />
      </button>
    } 
    content={<MoreOptionsContent />} 
    position="bottom" 
  />
</div>

      <div className="relative flex items-start gap-3">
        <div className="relative flex-shrink-0">
<img
  src={token.image}
  alt={token.name}
  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 p-1 border-blue-600"
  loading="lazy"
  decoding="async"
  width="80"
  height="80"
  style={{ maxWidth: '80px', maxHeight: '80px' }}
/>
          {token.isNew && (
            <div className="absolute -top-1 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          )}
          <div className="text-xs text-gray-500 mt-1 sm:mt-2 text-center font-mono">
            {formattedValues.address}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-sm truncate">{token.name}</h3>
            <span className="text-gray-400 text-sm truncate hidden sm:inline">{token.detailedName}</span>
            <button onClick={(e) => { e.stopPropagation(); handleCopyAddress(); }}>
  <Icon type="copy" size={15} className="text-gray-400 hover:text-gray-200" />
</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 mt-2 flex-wrap">
            <Timer timeInSeconds={token.timer} timerType={token.timerType} className="text-sm" />
            <div className="flex items-center gap-1">
              <Icon type="person" size={15} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <Icon type="search" size={15} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <Icon type="web" size={15} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <Icon type="multiPerson" size={15} className="text-gray-400" />
<span className="text-xs text-gray-300">{randomValues.multiPersonCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon type="achievement" size={15} className="text-gray-400" />
              <span className="text-xs text-gray-300">{formattedValues.personCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon type="crown" size={15} className="text-gray-400" />
              <span className="text-xs text-gray-300">0</span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <MetricChip value={token.metrics.growth} type="growth" size="sm" />
            <MetricChip value={token.metrics.chef} type="chef" size="sm" />
            <MetricChip value={token.metrics.target} type="target" size="sm" />
            <MetricChip value={token.metrics.other1} type="other" size="sm" showIcon={false} />
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm font-bold text-blue-400 mb-1">
            <span className='text-gray-500 text-xs mr-2'>MC</span>
            {formattedValues.marketCap}
          </div>
          <div className="text-xs text-gray-400 mb-2">
            V <span className='text-sm font-bold text-blue-400 mb-1'>{formattedValues.volume}</span>
          </div>
          <div className="text-xs text-gray-400">
F = {randomValues.feeValue} TX {randomValues.txValue}
          </div>
        </div>
      </div>

      {isHovered && (
        <div className="absolute top-2 right-2 bg-black/90 px-2 py-1 rounded text-xs border border-gray-600 z-10 animate-fade-in">
          <span className="text-gray-400">Bonding </span>
          <span className="text-white">{token.bondingPercentage}%</span>
        </div>
      )}
    </div>

        <Modal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
      title={`${token.name} Details`} 
      size="lg"
    >
      <TokenDetailsModal />
    </Modal>
    </>
  );
});