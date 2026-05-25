import { useState } from 'react';
import { Link } from 'react-router-dom';
import { exchanges, tokens, formatUSD } from '@/shared/data/cryptoData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Building2, TrendingUp, Activity, Clock, DollarSign, Zap,
  ArrowUpRight, ArrowDownRight, Shield, AlertTriangle, Server,
  Wifi, Layers, BarChart3
} from 'lucide-react';
import { SectionNav, TokenLink } from '@/components/shared';

const COLORS = ['#00f0ff', '#ff00ff', '#b829dd', '#00ff88', '#ff6b35', '#f0e800'];
const EXCHANGE_NAV = [
  { label: 'All', path: '/exchanges' },
  { label: 'Binance', path: '/exchanges/binance' },
  { label: 'Bybit', path: '/exchanges/bybit' },
  { label: 'OKX', path: '/exchanges/okx' },
];

export default function ExchangesIndexPage() {
  const [selectedEx, setSelectedEx] = useState('Binance');
  const exchange = exchanges.find(e => e.name === selectedEx) || exchanges[0];

  const totalVol = exchanges.reduce((s, e) => s + e.volume24h, 0);
  const totalOI = exchanges.reduce((s, e) => s + e.oi, 0);
  const avgUptime = exchanges.reduce((s, e) => s + e.uptime, 0) / exchanges.length;
  const operational = exchanges.filter(e => e.status === 'Operational').length;

  const volData = exchanges.map(e => ({ name: e.name, volume: e.volume24h, oi: e.oi }));
  const oiDist = exchanges.map(e => ({ name: e.name, value: e.oi }));

  const allPairs = exchanges.flatMap(ex =>
    ex.pairs.map(p => ({ ...p, exchange: ex.name }))
  );

  // Simulated 24h volume chart
  const volumeHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    ...exchanges.reduce((acc, ex) => {
      acc[ex.name] = ex.volume24h / 24 * (0.5 + Math.random());
      return acc;
    }, {} as Record<string, number>),
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={EXCHANGE_NAV} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan flex items-center gap-2">
            <Building2 className="w-6 h-6" /> Exchange Monitor
          </h1>
          <p className="text-sm text-gray-400 mt-1">Real-time exchange health and analytics across {exchanges.length} exchanges</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">TOTAL VOLUME 24H</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(totalVol, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">TOTAL OI</span>
          </div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{formatUSD(totalOI, true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">AVG UPTIME</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{avgUptime.toFixed(2)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">OPERATIONAL</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{operational}/{exchanges.length}</p>
        </div>
      </div>

      {/* Exchange Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">SELECT EXCHANGE:</span>
        {exchanges.map(ex => (
          <button
            key={ex.name}
            onClick={() => setSelectedEx(ex.name)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-200 ${
              selectedEx === ex.name
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-[#222] text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Selected Exchange Detail */}
      <div className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Exchange Info Card */}
        <div className="card-neon p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white"
                style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.3)' }}>
                {exchange.logo}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{exchange.name}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${exchange.status === 'Operational' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {exchange.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Volume 24H</span>
              <span className="text-white font-mono">{formatUSD(exchange.volume24h, true)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Volume Change</span>
              <span className={exchange.volumeChange >= 0 ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                {exchange.volumeChange >= 0 ? '+' : ''}{exchange.volumeChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Open Interest</span>
              <span className="text-magenta-400 font-mono">{formatUSD(exchange.oi, true)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">OI Change</span>
              <span className={exchange.oiChange >= 0 ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                {exchange.oiChange >= 0 ? '+' : ''}{exchange.oiChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Avg Spread</span>
              <span className={exchange.avgSpread > 0.01 ? 'text-red-400 font-mono' : 'text-green-400 font-mono'}>
                {(exchange.avgSpread * 100).toFixed(3)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Avg Latency</span>
              <span className={exchange.avgLatency > 100 ? 'text-red-400 font-mono' : exchange.avgLatency > 50 ? 'text-yellow-400 font-mono' : 'text-green-400 font-mono'}>
                {exchange.avgLatency}ms
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Uptime</span>
              <span className="text-green-400 font-mono">{exchange.uptime.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Markets</span>
              <span className="text-white font-mono">{exchange.markets.toLocaleString()}</span>
            </div>
          </div>

          {/* Health Status */}
          <div className="mt-4 pt-3 border-t border-[#222]">
            <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-2">Health</h4>
            <div className="stagger-children grid grid-cols-2 gap-2">
              {Object.entries(exchange.health).map(([service, status]) => (
                <div key={service} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'Normal' || status === 'Connected' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-[10px] text-gray-400 font-mono capitalize">{service}</span>
                  <span className={`text-[10px] font-mono ml-auto ${status === 'Normal' || status === 'Connected' ? 'text-green-400' : 'text-yellow-400'}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div className="mt-3 pt-3 border-t border-[#222]">
            <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-2">Fees</h4>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-mono">Maker</span>
              <span className="text-cyan-400 font-mono">{(exchange.fees.maker * 100).toFixed(3)}%</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-400 font-mono">Taker</span>
              <span className="text-magenta-400 font-mono">{(exchange.fees.taker * 100).toFixed(3)}%</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Volume Bar Chart */}
          <div className="card-neon p-4">
            <h3 className="text-sm font-bold neon-text-cyan mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Volume by Exchange
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#555" fontSize={11} />
                <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e9).toFixed(0)}B`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }} formatter={(value: number) => formatUSD(value, true)} />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {volData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* OI Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-neon p-4">
              <h3 className="text-sm font-bold neon-text-magenta mb-3">OI Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={oiDist} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label>
                    {oiDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }} formatter={(value: number) => formatUSD(value, true)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Exchange Comparison */}
            <div className="card-neon p-4">
              <h3 className="text-sm font-bold neon-text-cyan mb-3">Exchange Comparison</h3>
              <div className="space-y-2">
                {exchanges.map(ex => (
                  <div key={ex.name} className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setSelectedEx(ex.name)}
                      className={`font-mono font-bold ${selectedEx === ex.name ? 'text-cyan-400' : 'text-white hover:text-cyan-300'}`}
                    >
                      {ex.name}
                    </button>
                    <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(ex.volume24h / totalVol) * 100}%`,
                          background: `linear-gradient(90deg, #00f0ff, #b829dd)`,
                        }}
                      />
                    </div>
                    <span className="text-gray-400 font-mono w-12 text-right">{((ex.volume24h / totalVol) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Exchanges Table */}
      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4 flex items-center gap-2">
          <Server className="w-4 h-4" /> All Exchanges
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOLUME 24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOL CHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">OI</th>
                <th className="text-right p-2 text-gray-400 font-mono">SPREAD</th>
                <th className="text-right p-2 text-gray-400 font-mono">LATENCY</th>
                <th className="text-right p-2 text-gray-400 font-mono">UPTIME</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map(ex => (
                <tr
                  key={ex.name}
                  className="border-b border-[#1a1a1a] table-row-animate"
                  onClick={() => setSelectedEx(ex.name)}
                >
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))' }}>
                        {ex.logo}
                      </div>
                      <span className="font-mono font-bold text-white">{ex.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-right font-mono text-white">{formatUSD(ex.volume24h, true)}</td>
                  <td className={`p-2 text-right font-mono ${ex.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {ex.volumeChange >= 0 ? '+' : ''}{ex.volumeChange.toFixed(2)}%
                  </td>
                  <td className="p-2 text-right font-mono text-magenta-400">{formatUSD(ex.oi, true)}</td>
                  <td className={`p-2 text-right font-mono ${ex.avgSpread > 0.01 ? 'text-red-400' : 'text-green-400'}`}>
                    {(ex.avgSpread * 100).toFixed(3)}%
                  </td>
                  <td className={`p-2 text-right font-mono ${ex.avgLatency > 100 ? 'text-red-400' : 'text-green-400'}`}>
                    {ex.avgLatency}ms
                  </td>
                  <td className="p-2 text-right font-mono text-green-400">{ex.uptime.toFixed(2)}%</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${ex.status === 'Operational' ? 'bg-green-500/20 text-green-400' : ex.status === 'Degraded' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {ex.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-exchange Price Comparison */}
      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Cross-Exchange Price Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">PAIR</th>
                {exchanges.map(ex => (
                  <th key={ex.name} className="text-right p-2 text-gray-400 font-mono">{ex.name.toUpperCase()}</th>
                ))}
                <th className="text-right p-2 text-gray-400 font-mono">SPREAD</th>
              </tr>
            </thead>
            <tbody>
              {['BTCUSDT', 'ETHUSDT', 'SOLUSDT'].map(pair => {
                const prices = exchanges.map(ex => ex.pairs.find(p => p.symbol === pair)?.price || 0);
                const maxP = Math.max(...prices);
                const minP = Math.min(...prices);
                const spread = ((maxP - minP) / minP * 100);
                return (
                  <tr key={pair} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                    <td className="p-2 font-mono font-bold text-white">{pair}</td>
                    {exchanges.map(ex => {
                      const price = ex.pairs.find(p => p.symbol === pair)?.price || 0;
                      const isMax = price === maxP;
                      const isMin = price === minP;
                      return (
                        <td key={ex.name} className={`p-2 text-right font-mono ${isMax ? 'text-green-400' : isMin ? 'text-red-400' : 'text-white'}`}>
                          ${price.toLocaleString()}
                        </td>
                      );
                    })}
                    <td className={`p-2 text-right font-mono ${spread > 0.05 ? 'text-red-400' : 'text-green-400'}`}>
                      {spread.toFixed(3)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
