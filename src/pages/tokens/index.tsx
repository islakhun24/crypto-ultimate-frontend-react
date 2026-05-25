import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useSymbolsPaginated } from '@/shared/hooks/useTokens';
import { useCategories } from '@/shared/hooks/useTokens';
import { searchSymbols } from '@/shared/api/tokenApi';
import { useApiMode } from '@/shared/context/ApiModeContext';
import type { SymbolListItem } from '@/shared/types/api';
import { ShimmerLine, ApiModeToggle } from '@/components/shared';
import { SummaryWidget } from '@/components/dashboard';

function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 0.01) return price.toFixed(4);
  if (price >= 0.0001) return price.toFixed(6);
  return price.toExponential(4);
}

function formatUSD(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
  return `$${val.toFixed(2)}`;
}

// ─── Pagination Component ───
function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}) {
  const limits = [10, 20, 50, 100];
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = useMemo(() => {
    const arr: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (page > 3) arr.push('ellipsis');
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);
      for (let i = startPage; i <= endPage; i++) arr.push(i);
      if (page < totalPages - 2) arr.push('ellipsis');
      arr.push(totalPages);
    }
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-3 py-3 border-t border-cyan-500/5">
      <span className="text-[10px] text-gray-500 font-mono">
        {start}-{end} of {total}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="p-1 rounded border border-[#222] text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft className="w-3 h-3" />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded border border-[#222] text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="text-gray-600 px-1">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'min-w-[28px] h-6 text-[10px] font-mono rounded border transition-all',
                p === page
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-[#222] text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded border border-[#222] text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="p-1 rounded border border-[#222] text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight className="w-3 h-3" />
        </button>
      </div>

      <select
        value={limit}
        onChange={e => onLimitChange(Number(e.target.value))}
        className="bg-[#0a0a0a] border border-[#222] text-gray-400 text-[10px] font-mono rounded px-2 py-1 outline-none focus:border-cyan-500"
      >
        {limits.map(l => (
          <option key={l} value={l}>
            {l}/page
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Category Filter Component ───
function CategoryFilter({
  category,
  onChange,
}: {
  category: string;
  onChange: (cat: string) => void;
}) {
  const { data: categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-16 h-7 rounded-lg bg-[#111] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'px-3 py-1.5 text-xs font-mono rounded-lg border transition-all whitespace-nowrap flex items-center gap-1',
          category === 'all'
            ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
            : 'border-[#222] text-gray-400 hover:border-cyan-500/30'
        )}
      >
        <Layers className="w-3 h-3" /> ALL
      </button>
      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onChange(cat.name)}
          className={cn(
            'px-3 py-1.5 text-xs font-mono rounded-lg border transition-all whitespace-nowrap',
            category === cat.name
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
              : 'border-[#222] text-gray-400 hover:border-cyan-500/30'
          )}
        >
          {cat.name.toUpperCase()}
          <span className="ml-1 text-[9px] text-gray-600">({cat.symbol_count})</span>
        </button>
      ))}
    </div>
  );
}

