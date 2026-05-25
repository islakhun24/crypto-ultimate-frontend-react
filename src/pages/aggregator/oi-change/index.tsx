import { useState } from 'react';
import { tokens, formatUSD, formatPercent, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Overview', path: '/aggregator/overview' },
  { label: 'OI Change', path: '/aggregator/oi-change' },
  { label: 'Funding', path: '/aggregator/funding' },
  { label: 'Liquidations', path: '/aggregator/liquidations' },
];

export default function AggregatorOIChangePage() {
  const [sortBy, setSortBy] = useState<'change' | 'value'>('change');

  const sortedTokens = [...tokens].sort((a, b) => {
    if (sortBy === 'change') return b.oiChange24h - a.oiChange24h;
    return b.oi - a.oi;
  });

  const biggestIncreases = sortedTokens.filter(t => t.oiChange24h > 0).slice(0, 10);
  const biggestDecreases = sortedTokens.filter(t => t.oiChange24h < 0).slice(0, 10);

  const chartData = sortedTokens.slice(0, 15).map(t => ({
    symbol: t.symbol,
    oiChange: t.oiChange24h,
    oi: t.oi,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">OI Change Aggregator</h1>
          <p className="text-sm text-gray-400 mt-1">Open interest change across all exchanges</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSortBy('change')} className={`px-3 py-1.5 text-xs font-mono rounded border ${sortBy === 'change' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>BY CHANGE</button>
          <button onClick={() => setSortBy('value')} className={`px-3 py-1.5 text-xs font-mono rounded border ${sortBy === 'value' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>BY VALUE</button>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-green-400 font-mono">BIGGEST OI INCREASES</h3>
          </div>
          <div className="space-y-2">
            {biggestIncreases.map(t => (
              <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-[#0a0a0a] rounded">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{t.symbol}</span>
                  <span className="text-gray-500">{formatPrice(t.price)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-400">{formatUSD(t.oi, true)}</span>
                  <span className="font-mono text-green-400">+{t.oiChange24h.toFixed(2)}%</span>
                  <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{width: `${Math.min(t.oiChange24h * 3, 100)}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-red-400 font-mono">BIGGEST OI DECREASES</h3>
          </div>
          <div className="space-y-2">
            {biggestDecreases.map(t => (
              <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-[#0a0a0a] rounded">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{t.symbol}</span>
                  <span className="text-gray-500">{formatPrice(t.price)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-400">{formatUSD(t.oi, true)}</span>
                  <span className="font-mono text-red-400">{t.oiChange24h.toFixed(2)}%</span>
                  <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{width: `${Math.min(Math.abs(t.oiChange24h) * 3, 100)}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">OI Change Visualization</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="oiChange" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.oiChange >= 0 ? '#00ff88' : '#ff2d95'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">All Tokens OI Change</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI Δ24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S RATIO</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIGNAL</th>
              </tr>
            </thead>
            <tbody>
              {sortedTokens.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className="p-2 text-right font-mono text-gray-300">{formatUSD(t.oi, true)}</td>
                  <td className={`p-2 text-right font-mono ${t.oiChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPercent(t.oiChange24h)}</td>
                  <td className="p-2 text-right font-mono text-white">{t.longShortRatio.toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.oiChange24h > 5 && t.price > t.ema20 ? 'bg-green-500/20 text-green-400' : t.oiChange24h < -3 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {t.oiChange24h > 5 && t.price > t.ema20 ? 'LONG BUILDUP' : t.oiChange24h < -3 && t.price < t.ema20 ? 'SHORT BUILDUP' : 'NEUTRAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}