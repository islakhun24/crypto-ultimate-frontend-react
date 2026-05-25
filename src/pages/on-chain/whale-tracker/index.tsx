import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Fish, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#00f0ff', '#ff00ff', '#b829dd', '#00ff88', '#ff6b35', '#f0e800'];

// Simulated whale data
const whaleTransactions = Array.from({ length: 20 }, (_, i) => {
  const token = tokens[i % tokens.length];
  const isInflow = Math.random() > 0.4;
  return {
    id: i + 1,
    time: new Date(Date.now() - i * 1800000).toLocaleString(),
    token: token.symbol,
    amount: Math.random() * 10000000 + 1000000,
    isInflow,
    exchange: ['Binance', 'Bybit', 'OKX', 'Unknown'][Math.floor(Math.random() * 4)],
    txHash: '0x' + Math.random().toString(16).substr(2, 40),
  };
});

const whaleHoldings = tokens.slice(0, 6).map((t, i) => ({
  name: t.symbol,
  value: Math.random() * 500000000 + 50000000,
}));

const sectionNavItems = [
  { label: 'Whale Tracker', path: '/on-chain/whale-tracker' },
  { label: 'Gas Tracker', path: '/on-chain/gas-tracker' },
  { label: 'Token Flows', path: '/on-chain/token-flows' },
];

export default function WhaleTrackerPage() {
  const [filter, setFilter] = useState<'all' | 'inflow' | 'outflow'>('all');

  const filtered = filter === 'all' ? whaleTransactions : whaleTransactions.filter(w => filter === 'inflow' ? w.isInflow : !w.isInflow);
  const totalInflow = whaleTransactions.filter(w => w.isInflow).reduce((s, w) => s + w.amount, 0);
  const totalOutflow = whaleTransactions.filter(w => !w.isInflow).reduce((s, w) => s + w.amount, 0);
  const netFlow = totalInflow - totalOutflow;

  const flowData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${String(i * 2).padStart(2, '0')}:00`,
    inflow: Math.random() * 50000000 + 10000000,
    outflow: Math.random() * 40000000 + 8000000,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Whale Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">Large wallet transaction monitoring</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'inflow', 'outflow'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-mono rounded border ${filter === f ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Fish className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TX COUNT (24H)</span></div>
          <p className="text-xl font-bold text-white font-mono">{whaleTransactions.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowDownRight className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">TOTAL INFLOW</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{formatUSD(totalInflow, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowUpRight className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">TOTAL OUTFLOW</span></div>
          <p className="text-xl font-bold text-red-400 font-mono">{formatUSD(totalOutflow, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4" style={{ color: netFlow >= 0 ? '#00ff88' : '#ff2d95' }} /><span className="text-xs text-gray-400 font-mono">NET FLOW</span></div>
          <p className={`text-xl font-bold font-mono ${netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netFlow >= 0 ? '+' : ''}{formatUSD(netFlow, true)}</p>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Inflow vs Outflow</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={flowData}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} /><stop offset="95%" stopColor="#00ff88" stopOpacity={0} /></linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff2d95" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff2d95" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="hour" stroke="#555" fontSize={11} />
              <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
              <Area type="monotone" dataKey="inflow" stroke="#00ff88" fill="url(#inGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="outflow" stroke="#ff2d95" fill="url(#outGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Whale Holdings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={whaleHoldings} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label>
                {whaleHoldings.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Recent Whale Transactions</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filtered.map(w => (
            <div key={w.id} className={`flex items-center justify-between p-2 rounded ${w.isInflow ? 'bg-green-500/5 border border-green-500/10' : 'bg-red-500/5 border border-red-500/10'}`}>
              <div className="flex items-center gap-3">
                {w.isInflow ? <ArrowDownRight className="w-3 h-3 text-green-400" /> : <ArrowUpRight className="w-3 h-3 text-red-400" />}
                <span className="text-[10px] text-gray-500 font-mono">{w.time}</span>
                <span className="font-mono font-bold text-white text-xs">{w.token}</span>
                <span className="text-gray-400 text-xs">{formatUSD(w.amount, true)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">{w.exchange}</span>
                <span className="text-[10px] text-gray-600 font-mono">{w.txHash.slice(0, 8)}...{w.txHash.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}