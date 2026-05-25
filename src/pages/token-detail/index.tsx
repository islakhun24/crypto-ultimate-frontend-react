import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star, TrendingUp, TrendingDown, Bell, ArrowUpRight, ArrowDownRight, Activity, Layers, Flame, Zap } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { tokens, exchanges, formatUSD, formatPrice, formatPercent, getSignalScore } from '@/shared/data/cryptoData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(5,5,20,0.95)', border: '1px solid rgba(0,240,255,0.2)' }}><p className="text-slate-400 mb-1">{label}</p>{payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? (p.value >= 1000 ? `$${p.value.toLocaleString()}` : p.value.toFixed(4)) : p.value}</p>)}</div>;
};

export default function TokenDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const token = tokens.find(t => t.symbol === symbol) || tokens[0];
  const [tf, setTf] = useState('1D');
  const [chartType, setChartType] = useState<'price' | 'oi'>('price');

  const sig = useMemo(() => getSignalScore(token), [token]);

  const chartData = useMemo(() => {
    const base = chartType === 'price' ? token.price : token.oi;
    return Array.from({ length: 48 }, (_, i) => ({
      time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      value: base * (1 + Math.sin(i * 0.3) * 0.04 + (Math.random() - 0.5) * 0.015),
      volume: token.volume24h / 48 * (0.5 + Math.random()),
    }));
  }, [token, chartType]);

  const crossData = exchanges.map(e => {
    const spread = Math.abs(e.pairs.find(p => p.symbol === token.symbol + 'USDT')?.spread || 0.002);
    return { exchange: e.name, price: token.price * (1 + (Math.random() - 0.5) * spread * 2), spread, volume: e.pairs.find(p => p.symbol === token.symbol + 'USDT')?.volume || 0, oi: token.oi * (0.12 + Math.random() * 0.08) };
  });

  const levels = [
    { label: 'R3', price: token.ema200 * 1.08, type: 'Strong Resistance' },
    { label: 'R2', price: token.ema200 * 1.05, type: 'Resistance' },
    { label: 'R1', price: token.ema50 * 1.02, type: 'Minor Resistance' },
    { label: 'P', price: token.price, type: 'Pivot' },
    { label: 'S1', price: token.ema50 * 0.98, type: 'Minor Support' },
    { label: 'S2', price: token.ema200 * 0.95, type: 'Support' },
    { label: 'S3', price: token.ema200 * 0.92, type: 'Strong Support' },
  ];

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}<div className="text-[10px] text-slate-400 flex items-center gap-1"><span>Tokens</span><span>›</span><span className="text-white">{token.symbol}</span></div>

      {/* Header */}
      <div className="card-neon rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.2)' }}>{token.symbol[0]}</div>
            <div><div className="flex items-center gap-2"><h1 className="text-xl font-bold text-white">{token.name}</h1><span className="text-xs text-slate-400">{token.symbol}/USDT</span><Star size={14} className="text-slate-500" /></div>
              <div className="flex items-center gap-1 mt-0.5">{token.tags.map(tag => <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{tag}</span>)}</div></div>
          </div>
          <div className="text-right"><div className="text-3xl font-bold text-white">{formatPrice(token.price)}</div><div className={cn('text-sm', token.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{token.change24h > 0 ? <ArrowUpRight size={14} className="inline" /> : <ArrowDownRight size={14} className="inline" />}{formatPercent(token.change24h)} <span className="text-slate-400">({formatPercent(token.change7d)} 7d)</span></div></div>
          <div className="flex gap-4">
            {[{l:'Market Cap',v:formatUSD(token.marketCap, true),c:'+2.05%'},{l:'24h Volume',v:formatUSD(token.volume24h, true),c:'+8.47%'},{l:'Open Interest',v:formatUSD(token.oi, true),c:formatPercent(token.oiChange24h)},{l:'Funding',v:`${token.fundingRate > 0 ? '+' : ''}${(token.fundingRate * 100).toFixed(2)}%`,c:''},{l:'Signal',v:sig.score.toString(),c:sig.label}].map(s => (
              <div key={s.l} className="text-center"><div className="text-[9px] text-slate-400">{s.l}</div><div className="text-base font-bold text-white">{s.v}</div>{s.c && <div className="text-[9px]" style={{ color: s.l === 'Signal' ? sig.color : '#00ff88' }}>{s.c}</div>}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart + Side */}
      <div className="stagger-children grid grid-cols-3 gap-3">
        <div className="col-span-2 card-neon rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><button onClick={() => setChartType('price')} className={cn('px-3 py-1 rounded-lg text-[10px]', chartType === 'price' ? 'text-white' : 'text-slate-400')} style={chartType === 'price' ? { background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' } : {}}>Price</button><button onClick={() => setChartType('oi')} className={cn('px-3 py-1 rounded-lg text-[10px]', chartType === 'oi' ? 'text-white' : 'text-slate-400')} style={chartType === 'oi' ? { background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' } : {}}>OI</button></div>
            <div className="flex gap-1">{['1H','4H','1D','1W'].map(t => <button key={t} onClick={() => setTf(t)} className={cn('px-2 py-0.5 rounded text-[10px]', tf === t ? 'text-white' : 'text-slate-400')} style={tf === t ? { background: 'rgba(0,240,255,0.1)' } : {}}>{t}</button>)}</div>
          </div>
          <ResponsiveContainer width="100%" height={280}><AreaChart data={chartData}><defs><linearGradient id="tdGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="100%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.05)" /><XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} /><YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={{ stroke: 'rgba(0,240,255,0.1)' }} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={2} fill="url(#tdGrad)" name={chartType === 'price' ? 'Price' : 'OI'} /></AreaChart></ResponsiveContainer>
          <ResponsiveContainer width="100%" height={50}><BarChart data={chartData}><Bar dataKey="volume" name="Volume">{chartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? 'rgba(0,240,255,0.3)' : 'rgba(184,41,221,0.3)'} />)}</Bar></BarChart></ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {/* Key Metrics */}
          <div className="card-neon rounded-xl p-3"><h4 className="text-xs font-semibold text-slate-300 mb-2">Key Metrics</h4><div className="stagger-children grid grid-cols-2 gap-2">
            {[{l:'ATH',v:formatPrice(token.ath),c:`${formatPercent(token.athChange)}`},{l:'ATL',v:formatPrice(token.atl),c:''},{l:'RSI (14)',v:token.rsi14.toFixed(1),c:token.rsi14 > 70 ? 'Overbought' : token.rsi14 > 50 ? 'Bullish' : 'Bearish'},{l:'RSI (4h)',v:token.rsi4h.toFixed(1),c:''},{l:'EMA 20',v:formatPrice(token.ema20),c:''},{l:'EMA 50',v:formatPrice(token.ema50),c:''},{l:'EMA 200',v:formatPrice(token.ema200),c:''},{l:'CVD 24h',v:formatUSD(token.cvd24h, true),c:token.cvd24h > 0 ? 'Bullish' : 'Bearish'}].map(m => (
              <div key={m.l} className="bg-white/[0.02] rounded-lg p-2"><div className="text-[9px] text-slate-400">{m.l}</div><div className="text-xs text-white font-mono">{m.v}</div>{m.c && <div className="text-[8px]" style={{ color: m.c === 'Bullish' || m.c === 'Overbought' ? '#00ff88' : m.c === 'Bearish' ? '#ff2d95' : '#f0e800' }}>{m.c}</div>}</div>
            ))}
          </div></div>

          {/* Levels */}
          <div className="card-neon rounded-xl p-3"><h4 className="text-xs font-semibold text-slate-300 mb-2">Support / Resistance</h4>
            {levels.map(l => (
              <div key={l.label} className="flex items-center justify-between py-0.5"><span className="text-[9px] text-slate-400 w-6">{l.label}</span><span className="text-xs text-white font-mono">{formatPrice(l.price)}</span><span className={cn('text-[8px]', l.label.startsWith('R') ? 'text-[#ff6b35]' : l.label.startsWith('S') ? 'text-[#00ff88]' : 'text-[#00f0ff]')}>{l.type}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Exchange */}
      <div className="card-neon rounded-xl p-4">
        <h4 className="text-xs font-semibold text-slate-300 mb-3">Cross-Exchange Comparison</h4>
        <table className="w-full text-sm"><thead><tr className="text-[10px] text-slate-400 border-b border-cyan-500/10">
          <th className="text-left py-2">Exchange</th><th className="text-right">Price</th><th className="text-right">Spread</th><th className="text-right">Volume</th><th className="text-right">OI Contribution</th><th className="text-center">Status</th>
        </tr></thead><tbody>{crossData.map(c => (
          <tr key={c.exchange} className="border-b border-cyan-500/5"><td className="py-2 flex items-center gap-2"><div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[9px] font-bold text-white">{c.exchange[0]}</div><span className="text-xs text-white">{c.exchange}</span></td>
            <td className="text-right text-xs text-white font-mono">{formatPrice(c.price)}</td><td className="text-right text-xs text-[#ff6b35]">{c.spread.toFixed(3)}%</td><td className="text-right text-xs text-slate-300">{formatUSD(c.volume, true)}</td><td className="text-right text-xs text-slate-300">{formatUSD(c.oi, true)}</td>
            <td className="text-center"><span className="text-[9px] text-[#00ff88] flex items-center justify-center gap-1"><span className="w-1 h-1 rounded-full bg-[#00ff88]" />Normal</span></td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
