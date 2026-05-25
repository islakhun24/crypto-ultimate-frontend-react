import { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { tokens, formatUSD, formatPrice, formatPercent } from '@/shared/data/cryptoData';
import { TokenLink } from '@/components/shared';

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  return <svg width={60} height={20} viewBox={`0 0 ${data.length} 20`} preserveAspectRatio="none"><polyline points={data.map((v, i) => `${i},${20 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 18}`).join(' ')} fill="none" stroke={color} strokeWidth={1.5} /></svg>;
}

export default function TokensPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('marketCap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'Meme', 'AI', 'Payments', 'Oracle', 'Infrastructure', 'Exchange'];

  const filtered = useMemo(() => {
    let data = [...tokens];
    if (activeCategory !== 'All') data = data.filter(t => t.category === activeCategory);
    if (search) data = data.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));
    data.sort((a, b) => {
      const av = a[sortField as keyof typeof a] as number;
      const bv = b[sortField as keyof typeof b] as number;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return data;
  }, [search, sortField, sortDir, activeCategory]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold gradient-text">Token Market</h1><p className="text-xs text-slate-400">{filtered.length} assets tracked across 6 exchanges</p></div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tokens..." className="h-8 w-48 pl-8 pr-3 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none" style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.12)' }} /></div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-1 flex-wrap">{categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={cn('px-3 py-1 rounded-lg text-[10px]', activeCategory === c ? 'text-white' : 'text-slate-400')} style={activeCategory === c ? { background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.3)' } : { border: '1px solid transparent' }}>{c}</button>)}</div>

      {/* Table */}
      <div className="card-neon rounded-xl p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-400 border-b border-cyan-500/10">
              {[{l:'#',f:'rank'},{l:'Token',f:'symbol'},{l:'Price',f:'price'},{l:'24h',f:'change24h'},{l:'7d',f:'change7d'},{l:'Market Cap',f:'marketCap'},{l:'Volume',f:'volume24h'},{l:'OI',f:'oi'},{l:'Funding',f:'fundingRate'},{l:'L/S',f:'longShortRatio'},{l:'RSI',f:'rsi14'},{l:'Chart',f:''}].map(h => (
                <th key={h.f || h.l} className={cn('py-1.5 px-1 font-medium cursor-pointer', h.f ? 'text-right' : '')} onClick={() => h.f && toggleSort(h.f)}>
                  <span className="flex items-center gap-0.5 justify-end">{h.l}{h.f && <ArrowUpDown size={9} />}</span>
                </th>
              ))}
            </tr></thead>
            <tbody>{filtered.map(t => (
              <tr key={t.symbol} className="border-b border-cyan-500/5 hover:bg-cyan-500/[0.02] cursor-pointer" onClick={() => window.location.hash = `/token/${t.symbol}`}>
                <td className="py-1.5 px-1 text-[9px] text-slate-500">{t.rank}</td>
                <td className="px-1"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))' }}>{t.symbol[0]}</div><div><div><TokenLink symbol={t.symbol} className="text-xs" showColor={false} /></div><div className="text-[8px] text-slate-500">{t.name}</div></div></div></td>
                <td className="text-right text-xs text-white font-mono px-1">{formatPrice(t.price)}</td>
                <td className={cn('text-right text-xs px-1', t.change24h > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change24h)}</td>
                <td className={cn('text-right text-xs px-1', t.change7d > 0 ? 'text-[#00ff88]' : 'text-[#ff2d95]')}>{formatPercent(t.change7d)}</td>
                <td className="text-right text-xs text-slate-300 px-1">{formatUSD(t.marketCap, true)}</td>
                <td className="text-right text-xs text-slate-300 px-1">{formatUSD(t.volume24h, true)}</td>
                <td className="text-right text-xs text-slate-300 px-1">{formatUSD(t.oi, true)}</td>
                <td className={cn('text-right text-xs px-1', t.fundingRate > 0 ? 'text-[#ff6b35]' : 'text-[#00ff88]')}>{t.fundingRate > 0 ? '+' : ''}{(t.fundingRate * 100).toFixed(2)}%</td>
                <td className="text-right text-xs text-slate-300 px-1">{t.longShortRatio.toFixed(2)}</td>
                <td className="text-center text-xs px-1" style={{ color: t.rsi14 > 70 ? '#ff6b35' : t.rsi14 > 50 ? '#00ff88' : '#f0e800' }}>{t.rsi14.toFixed(0)}</td>
                <td className="text-right px-1"><MiniSpark data={t.sparkline7d} color={t.change7d > 0 ? '#00ff88' : '#ff2d95'} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
