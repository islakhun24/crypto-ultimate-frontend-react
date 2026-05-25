import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'CVD', path: '/flow/cvd' },
  { label: 'Taker Buy/Sell', path: '/flow/taker-buy-sell' },
  { label: 'Volume Spike', path: '/flow/volume-spike' },
];

export default function CVDPage() {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const token = tokens.find(t => t.symbol === selectedToken) || tokens[0];

  const cvdData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    cvd: token.cvd24h * (i / 24) + (Math.random() - 0.5) * token.cvd24h * 0.3,
    price: token.price * (0.95 + (i / 24) * 0.1 + (Math.random() - 0.5) * 0.02),
  }));

  const sortedByCVD = [...tokens].sort((a, b) => b.cvd24h - a.cvd24h);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">CVD Flow</h1>
          <p className="text-sm text-gray-400 mt-1">Cumulative Volume Delta analysis</p>
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
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">CVD 24H</span>
          </div>
          <p className={`text-xl font-bold font-mono ${token.cvd24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {token.cvd24h >= 0 ? '+' : ''}{formatUSD(token.cvd24h, true)}
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">TAKER BUY RATIO</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{token.takerBuyRatio.toFixed(1)}%</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">PRESSURE</span>
          </div>
          <p className={`text-xl font-bold font-mono ${token.takerBuyRatio > 55 ? 'text-green-400' : token.takerBuyRatio < 45 ? 'text-red-400' : 'text-yellow-400'}`}>
            {token.takerBuyRatio > 55 ? 'BUYING' : token.takerBuyRatio < 45 ? 'SELLING' : 'NEUTRAL'}
          </p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">{token.symbol} CVD + Price</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={cvdData}>
            <defs>
              <linearGradient id="cvdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={token.cvd24h >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={token.cvd24h >= 0 ? '#00ff88' : '#ff2d95'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => formatUSD(v, true)} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
            <Area type="monotone" dataKey="cvd" stroke={token.cvd24h >= 0 ? '#00ff88' : '#ff2d95'} fillOpacity={1} fill="url(#cvdGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">All Tokens CVD Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">RANK</th>
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">CVD 24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">TAKER BUY %</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIGNAL</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCVD.map((t, i) => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer" onClick={() => setSelectedToken(t.symbol)}>
                  <td className="p-2 font-mono text-gray-500">#{i + 1}</td>
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className={`p-2 text-right font-mono ${t.cvd24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.cvd24h >= 0 ? '+' : ''}{formatUSD(t.cvd24h, true)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{width: `${t.takerBuyRatio}%`}} />
                      </div>
                      <span className="font-mono text-white">{t.takerBuyRatio.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.takerBuyRatio > 60 ? 'bg-green-500/20 text-green-400' : t.takerBuyRatio < 40 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {t.takerBuyRatio > 60 ? 'STRONG BUY' : t.takerBuyRatio > 55 ? 'BUY' : t.takerBuyRatio < 40 ? 'STRONG SELL' : t.takerBuyRatio < 45 ? 'SELL' : 'NEUTRAL'}
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