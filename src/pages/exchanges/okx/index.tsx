import { useState } from 'react';
import { exchanges, tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Building2, TrendingUp, Activity, Shield, Server, DollarSign, Layers, Zap } from 'lucide-react';
import { SectionNav, TokenLink } from '@/components/shared';
import { Link } from 'react-router-dom';

const COLORS = ['#00f0ff', '#ff00ff', '#00ff88', '#ff6b35', '#f0e800', '#b829dd'];
const EXCHANGE_NAV = [
  { label: 'All', path: '/exchanges' },
  { label: 'Binance', path: '/exchanges/binance' },
  { label: 'Bybit', path: '/exchanges/bybit' },
  { label: 'OKX', path: '/exchanges/okx' },
];

export default function ExchangeOKXPage() {
  const exchange = exchanges.find(e => e.name === 'OKX') || exchanges[2];
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'health'>('overview');

  const volHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    volume: exchange.volume24h / 24 * (0.5 + Math.random() * 1.2),
  }));

  const pairPerf = exchange.pairs.map(p => {
    const token = tokens.find(t => p.symbol.includes(t.symbol));
    return {
      symbol: p.symbol,
      tokenSymbol: token?.symbol || p.symbol.replace('USDT', ''),
      price: p.price,
      spread: p.spread,
      depth: p.depth,
      volume: p.volume,
      change24h: token?.change24h || 0,
    };
  });

  return (
    <div className="space-y-6">
      <SectionNav items={EXCHANGE_NAV} />

      {/* Exchange Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #00f0ff33, #b829dd33)', border: '1px solid rgba(0,240,255,0.3)' }}>
            {exchange.logo}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{exchange.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3" /> {exchange.status}
              </span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-400 font-mono">{exchange.markets} markets</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-400 font-mono">{exchange.uptime.toFixed(2)}% uptime</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://www.${exchange.name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 text-xs font-mono table-row-animate flex items-center gap-1">
            <Zap className="w-3 h-3" /> Website
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">VOLUME 24H</span></div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(exchange.volume24h, true)}</p>
          <p className={`text-xs mt-1 ${exchange.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{exchange.volumeChange >= 0 ? '+' : ''}{exchange.volumeChange.toFixed(2)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Layers className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">OPEN INTEREST</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{formatUSD(exchange.oi, true)}</p>
          <p className={`text-xs mt-1 ${exchange.oiChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{exchange.oiChange >= 0 ? '+' : ''}{exchange.oiChange.toFixed(2)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">AVG SPREAD</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{(exchange.avgSpread * 100).toFixed(3)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Server className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">LATENCY</span></div>
          <p className="text-xl font-bold text-cyan-400 font-mono">{exchange.avgLatency}ms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(['overview', 'markets', 'health'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all ${activeTab === tab ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400 hover:border-cyan-500/30'}`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-neon p-4">
              <h3 className="text-sm font-bold neon-text-cyan mb-3">Volume History (24H)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={volHistory}>
                  <defs><linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" /><XAxis dataKey="hour" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }} formatter={(value: number) => formatUSD(value, true)} />
                  <Area type="monotone" dataKey="volume" stroke="#00f0ff" fill="url(#volGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card-neon p-4">
              <h3 className="text-sm font-bold neon-text-cyan mb-3">Fees</h3>
              <div className="flex items-center justify-center h-[220px]">
                <div className="stagger-children grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-cyan-500/20">
                    <p className="text-xs text-gray-400 font-mono mb-2">MAKER FEE</p>
                    <p className="text-3xl font-bold text-cyan-400 font-mono">{(exchange.fees.maker * 100).toFixed(3)}%</p>
                  </div>
                  <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-magenta-500/20">
                    <p className="text-xs text-gray-400 font-mono mb-2">TAKER FEE</p>
                    <p className="text-3xl font-bold text-magenta-400 font-mono">{(exchange.fees.taker * 100).toFixed(3)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'markets' && (
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Markets</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#222]">
                  <th className="text-left p-2 text-gray-400 font-mono">PAIR</th>
                  <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                  <th className="text-right p-2 text-gray-400 font-mono">24H CHANGE</th>
                  <th className="text-right p-2 text-gray-400 font-mono">SPREAD</th>
                  <th className="text-right p-2 text-gray-400 font-mono">DEPTH</th>
                  <th className="text-right p-2 text-gray-400 font-mono">VOLUME</th>
                </tr>
              </thead>
              <tbody>
                {pairPerf.map(p => (
                  <tr key={p.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                    <td className="p-2">
                      <Link to={`/token/${p.tokenSymbol}`} className="font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                        {p.symbol}
                      </Link>
                    </td>
                    <td className="p-2 text-right font-mono text-white">${p.price.toLocaleString()}</td>
                    <td className={`p-2 text-right font-mono ${p.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(2)}%</td>
                    <td className={`p-2 text-right font-mono ${p.spread > 0.01 ? 'text-red-400' : 'text-green-400'}`}>{(p.spread * 100).toFixed(3)}%</td>
                    <td className="p-2 text-right font-mono text-white">{p.depth}</td>
                    <td className="p-2 text-right font-mono text-white">{formatUSD(p.volume, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(exchange.health).map(([service, status]) => (
            <div key={service} className={`card-neon p-4 ${status === 'Normal' || status === 'Connected' ? 'border-green-500/20' : 'border-yellow-500/20'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status === 'Normal' || status === 'Connected' ? 'bg-green-400' : status === 'Delayed' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
                  <span className="text-sm font-mono font-bold text-white capitalize">{service}</span>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${status === 'Normal' || status === 'Connected' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
