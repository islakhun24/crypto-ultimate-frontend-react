import { useState } from 'react';
import { tokens, formatPrice } from '@/shared/data/cryptoData';
import { Settings, Play, Save, Trash2, Plus, TrendingUp } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

interface Strategy {
  id: number;
  name: string;
  token: string;
  condition: string;
  value: string;
  action: 'buy' | 'sell';
  active: boolean;
}

const sectionNavItems = [
  { label: 'Scanner', path: '/signals/scanner' },
  { label: 'History', path: '/signals/history' },
  { label: 'Strategy', path: '/signals/strategy-builder' },
  { label: 'Score', path: '/signals/signal-score' },
  { label: 'Pre-Pump', path: '/signals/pre-pump-scanner' },
];

export default function StrategyBuilderPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: 1, name: 'RSI Oversold', token: 'BTC', condition: 'RSI <', value: '30', action: 'buy', active: true },
    { id: 2, name: 'Funding Extreme', token: 'ETH', condition: 'Funding >', value: '0.01', action: 'sell', active: true },
    { id: 3, name: 'OI Spike', token: 'SOL', condition: 'OI Change >', value: '10', action: 'buy', active: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newStrategy, setNewStrategy] = useState({ name: '', token: 'BTC', condition: 'RSI <', value: '', action: 'buy' as 'buy' | 'sell' });

  const addStrategy = () => {
    if (!newStrategy.name || !newStrategy.value) return;
    setStrategies([...strategies, { ...newStrategy, id: Date.now(), active: true }]);
    setNewStrategy({ name: '', token: 'BTC', condition: 'RSI <', value: '', action: 'buy' });
    setShowAdd(false);
  };

  const toggleActive = (id: number) => {
    setStrategies(strategies.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteStrategy = (id: number) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Strategy Builder</h1>
          <p className="text-sm text-gray-400 mt-1">Create custom trading strategies</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 text-xs font-mono table-row-animate">
          <Plus className="w-3 h-3" /> NEW STRATEGY
        </button>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Settings className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">TOTAL STRATEGIES</span></div>
          <p className="text-xl font-bold text-white font-mono">{strategies.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Play className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">ACTIVE</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{strategies.filter(s => s.active).length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">SIGNALS TODAY</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{Math.floor(Math.random() * 20)}</p>
        </div>
      </div>

      {showAdd && (
        <div className="card-neon p-4 border-cyan-500/30">
          <h3 className="text-sm font-bold neon-text-cyan mb-3">New Strategy</h3>
          <div className="stagger-children grid grid-cols-1 md:grid-cols-6 gap-3">
            <input value={newStrategy.name} onChange={e => setNewStrategy({...newStrategy, name: e.target.value})} placeholder="Strategy Name" className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono focus:border-cyan-500 outline-none" />
            <select value={newStrategy.token} onChange={e => setNewStrategy({...newStrategy, token: e.target.value})} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono">
              {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
            <select value={newStrategy.condition} onChange={e => setNewStrategy({...newStrategy, condition: e.target.value})} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono">
              <option>RSI {'<'}</option>
              <option>RSI {'>'}</option>
              <option>Funding {'>'}</option>
              <option>Funding {'<'}</option>
              <option>OI Change {'>'}</option>
              <option>OI Change {'<'}</option>
              <option>Price Change {'>'}</option>
              <option>Price Change {'<'}</option>
            </select>
            <input value={newStrategy.value} onChange={e => setNewStrategy({...newStrategy, value: e.target.value})} placeholder="Value" className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono focus:border-cyan-500 outline-none" />
            <select value={newStrategy.action} onChange={e => setNewStrategy({...newStrategy, action: e.target.value as 'buy' | 'sell'})} className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-3 py-2 font-mono">
              <option value="buy">BUY</option>
              <option value="sell">SELL</option>
            </select>
            <button onClick={addStrategy} className="px-3 py-2 bg-green-500/20 text-green-400 rounded border border-green-500/30 text-xs font-mono table-row-animate flex items-center justify-center gap-1">
              <Save className="w-3 h-3" /> SAVE
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {strategies.map(s => (
          <div key={s.id} className={`card-neon p-4 ${s.active ? 'border-cyan-500/20' : 'border-gray-700/20 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                <span className="font-mono font-bold text-white">{s.name}</span>
                <span className="px-2 py-0.5 bg-[#0a0a0a] rounded text-xs font-mono text-cyan-400">{s.token}</span>
                <span className="text-xs text-gray-400 font-mono">{s.condition} {s.value}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${s.action === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.action.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(s.id)} className={`px-3 py-1 rounded text-[10px] font-mono border ${s.active ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-400'}`}>{s.active ? 'ACTIVE' : 'INACTIVE'}</button>
                <button onClick={() => deleteStrategy(s.id)} className="p-1 text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}