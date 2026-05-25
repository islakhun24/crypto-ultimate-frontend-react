import { useState } from 'react';
import { exchanges, formatUSD } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Price-OI Div', path: '/intelligence/price-oi-divergence' },
  { label: 'Exchange Div', path: '/intelligence/exchange-divergence' },
  { label: 'Market Pressure', path: '/intelligence/market-pressure' },
  { label: 'Anomaly', path: '/intelligence/anomaly-detector' },
];

export default function ExchangeDivergencePage() {
  const [metric, setMetric] = useState<'price' | 'spread' | 'volume'>('price');

  const priceData = exchanges.flatMap(ex =>
    ex.pairs.map(p => ({ exchange: ex.name, symbol: p.symbol, price: p.price, spread: p.spread, volume: p.volume }))
  );

  const btcPrices = exchanges.map(ex => {
    const pair = ex.pairs.find(p => p.symbol === 'BTCUSDT');
    return { exchange: ex.name, price: pair?.price || 0, spread: pair?.spread || 0, volume: pair?.volume || 0 };
  });

  const avgPrice = btcPrices.reduce((s, e) => s + e.price, 0) / btcPrices.length;
  const maxPrice = Math.max(...btcPrices.map(e => e.price));
  const minPrice = Math.min(...btcPrices.map(e => e.price));
  const maxSpread = Math.max(...btcPrices.map(e => e.spread));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Exchange Divergence</h1>
          <p className="text-sm text-gray-400 mt-1">Price and spread differences across exchanges</p>
        </div>
        <div className="flex gap-2">
          {(['price', 'spread', 'volume'] as const).map(m => (
            <button key={m} onClick={() => setMetric(m)} className={`px-3 py-1.5 text-xs font-mono rounded border ${metric === m ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{m.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">AVG BTC PRICE</span></div>
          <p className="text-xl font-bold text-white font-mono">${avgPrice.toLocaleString()}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">HIGHEST</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">${maxPrice.toLocaleString()}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">LOWEST</span></div>
          <p className="text-xl font-bold text-red-400 font-mono">${minPrice.toLocaleString()}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">MAX SPREAD</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{(maxSpread * 100).toFixed(3)}%</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">BTC Price by Exchange</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={btcPrices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="exchange" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={(v) => `$${v.toLocaleString()}`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="price" fill="#00f0ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Exchange Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">BTC PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SPREAD</th>
                <th className="text-right p-2 text-gray-400 font-mono">DEPTH</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOLUME</th>
                <th className="text-right p-2 text-gray-400 font-mono">VS AVG</th>
              </tr>
            </thead>
            <tbody>
              {btcPrices.map(ex => (
                <tr key={ex.exchange} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{ex.exchange}</td>
                  <td className="p-2 text-right font-mono text-white">${ex.price.toLocaleString()}</td>
                  <td className={`p-2 text-right font-mono ${ex.spread > 0.01 ? 'text-red-400' : 'text-green-400'}`}>{(ex.spread * 100).toFixed(3)}%</td>
                  <td className="p-2 text-right font-mono text-gray-300">{ex.spread > 0.01 ? 'Low' : ex.spread > 0.005 ? 'Medium' : 'High'}</td>
                  <td className="p-2 text-right font-mono text-gray-300">{formatUSD(ex.volume, true)}</td>
                  <td className={`p-2 text-right font-mono ${ex.price > avgPrice ? 'text-green-400' : 'text-red-400'}`}>{((ex.price / avgPrice - 1) * 100).toFixed(3)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}