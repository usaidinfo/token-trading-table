// utils/formatters.ts


interface CurrencyFormatOptions {
  showCents?: boolean;
  forceSign?: boolean;
  minDecimals?: number;
  maxDecimals?: number;
  compact?: boolean;
}

export const formatCurrency = (
  value: number,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    showCents = false,
    forceSign = false,
    minDecimals = 0,
    maxDecimals = 2,
    compact = true,
  } = options;

  if (isNaN(value) || !isFinite(value)) {
    return '$0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : (forceSign && value > 0 ? '+' : '');

  if (!compact) {
    return `${sign}$${absValue.toLocaleString('en-US', {
      minimumFractionDigits: showCents ? 2 : minDecimals,
      maximumFractionDigits: showCents ? 2 : maxDecimals,
    })}`;
  }

  if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(0)}K`;
  } else if (absValue >= 1) {
    return `${sign}$${absValue.toFixed(showCents ? 2 : 0)}`;
  } else {
    const decimals = Math.max(2, Math.ceil(-Math.log10(absValue)) + 1);
    return `${sign}$${absValue.toFixed(Math.min(decimals, 6))}`;
  }
};


interface PercentageFormatOptions {
  showSign?: boolean;
  decimals?: number;
  neutralThreshold?: number;
}

export const formatPercentage = (
  value: number,
  options: PercentageFormatOptions = {}
): { formatted: string; colorClass: string; isPositive: boolean; isNeutral: boolean } => {
  const {
    showSign = true,
    decimals = 1,
    neutralThreshold = 0.1,
  } = options;

  if (isNaN(value) || !isFinite(value)) {
    return {
      formatted: '0%',
      colorClass: 'text-gray-400',
      isPositive: false,
      isNeutral: true,
    };
  }

  const absValue = Math.abs(value);
  const isPositive = value > neutralThreshold;
  const isNegative = value < -neutralThreshold;
  const isNeutral = !isPositive && !isNegative;

  const sign = showSign ? (value > 0 ? '+' : '') : '';
  const formatted = `${sign}${value.toFixed(decimals)}%`;

  let colorClass = 'text-gray-400';
  if (isPositive) {
    colorClass = 'text-green-400';
  } else if (isNegative) {
    colorClass = 'text-red-400';
  }

  return {
    formatted,
    colorClass,
    isPositive,
    isNeutral,
  };
};


export const formatTimer = (
  timeInSeconds: number,
  timerType: 'seconds' | 'minutes' | 'hours'
): { formatted: string; urgent: boolean; expired: boolean } => {
  if (timeInSeconds <= 0) {
    return {
      formatted: '0s',
      urgent: false,
      expired: true,
    };
  }

  const seconds = Math.floor(timeInSeconds);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  let formatted: string;
  let urgent = false;

  switch (timerType) {
    case 'seconds':
      formatted = `${seconds}s`;
      urgent = seconds <= 10; 
      break;

    case 'minutes':
      if (minutes >= 60) {
        const remainingMinutes = minutes % 60;
        formatted = remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
      } else {
        formatted = `${minutes}m`;
      }
      urgent = minutes <= 2; 
      break;

    case 'hours':
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        formatted = remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
      } else if (hours >= 1) {
        const remainingMinutes = minutes % 60;
        formatted = remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
      } else {
        formatted = `${minutes}m`;
      }
      urgent = hours <= 1;
      break;

    default:
      formatted = `${seconds}s`;
      break;
  }

  return {
    formatted,
    urgent,
    expired: false,
  };
};


interface NumberFormatOptions {
  compact?: boolean;
  precision?: number;
  showDecimals?: boolean;
}

export const formatNumber = (
  value: number,
  options: NumberFormatOptions = {}
): string => {
  const {
    compact = true,
    precision = 1,
    showDecimals = false,
  } = options;

  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }

  const absValue = Math.abs(value);

  if (!compact) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: showDecimals ? precision : 0,
      maximumFractionDigits: showDecimals ? precision : 0,
    });
  }

  if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(precision)}M`;
  } else if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(precision)}K`;
  } else {
    return value.toString();
  }
};


export const formatAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address || address.length <= startChars + endChars) {
    return address || '';
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};


export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? 'just now' : `${diffSeconds}s ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};


export const formatMarketCap = (marketCap: number): string => {
  return formatCurrency(marketCap, { compact: true, maxDecimals: 0 });
};


export const formatVolume = (volume: number): string => {
  return formatCurrency(volume, { compact: true, maxDecimals: 0 });
};


export const formatPriceChange = (priceChange: number) => {
  const percentage = formatPercentage(priceChange, { showSign: true, decimals: 2 });
  
  return {
    ...percentage,
    intensity: Math.min(Math.abs(priceChange) / 10, 1),
  };
};


export const formatBonding = (bondingPercentage: number): string => {
  if (isNaN(bondingPercentage) || !isFinite(bondingPercentage)) {
    return '0%';
  }

  return `${Math.round(bondingPercentage)}%`;
};


export const sanitizeNumeric = (value: any, fallback: number = 0): number => {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};


export const formatForClipboard = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};


export const getAdaptiveTextSize = (
  text: string,
  baseSize: string = 'text-sm'
): string => {
  const length = text.length;
  
  if (length > 30) return 'text-xs';
  if (length > 20) return 'text-sm';
  if (length > 10) return baseSize;
  
  return 'text-base';
};


export const formatSearchKeywords = (keywords: string): string[] => {
  return keywords
    .toLowerCase()
    .split(/\s+/)
    .filter(keyword => keyword.length > 0)
    .map(keyword => keyword.trim());
};