// components/ui/Timer.tsx
import { formatTimer } from '../../utils/formatters';

interface TimerProps {
  timeInSeconds: number;
  timerType: 'seconds' | 'minutes' | 'hours';
  className?: string;
}

export const Timer = ({ timeInSeconds, timerType, className = '' }: TimerProps) => {
  const { formatted, urgent, expired } = formatTimer(timeInSeconds, timerType);

  const textColor = expired ? 'text-gray-500' 
    : urgent ? 'text-orange-400' 
    : 'text-green-400';

  return (
    <span className={`font-medium ${textColor} ${className}`}>
      {formatted}
    </span>
  );
};