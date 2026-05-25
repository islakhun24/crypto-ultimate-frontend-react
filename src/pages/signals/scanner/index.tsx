import { useState } from 'react';
import { tokens, formatUSD, formatPrice, getSignalScore } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Radar, Zap, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#00ff88', '#00f0ff', '#f0e800', '#ff6b35', '#ff2d95'];

const sectionNavItems = [
  { label: 'Scanner', path: '/signals/scanner' },
  { label: 'History', path: '/signals/history' },
  { label: 'Strategy', path: '/signals/strategy-builder' },
  { label: 'Score', path: '/signals/signal-score' },
  { label: 'Pre-Pump', path: '/signals/pre-pump-scanner' },
];

export default function SignalScannerPage() {
  const [minScore, setMinScore] = useState(40);
  const [category, setCategory] = useState('all');

  const signals = tokens.map(t => {
    const signal = getSignalScore(t);
    return { ...t, ...signal };
  });

  const filtered = signals
    .filter(s => s.score >= minScore)
    .filter(s => category === 'all' || s.label.toLowerCase().includes(category.toLowerCase()))
    .sort((a, b) => b.score - a.score);

  const scoreDistribution = [
    { name: 'Strong Buy', value: signals.filter(s => s.label === 'Strong Buy').length },
    { name: 'Buy', value: signals.filter(s => s.label === 'Buy').length },
    { name: 'Neutral', value: signals.filter(s => s.label === 'Neutral').length },
    { name: 'Sell', value: signals.filter(s => s.label === 'Sell').length },
    { name: 'Strong Sell', value: signals.filter(s => s.label === 'Strong Sell').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Signal Scanner</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time trading signal scanner</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-2 py-1.5 font-mono">
            <option value="all">ALL</option>
            <option value="buy">BUY</option>
            <option value="sell">SELL</option>
            <option value="neutral">NEUTRAL</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">MIN</span>
            <input type="range" min="0" max="100" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-20 accent-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">{minScore}</span>
          </div>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-2 md:grid-cols-5 gap-3">
        {scoreDistribution.map((d, i) => (
          <div key={d.name} className="card-neon p-3 text-center">
            <p className="text-lg font-bold font-mono" style={{ color: COLORS[i] }}>{d.value}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">{d.name.toUpperCase()}</p>
          </div>
        ))}
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Signal Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={scoreDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label>
                {scoreDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Top Signals</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filtered.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
              <YAxis stroke="#555" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {filtered.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Signal Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">SCORE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIGNAL</th>
                <th className="text-right p-2 text-gray-400 font-mono">RSI</th>
                <th className="text-right p-2 text-gray-400 font-mono">FUNDING</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{s.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(s.price)}</td>
                  <td className={`p-2 text-right font-mono ${s.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.change24h >= 0 ? '+' : ''}{s.change24h.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono font-bold" style={{ color: s.color }}>{s.score}</td>
                  <td className="p-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>
                      {s.label.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2 text-right font-mono text-white">{s.rsi14.toFixed(1)}</td>
                  <td className={`p-2 text-right font-mono ${s.fundingRate > 0.01 ? 'text-magenta-400' : 'text-gray-300'}`}>{(s.fundingRate * 100).toFixed(3)}%</td>
                  <td className="p-2 text-right font-mono text-white">{s.longShortRatio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}