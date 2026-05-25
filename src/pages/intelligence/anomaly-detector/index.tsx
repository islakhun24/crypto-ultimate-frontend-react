import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Zap, Activity } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Price-OI Div', path: '/intelligence/price-oi-divergence' },
  { label: 'Exchange Div', path: '/intelligence/exchange-divergence' },
  { label: 'Market Pressure', path: '/intelligence/market-pressure' },
  { label: 'Anomaly', path: '/intelligence/anomaly-detector' },
];

export default function AnomalyDetectorPage() {
  const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium');

  const thresholds = { low: 5, medium: 3, high: 1.5 };
  const threshold = thresholds[sensitivity];

  const anomalies = tokens.map(t => {
    const rsiAnomaly = t.rsi14 > 80 || t.rsi14 < 20;
    const fundingAnomaly = Math.abs(t.fundingRate) > 0.015;
    const lsAnomaly = t.longShortRatio > 3 || t.longShortRatio < 0.5;
    const volumeAnomaly = t.volume24h > t.marketCap * 0.3;
    const priceAnomaly = Math.abs(t.change24h) > threshold;
    const score = [rsiAnomaly, fundingAnomaly, lsAnomaly, volumeAnomaly, priceAnomaly].filter(Boolean).length;
    return { ...t, rsiAnomaly, fundingAnomaly, lsAnomaly, volumeAnomaly, priceAnomaly, score };
  }).filter(t => t.score > 0).sort((a, b) => b.score - a.score);

  const highRisk = anomalies.filter(a => a.score >= 4);
  const mediumRisk = anomalies.filter(a => a.score === 2 || a.score === 3);
  const lowRisk = anomalies.filter(a => a.score === 1);

  const chartData = anomalies.slice(0, 12).map(a => ({ symbol: a.symbol, score: a.score, change: Math.abs(a.change24h) }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-red">Anomaly Detector</h1>
          <p className="text-sm text-gray-400 mt-1">Detect abnormal market conditions</p>
        </div>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map(s => (
            <button key={s} onClick={() => setSensitivity(s)} className={`px-3 py-1.5 text-xs font-mono rounded border ${sensitivity === s ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-[#222] text-gray-400'}`}>{s.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-400 font-mono">DETECTED</span></div>
          <p className="text-xl font-bold text-red-400 font-mono">{anomalies.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">HIGH RISK</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{highRisk.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-orange-400" /><span className="text-xs text-gray-400 font-mono">MEDIUM RISK</span></div>
          <p className="text-xl font-bold text-orange-400 font-mono">{mediumRisk.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-yellow-400" /><span className="text-xs text-gray-400 font-mono">LOW RISK</span></div>
          <p className="text-xl font-bold text-yellow-400 font-mono">{lowRisk.length}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-red mb-4">Anomaly Score Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score >= 4 ? '#ff00ff' : entry.score >= 2 ? '#ff6b35' : '#f0e800'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-red mb-4">Detected Anomalies</h3>
        <div className="space-y-2">
          {anomalies.map(a => (
            <div key={a.symbol} className={`p-3 rounded border ${a.score >= 4 ? 'bg-magenta-500/10 border-magenta-500/30' : a.score >= 2 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-yellow-500/5 border-yellow-500/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{a.symbol}</span>
                  <span className="text-gray-400">{formatPrice(a.price)}</span>
                  <span className={a.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>{a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: a.score }).map((_, i) => (
                    <AlertTriangle key={i} className={`w-3 h-3 ${a.score >= 4 ? 'text-magenta-400' : a.score >= 2 ? 'text-orange-400' : 'text-yellow-400'}`} />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {a.rsiAnomaly && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-mono">RSI EXTREME ({a.rsi14.toFixed(1)})</span>}
                {a.fundingAnomaly && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-mono">FUNDING EXTREME ({(a.fundingRate * 100).toFixed(2)}%)</span>}
                {a.lsAnomaly && <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-mono">L/S IMBALANCE ({a.longShortRatio.toFixed(2)})</span>}
                {a.volumeAnomaly && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-mono">VOLUME SPIKE</span>}
                {a.priceAnomaly && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-mono">PRICE MOVE ({Math.abs(a.change24h).toFixed(1)}%)</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}