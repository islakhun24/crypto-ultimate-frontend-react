import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Fuel, TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const gasData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  ethereum: Math.random() * 80 + 20 + (i > 8 && i < 20 ? 30 : 0),
  bsc: Math.random() * 10 + 3,
  arbitrum: Math.random() * 5 + 1,
  optimism: Math.random() * 3 + 0.5,
  base: Math.random() * 4 + 1,
}));

const currentGas = {
  ethereum: { value: 45, unit: 'gwei', change24h: -12.5, speed: { slow: 35, standard: 45, fast: 62, urgent: 85 } },
  bsc: { value: 8, unit: 'gwei', change24h: 3.2 },
  arbitrum: { value: 2.1, unit: 'gwei', change24h: -5.1 },
  optimism: { value: 1.4, unit: 'gwei', change24h: -2.8 },
  base: { value: 1.8, unit: 'gwei', change24h: 8.4 },
};

const sectionNavItems = [
  { label: 'Whale Tracker', path: '/on-chain/whale-tracker' },
  { label: 'Gas Tracker', path: '/on-chain/gas-tracker' },
  { label: 'Token Flows', path: '/on-chain/token-flows' },
];

export default function GasTrackerPage() {
  const [chain, setChain] = useState<'ethereum' | 'bsc' | 'arbitrum' | 'optimism' | 'base'>('ethereum');

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Gas Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">Multi-chain gas price monitoring</p>
        </div>
        <div className="flex gap-2">
          {(['ethereum', 'bsc', 'arbitrum', 'optimism', 'base'] as const).map(c => (
            <button key={c} onClick={() => setChain(c)} className={`px-3 py-1.5 text-xs font-mono rounded border ${chain === c ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{c.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(currentGas).map(([name, data]) => (
          <div key={name} className={`card-neon p-4 ${name === chain ? 'border-cyan-500/30' : ''}`}>
            <div className="flex items-center gap-2 mb-2"><Fuel className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">{name.toUpperCase()}</span></div>
            <p className="text-xl font-bold text-white font-mono">{data.value} <span className="text-sm text-gray-500">{data.unit}</span></p>
            <p className={`text-xs mt-1 ${data.change24h >= 0 ? 'text-red-400' : 'text-green-400'}`}>{data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      {chain === 'ethereum' && (
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Ethereum Gas Speeds</h3>
          <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentGas.ethereum.speed).map(([speed, value]) => (
              <div key={speed} className="p-4 bg-[#0a0a0a] rounded border border-[#222] text-center">
                <p className="text-xs text-gray-400 font-mono uppercase mb-1">{speed}</p>
                <p className="text-2xl font-bold text-white font-mono">{value}</p>
                <p className="text-xs text-gray-500">gwei</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Gas Price History (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={gasData}>
            <defs>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="hour" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            <Area type="monotone" dataKey={chain} stroke="#00f0ff" fill="url(#gasGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Multi-Chain Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={gasData.slice(0, 12)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="hour" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={11} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            <Bar dataKey="ethereum" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bsc" fill="#ff00ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="arbitrum" fill="#00ff88" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}