/**
 * Summary Widget - Displays /summary endpoint data
 * Shows: total symbols, active symbols, total markets, average market count, top categories
 */

import { useSummary } from '@/shared/hooks/useTokens';
import { Database, Activity, Globe, BarChart3, Layers, Clock } from 'lucide-react';
import { ShimmerLine } from '@/components/shared';

function formatNumber(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  return val.toLocaleString();
}

export default function SummaryWidget() {
  const { data, loading, error } = useSummary();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerLine key={i} className="w-full h-20" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card-neon p-4 border-red-500/20">
        <p className="text-red-400 text-xs font-mono">Failed to load summary: {error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'TOTAL SYMBOLS',
      value: formatNumber(data.total_symbols),
      icon: Database,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'ACTIVE SYMBOLS',
      value: formatNumber(data.active_symbols),
      icon: Activity,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'TOTAL MARKETS',
      value: formatNumber(data.total_markets),
      icon: Globe,
      color: 'text-magenta-400',
      bg: 'bg-fuchsia-500/10',
    },
    {
      label: 'AVG MARKETS/SYM',
      value: data.average_market_count.toFixed(1),
      icon: BarChart3,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card-neon p-4"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top Categories */}
      <div className="card-neon p-4">
        <h3 className="text-xs text-gray-400 font-mono mb-3 flex items-center gap-1">
          <Layers className="w-3 h-3" /> TOP CATEGORIES
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.top_categories?.map(cat => (
            <div
              key={cat.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#222]"
            >
              <span className="text-xs font-mono text-cyan-400">{cat.name}</span>
              <span className="text-[10px] font-mono text-gray-500">
                {cat.symbol_count} symbols
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
        <Clock className="w-3 h-3" />
        Last normalized: {new Date(data.last_normalized_at).toLocaleString()}
      </div>
    </div>
  );
}
