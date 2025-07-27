// components/ui/MetricChip.tsx
import { MetricIcon } from './Icon';
import { formatPercentage } from '../../utils/formatters';

interface MetricChipProps {
  value: number;
  type: 'growth' | 'chef' | 'target' | 'other';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const MetricChip = ({
  value,
  type,
  size = 'sm',
  showIcon = true,
  className = '',
}: MetricChipProps) => {
  const { formatted, isPositive, isNeutral } = formatPercentage(value, {
    showSign: true,
    decimals: 0,
  });

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';
  const bgColor = isPositive ? 'bg-green-500/10 border-green-500/20' 
    : !isNeutral ? 'bg-red-500/10 border-red-500/20' 
    : 'bg-gray-500/10 border-gray-500/20';
  const textColor = isPositive ? 'text-green-400' 
    : !isNeutral ? 'text-red-400' 
    : 'text-gray-400';

  return (
    <div className={`inline-flex items-center gap-1 rounded-xl border ${sizeClasses} ${bgColor} transition-all duration-200 ${className}`}>
      {showIcon && <MetricIcon value={value} type={type} size={size === 'sm' ? 12 : 14} />}
      <span className={`font-medium ${textColor}`}>{formatted}</span>
    </div>
  );
};

interface PercentageChipProps {
  value: number;
  size?: 'sm' | 'md';
  showSign?: boolean;
  className?: string;
}

export const PercentageChip = ({
  value,
  size = 'sm',
  showSign = true,
  className = '',
}: PercentageChipProps) => {
  const { formatted, colorClass } = formatPercentage(value, { showSign, decimals: 0 });
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-md ${sizeClasses} ${colorClass} font-medium ${className}`}>
      {formatted}
    </span>
  );
};