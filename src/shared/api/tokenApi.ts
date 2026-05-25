/**
 * ═══════════════════════════════════════════════════════════
 * TOKEN API CLIENT - Consolidated Dual Mode
 * Crypto Exchange Normalizer API (OpenAPI 3.0.2)
 * Base Path: /api/v1/exchange
 * ═══════════════════════════════════════════════════════════
 *
 * SINGLE ENTRY POINT: apiCall<T>(endpoint, params?)
 * Auto-switches between Dummy and Real API via ApiModeContext.
 *
 * Endpoints:
 *   GET /healthz
 *   GET /markets
 *   GET /symbols?page&limit&category&market_cap_tier&sort_by&sort_dir
 *   GET /symbols/categories
 *   GET /symbols/search?query
 *   GET /symbols/top
 *   GET /symbols/{symbol}
 *   GET /symbols/{symbol}/markets
 *   GET /symbols/{symbol}/quotes
 *   GET /summary
 *   GET /exchange-info/{exchange}/{type}/{quote}
 */

import type {
  SymbolData,
  HealthResponse,
  SymbolDetail,
  SymbolDetailResponse,
  SymbolListResponse,
  SymbolListItem,
  CategoryListResponse,
  CategoryItem,
  MarketSnapshotResponse,
  TopSymbolsResponse,
  SearchSymbolsResponse,
  SummaryResponse,
  SymbolQuotesResponse,
  SymbolMarketsResponse,
  ExchangeInfoResponse,
} from '@/shared/types/api';
import { symbolListItemToLegacy } from '@/shared/types/api';
import {
  DUMMY_TOKENS,
  toSymbolListItem,
  toSymbolDetail,
  dummyCategoryItems,
} from '@/shared/data/dummyTokens';
import { isDummyMode } from '@/shared/context/ApiModeContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BASE_PATH = '/api/v1/exchange';

// ═══════════════════════════════════════════════════════════
// SINGLE ENTRY POINT
// ═══════════════════════════════════════════════════════════

/** Check if currently in dummy mode */
function dummy(): boolean {
  return isDummyMode();
}

/** Build query string from params */
function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      q.set(key, String(val));
    }
  }
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

/** Fetch from real API */
async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${BASE_PATH}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// ═══════════════════════════════════════════════════════════
// CONSOLIDATED API CALLER
// ═══════════════════════════════════════════════════════════

interface ApiParams {
  [key: string]: string | number | undefined;
}

/**
 * SINGLE API CALL - All endpoints go through here
 * @param endpoint - API path (e.g. '/symbols', '/summary')
 * @param params - Query parameters
 * @returns Raw API response
 */
async function apiCall<T>(endpoint: string, params?: ApiParams): Promise<T> {
  const qs = params ? buildQuery(params) : '';
  return fetchApi<T>(`${endpoint}${qs}`);
}

// ═══════════════════════════════════════════════════════════
// DUMMY DATA HANDLER - Single function for all dummy responses
// ═══════════════════════════════════════════════════════════

interface DummyHandler<T> {
  (endpoint: string, params?: ApiParams, symbol?: string): T | Promise<T>;
}

