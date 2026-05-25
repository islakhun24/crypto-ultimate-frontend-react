import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Rocket, Zap, TrendingUp, Activity, Timer } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'Scanner', path: '/signals/scanner' },
  { label: 'History', path: '/signals/history' },
  { label: 'Strategy', path: '/signals/strategy-builder' },
  { label: 'Score', path: '/signals/signal-score' },
  { label: 'Pre-Pump', path: '/signals/pre-pump-scanner' },
];

export default function PrePumpScannerPage() {
  const [minProbability, setMinProbability] = useState(50);

  // Simulate pre-pump detection algorithm
  const prePumpSignals = tokens.map(t => {
    const volumeSpike = (t.volume24h / t.marketCap) * 100;
    const oiBuildup = t.oiChange24h;
    const fundingPressure = Math.abs(t.fundingRate);
    const cvdStrength = t.cvd24h > 0 ? (t.cvd24h / t.volume24h) * 100 : 0;
    const lsImbalance = t.longShortRatio > 1.5 ? (t.longShortRatio - 1) * 20 : 0;
    const rsiMomentum = t.rsi14 > 40 && t.rsi14 < 70 ? 30 : 10;

    const probability = Math.min(Math.round(
      (volumeSpike * 3) + (oiBuildup * 2) + (fundingPressure * 500) + cvdStrength + lsImbalance + rsiMomentum
    ), 99);

    const triggers = [];
    if (volumeSpike > 10) triggers.push('Volume Spike');
    if (oiBuildup > 5) triggers.push('OI Buildup');
    if (fundingPressure > 0.008) triggers.push('Funding Heat');
    if (cvdStrength > 2) triggers.push('CVD Positive');
    if (lsImbalance > 15) triggers.push('L/S Imbalance');

    return { ...t, probability, triggers, volumeSpike: Math.min(volumeSpike, 50) };
  }).filter(t => t.probability >= minProbability).sort((a, b) => b.probability - a.probability);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-magenta">Pre-Pump Scanner</h1>
          <p className="text-sm text-gray-400 mt-1">Early detection of potential pumps</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">MIN PROB</span>
          <input type="range" min="0" max="100" value={minProbability} onChange={(e) => setMinProbability(Number(e.target.value))} className="w-24 accent-magenta-400" />
          <span className="text-xs font-mono text-magenta-400">{minProbability}%</span>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4 border-magenta-500/20">
          <div className="flex items-center gap-2 mb-2"><Rocket className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">CANDIDATES</span></div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{prePumpSignals.length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">HIGH PROB</span></div>
          <p className="text-xl font-bold text-green-400 font-mono">{prePumpSignals.filter(s => s.probability > 75).length}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">AVG PROBABILITY</span></div>
          <p className="text-xl font-bold text-cyan-400 font-mono">
            {prePumpSignals.length > 0 ? (prePumpSignals.reduce((s, t) => s + t.probability, 0) / prePumpSignals.length).toFixed(0) : 0}%
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2"><Timer className="w-4 h-4 text-yellow-400" /><span className="text-xs text-gray-400 font-mono">LAST SCAN</span></div>
          <p className="text-xl font-bold text-white font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-magenta mb-4">Probability Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prePumpSignals.slice(0, 12)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={11} />
            <YAxis stroke="#555" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value}%`} />
            <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
              {prePumpSignals.slice(0, 12).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.probability > 75 ? '#ff00ff' : entry.probability > 50 ? '#ff6b35' : '#f0e800'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {prePumpSignals.map(s => (
          <div key={s.symbol} className={`card-neon p-4 ${s.probability > 75 ? 'border-magenta-500/30 bg-magenta-500/5' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {s.probability > 75 ? <Rocket className="w-4 h-4 text-magenta-400" /> : <Zap className="w-4 h-4 text-yellow-400" />}
                <span className="font-mono font-bold text-white">{s.symbol}</span>
                <span className="text-gray-400 text-xs">{formatPrice(s.price)}</span>
                <span className={`text-xs font-mono ${s.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.change24h >= 0 ? '+' : ''}{s.change24h.toFixed(2)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {s.triggers.map((trigger, i) => (
                    <span key={i} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-[10px] font-mono border border-cyan-500/20">{trigger}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width: `${s.probability}%`, background: s.probability > 75 ? 'linear-gradient(90deg, #ff00ff, #ff6b35)' : s.probability > 50 ? '#ff6b35' : '#f0e800'}} />
                  </div>
                  <span className={`font-mono font-bold text-sm ${s.probability > 75 ? 'text-magenta-400' : s.probability > 50 ? 'text-orange-400' : 'text-yellow-400'}`}>{s.probability}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}