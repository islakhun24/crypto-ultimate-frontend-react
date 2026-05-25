import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Skull } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#ff2d95', '#ff6b35', '#f0e800', '#00ff88', '#00f0ff', '#b829dd'];

const sectionNavItems = [
  { label: 'Overview', path: '/aggregator/overview' },
  { label: 'OI Change', path: '/aggregator/oi-change' },
  { label: 'Funding', path: '/aggregator/funding' },
  { label: 'Liquidations', path: '/aggregator/liquidations' },
];

export default function AggregatorLiquidationsPage() {
  const [timeframe, setTimeframe] = useState('24h');

  const sortedByLiq = [...tokens].sort((a, b) => b.liquidation24h - a.liquidation24h);
  const totalLiq = tokens.reduce((sum, t) => sum + t.liquidation24h, 0);
  const totalLongLiq = tokens.reduce((sum, t) => sum + t.longLiquidation, 0);
  const totalShortLiq = tokens.reduce((sum, t) => sum + t.shortLiquidation, 0);
  const longLiqPct = (totalLongLiq / totalLiq * 100).toFixed(1);

  const liqDistribution = [
    { name: 'Long Liquidations', value: totalLongLiq },
    { name: 'Short Liquidations', value: totalShortLiq },
  ];

  const chartData = sortedByLiq.slice(0, 12).map(t => ({
    symbol: t.symbol,
    longLiq: t.longLiquidation,
    shortLiq: t.shortLiquidation,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-red">Liquidations Aggregator</h1>
          <p className="text-sm text-gray-400 mt-1">Cross-exchange liquidation tracking</p>
        </div>
        <div className="flex gap-2">
          {['1h', '4h', '24h', '7d'].map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1.5 text-xs font-mono rounded border ${timeframe === tf ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-[#222] text-gray-400'}`}>{tf}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Skull className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">TOTAL LIQUIDATED</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{formatUSD(totalLiq, true)}</p>
          <p className="text-xs text-gray-400 mt-1">Last {timeframe}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">LONG LIQUIDATIONS</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{formatUSD(totalLongLiq, true)}</p>
          <p className="text-xs text-gray-400 mt-1">{longLiqPct}% of total</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">SHORT LIQUIDATIONS</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{formatUSD(totalShortLiq, true)}</p>
          <p className="text-xs text-gray-400 mt-1">{(100 - parseFloat(longLiqPct)).toFixed(1)}% of total</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">MOST AFFECTED</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{sortedByLiq[0].symbol}</p>
          <p className="text-xs text-gray-400 mt-1">{formatUSD(sortedByLiq[0].liquidation24h, true)}</p>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-red mb-4">Long vs Short Liquidations</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
              <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
              <Legend />
              <Bar dataKey="longLiq" name="Long" fill="#ff2d95" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortLiq" name="Short" fill="#00ff88" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-magenta mb-4">Liquidation Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={liqDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label>
                {liqDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-red mb-4">Liquidation Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">24H CHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">TOTAL LIQ</th>
                <th className="text-right p-2 text-gray-400 font-mono">LONG LIQ</th>
                <th className="text-right p-2 text-gray-400 font-mono">SHORT LIQ</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S RATIO</th>
              </tr>
            </thead>
            <tbody>
              {sortedByLiq.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className={`p-2 text-right font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono text-red-400">{formatUSD(t.liquidation24h, true)}</td>
                  <td className="p-2 text-right font-mono text-red-400">{formatUSD(t.longLiquidation, true)}</td>
                  <td className="p-2 text-right font-mono text-green-400">{formatUSD(t.shortLiquidation, true)}</td>
                  <td className="p-2 text-right font-mono text-white">{t.longShortRatio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}