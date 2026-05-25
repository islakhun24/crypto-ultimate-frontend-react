import { useState } from 'react';
import { exchanges, tokens } from '@/shared/data/cryptoData';
import { Search, Link2, CheckCircle, XCircle } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

// Generate symbol mappings
const mappings = exchanges.flatMap(ex =>
  tokens.slice(0, 10).map(t => ({
    exchange: ex.name,
    unified: t.symbol,
    local: `${t.symbol}USDT`,
    active: Math.random() > 0.1,
    lastUpdate: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
  }))
);

const sectionNavItems = [
  { label: 'Data Quality', path: '/data/data-quality' },
  { label: 'Symbol Mapping', path: '/data/exchange-symbol-mapping' },
];

export default function ExchangeSymbolMappingPage() {
  const [search, setSearch] = useState('');
  const [exchangeFilter, setExchangeFilter] = useState('all');

  const filtered = mappings
    .filter(m => exchangeFilter === 'all' || m.exchange === exchangeFilter)
    .filter(m => m.unified.toLowerCase().includes(search.toLowerCase()) || m.local.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Symbol Mapping</h1>
          <p className="text-sm text-gray-400 mt-1">Exchange symbol mapping management</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search symbol..." className="w-full bg-[#0a0a0a] border border-[#222] text-white text-sm rounded pl-9 pr-3 py-2 font-mono focus:border-cyan-500 outline-none" />
        </div>
        <select value={exchangeFilter} onChange={e => setExchangeFilter(e.target.value)} className="bg-[#0a0a0a] border border-[#222] text-white text-sm rounded px-3 py-2 font-mono">
          <option value="all">All Exchanges</option>
          {exchanges.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
        </select>
      </div>

      <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-neon p-3 text-center"><p className="text-lg font-bold text-white font-mono">{mappings.length}</p><p className="text-[10px] text-gray-400 font-mono">TOTAL MAPPINGS</p></div>
        <div className="card-neon p-3 text-center"><p className="text-lg font-bold text-green-400 font-mono">{mappings.filter(m => m.active).length}</p><p className="text-[10px] text-gray-400 font-mono">ACTIVE</p></div>
        <div className="card-neon p-3 text-center"><p className="text-lg font-bold text-red-400 font-mono">{mappings.filter(m => !m.active).length}</p><p className="text-[10px] text-gray-400 font-mono">INACTIVE</p></div>
        <div className="card-neon p-3 text-center"><p className="text-lg font-bold text-cyan-400 font-mono">{exchanges.length}</p><p className="text-[10px] text-gray-400 font-mono">EXCHANGES</p></div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Mappings</h3>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0f0f0f]">
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-left p-2 text-gray-400 font-mono">UNIFIED</th>
                <th className="text-left p-2 text-gray-400 font-mono">LOCAL</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
                <th className="text-left p-2 text-gray-400 font-mono">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{m.exchange}</td>
                  <td className="p-2 font-mono text-cyan-400">{m.unified}</td>
                  <td className="p-2 font-mono text-gray-300">{m.local}</td>
                  <td className="p-2">{m.active ? <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" /> Active</span> : <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" /> Inactive</span>}</td>
                  <td className="p-2 font-mono text-gray-500">{m.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}