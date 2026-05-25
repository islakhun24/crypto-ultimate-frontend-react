import { useState } from 'react';
import { tokens, formatUSD, formatPrice, getSignalScore } from '@/shared/data/cryptoData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercent } from '@/shared/data/cryptoData';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Scanner', path: '/signals/scanner' },
  { label: 'History', path: '/signals/history' },
  { label: 'Strategy', path: '/signals/strategy-builder' },
  { label: 'Score', path: '/signals/signal-score' },
  { label: 'Pre-Pump', path: '/signals/pre-pump-scanner' },
];

export default function SignalScorePage() {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const token = tokens.find(t => t.symbol === selectedToken) || tokens[0];
  const signal = getSignalScore(token);

  const radarData = [
    { metric: 'Trend', value: token.price > token.ema20 ? 80 : token.price > token.ema50 ? 50 : 20 },
    { metric: 'Momentum', value: token.rsi14 },
    { metric: 'OI Flow', value: token.oiChange24h > 0 ? 70 : 30 },
    { metric: 'Volume', value: Math.min((token.volume24h / token.marketCap) * 500, 100) },
    { metric: 'Funding', value: token.fundingRate > 0 ? 60 : 75 },
    { metric: 'CVD', value: token.takerBuyRatio },
  ];

  const allScores = tokens.map(t => ({ ...t, ...getSignalScore(t) })).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Signal Score</h1>
          <p className="text-sm text-gray-400 mt-1">Comprehensive signal scoring system</p>
        </div>
        <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} className="bg-[#0a0a0a] border border-[#222] text-white text-sm rounded px-3 py-1.5 font-mono focus:border-cyan-500 outline-none">
          {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
        </select>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-neon p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4" style={{ color: signal.color }} /><span className="text-xs text-gray-400 font-mono">{token.symbol} SCORE</span></div>
          <p className="text-4xl font-bold font-mono" style={{ color: signal.color }}>{signal.score}<span className="text-lg text-gray-500">/100</span></p>
          <p className="text-sm font-mono mt-1" style={{ color: signal.color }}>{signal.label.toUpperCase()}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">BUY SIGNALS</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{allScores.filter(s => s.label.includes('Buy')).length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Minus className="w-4 h-4 text-yellow-400" /><span className="text-xs text-gray-400 font-mono">NEUTRAL</span></div>
          <p className="text-xl font-bold text-yellow-400 font-mono">{allScores.filter(s => s.label === 'Neutral').length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">SELL SIGNALS</span></div>
          <p className="text-xl font-bold text-red-400 font-mono">{allScores.filter(s => s.label.includes('Sell')).length}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">{token.symbol} Score Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#222" />
            <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={11} />
            <PolarRadiusAxis stroke="#555" fontSize={10} />
            <Radar name={token.symbol} dataKey="value" stroke={signal.color} fill={signal.color} fillOpacity={0.3} strokeWidth={2} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">All Token Scores</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={allScores.slice(0, 15)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} domain={[0, 100]} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {allScores.slice(0, 15).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Score Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">RANK</th>
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SCORE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIGNAL</th>
                <th className="text-right p-2 text-gray-400 font-mono">RSI</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI Δ</th>
                <th className="text-right p-2 text-gray-400 font-mono">FUNDING</th>
              </tr>
            </thead>
            <tbody>
              {allScores.map((s, i) => (
                <tr key={s.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer" onClick={() => setSelectedToken(s.symbol)}>
                  <td className="p-2 font-mono text-gray-500">#{i + 1}</td>
                  <td className="p-2 font-mono font-bold text-white">{s.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(s.price)}</td>
                  <td className="p-2 text-right font-mono font-bold" style={{ color: s.color }}>{s.score}</td>
                  <td className="p-2 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label.toUpperCase()}</span></td>
                  <td className="p-2 text-right font-mono text-white">{s.rsi14.toFixed(1)}</td>
                  <td className={`p-2 text-right font-mono ${s.oiChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPercent(s.oiChange24h)}</td>
                  <td className={`p-2 text-right font-mono ${s.fundingRate > 0.01 ? 'text-magenta-400' : 'text-gray-300'}`}>{(s.fundingRate * 100).toFixed(3)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}