/** Central dummy data dispatcher - handles all endpoints (sync) */
function dummyCall<T>(endpoint: string, params?: ApiParams): T {
  // /healthz
  if (endpoint === '/healthz') return { status: 'ok' } as T;

  // /markets
  if (endpoint === '/markets') {
    return {
      data: DUMMY_TOKENS.map(t => toSymbolListItem(t)),
      last_normalized_at: DUMMY_TOKENS[0]?.quotes?.[0]?.lastUpdated ?? new Date().toISOString(),
    } as T;
  }

  // /symbols (paginated list)
  if (endpoint === '/symbols') {
    const page = Number(params?.page ?? 1);
    const limit = Number(params?.limit ?? 20);
    const category = params?.category as string | undefined;
    const sort_by = params?.sort_by as string | undefined;
    const sort_dir = params?.sort_dir as string | undefined;

    let items = DUMMY_TOKENS.map(t => toSymbolListItem(t));

    if (category && category !== 'all') {
      items = items.filter(i => i.categories.includes(category));
    }

    if (sort_by) {
      const dir = sort_dir === 'asc' ? 1 : -1;
      items.sort((a, b) => {
        switch (sort_by) {
          case 'price': return (a.market_data.price - b.market_data.price) * dir;
          case 'volume': return (a.market_data.volume_24h - b.market_data.volume_24h) * dir;
          case 'market_cap': return (a.market_data.market_cap - b.market_data.market_cap) * dir;
          case 'rank': return (a.coin.cmc_rank - b.coin.cmc_rank) * dir;
          case 'change_24h': return (a.market_data.percent_change['24h'] - b.market_data.percent_change['24h']) * dir;
          default: return (a.market_data.market_cap - b.market_data.market_cap) * dir;
        }
      });
    }

    const total = items.length;
    const total_pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return {
      data: paginated,
      meta: { page, limit, total, total_pages, category, sort_by, sort_dir },
    } as T;
  }

  // /symbols/categories
  if (endpoint === '/symbols/categories') {
    return {
      data: dummyCategoryItems,
      meta: { total: dummyCategoryItems.length },
    } as T;
  }

  // /symbols/search
  if (endpoint === '/symbols/search') {
    const query = String(params?.query ?? '').toLowerCase();
    const results = query
      ? DUMMY_TOKENS.filter(
          t =>
            t.symbol.toLowerCase().includes(query) ||
            t.base_asset.toLowerCase().includes(query) ||
            t.coin_name?.toLowerCase().includes(query)
        )
      : DUMMY_TOKENS;
    return { data: results.map(t => toSymbolListItem(t)) } as T;
  }

  // /symbols/top
  if (endpoint === '/symbols/top') {
    const sorted = [...DUMMY_TOKENS]
      .sort((a, b) => (b.quotes?.[0]?.marketCap ?? 0) - (a.quotes?.[0]?.marketCap ?? 0))
      .slice(0, 10);
    return { data: sorted.map(t => toSymbolListItem(t)) } as T;
  }

  // /summary
  if (endpoint === '/summary') {
    const total_symbols = DUMMY_TOKENS.length;
    const total_markets = DUMMY_TOKENS.reduce((s, t) => s + (t.markets?.length ?? 0), 0);
    const catMap = new Map<string, number>();
    DUMMY_TOKENS.forEach(t => t.categories?.forEach(c => catMap.set(c, (catMap.get(c) ?? 0) + 1)));
    return {
      total_symbols,
      active_symbols: total_symbols,
      total_markets,
      average_market_count: Number((total_markets / total_symbols).toFixed(2)),
      top_categories: [...catMap.entries()].map(([name, symbol_count]) => ({ name, symbol_count })).sort((a, b) => b.symbol_count - a.symbol_count),
      last_normalized_at: DUMMY_TOKENS[0]?.quotes?.[0]?.lastUpdated ?? new Date().toISOString(),
    } as T;
  }

  // Dynamic: /symbols/{symbol}
  const symbolMatch = endpoint.match(/^\/symbols\/([^/]+)$/);
  if (symbolMatch) {
    const sym = symbolMatch[1];
    const found = DUMMY_TOKENS.find(
      t => t.symbol === sym || t.base_asset === sym || t.symbol === `${sym}USDT`
    );
    return (found ? { data: toSymbolDetail(found) } : { data: null }) as T;
  }

  // Dynamic: /symbols/{symbol}/markets
  const marketsMatch = endpoint.match(/^\/symbols\/([^/]+)\/markets$/);
  if (marketsMatch) {
    const sym = marketsMatch[1];
    const found = DUMMY_TOKENS.find(
      t => t.symbol === sym || t.base_asset === sym || t.symbol === `${sym}USDT`
    );
    return {
      data: found?.markets ?? [],
      meta: { total: found?.markets?.length ?? 0 },
    } as T;
  }

  // Dynamic: /symbols/{symbol}/quotes
  const quotesMatch = endpoint.match(/^\/symbols\/([^/]+)\/quotes$/);
  if (quotesMatch) {
    const sym = quotesMatch[1];
    const found = DUMMY_TOKENS.find(
      t => t.symbol === sym || t.base_asset === sym || t.symbol === `${sym}USDT`
    );
    const q = found?.quotes?.[0];
    return {
      data: q
        ? [{
            name: q.name,
            price: q.price,
            market_cap: q.marketCap,
            market_cap_by_total_supply: q.marketCapByTotalSupply,
            fully_diluted_market_cap: q.fullyDilluttedMarketCap,
            dominance: q.dominance,
            volume_24h: q.volume24h,
            volume_percent_change: q.volumePercentChange,
            turnover: q.turnover,
            percent_change: {
              '1h': q.percentChange1h,
              '24h': q.percentChange24h,
              '7d': q.percentChange7d,
              '30d': q.percentChange30d,
              '60d': q.percentChange60d,
              '90d': q.percentChange90d,
              '1y': q.percentChange1y,
              ytd: q.ytdPriceChangePercentage,
            },
            last_updated: q.lastUpdated,
          }]
        : [],
    } as T;
  }

  // Fallback: return empty
  return { data: [] } as T;
}

// ═══════════════════════════════════════════════════════════
// PUBLIC API FUNCTIONS - All go through apiCall / dummyCall
// ═══════════════════════════════════════════════════════════

