// components/ui/Icon.tsx
import { 
  User, Globe, Search, Users, Settings, Trophy, Crown, 
  ChefHat, Target, Copy, ExternalLink, Timer,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { ICON_TYPES } from '../../utils/constants';
import type { IconType } from '../../utils/constants';

interface IconProps {
  type: IconType;
  size?: number;
  className?: string;
  active?: boolean;
}

export const Icon = ({ type, size = 16, className = '', active = true }: IconProps) => {
  const baseClasses = `transition-colors duration-200 ${active ? 'text-current' : 'text-gray-500'} ${className}`;

  const iconMap = {
    [ICON_TYPES.person]: User,
    [ICON_TYPES.web]: Globe,
    [ICON_TYPES.search]: Search,
    [ICON_TYPES.multiPerson]: Users,
    [ICON_TYPES.settings]: Settings,
    [ICON_TYPES.achievement]: Trophy,
    [ICON_TYPES.crown]: Crown,
    [ICON_TYPES.chef]: ChefHat,
    [ICON_TYPES.target]: Target,
    [ICON_TYPES.copy]: Copy,
    [ICON_TYPES.external]: ExternalLink,
  };

  const IconComponent = iconMap[type] || User;
  return <IconComponent size={size} className={baseClasses} />;
};

interface MetricIconProps {
  value: number;
  type: 'growth' | 'chef' | 'target' | 'other';
  size?: number;
  className?: string;
}

export const MetricIcon = ({ value, type, size = 14, className = '' }: MetricIconProps) => {
  const getIcon = () => {
    switch (type) {
      case 'growth':
        if (value > 0) return { icon: TrendingUp, color: 'text-green-400' };
        if (value < 0) return { icon: TrendingDown, color: 'text-red-400' };
        return { icon: Minus, color: 'text-gray-400' };
      case 'chef':
        return { 
          icon: ChefHat, 
          color: value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400' 
        };
      case 'target':
        return { icon: Target, color: 'text-blue-400' };
      default:
        return { icon: User, color: 'text-gray-400' };
    }
  };

  const { icon: IconComponent, color } = getIcon();
  return <IconComponent size={size} className={`${color} ${className}`} />;
};