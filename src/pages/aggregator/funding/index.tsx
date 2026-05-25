import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Overview', path: '/aggregator/overview' },
  { label: 'OI Change', path: '/aggregator/oi-change' },
  { label: 'Funding', path: '/aggregator/funding' },
  { label: 'Liquidations', path: '/aggregator/liquidations' },
];

export default function AggregatorFundingPage() {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const sortedByFunding = [...tokens].sort((a, b) => b.fundingRate - a.fundingRate);
  const positiveFunding = sortedByFunding.filter(t => t.fundingRate > 0);
  const negativeFunding = sortedByFunding.filter(t => t.fundingRate < 0);

  const displayTokens = filter === 'positive' ? positiveFunding : filter === 'negative' ? negativeFunding : sortedByFunding;

  const chartData = sortedByFunding.map(t => ({
    symbol: t.symbol,
    funding: t.fundingRate * 100,
  }));

  const extremeFunding = sortedByFunding.filter(t => Math.abs(t.fundingRate) > 0.01);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Funding Rate Aggregator</h1>
          <p className="text-sm text-gray-400 mt-1">Cross-exchange funding rates and premiums</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'positive', 'negative'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-mono rounded border ${filter === f ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">POSITIVE FUNDING</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{positiveFunding.length} tokens</p>
          <p className="text-xs text-gray-400 mt-1">Longs pay shorts</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">NEGATIVE FUNDING</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{negativeFunding.length} tokens</p>
          <p className="text-xs text-gray-400 mt-1">Shorts pay longs</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">EXTREME FUNDING</span>
          </div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{extremeFunding.length} tokens</p>
          <p className="text-xs text-gray-400 mt-1">{'>'} 1% funding rate</p>
        </div>
      </div>

      {extremeFunding.length > 0 && (
        <div className="card-neon p-4 border-magenta-500/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-magenta-400" />
            <h3 className="text-sm font-bold text-magenta-400 font-mono">EXTREME FUNDING ALERTS</h3>
          </div>
          <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {extremeFunding.map(t => (
              <div key={t.symbol} className="p-2 bg-magenta-500/10 rounded border border-magenta-500/20 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-white">{t.symbol}</span>
                  <span className="text-gray-400 ml-2">{formatPrice(t.price)}</span>
                </div>
                <span className={`font-mono font-bold ${t.fundingRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(t.fundingRate * 100).toFixed(3)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Funding Rate Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={10} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <ReferenceLine y={0} stroke="#555" />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value.toFixed(4)}%`} />
            <Bar dataKey="funding" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.funding >= 0 ? '#00ff88' : '#ff2d95'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Funding Rates Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">FUNDING</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S RATIO</th>
                <th className="text-right p-2 text-gray-400 font-mono">SENTIMENT</th>
              </tr>
            </thead>
            <tbody>
              {displayTokens.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className={`p-2 text-right font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</td>
                  <td className={`p-2 text-right font-mono font-bold ${t.fundingRate > 0.01 ? 'text-magenta-400' : t.fundingRate > 0 ? 'text-green-400' : t.fundingRate < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                    {(t.fundingRate * 100).toFixed(3)}%
                  </td>
                  <td className="p-2 text-right font-mono text-gray-300">{formatUSD(t.oi, true)}</td>
                  <td className="p-2 text-right font-mono text-white">{t.longShortRatio.toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.fundingRate > 0.008 ? 'bg-red-500/20 text-red-400' : t.fundingRate > 0.003 ? 'bg-yellow-500/20 text-yellow-400' : t.fundingRate < 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {t.fundingRate > 0.008 ? 'OVERHEATED' : t.fundingRate > 0.003 ? 'WARM' : t.fundingRate < 0 ? 'COLD' : 'NEUTRAL'}
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