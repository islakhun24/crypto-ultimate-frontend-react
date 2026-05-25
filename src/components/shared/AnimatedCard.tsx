import { cn } from '@/shared/utils/cn';
import type { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: 'glow' | 'lift' | 'scale' | 'none';
  onClick?: () => void;
}

export default function AnimatedCard({ children, className, delay = 0, hover = 'glow', onClick }: AnimatedCardProps) {
  const hoverStyles: Record<string, string> = {
    glow: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]',
    lift: 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,240,255,0.12)]',
    scale: 'hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(0,240,255,0.1)]',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4 transition-all duration-500 ease-out',
        'border border-[#1a1a2e] bg-[#0f0f1a]/80 backdrop-blur-xl',
        hoverStyles[hover],
        className
      )}
      style={{
        animation: `cardReveal 0.6s ease-out ${delay}s both`,
      }}
      onMouseEnter={e => {
        if (hover === 'glow') {
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0,240,255,0.1)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {children}
    </div>
  );
}
