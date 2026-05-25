import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BookOpen, Plus, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

interface Trade {
  id: number;
  date: string;
  token: string;
  type: 'long' | 'short';
  entry: number;
  exit: number | null;
  size: number;
  pnl: number | null;
  status: 'open' | 'closed';
  notes: string;
}

export default function TradeJournalPage() {
  const [trades, setTrades] = useState<Trade[]>([
    { id: 1, date: '2024-01-15', token: 'BTC', type: 'long', entry: 42500, exit: 45200, size: 0.5, pnl: 1350, status: 'closed', notes: 'EMA bounce' },
    { id: 2, date: '2024-01-16', token: 'ETH', type: 'long', entry: 2580, exit: 2710, size: 5, pnl: 650, status: 'closed', notes: 'Breakout play' },
    { id: 3, date: '2024-01-17', token: 'SOL', type: 'short', entry: 98.5, exit: null, size: 20, pnl: null, status: 'open', notes: 'Funding too high' },
    { id: 4, date: '2024-01-18', token: 'BTC', type: 'long', entry: 43800, exit: 42100, size: 0.3, pnl: -510, status: 'closed', notes: 'Stop hit' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTrade, setNewTrade] = useState({ token: 'BTC', type: 'long' as 'long' | 'short', entry: '', size: '', notes: '' });

  const totalPnl = trades.filter(t => t.pnl !== null).reduce((s, t) => s + (t.pnl || 0), 0);
  const winCount = trades.filter(t => t.status === 'closed' && (t.pnl || 0) > 0).length;
  const lossCount = trades.filter(t => t.status === 'closed' && (t.pnl || 0) <= 0).length;
  const winRate = trades.filter(t => t.status === 'closed').length > 0 ? (winCount / (winCount + lossCount) * 100).toFixed(0) : '0';

  const pnlData = trades.filter(t => t.pnl !== null).map((t, i) => ({
    id: i + 1,
    pnl: t.pnl,
    cumulative: trades.filter(tr => tr.pnl !== null).slice(0, i + 1).reduce((s, tr) => s + (tr.pnl || 0), 0),
  }));

  const addTrade = () => {
    if (!newTrade.entry || !newTrade.size) return;
    setTrades([...trades, {
      id: Date.now(), date: new Date().toISOString().split('T')[0], token: newTrade.token,
      type: newTrade.type, entry: Number(newTrade.entry), exit: null,
      size: Number(newTrade.size), pnl: null, status: 'open', notes: newTrade.notes,
    }]);
    setNewTrade({ token: 'BTC', type: 'long', entry: '', size: '', notes: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Trade Journal</h1>
          <p className="text-sm text-gray-400 mt-1">Personal trade log and analytics</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 text-xs font-mono table-row-animate">
          <Plus className="w-3 h-3" /> ADD TRADE
        </button>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL TRADES</span></div>
          <p className="text-xl font-bold text-white font-mono">{trades.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">WIN RATE</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{winRate}%</p>
          <p className="text-xs text-gray-500">{winCount}W / {lossCount}L</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL P&L</span></div>
          <p className={`text-xl font-bold font-mono ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalPnl.toLocaleString()}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">OPEN TRADES</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{trades.filter(t => t.status === 'open').length}</p>
        </div>
      </div>

      {showAdd && (
        <div className="card-neon p-4 border-cyan-500/30">
          <h3 className="text-sm font-bold neon-text-cyan mb-3">New Trade</h3>
          <div className="stagger-children grid grid-cols-1 md:grid-cols-6 gap-3">
            <select value={newTrade.token} onChange={e => setNewTrade({...newTrade, token: e.target.value})} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono">
              {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
            <select value={newTrade.type} onChange={e => setNewTrade({...newTrade, type: e.target.value as 'long' | 'short'})} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono">
              <option value="long">LONG</option>
              <option value="short">SHORT</option>
            </select>
            <input type="number" value={newTrade.entry} onChange={e => setNewTrade({...newTrade, entry: e.target.value})} placeholder="Entry Price" className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono" />
            <input type="number" value={newTrade.size} onChange={e => setNewTrade({...newTrade, size: e.target.value})} placeholder="Size" className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono" />
            <input value={newTrade.notes} onChange={e => setNewTrade({...newTrade, notes: e.target.value})} placeholder="Notes" className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono" />
            <button onClick={addTrade} className="px-3 py-2 bg-green-500/20 text-green-400 rounded border border-green-500/30 text-xs font-mono table-row-animate">SAVE</button>
          </div>
        </div>
      )}

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Cumulative P&L</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={pnlData}>
            <defs>
              <linearGradient id="tpnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="id" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${v.toLocaleString()}`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Area type="monotone" dataKey="cumulative" stroke={totalPnl >= 0 ? '#00ff88' : '#ff2d95'} fill="url(#tpnlGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Trade Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">DATE</th>
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-left p-2 text-gray-400 font-mono">TYPE</th>
                <th className="text-right p-2 text-gray-400 font-mono">ENTRY</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIZE</th>
                <th className="text-right p-2 text-gray-400 font-mono">P&L</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
                <th className="text-left p-2 text-gray-400 font-mono">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t.id} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono text-gray-400">{t.date}</td>
                  <td className="p-2 font-mono font-bold text-white">{t.token}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{t.type.toUpperCase()}</span></td>
                  <td className="p-2 text-right font-mono text-white">${t.entry.toLocaleString()}</td>
                  <td className="p-2 text-right font-mono text-white">{t.size}</td>
                  <td className={`p-2 text-right font-mono ${t.pnl === null ? 'text-gray-500' : (t.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.pnl === null ? '-' : `$${t.pnl.toLocaleString()}`}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.status === 'open' ? 'bg-magenta-500/20 text-magenta-400' : 'bg-gray-500/20 text-gray-400'}`}>{t.status.toUpperCase()}</span></td>
                  <td className="p-2 text-gray-400">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}