export default function TokenListPage() {
  const { useDummy } = useApiMode();
  const {
    data,
    meta,
    loading,
    error,
    refresh,
    setPage,
    setLimit,
    setCategory,
    category,
    page,
    limit,
    setSort,
    sortBy,
    sortDir,
  } = useSymbolsPaginated(20);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SymbolListItem[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Client-side search (debounced could be added)
  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const results = await searchSymbols(val);
      setSearchResults(results);
    } catch {
      // Fallback: client-side filter
      const q = val.toLowerCase();
      setSearchResults(
        data.filter(
          item =>
            item.symbol.toLowerCase().includes(q) ||
            item.asset.base.toLowerCase().includes(q) ||
            item.coin.name.toLowerCase().includes(q)
        )
      );
    } finally {
      setSearching(false);
    }
  };

  // Use search results if query exists, otherwise use paginated data
  const displayData = query.trim() ? (searchResults ?? []) : data;
  const isSearchMode = query.trim().length > 0;

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSort(key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key, 'desc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold neon-text-cyan">Token List</h1>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <ShimmerLine key={i} className="w-full h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan flex items-center gap-2">
            Token List
            <span className="text-sm text-gray-400 font-mono">
              ({meta?.total ?? displayData.length} tokens)
            </span>
          </h1>
          {useDummy && (
            <span className="text-[10px] text-yellow-400 font-mono flex items-center gap-1 mt-1">
              <WifiOff className="w-3 h-3" /> Using dummy data
            </span>
          )}
          {!useDummy && (
            <span className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-1">
              <Wifi className="w-3 h-3" /> Live API data
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ApiModeToggle />
          <button onClick={refresh} className="glow-btn flex items-center gap-1.5 text-xs">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Widget */}
      <SummaryWidget />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search symbol, name..."
            className="w-full bg-[#0a0a0a] border border-[#222] text-white text-sm rounded-lg pl-9 pr-3 py-2 font-mono focus:border-cyan-500 outline-none transition-colors"
          />
          {searching && (
            <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-400 animate-spin" />
          )}
        </div>
        {/* Category filter */}
        <CategoryFilter category={category} onChange={setCategory} />
      </div>

      {/* Search results info */}
      {isSearchMode && (
        <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
          <span>
            Search results for &quot;{query}&quot; — {displayData.length} found
          </span>
          <button onClick={() => { setQuery(''); setSearchResults(null); }} className="text-cyan-400 hover:underline">
            Clear
          </button>
        </div>
      )}

      {/* Token Table */}
      <div className="card-neon overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th
                  className="text-left p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('rank')}
                >
                  <span className="flex items-center gap-1">
                    # {sortBy === 'rank' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th className="text-left p-3 text-gray-400 font-mono">TOKEN</th>
                <th
                  className="text-right p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center justify-end gap-1">
                    PRICE {sortBy === 'price' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th
                  className="text-right p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('change_24h')}
                >
                  <span className="flex items-center justify-end gap-1">
                    24H {sortBy === 'change_24h' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th
                  className="text-right p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400 hidden sm:table-cell"
                  onClick={() => handleSort('change_7d')}
                >
                  <span className="flex items-center justify-end gap-1">
                    7D {sortBy === 'change_7d' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th
                  className="text-right p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400 hidden md:table-cell"
                  onClick={() => handleSort('volume')}
                >
                  <span className="flex items-center justify-end gap-1">
                    VOLUME {sortBy === 'volume' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th
                  className="text-right p-3 text-gray-400 font-mono cursor-pointer hover:text-cyan-400 hidden lg:table-cell"
                  onClick={() => handleSort('market_cap')}
                >
                  <span className="flex items-center justify-end gap-1">
                    MARKET CAP {sortBy === 'market_cap' && <ArrowUpDown className="w-3 h-3" />}
                  </span>
                </th>
                <th className="text-center p-3 text-gray-400 font-mono hidden xl:table-cell">EXCHANGES</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item: SymbolListItem) => {
                const md = item.market_data;
                const price = md.price;
                const change24h = md.percent_change['24h'];
                const change7d = md.percent_change['7d'];
                const volume = md.volume_24h;
                const mcap = md.market_cap;

                return (
                  <tr
                    key={item.symbol}
                    className="border-b border-cyan-500/5 table-row-animate cursor-pointer hover:bg-cyan-500/5 transition-colors"
                  >
                    <td className="p-3 font-mono text-gray-500">{item.coin.cmc_rank || '-'}</td>
                    <td className="p-3">
                      <Link to={`/token/${item.asset.base}`} className="flex items-center gap-2 group">
                        {item.coin.icon && (
                          <img
                            src={item.coin.icon}
                            alt={item.symbol}
                            className="w-6 h-6 rounded-full"
                            loading="lazy"
                          />
                        )}
                        {!item.coin.icon && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-[8px] font-bold text-cyan-400">
                            {item.asset.base?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                            {item.asset.base}
                          </div>
                          <div className="text-[10px] text-gray-500">{item.coin.name}</div>
                        </div>
                        {item.categories?.map(cat => (
                          <span
                            key={cat}
                            className="hidden lg:inline text-[9px] text-gray-600 font-mono ml-1"
                          >
                            {cat}
                          </span>
                        ))}
                      </Link>
                    </td>
                    <td className="p-3 text-right font-mono text-white">{formatPrice(price)}</td>
                    <td className="p-3 text-right">
                      <span
                        className={cn(
                          'font-mono flex items-center justify-end gap-1',
                          change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        )}
                      >
                        {change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {change24h >= 0 ? '+' : ''}
                        {change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td
                      className={cn(
                        'p-3 text-right font-mono hidden sm:table-cell',
                        change7d >= 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {change7d >= 0 ? '+' : ''}
                      {change7d.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right font-mono text-gray-300 hidden md:table-cell">
                      {formatUSD(volume)}
                    </td>
                    <td className="p-3 text-right font-mono text-gray-300 hidden lg:table-cell">
                      {formatUSD(mcap)}
                    </td>
                    <td className="p-3 hidden xl:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {item.exchanges.markets?.slice(0, 4).map(m => (
                          <span
                            key={`${m.exchange}-${m.source_symbol}`}
                            className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#0a0a0a] text-gray-400"
                            title={`${m.exchange} (${m.status})`}
                          >
                            {m.exchange.slice(0, 3).toUpperCase()}
                          </span>
                        ))}
                        {(item.exchanges.markets?.length ?? 0) > 4 && (
                          <span className="text-[9px] text-gray-500">
                            +{(item.exchanges.markets?.length ?? 0) - 4}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (show in non-search mode when we have data) */}
        {!isSearchMode && meta && meta.total > 0 && (
          <Pagination
            page={page}
            totalPages={meta.total_pages}
            total={meta.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>

      {error && (
        <div className="card-neon p-4 border-red-500/30">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}

