import { useState } from 'react';
import { tokens, exchanges, formatUSD, formatPercent, formatPrice } from '@/shared/data/cryptoData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#00f0ff', '#ff00ff', '#b829dd', '#00ff88', '#ff6b35', '#f0e800'];

const sectionNavItems = [
  { label: 'Overview', path: '/aggregator/overview' },
  { label: 'OI Change', path: '/aggregator/oi-change' },
  { label: 'Funding', path: '/aggregator/funding' },
  { label: 'Liquidations', path: '/aggregator/liquidations' },
];

export default function AggregatorOverviewPage() {
  const [timeframe, setTimeframe] = useState('24h');

  const topOI = [...tokens].sort((a, b) => b.oi - a.oi).slice(0, 10);
  const topFunding = [...tokens].sort((a, b) => b.fundingRate - a.fundingRate).slice(0, 10);
  const topLiquidations = [...tokens].sort((a, b) => b.liquidation24h - a.liquidation24h).slice(0, 10);

  const totalOI = tokens.reduce((sum, t) => sum + t.oi, 0);
  const totalLiquidations = tokens.reduce((sum, t) => sum + t.liquidation24h, 0);
  const avgFunding = tokens.reduce((sum, t) => sum + t.fundingRate, 0) / tokens.length;
  const totalCVD = tokens.reduce((sum, t) => sum + t.cvd24h, 0);

  const oiByExchange = exchanges.map(ex => ({
    name: ex.name,
    oi: ex.oi,
    oiChange: ex.oiChange,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Aggregator Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Cross-exchange derivatives aggregation</p>
        </div>
        <div className="flex gap-2">
          {['1h', '4h', '24h', '7d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-[#0a0a0a] text-gray-400 border border-[#222] hover:border-cyan-500/30'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">TOTAL OI</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(totalOI, true)}</p>
          <p className="text-xs text-green-400 mt-1">+3.21% (24h)</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">AVG FUNDING</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{(avgFunding * 100).toFixed(2)}%</p>
          <p className="text-xs text-green-400 mt-1">Neutral</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">LIQUIDATIONS 24H</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(totalLiquidations, true)}</p>
          <p className="text-xs text-red-400 mt-1">+12.4% vs avg</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">CVD 24H</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">+{formatUSD(totalCVD, true)}</p>
          <p className="text-xs text-green-400 mt-1">Buying pressure</p>
        </div>
      </div>

      {/* OI by Exchange */}
      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Open Interest by Exchange</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={oiByExchange}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" stroke="#555" fontSize={12} />
            <YAxis stroke="#555" fontSize={12} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(value: number) => formatUSD(value, true)}
            />
            <Bar dataKey="oi" fill="#00f0ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Three columns */}
      <div className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top OI */}
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-400 font-mono">TOP OI</h3>
          </div>
          <div className="space-y-2">
            {topOI.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between text-xs">
                <span className="font-mono text-white">{token.symbol}</span>
                <span className="font-mono text-gray-400">{formatUSD(token.oi, true)}</span>
                <span className={token.oiChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatPercent(token.oiChange24h)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Funding */}
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-magenta-400" />
            <h3 className="text-sm font-bold text-magenta-400 font-mono">HIGHEST FUNDING</h3>
          </div>
          <div className="space-y-2">
            {topFunding.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between text-xs">
                <span className="font-mono text-white">{token.symbol}</span>
                <span className="font-mono text-gray-400">{(token.fundingRate * 100).toFixed(3)}%</span>
                <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-magenta-400 rounded-full"
                    style={{ width: `${Math.min(token.fundingRate * 2000, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Liquidations */}
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-red-400 font-mono">TOP LIQUIDATIONS</h3>
          </div>
          <div className="space-y-2">
            {topLiquidations.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between text-xs">
                <span className="font-mono text-white">{token.symbol}</span>
                <span className="font-mono text-gray-400">{formatUSD(token.liquidation24h, true)}</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-red-400" />
                  <span className="text-red-400">{formatPercent(token.longLiquidation / token.liquidation24h * 100)} L</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funding Distribution Pie */}
      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-magenta mb-4">OI Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={topOI.slice(0, 6)}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="oi"
              nameKey="symbol"
              label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(1)}%`}
            >
              {topOI.slice(0, 6).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(value: number) => formatUSD(value, true)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Full Token Table */}
      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">All Tokens Derivatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI Δ24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">FUNDING</th>
                <th className="text-right p-2 text-gray-400 font-mono">LIQ 24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S RATIO</th>
                <th className="text-right p-2 text-gray-400 font-mono">CVD 24H</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.symbol} className="border-b border-[#1a1a1a] table-row-animate">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{token.symbol}</span>
                      <span className="text-gray-500">{token.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(token.price)}</td>
                  <td className="p-2 text-right font-mono text-white">{formatUSD(token.oi, true)}</td>
                  <td className={`p-2 text-right font-mono ${token.oiChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(token.oiChange24h)}
                  </td>
                  <td className={`p-2 text-right font-mono ${token.fundingRate > 0.01 ? 'text-magenta-400' : 'text-gray-300'}`}>
                    {(token.fundingRate * 100).toFixed(3)}%
                  </td>
                  <td className="p-2 text-right font-mono text-red-400">{formatUSD(token.liquidation24h, true)}</td>
                  <td className="p-2 text-right font-mono text-white">{token.longShortRatio.toFixed(2)}</td>
                  <td className={`p-2 text-right font-mono ${token.cvd24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.cvd24h >= 0 ? '+' : ''}{formatUSD(token.cvd24h, true)}
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
