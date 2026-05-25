import { useState } from 'react';
import { tokens, exchanges, marketOverview, formatUSD } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, Activity } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#00f0ff', '#ff00ff', '#00ff88', '#ff6b35', '#f0e800'];

const sectionNavItems = [
  { label: 'Correlation', path: '/market-intelligence/correlation-matrix' },
  { label: 'AI Summary', path: '/market-intelligence/ai-market-summary' },
];

export default function AIMarketSummaryPage() {
  const [timeframe, setTimeframe] = useState('24h');

  const topGainers = [...tokens].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const topLosers = [...tokens].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  const sentiment = marketOverview.fearGreedIndex > 75 ? 'Extreme Greed' : marketOverview.fearGreedIndex > 55 ? 'Greed' : marketOverview.fearGreedIndex > 45 ? 'Neutral' : marketOverview.fearGreedIndex > 25 ? 'Fear' : 'Extreme Fear';
  const sentimentColor = marketOverview.fearGreedIndex > 75 ? '#ff6b35' : marketOverview.fearGreedIndex > 55 ? '#00ff88' : marketOverview.fearGreedIndex > 45 ? '#f0e800' : marketOverview.fearGreedIndex > 25 ? '#ff6b35' : '#ff2d95';

  const alerts = [
    { type: 'warning', message: `${topGainers[0].symbol} showing unusual OI buildup with declining volume` },
    { type: 'info', message: `Funding rates on ${exchanges[0].name} above average for ETH` },
    { type: 'alert', message: `${topLosers[0].symbol} RSI entering oversold territory` },
    { type: 'success', message: `Market CVD showing net buying pressure for 6 consecutive hours` },
  ];

  const marketPulse = [
    { metric: 'BTC Dominance', value: marketOverview.btcDominance, max: 100 },
    { metric: 'ETH Dominance', value: marketOverview.ethDominance, max: 100 },
    { metric: 'OI Growth', value: Math.min(marketOverview.oiChange24h * 10, 100), max: 100 },
    { metric: 'Volume Health', value: Math.min(marketOverview.volumeChange24h * 5, 100), max: 100 },
    { metric: 'Funding Stress', value: Math.min(marketOverview.avgFunding * 5000, 100), max: 100 },
  ];

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-magenta-400" />
          <div>
            <h1 className="text-2xl font-bold neon-text-magenta">AI Market Summary</h1>
            <p className="text-sm text-gray-400 mt-1">AI-generated market intelligence report</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['1h', '4h', '24h', '7d'].map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1.5 text-xs font-mono rounded border ${timeframe === tf ? 'border-magenta-500 text-magenta-400 bg-magenta-500/10' : 'border-[#222] text-gray-400'}`}>{tf}</button>
          ))}
        </div>
      </div>

      <div className="card-neon p-4 border-magenta-500/20">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-magenta-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-magenta-400 font-mono mb-2">MARKET NARRATIVE</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The market is currently exhibiting <span className="text-cyan-400 font-bold">{sentiment.toLowerCase()}</span> sentiment with a Fear & Greed index of {marketOverview.fearGreedIndex}.
              Total market capitalization stands at {formatUSD(marketOverview.totalMarketCap, true)}, 
              {' '}with 24h volume at {formatUSD(marketOverview.volume24h, true)}. 
              BTC dominance at {marketOverview.btcDominance}% suggests 
              {marketOverview.btcDominance > 50 ? ' Bitcoin-led market movement' : ' altcoin participation'}.
              Open interest increased by {marketOverview.oiChange24h}%, indicating 
              {marketOverview.oiChange24h > 0 ? ' growing speculative interest' : ' position unwinding'}.
              Funding rates averaging {(marketOverview.avgFunding * 100).toFixed(3)}% show
              {marketOverview.avgFunding > 0.005 ? ' overheated long positioning' : ' balanced derivatives market'}.
            </p>
          </div>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-green-400" /><h3 className="text-sm font-bold text-green-400 font-mono">TOP GAINERS</h3></div>
          <div className="space-y-2">
            {topGainers.map(t => (
              <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-green-500/5 rounded">
                <span className="font-mono font-bold text-white">{t.symbol}</span>
                <span className="text-gray-400">{formatUSD(t.price)}</span>
                <span className="font-mono text-green-400">+{t.change24h.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-3"><TrendingDown className="w-4 h-4 text-red-400" /><h3 className="text-sm font-bold text-red-400 font-mono">TOP LOSERS</h3></div>
          <div className="space-y-2">
            {topLosers.map(t => (
              <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-red-500/5 rounded">
                <span className="font-mono font-bold text-white">{t.symbol}</span>
                <span className="text-gray-400">{formatUSD(t.price)}</span>
                <span className="font-mono text-red-400">{t.change24h.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Market Pulse</h3>
        <div className="space-y-3">
          {marketPulse.map(m => (
            <div key={m.metric} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-mono w-28">{m.metric}</span>
              <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{width: `${Math.min((m.value / m.max) * 100, 100)}%`, background: `linear-gradient(90deg, #00f0ff, ${m.value > 70 ? '#ff00ff' : '#00ff88'})`}} />
              </div>
              <span className="text-xs font-mono text-white w-12 text-right">{m.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-neon p-4">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-yellow-400" /><h3 className="text-sm font-bold text-yellow-400 font-mono">AI ALERTS</h3></div>
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-start gap-2 p-2 rounded ${alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' : alert.type === 'alert' ? 'bg-red-500/10 border border-red-500/20' : alert.type === 'success' ? 'bg-green-500/10 border border-green-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
              {alert.type === 'warning' ? <Zap className="w-3 h-3 text-yellow-400 mt-0.5" /> : alert.type === 'alert' ? <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5" /> : alert.type === 'success' ? <TrendingUp className="w-3 h-3 text-green-400 mt-0.5" /> : <Activity className="w-3 h-3 text-cyan-400 mt-0.5" />}
              <span className="text-xs text-gray-300">{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}