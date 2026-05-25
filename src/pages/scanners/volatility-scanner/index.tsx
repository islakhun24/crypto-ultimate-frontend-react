import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Volatility', path: '/scanners/volatility-scanner' },
  { label: 'Liquidity', path: '/scanners/liquidity-spread-monitor' },
];

export default function VolatilityScannerPage() {
  const [minVol, setMinVol] = useState(5);

  const volData = tokens.map(t => {
    const volatility = Math.abs(t.change24h) + Math.abs(t.change7d) / 7;
    return { ...t, volatility: Math.min(volatility, 50) };
  }).filter(t => t.volatility >= minVol).sort((a, b) => b.volatility - a.volatility);

  const highVol = volData.filter(t => t.volatility > 10);
  const extremeVol = volData.filter(t => t.volatility > 20);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Volatility Scanner</h1>
          <p className="text-sm text-gray-400 mt-1">Track volatility across all tokens</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">MIN VOL %</span>
          <input type="range" min="0" max="30" value={minVol} onChange={e => setMinVol(Number(e.target.value))} className="w-24 accent-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">{minVol}%</span>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">HIGH VOL</span></div><p className="text-xl font-bold text-orange-400 font-mono">{highVol.length}</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">EXTREME VOL</span></div><p className="text-xl font-bold text-magenta-400 font-mono">{extremeVol.length}</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">HIGHEST</span></div><p className="text-xl font-bold text-white font-mono">{volData[0]?.symbol || 'N/A'}</p><p className="text-xs text-magenta-400">{volData[0]?.volatility.toFixed(1)}%</p></div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Volatility Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volData.slice(0, 15)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="volatility" radius={[4, 4, 0, 0]}>
              {volData.slice(0, 15).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.volatility > 20 ? '#ff00ff' : entry.volatility > 10 ? '#ff6b35' : '#00f0ff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Volatility Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">7D</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOLATILITY</th>
                <th className="text-right p-2 text-gray-400 font-mono">LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {volData.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className={`p-2 text-right font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</td>
                  <td className={`p-2 text-right font-mono ${t.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change7d >= 0 ? '+' : ''}{t.change7d.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono font-bold" style={{color: t.volatility > 20 ? '#ff00ff' : t.volatility > 10 ? '#ff6b35' : '#00f0ff'}}>{t.volatility.toFixed(2)}%</td>
                  <td className="p-2 text-right"><span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.volatility > 20 ? 'bg-magenta-500/20 text-magenta-400' : t.volatility > 10 ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'}`}>{t.volatility > 20 ? 'EXTREME' : t.volatility > 10 ? 'HIGH' : 'ELEVATED'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}