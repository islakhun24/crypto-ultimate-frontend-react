import { useState } from 'react';
import { tokens, formatUSD, formatPrice, getSignalScore } from '@/shared/data/cryptoData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

// Simulated signal history
const signalHistory = Array.from({ length: 50 }, (_, i) => {
  const token = tokens[i % tokens.length];
  const signal = getSignalScore(token);
  const success = signal.score > 60 ? Math.random() > 0.3 : signal.score < 40 ? Math.random() > 0.3 : Math.random() > 0.5;
  return {
    id: i + 1,
    time: new Date(Date.now() - i * 3600000).toLocaleString(),
    symbol: token.symbol,
    price: token.price,
    signal: signal.label,
    score: signal.score,
    color: signal.color,
    success,
    pnl: success ? (Math.random() * 5) : -(Math.random() * 3),
  };
});

const sectionNavItems = [
  { label: 'Scanner', path: '/signals/scanner' },
  { label: 'History', path: '/signals/history' },
  { label: 'Strategy', path: '/signals/strategy-builder' },
  { label: 'Score', path: '/signals/signal-score' },
  { label: 'Pre-Pump', path: '/signals/pre-pump-scanner' },
];

export default function SignalHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all');

  const filtered = filter === 'all' ? signalHistory : signalHistory.filter(s => filter === 'win' ? s.success : !s.success);
  const winRate = (signalHistory.filter(s => s.success).length / signalHistory.length * 100).toFixed(1);
  const totalPnl = signalHistory.reduce((s, h) => s + h.pnl, 0);

  const pnlData = signalHistory.slice(0, 24).map((s, i) => ({
    time: s.time.split(',')[1]?.trim() || '',
    pnl: signalHistory.slice(0, i + 1).reduce((sum, h) => sum + h.pnl, 0),
  })).reverse();

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Signal History</h1>
          <p className="text-sm text-gray-400 mt-1">Historical signal performance</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'win', 'loss'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-mono rounded border ${filter === f ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL SIGNALS</span></div>
          <p className="text-xl font-bold text-white font-mono">{signalHistory.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">WIN RATE</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{winRate}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL P&L</span></div>
          <p className={`text-xl font-bold font-mono ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">AVG P&L</span></div>
          <p className={`text-xl font-bold font-mono ${totalPnl / signalHistory.length >= 0 ? 'text-green-400' : 'text-red-400'}`}>{(totalPnl / signalHistory.length).toFixed(2)}%</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Cumulative P&L</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={pnlData}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `${v.toFixed(1)}%`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Area type="monotone" dataKey="pnl" stroke={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} fill="url(#pnlGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Signal Log</h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filtered.map(s => (
            <div key={s.id} className={`flex items-center justify-between p-2 rounded ${s.success ? 'bg-green-500/5' : 'bg-red-500/5'} hover:bg-[#111]`}>
              <div className="flex items-center gap-3">
                {s.success ? <CheckCircle className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                <span className="text-[10px] text-gray-500 font-mono">{s.time}</span>
                <span className="font-mono font-bold text-white text-xs">{s.symbol}</span>
                <span className="text-gray-400 text-xs">{formatPrice(s.price)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.signal}</span>
                <span className={`font-mono text-xs ${s.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}