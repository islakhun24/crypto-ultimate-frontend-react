import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3,
  Globe, Clock, Layers, Zap, Percent, Coins, Hash, RefreshCw
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useSymbolDetail } from '@/shared/hooks/useTokens';
import { getSymbolQuotes } from '@/shared/api/tokenApi';
import type { SymbolDetail, SymbolQuote } from '@/shared/types/api';
import { ShimmerLine } from '@/components/shared';

function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 0.01) return price.toFixed(4);
  if (price >= 0.0001) return price.toFixed(6);
  return price.toExponential(4);
}

function formatUSD(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
  return `$${val.toFixed(2)}`;
}

function formatSupply(val: number): string {
  if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
  return val.toLocaleString();
}

function getChangeColor(val: number | undefined): string {
  if (val === undefined) return 'text-gray-400';
  return val >= 0 ? 'text-green-400' : 'text-red-400';
}

function getChangePrefix(val: number | undefined): string {
  if (val === undefined) return '';
  return val >= 0 ? '+' : '';
}

// ─── Simulated price history based on percent changes ───
function generatePriceHistory(detail: SymbolDetail | null) {
  if (!detail) return [];
  const basePrice = detail.market_data.price;
  const pct24h = detail.market_data.percent_change['24h'] / 100;
  const volatility = Math.abs(pct24h) * basePrice * 0.5;
  const points = 24;

  return Array.from({ length: points }, (_, i) => {
    const progress = i / (points - 1);
    const randomWalk = (Math.sin(i * 1.5) + Math.cos(i * 0.7)) * volatility * 0.3;
    const trend = pct24h * basePrice * progress;
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      price: basePrice + trend + randomWalk,
      volume: (detail.market_data.volume_24h / points) * (0.3 + Math.random() * 1.4),
    };
  });
}

// ─── Performance radar data ───
function getPerformanceData(detail: SymbolDetail | null) {
  if (!detail) return [];
  const pc = detail.market_data.percent_change;
  return [
    { metric: '1H', value: Math.min(Math.max(pc['1h'] + 50, 0), 100), fullMark: 100 },
    { metric: '24H', value: Math.min(Math.max(pc['24h'] + 50, 0), 100), fullMark: 100 },
    { metric: '7D', value: Math.min(Math.max(pc['7d'] + 50, 0), 100), fullMark: 100 },
    { metric: '30D', value: Math.min(Math.max(pc['30d'] + 50, 0), 100), fullMark: 100 },
    { metric: '90D', value: Math.min(Math.max(pc['90d'] + 50, 0), 100), fullMark: 100 },
    { metric: '1Y', value: Math.min(Math.max(pc['1y'] + 50, 0), 100), fullMark: 100 },
  ];
}

// ─── Market Tier Badge ───
function MarketCapTierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    large: 'bg-green-500/20 text-green-400 border-green-500/30',
    mid: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    small: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-mono border', colors[tier] ?? colors.small)}>
      {tier?.toUpperCase()}
    </span>
  );
}

// ─── Exchange Status Badge ───
function StatusBadge({ status }: { status: string }) {
  const isActive = ['TRADING', 'Trading', 'live', 'normal', 'active'].includes(status);
  return (
    <span className={cn(
      'px-2 py-0.5 rounded text-[10px] font-mono',
      isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    )}>
      {status}
    </span>
  );
}

