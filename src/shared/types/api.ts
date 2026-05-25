// ═══════════════════════════════════════════════════════════
// TYPES - Crypto Exchange Normalizer API (OpenAPI 3.0.2)
// Base Path: /api/v1/exchange
// ═══════════════════════════════════════════════════════════

// ─── Percent Change (nested object) ───
export interface PercentChange {
  '1h': number;
  '24h': number;
  '7d': number;
  '30d': number;
  '60d': number;
  '90d': number;
  '1y': number;
  'ytd': number;
}

// ─── Supply Info (nested object) ───
export interface SupplyInfo {
  circulating: number;
  self_reported_circulating: number;
  total: number;
  max?: number;
}

// ─── Asset Info (nested in symbol detail) ───
export interface AssetInfo {
  base: string;
  quote: string;
  market_type: string;
}

// ─── Coin Info (nested in symbol detail) ───
export interface CoinInfo {
  name: string;
  slug: string;
  icon: string;
  cmc_symbol: string;
  cmc_rank: number;
  match_strategy: string;
}

// ─── Exchange Market Detail ───
export interface ExchangeMarket {
  exchange: string;
  market_type: string;
  source_symbol: string;
  status: string;
}

// ─── Exchanges Container ───
export interface ExchangesInfo {
  count: number;
  markets: ExchangeMarket[];
}

// ─── Source Info ───
export interface SourceInfo {
  exchange: string;
  status: string;
  is_active: boolean;
}

// ─── Timestamps ───
export interface Timestamps {
  last_normalized_at: string;
  created_at: string;
  updated_at: string;
}

// ─── Market Data (nested in symbol detail) ───
export interface MarketData {
  market_cap: number;
  market_cap_tier: string;
  price: number;
  volume_24h: number;
  volume_percent_change: number;
  turnover: number;
  fully_diluted_market_cap: number;
  dominance: number;
  percent_change: PercentChange;
  supply: SupplyInfo;
  last_updated: string;
}

// ─── Symbol Detail Response (GET /symbols/{symbol}) ───
export interface SymbolDetail {
  id: string;
  symbol: string;
  asset: AssetInfo;
  categories: string[];
  coin: CoinInfo;
  market_data: MarketData;
  exchanges: ExchangesInfo;
  source: SourceInfo;
  timestamps: Timestamps;
}

export interface SymbolDetailResponse {
  data: SymbolDetail;
}

// ─── Quote (for /symbols/{symbol}/quotes) ───
export interface SymbolQuote {
  name: string;
  price: number;
  market_cap: number;
  market_cap_by_total_supply: number;
  fully_diluted_market_cap: number;
  dominance: number;
  volume_24h: number;
  volume_percent_change: number;
  turnover: number;
  percent_change: PercentChange;
  last_updated: string;
}

export interface SymbolQuotesResponse {
  data: SymbolQuote[];
}

// ─── Pagination Meta ───
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  category?: string;
  market_cap_tier?: string;
  sort_by?: string;
  sort_dir?: string;
}

// ─── Category Item (new format: {name, symbol_count}) ───
export interface CategoryItem {
  name: string;
  symbol_count: number;
}

export interface CategoryListResponse {
  data: CategoryItem[];
  meta: {
    total: number;
  };
}

// ─── Symbol List Item (for paginated /symbols endpoint) ───
export interface SymbolListItem {
  id: string;
  symbol: string;
  asset: AssetInfo;
  categories: string[];
  coin: CoinInfo;
  market_data: MarketData;
  exchanges: ExchangesInfo;
  source: SourceInfo;
  timestamps: Timestamps;
}

export interface SymbolListResponse {
  data: SymbolListItem[];
  meta: PageMeta;
}

// ─── Market Snapshot Response (GET /markets) ───
export interface MarketSnapshotItem {
  id: string;
  symbol: string;
  asset: AssetInfo;
  categories: string[];
  coin: CoinInfo;
  market_data: MarketData;
  exchanges: ExchangesInfo;
  source: SourceInfo;
  timestamps: Timestamps;
}

export interface MarketSnapshotResponse {
  data: MarketSnapshotItem[];
  last_normalized_at: string;
}

// ─── Top Symbols Response (GET /symbols/top) ───
export interface TopSymbolsResponse {
  data: SymbolListItem[];
}

// ─── Search Response (GET /symbols/search) ───
export interface SearchSymbolsResponse {
  data: SymbolListItem[];
}

// ─── Summary Response (GET /summary) ───
export interface SummaryCategory {
  name: string;
  symbol_count: number;
}

export interface SummaryResponse {
  total_symbols: number;
  active_symbols: number;
  total_markets: number;
  average_market_count: number;
  top_categories: SummaryCategory[];
  last_normalized_at: string;
}

// ─── Symbol Markets Response (GET /symbols/{symbol}/markets) ───
export interface SymbolMarketsResponse {
  data: ExchangeMarket[];
  meta: {
    total: number;
  };
}

// ─── Health Response ───
export interface HealthResponse {
  status: string;
}

