import { cn } from '@/shared/utils/cn';

interface ShimmerProps {
  className?: string;
  rows?: number;
  height?: number;
}

export function ShimmerLine({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('rounded-lg animate-shimmer', className)}
      style={{
        background: 'linear-gradient(90deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
    />
  );
}

export default function Shimmer({ className, rows = 5, height = 40 }: ShimmerProps) {
  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <ShimmerLine key={i} className="w-full" style={{ height }} />
      ))}
    </div>
  );
}

export function ShimmerCard() {
  const lineStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #0f0f1a, #1a1a2e, #0f0f1a)',
    backgroundSize: '200% 100%',
  };

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a1a2e]"
      style={{
        background: 'linear-gradient(135deg, rgba(0,240,255,0.02), rgba(184,41,221,0.02))',
      }}
    >
      <div className="animate-shimmer space-y-4">
        <div className="h-4 w-1/3 rounded" style={lineStyle} />
        <div className="h-8 w-2/3 rounded" style={lineStyle} />
        <div className="h-3 w-full rounded" style={lineStyle} />
      </div>
    </div>
  );
}
