import { useState } from 'react';
import { tokens, formatUSD, formatPrice } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, TrendingUp, Volume2 } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const sectionNavItems = [
  { label: 'CVD', path: '/flow/cvd' },
  { label: 'Taker Buy/Sell', path: '/flow/taker-buy-sell' },
  { label: 'Volume Spike', path: '/flow/volume-spike' },
];

export default function VolumeSpikePage() {
  const [minSpike, setMinSpike] = useState(50);

  const volumeData = tokens.map(t => {
    const avgVolume = t.volume24h / (1 + Math.random() * 0.5);
    const spikeRatio = ((t.volume24h - avgVolume) / avgVolume) * 100;
    return { ...t, spikeRatio };
  }).sort((a, b) => b.spikeRatio - a.spikeRatio);

  const filteredData = volumeData.filter(t => t.spikeRatio >= minSpike);
  const extremeSpikes = volumeData.filter(t => t.spikeRatio > 200);

  const chartData = volumeData.slice(0, 15).map(t => ({
    symbol: t.symbol,
    volume: t.volume24h,
    spike: t.spikeRatio,
  }));

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Volume Spike Detector</h1>
          <p className="text-sm text-gray-400 mt-1">Detect abnormal volume activity</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">MIN SPIKE %</span>
          <input
            type="range" min="0" max="500" value={minSpike}
            onChange={(e) => setMinSpike(Number(e.target.value))}
            className="w-24 accent-cyan-400"
          />
          <span className="text-xs font-mono text-cyan-400">{minSpike}%</span>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">TOTAL VOLUME 24H</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{formatUSD(tokens.reduce((s, t) => s + t.volume24h, 0), true)}</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">EXTREME SPIKES</span>
          </div>
          <p className="text-xl font-bold text-magenta-400 font-mono">{extremeSpikes.length}</p>
          <p className="text-xs text-gray-400 mt-1">{'>'} 200% above average</p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">BIGGEST SPIKE</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{volumeData[0].symbol}</p>
          <p className="text-xs text-magenta-400 mt-1">+{volumeData[0].spikeRatio.toFixed(0)}%</p>
        </div>
      </div>

      {extremeSpikes.length > 0 && (
        <div className="card-neon p-4 border-magenta-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-magenta-400" />
            <h3 className="text-sm font-bold text-magenta-400 font-mono">EXTREME VOLUME SPIKES</h3>
          </div>
          <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {extremeSpikes.map(t => (
              <div key={t.symbol} className="p-2 bg-magenta-500/10 rounded border border-magenta-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{t.symbol}</span>
                  <span className="font-mono text-magenta-400">+{t.spikeRatio.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-400">{formatPrice(t.price)}</span>
                  <span className={`text-xs ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Volume Spike Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="symbol" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} />
            <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => formatUSD(value, true)} />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.spike > 200 ? '#ff00ff' : entry.spike > 100 ? '#ff6b35' : '#00f0ff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Volume Spike Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">TOKEN</th>
                <th className="text-right p-2 text-gray-400 font-mono">PRICE</th>
                <th className="text-right p-2 text-gray-400 font-mono">24H</th>
                <th className="text-right p-2 text-gray-400 font-mono">VOLUME</th>
                <th className="text-right p-2 text-gray-400 font-mono">SPIKE %</th>
                <th className="text-right p-2 text-gray-400 font-mono">ALERT</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(t => (
                <tr key={t.symbol} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{t.symbol}</td>
                  <td className="p-2 text-right font-mono text-white">{formatPrice(t.price)}</td>
                  <td className={`p-2 text-right font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono text-gray-300">{formatUSD(t.volume24h, true)}</td>
                  <td className="p-2 text-right">
                    <span className={`font-mono font-bold ${t.spikeRatio > 200 ? 'text-magenta-400' : t.spikeRatio > 100 ? 'text-orange-400' : 'text-cyan-400'}`}>
                      +{t.spikeRatio.toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${t.spikeRatio > 300 ? 'bg-magenta-500/20 text-magenta-400' : t.spikeRatio > 150 ? 'bg-orange-500/20 text-orange-400' : t.spikeRatio > 50 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {t.spikeRatio > 300 ? 'EXTREME' : t.spikeRatio > 150 ? 'HIGH' : t.spikeRatio > 50 ? 'ELEVATED' : 'NORMAL'}
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