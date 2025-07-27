import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Popover = ({ trigger, content, position = 'bottom', className = '' }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current?.getBoundingClientRect();
      
      let style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
      };

      switch (position) {
        case 'bottom':
          style.top = triggerRect.bottom + 8;
          style.left = triggerRect.left;
          break;
        case 'top':
          style.bottom = window.innerHeight - triggerRect.top + 8;
          style.left = triggerRect.left;
          break;
        case 'right':
          style.top = triggerRect.top;
          style.left = triggerRect.right + 8;
          break;
        case 'left':
          style.top = triggerRect.top;
          style.right = window.innerWidth - triggerRect.left + 8;
          break;
      }

      setPopoverStyle(style);
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      
      {isOpen && typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className={`bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 animate-fade-in ${className}`}
          >
            {content}
          </div>,
          document.body
        )
      }
    </>
  );
};