/** GET /healthz */
export async function checkHealth(): Promise<boolean> {
  if (dummy()) return true;
  try {
    const data = await apiCall<HealthResponse>('/healthz');
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/** GET /markets */
export async function getMarkets(): Promise<SymbolListItem[]> {
  if (dummy()) {
    const data = dummyCall<MarketSnapshotResponse>('/markets');
    return data.data;
  }
  const data = await apiCall<MarketSnapshotResponse>('/markets');
  return data.data;
}

/** GET /symbols?page&limit&category&market_cap_tier&sort_by&sort_dir */
export async function getSymbolsPaginated(params: {
  page?: number;
  limit?: number;
  category?: string;
  market_cap_tier?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}): Promise<SymbolListResponse> {
  if (dummy()) {
    return dummyCall<SymbolListResponse>('/symbols', params);
  }
  return apiCall<SymbolListResponse>('/symbols', params);
}

/** GET /symbols/categories */
export async function getCategories(): Promise<CategoryItem[]> {
  if (dummy()) {
    const data = dummyCall<CategoryListResponse>('/symbols/categories');
    return data.data;
  }
  const data = await apiCall<CategoryListResponse>('/symbols/categories');
  return data.data;
}

/** GET /symbols/{symbol} */
export async function getSymbolDetail(symbol: string): Promise<SymbolDetail | null> {
  if (dummy()) {
    const data = dummyCall<SymbolDetailResponse>(`/symbols/${symbol}`);
    return data.data;
  }
  try {
    const data = await apiCall<SymbolDetailResponse>(`/symbols/${symbol}`);
    return data.data;
  } catch {
    return null;
  }
}

/** GET /symbols/{symbol}/markets */
export async function getSymbolMarkets(symbol: string): Promise<SymbolMarketsResponse | null> {
  if (dummy()) {
    return dummyCall<SymbolMarketsResponse>(`/symbols/${symbol}/markets`);
  }
  try {
    return await apiCall<SymbolMarketsResponse>(`/symbols/${symbol}/markets`);
  } catch {
    return null;
  }
}

/** GET /symbols/{symbol}/quotes */
export async function getSymbolQuotes(symbol: string): Promise<SymbolQuotesResponse | null> {
  if (dummy()) {
    return dummyCall<SymbolQuotesResponse>(`/symbols/${symbol}/quotes`);
  }
  try {
    return await apiCall<SymbolQuotesResponse>(`/symbols/${symbol}/quotes`);
  } catch {
    return null;
  }
}

/** GET /symbols/search?query */
export async function searchSymbols(query: string): Promise<SymbolListItem[]> {
  if (dummy()) {
    const data = dummyCall<SearchSymbolsResponse>('/symbols/search', { query });
    return data.data;
  }
  try {
    const data = await apiCall<SearchSymbolsResponse>('/symbols/search', { query });
    return data.data;
  } catch {
    return [];
  }
}

/** GET /symbols/top */
export async function getTopSymbols(): Promise<SymbolListItem[]> {
  if (dummy()) {
    const data = dummyCall<TopSymbolsResponse>('/symbols/top');
    return data.data;
  }
  try {
    const data = await apiCall<TopSymbolsResponse>('/symbols/top');
    return data.data;
  } catch {
    return [];
  }
}

/** GET /summary */
export async function getSummary(): Promise<SummaryResponse | null> {
  if (dummy()) {
    return dummyCall<SummaryResponse>('/summary');
  }
  try {
    return await apiCall<SummaryResponse>('/summary');
  } catch {
    return null;
  }
}

/** GET /exchange-info/{exchange}/{type}/{quote} */
export async function getExchangeInfo(
  exchange: string,
  type: string,
  quote: string
): Promise<ExchangeInfoResponse | null> {
  if (dummy()) {
    const tokens = DUMMY_TOKENS.filter(t => t.markets?.some(m => m.exchange === exchange));
    if (!tokens.length) return null;
    return {
      exchange,
      market_type: type,
      quote_asset: quote,
      symbols: tokens.map(t => t.symbol),
      count: tokens.length,
    };
  }
  try {
    return await apiCall<ExchangeInfoResponse>(`/exchange-info/${exchange}/${type}/${quote}`);
  } catch {
    return null;
  }
}

// ─── Legacy helpers ───

export async function getSymbols(): Promise<string[]> {
  const resp = await getSymbolsPaginated({ page: 1, limit: 1000 });
  return resp.data.map(d => d.symbol);
}

export async function getSymbol(symbol: string): Promise<SymbolData | null> {
  const detail = await getSymbolDetail(symbol);
  if (!detail) return null;
  return symbolListItemToLegacy({
    ...detail,
    market_data: detail.market_data,
    coin: detail.coin,
    asset: detail.asset,
    exchanges: detail.exchanges,
    source: detail.source,
    timestamps: detail.timestamps,
  } as SymbolListItem);
}

// ═══════════════════════════════════════════════════════════
// BACKWARD COMPAT
// ═══════════════════════════════════════════════════════════

export { DUMMY_TOKENS };
export const USE_DUMMY_DATA = true; // Kept for compatibility
