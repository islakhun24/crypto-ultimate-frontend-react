import { useState } from 'react';
import { tokens, formatUSD, formatPrice, formatPercent } from '@/shared/data/cryptoData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { GitFork, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Price-OI Div', path: '/intelligence/price-oi-divergence' },
  { label: 'Exchange Div', path: '/intelligence/exchange-divergence' },
  { label: 'Market Pressure', path: '/intelligence/market-pressure' },
  { label: 'Anomaly', path: '/intelligence/anomaly-detector' },
];

export default function PriceOIDivergencePage() {
  const [divergenceType, setDivergenceType] = useState<'all' | 'bullish' | 'bearish'>('all');

  const divergenceData = tokens.map(t => {
    const priceChange = t.change24h;
    const oiChange = t.oiChange24h;
    const divergence = oiChange - priceChange;
    return {
      symbol: t.symbol,
      priceChange,
      oiChange,
      divergence,
      price: t.price,
      oi: t.oi,
      type: divergence > 2 ? 'bearish' : divergence < -2 ? 'bullish' : 'neutral',
    };
  });

  const filtered = divergenceType === 'all' ? divergenceData : divergenceData.filter(d => d.type === divergenceType);
  const bullishDivs = divergenceData.filter(d => d.type === 'bullish');
  const bearishDivs = divergenceData.filter(d => d.type === 'bearish');

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Price-OI Divergence</h1>
          <p className="text-sm text-gray-400 mt-1">Detect divergence between price and open interest</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'bullish', 'bearish'] as const).map(t => (
            <button key={t} onClick={() => setDivergenceType(t)} className={`px-3 py-1.5 text-xs font-mono rounded border ${divergenceType === t ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">DIVERGENCES</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{bullishDivs.length + bearishDivs.length}</p>
        </div>
        <div className="card-neon p-4 border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">BULLISH DIV</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{bullishDivs.length}</p>
          <p className="text-xs text-gray-400 mt-1">Price ↓ OI ↑ or Price ↑ OI ↓↓</p>
        </div>
        <div className="card-neon p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">BEARISH DIV</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{bearishDivs.length}</p>
          <p className="text-xs text-gray-400 mt-1">Price ↑ OI ↓ or Price ↓ OI ↑↑</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Price Change vs OI Change</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis type="number" dataKey="priceChange" name="Price Change %" stroke="#555" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <YAxis type="number" dataKey="oiChange" name="OI Change %" stroke="#555" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <ReferenceLine x={0} stroke="#555" />
            <ReferenceLine y={0} stroke="#555" />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]} />
            <Scatter data={filtered}>
              {filtered.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'bullish' ? '#00ff88' : entry.type === 'bearish' ? '#ff2d95' : '#666'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4 border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-green-400 font-mono">BULLISH DIVERGENCES</h3>
          </div>
          <div className="space-y-2">
            {bullishDivs.map(d => (
              <div key={d.symbol} className="flex items-center justify-between text-xs p-2 bg-green-500/5 rounded border border-green-500/10">
                <span className="font-mono font-bold text-white">{d.symbol}</span>
                <span className="text-gray-400">{formatPrice(d.price)}</span>
                <span className="text-red-400">{d.priceChange.toFixed(2)}%</span>
                <span className="text-green-400">+{d.oiChange.toFixed(2)}% OI</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-neon p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-red-400 font-mono">BEARISH DIVERGENCES</h3>
          </div>
          <div className="space-y-2">
            {bearishDivs.map(d => (
              <div key={d.symbol} className="flex items-center justify-between text-xs p-2 bg-red-500/5 rounded border border-red-500/10">
                <span className="font-mono font-bold text-white">{d.symbol}</span>
                <span className="text-gray-400">{formatPrice(d.price)}</span>
                <span className="text-green-400">+{d.priceChange.toFixed(2)}%</span>
                <span className="text-red-400">{d.oiChange.toFixed(2)}% OI</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}