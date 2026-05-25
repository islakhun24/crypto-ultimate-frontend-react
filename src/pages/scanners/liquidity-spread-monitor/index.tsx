import { useState } from 'react';
import { exchanges, formatUSD } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Volatility', path: '/scanners/volatility-scanner' },
  { label: 'Liquidity', path: '/scanners/liquidity-spread-monitor' },
];

export default function LiquiditySpreadMonitorPage() {
  const [minSpread, setMinSpread] = useState(0);

  const spreadData = exchanges.map(ex => ({
    name: ex.name,
    avgSpread: ex.avgSpread,
    avgLatency: ex.avgLatency,
    status: ex.status,
    depth: ex.pairs.reduce((s, p) => s + p.depth, 0) / ex.pairs.length,
  })).filter(e => e.avgSpread * 100 >= minSpread).sort((a, b) => b.avgSpread - a.avgSpread);

  const problemExchanges = spreadData.filter(e => e.avgSpread > 0.01 || e.status !== 'Operational');

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Liquidity & Spread Monitor</h1>
          <p className="text-sm text-gray-400 mt-1">Exchange liquidity and spread analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">MIN SPREAD %</span>
          <input type="range" min="0" max="500" value={minSpread} onChange={e => setMinSpread(Number(e.target.value))} className="w-24 accent-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">{minSpread / 100}%</span>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><Droplets className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">AVG SPREAD</span></div><p className="text-xl font-bold text-white font-mono">{(spreadData.reduce((s, e) => s + e.avgSpread, 0) / spreadData.length * 100).toFixed(3)}%</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">PROBLEMS</span></div><p className="text-xl font-bold text-magenta-400 font-mono">{problemExchanges.length}</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">BEST SPREAD</span></div><p className="text-xl font-bold text-green-400 font-mono">{spreadData[spreadData.length - 1]?.name || 'N/A'}</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">WORST SPREAD</span></div><p className="text-xl font-bold text-red-400 font-mono">{spreadData[0]?.name || 'N/A'}</p></div>
      </div>

      {problemExchanges.length > 0 && (
        <div className="card-neon p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-400" /><h3 className="text-sm font-bold text-red-400 font-mono">LIQUIDITY ALERTS</h3></div>
          <div className="space-y-2">
            {problemExchanges.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs p-2 bg-red-500/5 rounded border border-red-500/10">
                <span className="font-mono font-bold text-white">{e.name}</span>
                <span className="text-gray-400">Spread: {(e.avgSpread * 100).toFixed(3)}%</span>
                <span className="text-gray-400">Latency: {e.avgLatency}ms</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${e.status === 'Operational' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{e.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Spread by Exchange</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={spreadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(2)}%`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${(value * 100).toFixed(3)}%`} />
            <Bar dataKey="avgSpread" radius={[4, 4, 0, 0]} fill="#00f0ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Exchange Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SPREAD</th>
                <th className="text-right p-2 text-gray-400 font-mono">LATENCY</th>
                <th className="text-right p-2 text-gray-400 font-mono">AVG DEPTH</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {spreadData.map(e => (
                <tr key={e.name} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{e.name}</td>
                  <td className={`p-2 text-right font-mono ${e.avgSpread > 0.01 ? 'text-red-400' : e.avgSpread > 0.005 ? 'text-yellow-400' : 'text-green-400'}`}>{(e.avgSpread * 100).toFixed(3)}%</td>
                  <td className={`p-2 text-right font-mono ${e.avgLatency > 100 ? 'text-red-400' : e.avgLatency > 50 ? 'text-yellow-400' : 'text-green-400'}`}>{e.avgLatency}ms</td>
                  <td className="p-2 text-right font-mono text-white">{e.depth.toFixed(0)}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-mono ${e.status === 'Operational' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{e.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}