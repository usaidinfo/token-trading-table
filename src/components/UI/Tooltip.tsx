// components/UI/Tooltip.tsx 
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 500,
  className = '' 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      
      let style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 60,
        pointerEvents: 'none',
      };

      switch (position) {
        case 'top':
          style.bottom = window.innerHeight - triggerRect.top + 8;
          style.left = triggerRect.left + triggerRect.width / 2;
          style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          style.top = triggerRect.bottom + 8;
          style.left = triggerRect.left + triggerRect.width / 2;
          style.transform = 'translateX(-50%)';
          break;
        case 'left':
          style.top = triggerRect.top + triggerRect.height / 2;
          style.right = window.innerWidth - triggerRect.left + 8;
          style.transform = 'translateY(-50%)';
          break;
        case 'right':
          style.top = triggerRect.top + triggerRect.height / 2;
          style.left = triggerRect.right + 8;
          style.transform = 'translateY(-50%)';
          break;
      }

      setTooltipStyle(style);
    }
  }, [isVisible, position]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && typeof window !== 'undefined' &&
        createPortal(
          <div
            style={tooltipStyle}
            className={`bg-black/90 text-white text-xs px-2 py-1 rounded border border-gray-600 animate-fade-in whitespace-nowrap ${className}`}
          >
            {content}
            <div className={`absolute w-2 h-2 bg-black/90 border rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-b-0 border-r-0' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t-0 border-l-0' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-b-0 border-l-0' :
              'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-0 border-r-0'
            } border-gray-600`}></div>
          </div>,
          document.body
        )
      }
    </>
  );
};