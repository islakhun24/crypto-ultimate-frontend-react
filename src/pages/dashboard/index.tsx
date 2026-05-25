import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Flame, Zap, Globe, BarChart3, Layers, ArrowUpRight, ArrowDownRight, Star, Bell, Brain, GitFork, ScanLine, Database, Server, Shield, Link2, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { TokenLink } from '@/components/shared';
import { tokens, marketOverview, exchanges, formatUSD, formatPrice, formatPercent, getSignalScore } from '@/shared/data/cryptoData';

// ===== TOOLTIP CUSTOM =====
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(5,5,20,0.95)', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 10px rgba(0,240,255,0.1)' }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? (p.value >= 1000 ? `$${p.value.toLocaleString()}` : p.value.toFixed(4)) : p.value}</p>
      ))}
    </div>
  );
};

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => (
  <svg width={80} height={28} viewBox={`0 0 ${data.length} 28`} preserveAspectRatio="none">
    <defs>
      <linearGradient id={`spGrad${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <path d={`M0,${28 - ((data[0] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 26} ${data.slice(1).map((v, i) => `L${i + 1},${28 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 26}`).join(' ')} L${data.length - 1},28 L0,28 Z`} fill={`url(#spGrad${color.replace('#','')})`} />
    <polyline points={data.map((v, i) => `${i},${28 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 26}`).join(' ')} fill="none" stroke={color} strokeWidth={1.5} />
  </svg>
);

export default function DashboardPage() {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [selectedToken, setSelectedToken] = useState('BTC');

  const selectedTokenData = useMemo(() => tokens.find(t => t.symbol === selectedToken) || tokens[0], [selectedToken]);

  // Generate chart data
  const priceChartData = useMemo(() => {
    const base = selectedTokenData.price;
    return Array.from({ length: 48 }, (_, i) => ({
      time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      price: base * (1 + Math.sin(i * 0.3) * 0.04 + (Math.random() - 0.5) * 0.015),
      volume: selectedTokenData.volume24h / 48 * (0.5 + Math.random()),
    }));
  }, [selectedTokenData]);

  const marketCapData = [
    { name: 'BTC', value: 52.18, fill: '#f59e0b' },
    { name: 'ETH', value: 18.42, fill: '#8b5cf6' },
    { name: 'SOL', value: 3.82, fill: '#00f0ff' },
    { name: 'BNB', value: 4.21, fill: '#ff6b35' },
    { name: 'XRP', value: 1.84, fill: '#ff2d95' },
    { name: 'Others', value: 19.53, fill: '#64748b' },
  ];

  const signalData = tokens.slice(0, 8).map(t => {
    const sig = getSignalScore(t);
    return { subject: t.symbol, A: sig.score, fullMark: 100 };
  });

  const topGainers = [...tokens].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const topLosers = [...tokens].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  return (
    <div className="space-y-3">
      {/* ===== TOP TICKER BAR ===== */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tokens.slice(0, 12).map(t => (
          <button key={t.symbol} onClick={() => setSelectedToken(t.symbol)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200', selectedToken === t.symbol ? 'text-cyan-300' : 'text-slate-400 hover:text-cyan-300')}
            style={selectedToken === t.symbol ? { background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)' } : { border: '1px solid transparent' }}>
            <span className="font-semibold">{t.symbol}</span>
            <span className={t.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]'}>{formatPrice(t.price)}</span>
            <span className={t.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]'}>{formatPercent(t.change24h)}</span>
          </button>
        ))}
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-6 gap-3 stagger-children">
        {[
          { label: 'Total Market Cap', value: formatUSD(marketOverview.totalMarketCap, true), change: formatPercent(marketOverview.marketCapChange24h), icon: Globe, color: '#00f0ff' },
          { label: '24h Volume', value: formatUSD(marketOverview.volume24h, true), change: formatPercent(marketOverview.volumeChange24h), icon: BarChart3, color: '#b829dd' },
          { label: 'Open Interest', value: formatUSD(marketOverview.totalOI, true), change: formatPercent(marketOverview.oiChange24h), icon: Layers, color: '#00ff88' },
          { label: '24h Liquidations', value: formatUSD(marketOverview.liquidation24h, true), change: '+32.4%', icon: Flame, color: '#ff6b35' },
          { label: 'BTC Dominance', value: `${marketOverview.btcDominance}%`, change: '+0.42%', icon: Activity, color: '#f59e0b' },
          { label: 'Fear & Greed', value: `${marketOverview.fearGreedIndex}`, change: marketOverview.fearGreedLabel, icon: Zap, color: marketOverview.fearGreedIndex > 75 ? '#ff2d95' : marketOverview.fearGreedIndex > 50 ? '#00ff88' : '#f0e800' },
        ].map((s, i) => (
          <div key={i} className="card-neon rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <s.icon size={13} style={{ color: s.color, filter: `drop-shadow(0 0 3px ${s.color}40)` }} />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-lg font-bold text-white">{s.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: s.change.startsWith('+') || s.change === 'Greed' ? '#00ff88' : s.change === 'Neutral' ? '#f0e800' : '#ff2d95' }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* ===== MAIN CHART + SIDEBAR ===== */}
      <div className="grid grid-cols-4 gap-3 stagger-children">
        {/* Main Chart */}
        <div className="col-span-3 card-neon rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{selectedTokenData.symbol}USDT</span>
                <span className="text-xs text-slate-400">Perpetual</span>
                <Star size={13} className="text-slate-500" />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-2xl font-bold text-white">{formatPrice(selectedTokenData.price)}</span>
                <span className={cn('text-sm font-medium', selectedTokenData.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>
                  {selectedTokenData.change24h > 0 ? <ArrowUpRight size={14} className="inline" /> : <ArrowDownRight size={14} className="inline" />}
                  {formatPercent(selectedTokenData.change24h)} ({formatPercent(selectedTokenData.change7d)} 7d)
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                O {formatPrice(selectedTokenData.price * 0.998)} H {formatPrice(selectedTokenData.price * 1.005)} L {formatPrice(selectedTokenData.price * 0.992)} C {formatPrice(selectedTokenData.price)}
              </div>
            </div>
            <div className="flex gap-1">
              {['1H', '4H', '1D', '1W', '1M'].map(tf => (
                <button key={tf} onClick={() => setActiveTimeframe(tf)}
                  className={cn('px-3 py-1 rounded-lg text-xs transition-all', activeTimeframe === tf ? 'text-white' : 'text-slate-400 hover:text-cyan-300')}
                  style={activeTimeframe === tf ? { background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.3)' } : {}}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceChartData}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} tickFormatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v.toFixed(0)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#00f0ff" strokeWidth={2} fill="url(#priceGrad)" name="Price" />
            </AreaChart>
          </ResponsiveContainer>
          {/* Volume bar */}
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={priceChartData}>
              <Bar dataKey="volume" name="Volume">
                {priceChartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? 'rgba(0,240,255,0.3)' : 'rgba(184,41,221,0.3)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Panel */}
        <div className="space-y-3">
          {/* Market Dominance */}
          <div className="card-neon rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Market Dominance</h4>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={marketCapData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                  {marketCapData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-1">
              {marketCapData.slice(0, 4).map(m => (
                <div key={m.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: m.fill }} />{m.name}</div>
                  <span className="text-white">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Radar */}
          <div className="card-neon rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Signal Strength</h4>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={signalData}>
                <PolarGrid stroke="rgba(0,240,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar name="Score" dataKey="A" stroke="#00f0ff" fill="rgba(0,240,255,0.15)" strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Active Signals */}
          <div className="card-neon rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Active Signals</h4>
            <div className="space-y-1.5">
              {tokens.slice(0, 4).map(t => {
                const sig = getSignalScore(t);
                return (
                  <div key={t.symbol} className="flex items-center justify-between">
                    <span className="text-[11px] text-white">{t.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${sig.color}20`, color: sig.color }}>{sig.label} ({sig.score})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ROW ===== */}
      <div className="grid grid-cols-3 gap-3 stagger-children">
        {/* Top Gainers */}
        <div className="card-neon rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#00ff88]" /> Top Gainers (24h)
          </h4>
          <table className="w-full">
            <tbody>{topGainers.map(t => (
              <tr key={t.symbol} className="border-b border-cyan-500/5">
                <td className="py-1.5"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #00f0ff40, #0080ff40)' }}>{t.symbol[0]}</div><span className="text-xs text-white">{t.symbol}</span></div></td>
                <td className="text-right text-xs text-white">{formatPrice(t.price)}</td>
                <td className="text-right text-xs text-[#00ff88]">{formatPercent(t.change24h)}</td>
                <td className="text-right"><MiniSparkline data={t.sparkline7d} color="#00ff88" /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Top Losers */}
        <div className="card-neon rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <TrendingDown size={13} className="text-[#ff2d95]" /> Top Losers (24h)
          </h4>
          <table className="w-full">
            <tbody>{topLosers.map(t => (
              <tr key={t.symbol} className="border-b border-cyan-500/5">
                <td className="py-1.5"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff2d9540, #ff006640)' }}>{t.symbol[0]}</div><span className="text-xs text-white">{t.symbol}</span></div></td>
                <td className="text-right text-xs text-white">{formatPrice(t.price)}</td>
                <td className="text-right text-xs text-[#ff2d95]">{formatPercent(t.change24h)}</td>
                <td className="text-right"><MiniSparkline data={t.sparkline7d} color="#ff2d95" /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Exchange Volume */}
        <div className="card-neon rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <Globe size={13} className="text-[#b829dd]" /> Exchange Volume (24h)
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={exchanges} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={(v) => `$${(v/1e9).toFixed(0)}B`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume24h" name="Volume">
                {exchanges.map((_, i) => (
                  <Cell key={i} fill={['#00f0ff', '#b829dd', '#ff00ff', '#00ff88', '#ff6b35', '#f0e800'][i]} fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== MARKET TABLE ===== */}
      <div className="card-neon rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity size={13} className="text-[#00f0ff]" /> Market Overview
          </h4>
          <span className="text-[10px] text-slate-500">Top 25 Markets | Real-time</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-400 border-b border-cyan-500/10">
                <th className="text-left py-2 px-1 font-medium">#</th>
                <th className="text-left py-2 px-1 font-medium">Token</th>
                <th className="text-right py-2 px-1 font-medium">Price</th>
                <th className="text-right py-2 px-1 font-medium">24h %</th>
                <th className="text-right py-2 px-1 font-medium">7d %</th>
                <th className="text-right py-2 px-1 font-medium">Market Cap</th>
                <th className="text-right py-2 px-1 font-medium">Volume (24h)</th>
                <th className="text-right py-2 px-1 font-medium">OI</th>
                <th className="text-right py-2 px-1 font-medium">Funding</th>
                <th className="text-right py-2 px-1 font-medium">L/S Ratio</th>
                <th className="text-center py-2 px-1 font-medium">Signal</th>
                <th className="text-right py-2 px-1 font-medium">7D Chart</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map(t => {
                const sig = getSignalScore(t);
                return (
                  <tr key={t.symbol} className={cn('border-b border-cyan-500/5 table-row-animate cursor-pointer', selectedToken === t.symbol && 'bg-cyan-500/[0.04]')}
                    onClick={() => setSelectedToken(t.symbol)}>
                    <td className="py-1.5 px-1 text-[10px] text-slate-500">{t.rank}</td>
                    <td className="py-1.5 px-1"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${sig.color}40, ${sig.color}20)` }}>{t.symbol[0]}</div><div><div className="text-xs text-white font-medium">{t.symbol}</div><div className="text-[9px] text-slate-500">{t.name}</div></div></div></td>
                    <td className="text-right py-1.5 px-1 text-xs text-white font-mono">{formatPrice(t.price)}</td>
                    <td className={cn('text-right py-1.5 px-1 text-xs font-medium', t.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change24h)}</td>
                    <td className={cn('text-right py-1.5 px-1 text-xs', t.change7d > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change7d)}</td>
                    <td className="text-right py-1.5 px-1 text-xs text-slate-300">{formatUSD(t.marketCap, true)}</td>
                    <td className="text-right py-1.5 px-1 text-xs text-slate-300">{formatUSD(t.volume24h, true)}</td>
                    <td className="text-right py-1.5 px-1 text-xs text-slate-300">{formatUSD(t.oi, true)}</td>
                    <td className={cn('text-right py-1.5 px-1 text-xs', t.fundingRate > 0 ? 'text-[#ff6b35]' : 'text-[#00ff88]')}>{t.fundingRate > 0 ? '+' : ''}{t.fundingRate.toFixed(4)}%</td>
                    <td className="text-right py-1.5 px-1 text-xs text-slate-300">{t.longShortRatio.toFixed(2)}</td>
                    <td className="text-center py-1.5 px-1"><span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${sig.color}20`, color: sig.color }}>{sig.score}</span></td>
                    <td className="text-right py-1.5 px-1"><MiniSparkline data={t.sparkline7d} color={t.change7d > 0 ? '#00ff88' : '#ff2d95'} /></td>
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