export default function TokenDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data, loading, error, refresh } = useSymbolDetail(symbol);
  const [quotes, setQuotes] = useState<SymbolQuote[]>([]);

  // Fetch quotes when symbol changes
  useState(() => {
    if (symbol) {
      getSymbolQuotes(symbol).then(resp => {
        if (resp?.data) setQuotes(resp.data);
      });
    }
  });

  const priceHistory = useMemo(() => generatePriceHistory(data), [data]);
  const performanceData = useMemo(() => getPerformanceData(data), [data]);
  const isUp = (data?.market_data.percent_change['24h'] ?? 0) >= 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <ShimmerLine className="w-full h-16" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ShimmerLine key={i} className="w-full h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-mono">Token {symbol} not found</p>
        <Link to="/tokens" className="text-cyan-400 hover:underline text-sm mt-2 inline-block">
          Back to Token List
        </Link>
      </div>
    );
  }

  const md = data.market_data;
  const pc = md.percent_change;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Back + Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Link
            to="/tokens"
            className="p-2 rounded-lg border border-[#222] text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            {data.coin.icon ? (
              <img src={data.coin.icon} alt={data.symbol} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-cyan-400">
                {data.asset.base?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                {data.asset.base}
                <span className="text-sm text-gray-500 font-normal">{data.coin.name}</span>
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-bold flex items-center gap-1">
                  {isUp ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={isUp ? 'text-green-400' : 'text-red-400'}>
                    {getChangePrefix(pc['24h'])}
                    {pc['24h']?.toFixed(2)}%
                  </span>
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Rank #{data.coin.cmc_rank || 'N/A'}
                </span>
                <MarketCapTierBadge tier={md.market_cap_tier} />
                {data.categories?.map(cat => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={refresh} className="glow-btn flex items-center gap-1.5 text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Price Hero */}
      <div className="card-neon text-center py-6 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-5 ${isUp ? 'bg-green-500' : 'bg-red-500'}`} />
        <p className="text-4xl font-bold text-white font-mono">${formatPrice(md.price)}</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono flex-wrap">
          {(['1h', '24h', '7d', '30d', '60d', '90d', '1y', 'ytd'] as const).map(period => (
            <span key={period} className={getChangeColor(pc[period])}>
              {period}: {getChangePrefix(pc[period])}
              {pc[period]?.toFixed(2)}%
            </span>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">MARKET CAP</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">{formatUSD(md.market_cap)}</p>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            FDV: {formatUSD(md.fully_diluted_market_cap)}
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400 font-mono">VOLUME 24H</span>
          </div>
          <p className="text-lg font-bold text-magenta-400 font-mono">{formatUSD(md.volume_24h)}</p>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            Vol%: {md.volume_percent_change?.toFixed(2)}%
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-mono">DOMINANCE</span>
          </div>
          <p className="text-lg font-bold text-green-400 font-mono">{md.dominance?.toFixed(4)}%</p>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            Turnover: {md.turnover?.toFixed(4)}
          </p>
        </div>
        <div className="card-neon p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">EXCHANGES</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">{data.exchanges.count}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {data.exchanges.markets?.slice(0, 4).map(m => (
              <span
                key={m.exchange}
                className="text-[8px] px-1 py-0.5 rounded bg-[#0a0a0a] text-gray-400 font-mono"
              >
                {m.exchange.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="card-neon p-4 lg:col-span-2">
          <h3 className="text-sm font-bold neon-text-cyan mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Price Simulation (24h)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="priceGradDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isUp ? '#00ff88' : '#ff2d5f'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isUp ? '#00ff88' : '#ff2d5f'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="time" stroke="#555" fontSize={10} />
              <YAxis stroke="#555" fontSize={10} domain={['auto', 'auto']} tickFormatter={v => formatPrice(Number(v))} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }}
                formatter={(v: number) => formatPrice(v)}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUp ? '#00ff88' : '#ff2d5f'}
                fill="url(#priceGradDetail)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-magenta mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#222" />
              <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={10} />
              <PolarRadiusAxis stroke="#444" fontSize={8} domain={[0, 100]} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#b829dd"
                fill="#b829dd"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="card-neon p-4">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Volume Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={10} tickFormatter={v => formatUSD(Number(v))} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(v: number) => formatUSD(v)}
            />
            <Bar dataKey="volume" fill="#b829dd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Supply Information */}
      <div className="card-neon p-4">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 flex items-center gap-2">
          <Coins className="w-4 h-4" /> Supply Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 font-mono">CIRCULATING SUPPLY</p>
            <p className="text-sm font-bold text-white font-mono">
              {formatSupply(md.supply.circulating)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">TOTAL SUPPLY</p>
            <p className="text-sm font-bold text-white font-mono">{formatSupply(md.supply.total)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">MAX SUPPLY</p>
            <p className="text-sm font-bold text-white font-mono">
              {md.supply.max ? formatSupply(md.supply.max) : 'Unlimited'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">SELF REPORTED</p>
            <p className="text-sm font-bold text-white font-mono">
              {formatSupply(md.supply.self_reported_circulating)}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-neon p-4">
          <h3 className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Coin Info
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="text-white">{data.coin.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Slug</span>
              <span className="text-cyan-400">{data.coin.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CMC Symbol</span>
              <span className="text-white">{data.coin.cmc_symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Match Strategy</span>
              <span className="text-white">{data.coin.match_strategy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CMC Rank</span>
              <span className="text-green-400">#{data.coin.cmc_rank}</span>
            </div>
          </div>
        </div>

        <div className="card-neon p-4">
          <h3 className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1">
            <Hash className="w-3 h-3" /> Asset Info
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Symbol</span>
              <span className="text-white">{data.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Base Asset</span>
              <span className="text-white">{data.asset.base}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quote Asset</span>
              <span className="text-white">{data.asset.quote}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Market Type</span>
              <span className="text-white">{data.asset.market_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Categories</span>
              <span className="text-cyan-400">{data.categories?.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="card-neon p-4">
          <h3 className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Timestamps
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Last Normalized</span>
              <span className="text-white">
                {new Date(data.timestamps.last_normalized_at).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-white">
                {new Date(md.last_updated).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Source</span>
              <span className="text-cyan-400 capitalize">{data.source.exchange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-400">{data.source.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active</span>
              <span className={data.source.is_active ? 'text-green-400' : 'text-red-400'}>
                {data.source.is_active ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Markets */}
      <div className="card-neon p-4">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Available Markets ({data.exchanges.count})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-left p-2 text-gray-400 font-mono">TYPE</th>
                <th className="text-left p-2 text-gray-400 font-mono">SOURCE SYMBOL</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.exchanges.markets?.map(m => (
                <tr
                  key={`${m.exchange}-${m.source_symbol}`}
                  className="border-b border-[#1a1a1a] table-row-animate"
                >
                  <td className="p-2 font-mono font-bold text-white capitalize">{m.exchange}</td>
                  <td className="p-2 font-mono text-gray-400">{m.market_type}</td>
                  <td className="p-2 font-mono text-cyan-400">{m.source_symbol}</td>
                  <td className="p-2">
                    <StatusBadge status={m.status} />
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