// ─── Exchange Info Response ───
export interface ExchangeInfoResponse {
  exchange: string;
  market_type: string;
  quote_asset: string;
  symbols: string[];
  count: number;
}

// ─── Legacy Types (backward compatible with existing components) ───
// Kept for smooth migration - will be phased out

export interface Quote {
  name: string;
  price: number;
  marketCap: number;
  marketCapByTotalSupply: number;
  fullyDilluttedMarketCap: number;
  dominance: number;
  volume24h: number;
  volumePercentChange: number;
  turnover: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  percentChange30d: number;
  percentChange60d: number;
  percentChange90d: number;
  percentChange1y: number;
  ytdPriceChangePercentage: number;
  lastUpdated: string;
}

export interface Market {
  exchange: string;
  market_type: string;
  source_symbol: string;
  status: string;
}

export interface SymbolData {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  categories: string[];
  icon: string;
  cmc_symbol: string;
  cmc_match_strategy: string;
  coin_slug: string;
  coin_name: string;
  cmc_rank: number;
  circulating_supply: number;
  self_reported_circulating_supply: number;
  total_supply: number;
  max_supply?: number;
  quotes: Quote[];
  markets: Market[];
}

export interface MarketsResponse {
  data: SymbolData[];
}

export interface CategoriesResponse {
  data: string[];
}

export interface ExchangeInfo {
  exchange: string;
  symbols: string[];
}

// ─── Helper: Convert new SymbolDetail → legacy SymbolData ───
export function symbolDetailToLegacy(d: SymbolDetail): SymbolData {
  return {
    symbol: d.symbol,
    base_asset: d.asset.base,
    quote_asset: d.asset.quote,
    categories: d.categories,
    icon: d.coin.icon,
    cmc_symbol: d.coin.cmc_symbol,
    cmc_match_strategy: d.coin.match_strategy,
    coin_slug: d.coin.slug,
    coin_name: d.coin.name,
    cmc_rank: d.coin.cmc_rank,
    circulating_supply: d.market_data.supply.circulating,
    self_reported_circulating_supply: d.market_data.supply.self_reported_circulating,
    total_supply: d.market_data.supply.total,
    max_supply: d.market_data.supply.max,
    quotes: [{
      name: 'USD',
      price: d.market_data.price,
      marketCap: d.market_data.market_cap,
      marketCapByTotalSupply: d.market_data.market_cap,
      fullyDilluttedMarketCap: d.market_data.fully_diluted_market_cap,
      dominance: d.market_data.dominance,
      volume24h: d.market_data.volume_24h,
      volumePercentChange: d.market_data.volume_percent_change,
      turnover: d.market_data.turnover,
      percentChange1h: d.market_data.percent_change['1h'],
      percentChange24h: d.market_data.percent_change['24h'],
      percentChange7d: d.market_data.percent_change['7d'],
      percentChange30d: d.market_data.percent_change['30d'],
      percentChange60d: d.market_data.percent_change['60d'],
      percentChange90d: d.market_data.percent_change['90d'],
      percentChange1y: d.market_data.percent_change['1y'],
      ytdPriceChangePercentage: d.market_data.percent_change['ytd'],
      lastUpdated: d.market_data.last_updated,
    }],
    markets: d.exchanges.markets,
  };
}

// ─── Helper: Convert SymbolListItem → legacy SymbolData ───
export function symbolListItemToLegacy(item: SymbolListItem): SymbolData {
  return {
    symbol: item.symbol,
    base_asset: item.asset.base,
    quote_asset: item.asset.quote,
    categories: item.categories,
    icon: item.coin.icon,
    cmc_symbol: item.coin.cmc_symbol,
    cmc_match_strategy: item.coin.match_strategy,
    coin_slug: item.coin.slug,
    coin_name: item.coin.name,
    cmc_rank: item.coin.cmc_rank,
    circulating_supply: item.market_data.supply.circulating,
    self_reported_circulating_supply: item.market_data.supply.self_reported_circulating,
    total_supply: item.market_data.supply.total,
    max_supply: item.market_data.supply.max,
    quotes: [{
      name: 'USD',
      price: item.market_data.price,
      marketCap: item.market_data.market_cap,
      marketCapByTotalSupply: item.market_data.market_cap,
      fullyDilluttedMarketCap: item.market_data.fully_diluted_market_cap,
      dominance: item.market_data.dominance,
      volume24h: item.market_data.volume_24h,
      volumePercentChange: item.market_data.volume_percent_change,
      turnover: item.market_data.turnover,
      percentChange1h: item.market_data.percent_change['1h'],
      percentChange24h: item.market_data.percent_change['24h'],
      percentChange7d: item.market_data.percent_change['7d'],
      percentChange30d: item.market_data.percent_change['30d'],
      percentChange60d: item.market_data.percent_change['60d'],
      percentChange90d: item.market_data.percent_change['90d'],
      percentChange1y: item.market_data.percent_change['1y'],
      ytdPriceChangePercentage: item.market_data.percent_change['ytd'],
      lastUpdated: item.market_data.last_updated,
    }],
    markets: item.exchanges.markets,
  };
}
