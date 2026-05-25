import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'CVD', path: '/flow/cvd' },
  { label: 'Taker Buy/Sell', path: '/flow/taker-buy-sell' },
  { label: 'Volume Spike', path: '/flow/volume-spike' },
];

export default function TakerBuySellPage() {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const token = tokens.find(t => t.symbol === selectedToken) || tokens[0];

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    buyVolume: token.volume24h / 24 * (0.5 + Math.random() * 0.8) * (token.takerBuyRatio / 100),
    sellVolume: token.volume24h / 24 * (0.5 + Math.random() * 0.8) * ((100 - token.takerBuyRatio) / 100),
  }));

  const sortedByRatio = [...tokens].sort((a, b) => b.takerBuyRatio - a.takerBuyRatio);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Taker Buy/Sell Flow</h1>
          <p className="text-sm text-gray-400 mt-1">Taker volume analysis across exchanges</p>
        </div>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="bg-[#0a0a0a] border border-[#222] text-white text-sm rounded px-3 py-1.5 font-mono focus:border-cyan-500 outline-none"
        >
          {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
        </select>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">TAKER BUY %</span>
          </div>
          <p className="text-xl font-bold text-green-400 font-mono">{token.takerBuyRatio.toFixed(1)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-mono">TAKER SELL %</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{(100 - token.takerBuyRatio).toFixed(1)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">VOLUME 24H</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(token.volume24h, true)}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">{token.symbol} Buy vs Sell Volume (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="hour" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
            <Bar dataKey="buyVolume" name="Buy" fill="#00ff88" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sellVolume" name="Sell" fill="#ff2d95" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Taker Buy Ratio Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">BUY %</th>
                <th className="text-right p-2 text-gray-400 font-mono">SELL %</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOLUME</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRESSURE</th>
              </tr>
            </thead>
            <tbody>
              {sortedByRatio.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer" onClick={() => setSelectedToken(t.symbol)}>
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full" style={{width: `${t.takerBuyRatio}%`}} />
                      </div>
                      <span className="font-mono text-green-400">{t.takerBuyRatio.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{width: `${100 - t.takerBuyRatio}%`}} />
                      </div>
                      <span className="font-mono text-red-400">{(100 - t.takerBuyRatio).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right font-mono text-gray-300">{formatUSD(t.volume24h, true)}</td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.takerBuyRatio > 55 ? 'bg-green-500/20 text-green-400' : t.takerBuyRatio < 45 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {t.takerBuyRatio > 55 ? 'BUY' : t.takerBuyRatio < 45 ? 'SELL' : 'NEUTRAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}