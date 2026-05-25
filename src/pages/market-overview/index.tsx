import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { TrendingUp, TrendingDown, Globe, Volume2, Bitcoin, Activity, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { tokens, marketOverview, formatUSD, formatPrice, formatPercent } from '@/shared/data/cryptoData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(5,5,20,0.95)', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 10px rgba(0,240,255,0.1)' }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? formatUSD(p.value, true) : p.value}</p>)}
    </div>
  );
};

export default function MarketOverviewPage() {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Layer 1', 'DeFi', 'Meme', 'AI', 'Gaming', 'Infrastructure'];

  const topGainers = [...tokens].sort((a, b) => b.change24h - a.change24h).slice(0, 8);
  const topLosers = [...tokens].sort((a, b) => a.change24h - b.change24h).slice(0, 8);
  const topVolume = [...tokens].sort((a, b) => b.volume24h - a.volume24h).slice(0, 8);
  const filteredTokens = activeTab === 'All' ? tokens : tokens.filter(t => t.category === activeTab || t.tags.includes(activeTab));

  const mcHistory = [
    { t: '00:00', v: 2550000000000 }, { t: '04:00', v: 2562000000000 }, { t: '08:00', v: 2584000000000 },
    { t: '12:00', v: 2598000000000 }, { t: '16:00', v: 2602000000000 }, { t: '20:00', v: 2610000000000 },
  ];

  const dominance = [
    { name: 'BTC', value: 52.18, fill: '#f59e0b' },
    { name: 'ETH', value: 18.42, fill: '#8b5cf6' },
    { name: 'SOL', value: 3.82, fill: '#00f0ff' },
    { name: 'BNB', value: 4.21, fill: '#ff6b35' },
    { name: 'XRP', value: 1.84, fill: '#ff2d95' },
    { name: 'USDT', value: 5.2, fill: '#00ff88' },
    { name: 'Others', value: 14.33, fill: '#475569' },
  ];

  const sentimentData = [
    { subject: 'Volatility', A: 68, fullMark: 100 },
    { subject: 'Momentum', A: 72, fullMark: 100 },
    { subject: 'Volume', A: 64, fullMark: 100 },
    { subject: 'Breadth', A: 58, fullMark: 100 },
    { subject: 'Social', A: 74, fullMark: 100 },
    { subject: 'On-Chain', A: 62, fullMark: 100 },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div><h1 className="text-xl font-bold gradient-text">Market Overview</h1><p className="text-xs text-slate-400">Global crypto market performance and key metrics. Last updated: 2s ago</p></div>

      {/* Stats Row */}
      <div className="stagger-children grid grid-cols-6 gap-3">
        {[
          { label: 'Total Market Cap', value: formatUSD(marketOverview.totalMarketCap, true), change: formatPercent(marketOverview.marketCapChange24h), icon: Globe, color: '#00f0ff', positive: true },
          { label: '24h Volume', value: formatUSD(marketOverview.volume24h, true), change: formatPercent(marketOverview.volumeChange24h), icon: Volume2, color: '#b829dd', positive: true },
          { label: 'BTC Dominance', value: `${marketOverview.btcDominance}%`, change: '+0.42%', icon: Bitcoin, color: '#f59e0b', positive: true },
          { label: 'ETH Dominance', value: `${marketOverview.ethDominance}%`, change: '+0.18%', icon: Activity, color: '#8b5cf6', positive: true },
          { label: 'DeFi TVL', value: formatUSD(marketOverview.defiTVL, true), change: '+2.14%', icon: TrendingUp, color: '#00ff88', positive: true },
          { label: 'Fear & Greed', value: `${marketOverview.fearGreedIndex}`, change: marketOverview.fearGreedLabel, icon: Activity, color: '#ff6b35', positive: true },
        ].map((s, i) => (
          <div key={i} className="card-neon rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1"><s.icon size={12} style={{ color: s.color, filter: `drop-shadow(0 0 3px ${s.color}40)` }} /><span className="text-[9px] text-slate-400 uppercase tracking-wider">{s.label}</span></div>
            <div className="text-base font-bold text-white">{s.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: s.positive ? '#00ff88' : '#ff2d95' }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Main Chart + Side Panels */}
      <div className="stagger-children grid grid-cols-3 gap-3">
        {/* Market Cap Chart */}
        <div className="col-span-2 card-neon rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-sm font-semibold text-white">Total Market Cap</h3><div className="text-lg font-bold text-white">{formatUSD(marketOverview.totalMarketCap, true)} <span className="text-xs text-[#00ff88]">{formatPercent(marketOverview.marketCapChange24h)}</span></div></div>
            <div className="flex gap-1">{['1D', '7D', '1M', '3M', '1Y', 'ALL'].map(tf => <button key={tf} onClick={() => setTimeframe(tf)} className={cn('px-2 py-1 rounded-lg text-[10px]', timeframe === tf ? 'text-white' : 'text-slate-400')} style={timeframe === tf ? { background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.3)' } : {}}>{tf}</button>)}</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mcHistory}>
              <defs><linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="100%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.05)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} tickFormatter={(v) => `$${(v/1e12).toFixed(2)}T`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke="#00f0ff" strokeWidth={2} fill="url(#mcGrad)" name="Market Cap" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Side Panels */}
        <div className="space-y-3">
          {/* Dominance */}
          <div className="card-neon rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Dominance</h4>
            <ResponsiveContainer width="100%" height={120}><PieChart><Pie data={dominance} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" stroke="none">{dominance.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.8} />)}</Pie></PieChart></ResponsiveContainer>
            <div className="space-y-0.5">{dominance.slice(0, 4).map(m => <div key={m.name} className="flex justify-between text-[9px]"><div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: m.fill }} />{m.name}</div><span className="text-white">{m.value}%</span></div>)}</div>
          </div>

          {/* Sentiment Radar */}
          <div className="card-neon rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Sentiment</h4>
            <ResponsiveContainer width="100%" height={130}>
              <RadarChart data={sentimentData}><PolarGrid stroke="rgba(0,240,255,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#475569' }} /><Radar name="Score" dataKey="A" stroke="#00f0ff" fill="rgba(0,240,255,0.15)" strokeWidth={1.5} /></RadarChart>
            </ResponsiveContainer>
            <div className="text-center"><span className="text-sm font-bold text-white">{marketOverview.fearGreedIndex}</span><span className="text-[10px] ml-1 text-[#ff6b35]">{marketOverview.fearGreedLabel}</span></div>
          </div>
        </div>
      </div>

      {/* Top Lists Row */}
      <div className="stagger-children grid grid-cols-3 gap-3">
        {/* Gainers */}
        <div className="card-neon rounded-xl p-3">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5"><TrendingUp size={12} className="text-[#00ff88]" /> Top Gainers (24h)</h4>
          <div className="space-y-1">{topGainers.slice(0, 6).map(t => (
            <div key={t.symbol} className="flex items-center justify-between py-1 border-b border-cyan-500/5">
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #00ff8840, #00ff8820)' }}>{t.symbol[0]}</div><span className="text-xs text-white">{t.symbol}</span></div>
              <span className="text-xs text-white">{formatPrice(t.price)}</span><span className="text-xs text-[#00ff88]">{formatPercent(t.change24h)}</span>
            </div>
          ))}</div>
        </div>
        {/* Losers */}
        <div className="card-neon rounded-xl p-3">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5"><TrendingDown size={12} className="text-[#ff2d95]" /> Top Losers (24h)</h4>
          <div className="space-y-1">{topLosers.slice(0, 6).map(t => (
            <div key={t.symbol} className="flex items-center justify-between py-1 border-b border-cyan-500/5">
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff2d9540, #ff2d9520)' }}>{t.symbol[0]}</div><span className="text-xs text-white">{t.symbol}</span></div>
              <span className="text-xs text-white">{formatPrice(t.price)}</span><span className="text-xs text-[#ff2d95]">{formatPercent(t.change24h)}</span>
            </div>
          ))}</div>
        </div>
        {/* Volume Leaders */}
        <div className="card-neon rounded-xl p-3">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5"><Volume2 size={12} className="text-[#b829dd]" /> Volume Leaders</h4>
          <div className="space-y-1">{topVolume.slice(0, 6).map(t => (
            <div key={t.symbol} className="flex items-center justify-between py-1 border-b border-cyan-500/5">
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #b829dd40, #b829dd20)' }}>{t.symbol[0]}</div><span className="text-xs text-white">{t.symbol}</span></div>
              <span className="text-xs text-slate-300">{formatUSD(t.volume24h, true)}</span>
            </div>
          ))}</div>
        </div>
      </div>

      {/* Full Market Table */}
      <div className="card-neon rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3"><h4 className="text-xs font-semibold text-slate-300">All Markets</h4><div className="flex gap-1">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-2 py-0.5 rounded text-[10px]', activeTab === tab ? 'text-cyan-300' : 'text-slate-400')} style={activeTab === tab ? { background: 'rgba(0,240,255,0.08)' } : {}}>{tab}</button>)}</div></div>
          <span className="text-[10px] text-slate-500">{filteredTokens.length} assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-400 border-b border-cyan-500/10">
              <th className="text-left py-1.5">#</th><th className="text-left">Token</th><th className="text-right">Price</th>
              <th className="text-right">24h</th><th className="text-right">7d</th><th className="text-right">Market Cap</th>
              <th className="text-right">Volume</th><th className="text-right">OI</th><th className="text-right">Funding</th><th className="text-center">RSI</th><th className="text-center">Signal</th>
            </tr></thead>
            <tbody>{filteredTokens.map(t => {
              const score = t.rsi14;
              const signal = score > 70 ? 'Overbought' : score > 50 ? 'Bullish' : score > 30 ? 'Neutral' : 'Oversold';
              return (
                <tr key={t.symbol} className="border-b border-cyan-500/5 hover:bg-cyan-500/[0.02]">
                  <td className="py-1.5 text-[9px] text-slate-500">{t.rank}</td>
                  <td><div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-[7px] font-bold text-cyan-400">{t.symbol[0]}</div><div><div className="text-xs text-white">{t.symbol}</div><div className="text-[8px] text-slate-500">{t.name}</div></div></div></td>
                  <td className="text-right text-xs text-white font-mono">{formatPrice(t.price)}</td>
                  <td className={cn('text-right text-xs', t.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change24h)}</td>
                  <td className={cn('text-right text-xs', t.change7d > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change7d)}</td>
                  <td className="text-right text-xs text-slate-300">{formatUSD(t.marketCap, true)}</td>
                  <td className="text-right text-xs text-slate-300">{formatUSD(t.volume24h, true)}</td>
                  <td className="text-right text-xs text-slate-300">{formatUSD(t.oi, true)}</td>
                  <td className={cn('text-right text-xs', t.fundingRate > 0 ? 'text-[#ff6b35]' : 'text-[#00ff88]')}>{t.fundingRate > 0 ? '+' : ''}{(t.fundingRate * 100).toFixed(2)}%</td>
                  <td className="text-center text-xs" style={{ color: score > 70 ? '#ff6b35' : score > 50 ? '#00ff88' : '#f0e800' }}>{t.rsi14.toFixed(1)}</td>
                  <td className="text-center"><span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: score > 70 ? 'rgba(255,107,53,0.15)' : score > 50 ? 'rgba(0,255,136,0.15)' : 'rgba(240,232,0,0.15)', color: score > 70 ? '#ff6b35' : score > 50 ? '#00ff88' : '#f0e800' }}>{signal}</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
