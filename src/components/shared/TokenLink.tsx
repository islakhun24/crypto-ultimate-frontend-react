import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface TokenLinkProps {
  symbol: string;
  className?: string;
  showColor?: boolean;
}

export default function TokenLink({ symbol, className, showColor = true }: TokenLinkProps) {
  return (
    <Link
      to={`/token/${symbol}`}
      className={cn(
        'inline-flex items-center gap-1 font-mono font-bold transition-all duration-200 hover:underline',
        showColor && 'text-cyan-400 hover:text-cyan-300',
        !showColor && 'text-inherit',
        className
      )}
      style={showColor ? { textShadow: '0 0 8px rgba(0,240,255,0.3)' } : {}}
    >
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{
          background: `linear-gradient(135deg, #00f0ff, #b829dd)`,
        }}
      />
      {symbol}
    </Link>
  );
}
