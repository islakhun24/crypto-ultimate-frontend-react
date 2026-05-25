import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Sankey } from 'recharts';
import { ArrowRightLeft, TrendingUp, TrendingDown, Building2, Wallet } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const exchangeFlows = [
  { from: 'Binance', to: 'Bybit', value: 42000000 },
  { from: 'Bybit', to: 'Binance', value: 38000000 },
  { from: 'Binance', to: 'OKX', value: 28000000 },
  { from: 'OKX', to: 'Binance', value: 32000000 },
  { from: 'Bybit', to: 'OKX', value: 18000000 },
  { from: 'Unknown', to: 'Binance', value: 65000000 },
  { from: 'Binance', to: 'Unknown', value: 52000000 },
];

const tokenFlows = tokens.slice(0, 8).map(t => ({
  symbol: t.symbol,
  inflow: Math.random() * 50000000 + 5000000,
  outflow: Math.random() * 40000000 + 8000000,
  net: 0,
})).map(f => ({ ...f, net: f.inflow - f.outflow }));

const sectionNavItems = [
  { label: 'Whale Tracker', path: '/on-chain/whale-tracker' },
  { label: 'Gas Tracker', path: '/on-chain/gas-tracker' },
  { label: 'Token Flows', path: '/on-chain/token-flows' },
];

export default function TokenFlowsPage() {
  const [timeframe, setTimeframe] = useState('24h');

  const totalInflow = tokenFlows.reduce((s, f) => s + f.inflow, 0);
  const totalOutflow = tokenFlows.reduce((s, f) => s + f.outflow, 0);

  const historyData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${String(i * 2).padStart(2, '0')}:00`,
    inflow: Math.random() * 200000000 + 50000000,
    outflow: Math.random() * 180000000 + 40000000,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Token Flows</h1>
          <p className="text-sm text-gray-400 mt-1">Inter-exchange token flow analysis</p>
        </div>
        <div className="flex gap-2">
          {['1h', '4h', '24h', '7d'].map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1.5 text-xs font-mono rounded border ${timeframe === tf ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{tf}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowRightLeft className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL INFLOWS</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{formatUSD(totalInflow, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowRightLeft className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL OUTFLOWS</span></div>
          <p className="text-xl font-bold text-red-400 font-mono">{formatUSD(totalOutflow, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4" style={{ color: totalInflow > totalOutflow ? '#00ff88' : '#ff2d95' }} /><span className="text-xs text-gray-400 font-mono">NET FLOW</span></div>
          <p className={`text-xl font-bold font-mono ${totalInflow > totalOutflow ? 'text-green-400' : 'text-red-400'}`}>{totalInflow > totalOutflow ? '+' : ''}{formatUSD(totalInflow - totalOutflow, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">FLOWS TRACKED</span></div>
          <p className="text-xl font-bold text-white font-mono">{exchangeFlows.length}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Flow History</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={historyData}>
            <defs>
              <linearGradient id="inGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} /><stop offset="95%" stopColor="#00ff88" stopOpacity={0} /></linearGradient>
              <linearGradient id="outGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff2d95" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff2d95" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="hour" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
            <Area type="monotone" dataKey="inflow" stroke="#00ff88" fill="url(#inGrad2)" strokeWidth={2} />
            <Area type="monotone" dataKey="outflow" stroke="#ff2d95" fill="url(#outGrad2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Token Flow Breakdown</h3>
        <div className="space-y-3">
          {tokenFlows.map(f => (
            <div key={f.symbol} className="p-3 bg-[#0a0a0a] rounded border border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white">{f.symbol}</span>
                <span className={`font-mono text-sm ${f.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>{f.net >= 0 ? '+' : ''}{formatUSD(f.net, true)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>In</span><span>{formatUSD(f.inflow, true)}</span></div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full" style={{width: `${Math.min((f.inflow / (f.inflow + f.outflow)) * 100, 100)}%`}} /></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Out</span><span>{formatUSD(f.outflow, true)}</span></div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden"><div className="h-full bg-red-400 rounded-full" style={{width: `${Math.min((f.outflow / (f.inflow + f.outflow)) * 100, 100)}%`}} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Exchange Flow Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">FROM</th>
                <th className="text-left p-2 text-gray-400 font-mono">TO</th>
                <th className="text-right p-2 text-gray-400 font-mono">VALUE</th>
                <th className="text-right p-2 text-gray-400 font-mono">TREND</th>
              </tr>
            </thead>
            <tbody>
              {exchangeFlows.map((f, i) => (
                <tr key={i} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono text-white">{f.from}</td>
                  <td className="p-2 font-mono text-white">{f.to}</td>
                  <td className="p-2 text-right font-mono text-cyan-400">{formatUSD(f.value, true)}</td>
                  <td className="p-2 text-right"><ArrowRightLeft className="w-3 h-3 text-gray-500 inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}