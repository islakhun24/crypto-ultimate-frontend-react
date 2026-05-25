import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/data/cryptoData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerData {
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  oi: number;
}

const tickerData: TickerData[] = tokens.slice(0, 25);

function TickerItem({ data }: { data: TickerData }) {
  const isUp = data.change24h >= 0;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 shrink-0 whitespace-nowrap">
      <span className="text-[11px] font-bold tracking-wider" style={{ color: '#e2e8f0' }}>
        {data.symbol}
      </span>
      <span className="text-[11px] font-mono" style={{ color: isUp ? '#00ff88' : '#ff2d5f' }}>
        {data.price >= 1 ? data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.price.toFixed(6)}
      </span>
      <span className="inline-flex items-center gap-0.5">
        {isUp ? <TrendingUp size={8} style={{ color: '#00ff88' }} /> : <TrendingDown size={8} style={{ color: '#ff2d5f' }} />}
        <span className="text-[10px] font-mono font-bold" style={{ color: isUp ? '#00ff88' : '#ff2d5f' }}>
          {isUp ? '+' : ''}{data.change24h.toFixed(2)}%
        </span>
      </span>
    </span>
  );
}

export default function TickerBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    let animId: number;
    let pos = 0;
    const speed = 1.5;

    const scroll = () => {
      pos += speed;
      if (el) {
        const half = el.scrollWidth / 2;
        if (pos >= half) pos = 0;
        el.style.transform = `translateX(-${pos}px)`;
      }
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Double the items for seamless loop
  const doubled = [...tickerData, ...tickerData];

  return (
    <div
      className="fixed top-0 left-0 right-0 overflow-hidden"
      style={{
        height: 30,
        zIndex: 35,
        background: 'linear-gradient(180deg, #020205 0%, #0a0a18 100%)',
        borderBottom: '1px solid rgba(0,240,255,0.08)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Neon glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.3), rgba(184,41,221,0.3), transparent)' }} />

      <div
        ref={scrollRef}
        className="flex items-center h-full will-change-transform"
        style={{ width: 'max-content' }}
      >
        {doubled.map((t, i) => (
          <TickerItem key={`${t.symbol}-${i}`} data={t} />
        ))}
      </div>
    </div>
  );
}
