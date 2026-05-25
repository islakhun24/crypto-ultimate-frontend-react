import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Price-OI Div', path: '/intelligence/price-oi-divergence' },
  { label: 'Exchange Div', path: '/intelligence/exchange-divergence' },
  { label: 'Market Pressure', path: '/intelligence/market-pressure' },
  { label: 'Anomaly', path: '/intelligence/anomaly-detector' },
];

export default function MarketPressurePage() {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const token = tokens.find(t => t.symbol === selectedToken) || tokens[0];

  const radarData = [
    { metric: 'Price vs EMA20', value: Math.min((token.price / token.ema20) * 50, 100) },
    { metric: 'RSI', value: token.rsi14 },
    { metric: 'L/S Ratio', value: token.longShortRatio * 30 },
    { metric: 'Taker Buy %', value: token.takerBuyRatio },
    { metric: 'OI Trend', value: token.oiChange24h > 0 ? 70 : 30 },
    { metric: 'CVD', value: token.cvd24h > 0 ? 75 : 25 },
  ];

  const pressureScore = (radarData.reduce((s, d) => s + d.value, 0) / radarData.length).toFixed(0);
  const pressureLabel = parseInt(pressureScore) > 60 ? 'BULLISH' : parseInt(pressureScore) < 40 ? 'BEARISH' : 'NEUTRAL';

  const allPressures = tokens.map(t => {
    const score = ((Math.min((t.price / t.ema20) * 50, 100) + t.rsi14 + t.longShortRatio * 30 + t.takerBuyRatio + (t.oiChange24h > 0 ? 70 : 30) + (t.cvd24h > 0 ? 75 : 25)) / 6).toFixed(0);
    return { ...t, pressureScore: parseInt(score) };
  }).sort((a, b) => b.pressureScore - a.pressureScore);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Market Pressure</h1>
          <p className="text-sm text-gray-400 mt-1">Aggregated market pressure analysis</p>
        </div>
        <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} className="bg-[#0a0a0a] border border-[#222] text-white text-sm rounded px-3 py-1.5 font-mono focus:border-cyan-500 outline-none">
          {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
        </select>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Gauge className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">{token.symbol} PRESSURE</span></div>
          <p className={`text-xl font-bold font-mono ${parseInt(pressureScore) > 60 ? 'text-green-400' : parseInt(pressureScore) < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
            {pressureScore}/100
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            {pressureLabel === 'BULLISH' ? <TrendingUp className="w-4 h-4 text-green-400" /> : pressureLabel === 'BEARISH' ? <TrendingDown className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4 text-yellow-400" />}
            <span className="text-xs text-gray-400 font-mono">SENTIMENT</span>
          </div>
          <p className={`text-xl font-bold font-mono ${pressureLabel === 'BULLISH' ? 'text-green-400' : pressureLabel === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'}`}>{pressureLabel}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">L/S RATIO</span></div>
          <p className="text-xl font-bold text-white font-mono">{token.longShortRatio.toFixed(2)}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">{token.symbol} Pressure Radar</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#222" />
            <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={11} />
            <PolarRadiusAxis stroke="#555" fontSize={10} />
            <Radar name={token.symbol} dataKey="value" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} strokeWidth={2} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">All Tokens Pressure Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRESSURE</th>
                <th className="text-right p-2 text-gray-400 font-mono">SIGNAL</th>
                <th className="text-right p-2 text-gray-400 font-mono">RSI</th>
                <th className="text-right p-2 text-gray-400 font-mono">L/S</th>
                <th className="text-right p-2 text-gray-400 font-mono">CVD</th>
              </tr>
            </thead>
            <tbody>
              {allPressures.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer" onClick={() => setSelectedToken(t.symbol)}>
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width: `${t.pressureScore}%`, backgroundColor: t.pressureScore > 60 ? '#00ff88' : t.pressureScore < 40 ? '#ff2d95' : '#f0e800'}} />
                      </div>
                      <span className="font-mono text-white">{t.pressureScore}</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.pressureScore > 60 ? 'bg-green-500/20 text-green-400' : t.pressureScore < 40 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {t.pressureScore > 60 ? 'BULLISH' : t.pressureScore < 40 ? 'BEARISH' : 'NEUTRAL'}
                    </span>
                  </td>
                  <td className="p-2 text-right font-mono text-white">{t.rsi14.toFixed(1)}</td>
                  <td className="p-2 text-right font-mono text-white">{t.longShortRatio.toFixed(2)}</td>
                  <td className={`p-2 text-right font-mono ${t.cvd24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.cvd24h >= 0 ? '+' : ''}{formatUSD(t.cvd24h, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}