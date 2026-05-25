/**
 * ═══════════════════════════════════════════════════════════
 * TOKEN HOOKS - Crypto Exchange Normalizer API
 * Supports pagination, search, summary, and symbol detail
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SymbolListItem, CategoryItem, SummaryResponse, SymbolDetail, SymbolData } from '@/shared/types/api';
import {
  getSymbolsPaginated,
  getCategories,
  getSymbolDetail,
  searchSymbols,
  getTopSymbols,
  getSummary,
} from '@/shared/api/tokenApi';
import { useApiMode } from '@/shared/context/ApiModeContext';
import { DUMMY_TOKENS, toSymbolListItem, toSymbolDetail, DUMMY_CATEGORIES, dummyCategoryItems } from '@/shared/data/dummyTokens';

// ═══════════════════════════════════════════════════════════
// USE SYMBOLS PAGINATED (server-side pagination)
// ═══════════════════════════════════════════════════════════

export interface UseSymbolsPaginatedReturn {
  data: SymbolListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCategory: (category: string) => void;
  setSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  category: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export function useSymbolsPaginated(initialLimit = 20): UseSymbolsPaginatedReturn {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SymbolListItem[]>([]);
  const [meta, setMeta] = useState<UseSymbolsPaginatedReturn['meta']>(null);
  const [loading, setLoading] = useState(!useDummy);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(initialLimit);
  const [category, setCategoryState] = useState('all');
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Parameters<typeof getSymbolsPaginated>[0] = {
        page,
        limit,
        sort_by: sortBy,
        sort_dir: sortDir,
      };
      if (category && category !== 'all') {
        params.category = category;
      }

      const response = await getSymbolsPaginated(params);
      setData(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch symbols');
      const fallback = DUMMY_TOKENS.map(t => toSymbolListItem(t));
      setData(fallback);
      setMeta({
        page: 1,
        limit: fallback.length,
        total: fallback.length,
        total_pages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, sortBy, sortDir, useDummy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPage(1);
  }, []);

  const setCategory = useCallback((newCategory: string) => {
    setCategoryState(newCategory);
    setPage(1);
  }, []);

  const setSort = useCallback((newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(1);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    refresh: fetchData,
    setPage,
    setLimit,
    setCategory,
    setSort,
    category,
    page,
    limit,
    sortBy,
    sortDir,
  };
}

// ═══════════════════════════════════════════════════════════
// USE CATEGORIES
// ═══════════════════════════════════════════════════════════

export function useCategories() {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(!useDummy);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setData(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setData(dummyCategoryItems);
    } finally {
      setLoading(false);
    }
  }, [useDummy]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refresh: fetchCategories };
}

// ═══════════════════════════════════════════════════════════
// USE SYMBOL DETAIL
// ═══════════════════════════════════════════════════════════

export function useSymbolDetail(symbol: string | undefined) {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SymbolDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!symbol) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const detail = await getSymbolDetail(symbol);
      setData(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch symbol detail');
      const fallback = DUMMY_TOKENS.find(
        t => t.symbol === symbol || t.base_asset === symbol || t.symbol === `${symbol}USDT`
      );
      if (fallback) {
        setData(toSymbolDetail(fallback));
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, useDummy]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refresh: fetchDetail };
}

// ═══════════════════════════════════════════════════════════
// USE SEARCH
// ═══════════════════════════════════════════════════════════

export function useSearchSymbols() {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SymbolListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      const results = await searchSymbols(query);
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      const q = query.toLowerCase();
      const fallback = DUMMY_TOKENS.filter(
        t =>
          t.symbol.toLowerCase().includes(q) ||
          t.base_asset.toLowerCase().includes(q) ||
          t.coin_name?.toLowerCase().includes(q)
      ).map(t => toSymbolListItem(t));
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [useDummy]);

  return { data, loading, error, search };
}

// ═══════════════════════════════════════════════════════════
// USE TOP SYMBOLS
// ═══════════════════════════════════════════════════════════

export function useTopSymbols() {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SymbolListItem[]>([]);
  const [loading, setLoading] = useState(!useDummy);
  const [error, setError] = useState<string | null>(null);

  const fetchTop = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getTopSymbols();
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top symbols');
      const fallback = [...DUMMY_TOKENS]
        .sort((a, b) => (b.quotes?.[0]?.marketCap ?? 0) - (a.quotes?.[0]?.marketCap ?? 0))
        .slice(0, 10)
        .map(t => toSymbolListItem(t));
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [useDummy]);

  useEffect(() => {
    fetchTop();
  }, [fetchTop]);

  return { data, loading, error, refresh: fetchTop };
}

// ═══════════════════════════════════════════════════════════
// USE SUMMARY
// ═══════════════════════════════════════════════════════════

export function useSummary() {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(!useDummy);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSummary();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
      const total_symbols = DUMMY_TOKENS.length;
      const total_markets = DUMMY_TOKENS.reduce((s, t) => s + (t.markets?.length ?? 0), 0);
      const catMap = new Map<string, number>();
      DUMMY_TOKENS.forEach(t => t.categories?.forEach(c => catMap.set(c, (catMap.get(c) ?? 0) + 1)));
      setData({
        total_symbols,
        active_symbols: total_symbols,
        total_markets,
        average_market_count: Number((total_markets / total_symbols).toFixed(2)),
        top_categories: [...catMap.entries()].map(([name, symbol_count]) => ({ name, symbol_count })).sort((a, b) => b.symbol_count - a.symbol_count),
        last_normalized_at: DUMMY_TOKENS[0]?.quotes?.[0]?.lastUpdated ?? new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [useDummy]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { data, loading, error, refresh: fetchSummary };
}

// ═══════════════════════════════════════════════════════════
// LEGACY HOOKS (backward compatible)
// ═══════════════════════════════════════════════════════════

export function useTokens() {
  const { useDummy } = useApiMode();
  const [data, setData] = useState<SymbolData[]>(useDummy ? DUMMY_TOKENS : []);
  const [loading, setLoading] = useState(!useDummy);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getSymbolsPaginated({ page: 1, limit: 1000 });
      const { symbolListItemToLegacy } = await import('@/shared/types/api');
      setData(resp.data.map(item => symbolListItemToLegacy(item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      if (!useDummy) setData(DUMMY_TOKENS);
    } finally {
      setLoading(false);
    }
  }, [useDummy]);

  useEffect(() => {
    if (!useDummy) fetchTokens();
  }, [fetchTokens, useDummy]);

  return {
    data,
    loading,
    error,
    usingFallback: useDummy,
    refresh: fetchTokens,
  };
}

export function useCategoryStrings(data: SymbolData[]): string[] {
  const { useDummy } = useApiMode();
  return useMemo(() => {
    if (useDummy) return DUMMY_CATEGORIES;
    const cats = new Set<string>();
    data.forEach(item => item.categories?.forEach(c => cats.add(c)));
    return [...cats].sort();
  }, [data, useDummy]);
}

export function filterByCategory(data: SymbolData[], category: string): SymbolData[] {
  if (category === 'all') return data;
  return data.filter(item => item.categories?.includes(category));
}

export function searchTokens(data: SymbolData[], query: string): SymbolData[] {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter(
    item =>
      item.symbol.toLowerCase().includes(q) ||
      item.base_asset.toLowerCase().includes(q) ||
      item.coin_name?.toLowerCase().includes(q) ||
      item.coin_slug?.toLowerCase().includes(q) ||
      item.categories?.some(c => c.toLowerCase().includes(q))
  );
}

export function sortTokens(
  data: SymbolData[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): SymbolData[] {
  return [...data].sort((a, b) => {
    const aQ = a.quotes?.[0];
    const bQ = b.quotes?.[0];

    let aVal = 0;
    let bVal = 0;

    switch (sortBy) {
      case 'price':
        aVal = aQ?.price ?? 0;
        bVal = bQ?.price ?? 0;
        break;
      case 'change24h':
        aVal = aQ?.percentChange24h ?? 0;
        bVal = bQ?.percentChange24h ?? 0;
        break;
      case 'change7d':
        aVal = aQ?.percentChange7d ?? 0;
        bVal = bQ?.percentChange7d ?? 0;
        break;
      case 'volume':
        aVal = aQ?.volume24h ?? 0;
        bVal = bQ?.volume24h ?? 0;
        break;
      case 'marketCap':
        aVal = aQ?.marketCap ?? 0;
        bVal = bQ?.marketCap ?? 0;
        break;
      case 'rank':
        aVal = a.cmc_rank ?? 999999;
        bVal = b.cmc_rank ?? 999999;
        break;
      default:
        aVal = aQ?.marketCap ?? 0;
        bVal = bQ?.marketCap ?? 0;
    }

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

export function useToken(symbol: string | undefined) {
  const { data } = useTokens();

  return useMemo(() => {
    if (!symbol) return null;
    return (
      data.find(
        t => t.symbol === symbol || t.base_asset === symbol || t.symbol === `${symbol}USDT`
      ) ?? null
    );
  }, [data, symbol]);
}
