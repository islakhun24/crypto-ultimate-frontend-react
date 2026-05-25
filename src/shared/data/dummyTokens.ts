/**
 * DUMMY DATA - Crypto Exchange Normalizer API
 * Converted to match OpenAPI 3.0.2 spec nested structure
 *
 * Toggle: Set USE_DUMMY_DATA = true in tokenApi.ts to use this data
 *         Set USE_DUMMY_DATA = false to use real API
 */

import type { SymbolData, SymbolListItem, SymbolDetail, SummaryResponse, CategoryItem } from '@/shared/types/api';

// ─── Raw legacy data (flat structure for backward compat) ───
export const DUMMY_TOKENS: SymbolData[] = [
  {
    symbol: "0GUSDT",
    base_asset: "0G",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/38337.png",
    cmc_symbol: "0G",
    cmc_match_strategy: "exact",
    coin_slug: "0g-labs",
    coin_name: "0G",
    cmc_rank: 198,
    circulating_supply: 213243998,
    self_reported_circulating_supply: 0,
    total_supply: 1000000000,
    quotes: [
      {
        name: "USD",
        price: 0.4773,
        marketCap: 101798134,
        marketCapByTotalSupply: 101798134,
        fullyDilluttedMarketCap: 477378663,
        dominance: 0.0039,
        volume24h: 8423301,
        volumePercentChange: -32.42,
        turnover: 0.08278052,
        percentChange1h: 0.107,
        percentChange24h: -0.768,
        percentChange7d: -1.479,
        percentChange30d: -16.34,
        percentChange60d: -33.29,
        percentChange90d: -23.13,
        percentChange1y: -84.12,
        ytdPriceChangePercentage: -51.42,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "0GUSDT", status: "TRADING" },
      { exchange: "okx", market_type: "swap", source_symbol: "0G-USDT-SWAP", status: "live" },
      { exchange: "bybit", market_type: "linear", source_symbol: "0GUSDT", status: "Trading" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "0GUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "0G_USDT", status: "active" },
      { exchange: "gate", market_type: "usdt-futures", source_symbol: "0G_USDT", status: "active" },
    ],
  },
  {
    symbol: "1000BONKUSDT",
    base_asset: "1000BONK",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
    cmc_symbol: "BONK",
    cmc_match_strategy: "prefix",
    coin_slug: "bonk1",
    coin_name: "Bonk",
    cmc_rank: 81,
    circulating_supply: 87994730621386.89,
    self_reported_circulating_supply: 87994731328439.48,
    total_supply: 87994730621386.89,
    max_supply: 88872433754423.19,
    quotes: [
      {
        name: "USD",
        price: 0.0000061005,
        marketCap: 536810568.18,
        marketCapByTotalSupply: 536810568.18,
        fullyDilluttedMarketCap: 542164983.32,
        dominance: 0.0208,
        volume24h: 28991162.59,
        volumePercentChange: -21.17,
        turnover: 0.05400632,
        percentChange1h: 0.184,
        percentChange24h: 0.585,
        percentChange7d: 4.208,
        percentChange30d: -4.04,
        percentChange60d: 2.81,
        percentChange90d: 5.77,
        percentChange1y: -69.44,
        ytdPriceChangePercentage: -25.54,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "1000BONKUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "1000BONKUSDT", status: "Trading" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "1000BONKUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "1000BONK_USDT", status: "active" },
    ],
  },
  {
    symbol: "1000FLOKIUSDT",
    base_asset: "1000FLOKI",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png",
    cmc_symbol: "FLOKI",
    cmc_match_strategy: "prefix",
    coin_slug: "floki-inu",
    coin_name: "FLOKI",
    cmc_rank: 123,
    circulating_supply: 9536207834988.35,
    self_reported_circulating_supply: 9317621738535.4,
    total_supply: 9649673637129.39,
    quotes: [
      {
        name: "USD",
        price: 0.000029633,
        marketCap: 282582807.11,
        marketCapByTotalSupply: 285945095.91,
        fullyDilluttedMarketCap: 285945095.91,
        dominance: 0.0109,
        volume24h: 17959139.51,
        volumePercentChange: -14.44,
        turnover: 0.06355355,
        percentChange1h: 0.386,
        percentChange24h: -0.021,
        percentChange7d: -0.705,
        percentChange30d: -10.58,
        percentChange60d: 2.27,
        percentChange90d: 6.74,
        percentChange1y: -68.68,
        ytdPriceChangePercentage: -32.86,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "1000FLOKIUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "1000FLOKIUSDT", status: "Trading" },
    ],
  },
  {
    symbol: "1000LUNCUSDT",
    base_asset: "1000LUNC",
    quote_asset: "USDT",
    categories: ["DeFi"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png",
    cmc_symbol: "LUNC",
    cmc_match_strategy: "prefix",
    coin_slug: "terra-luna",
    coin_name: "Terra Classic",
    cmc_rank: 89,
    circulating_supply: 5541737637520.53,
    self_reported_circulating_supply: 5541742398131.44,
    total_supply: 6459101327252.59,
    max_supply: 6459101478256.21,
    quotes: [
      {
        name: "USD",
        price: 0.000082763,
        marketCap: 458652359.92,
        marketCapByTotalSupply: 534576383.88,
        fullyDilluttedMarketCap: 534576396.38,
        dominance: 0.0177,
        volume24h: 26407357.41,
        volumePercentChange: -17.46,
        turnover: 0.05757598,
        percentChange1h: 0.466,
        percentChange24h: 3.401,
        percentChange7d: 9.157,
        percentChange30d: 61.70,
        percentChange60d: 120.87,
        percentChange90d: 136.38,
        percentChange1y: 37.24,
        ytdPriceChangePercentage: 106.04,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "1000LUNCUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "1000LUNCUSDT", status: "Trading" },
    ],
  },
  {
    symbol: "1000PEPEUSDT",
    base_asset: "1000PEPE",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png",
    cmc_symbol: "PEPE",
    cmc_match_strategy: "prefix",
    coin_slug: "pepe",
    coin_name: "Pepe",
    cmc_rank: 47,
    circulating_supply: 413772485432296,
    self_reported_circulating_supply: 0,
    total_supply: 413772485432296,
    max_supply: 413772485432296,
    quotes: [
      {
        name: "USD",
        price: 0.0000036109,
        marketCap: 1494090740.82,
        marketCapByTotalSupply: 1494090740.82,
        fullyDilluttedMarketCap: 1494090740.82,
        dominance: 0.0578,
        volume24h: 125730859.93,
        volumePercentChange: -29.81,
        turnover: 0.08415209,
        percentChange1h: 0.414,
        percentChange24h: -0.257,
        percentChange7d: -0.063,
        percentChange30d: -7.02,
        percentChange60d: 5.78,
        percentChange90d: -7.49,
        percentChange1y: -72.43,
        ytdPriceChangePercentage: -26.66,
        lastUpdated: "2026-05-25T10:27:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "1000PEPEUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "1000PEPEUSDT", status: "Trading" },
    ],
  },
  {
    symbol: "1000SHIBUSDT",
    base_asset: "1000SHIB",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    cmc_symbol: "SHIB",
    cmc_match_strategy: "prefix",
    coin_slug: "shiba-inu",
    coin_name: "Shiba Inu",
    cmc_rank: 19,
    circulating_supply: 589253890322245,
    self_reported_circulating_supply: 589270914269021,
    total_supply: 589507248812349,
    quotes: [
      {
        name: "USD",
        price: 0.00001883,
        marketCap: 11102339208.62,
        marketCapByTotalSupply: 11104146648.18,
        fullyDilluttedMarketCap: 11104146648.18,
        dominance: 0.1491,
        volume24h: 416938977.19,
        volumePercentChange: -22.24,
        turnover: 0.03755154,
        percentChange1h: 0.116,
        percentChange24h: 0.389,
        percentChange7d: 0.718,
        percentChange30d: -4.78,
        percentChange60d: 2.38,
        percentChange90d: -4.87,
        percentChange1y: -56.78,
        ytdPriceChangePercentage: -10.93,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "1000SHIBUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "1000SHIBUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "1000SHIB-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "1000SHIBUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "1000SHIB_USDT", status: "active" },
    ],
  },
  {
    symbol: "ADAUSDT",
    base_asset: "ADA",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    cmc_symbol: "ADA",
    cmc_match_strategy: "exact",
    coin_slug: "cardano",
    coin_name: "Cardano",
    cmc_rank: 9,
    circulating_supply: 35286737577.2,
    self_reported_circulating_supply: 0,
    total_supply: 45000000000,
    max_supply: 45000000000,
    quotes: [
      {
        name: "USD",
        price: 0.9878,
        marketCap: 34869402584.79,
        marketCapByTotalSupply: 44476224150,
        fullyDilluttedMarketCap: 44476224150,
        dominance: 0.8205,
        volume24h: 943235008.88,
        volumePercentChange: -22.31,
        turnover: 0.02705063,
        percentChange1h: 0.032,
        percentChange24h: 0.583,
        percentChange7d: 3.504,
        percentChange30d: 8.75,
        percentChange60d: 27.14,
        percentChange90d: 5.51,
        percentChange1y: -25.98,
        ytdPriceChangePercentage: 33.93,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "ADAUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "ADAUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "ADA-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "ADAUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "ADA_USDT", status: "active" },
    ],
  },
  {
    symbol: "AAVEUSDT",
    base_asset: "AAVE",
    quote_asset: "USDT",
    categories: ["DeFi"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
    cmc_symbol: "AAVE",
    cmc_match_strategy: "exact",
    coin_slug: "aave",
    coin_name: "Aave",
    cmc_rank: 57,
    circulating_supply: 15072209.6,
    self_reported_circulating_supply: 0,
    total_supply: 16000000,
    max_supply: 16000000,
    quotes: [
      {
        name: "USD",
        price: 266.44,
        marketCap: 4013485483.95,
        marketCapByTotalSupply: 4262980083.2,
        fullyDilluttedMarketCap: 4262980083.2,
        dominance: 0.0491,
        volume24h: 663805361.88,
        volumePercentChange: -21.14,
        turnover: 0.16539422,
        percentChange1h: 0.151,
        percentChange24h: -0.963,
        percentChange7d: 2.365,
        percentChange30d: 8.99,
        percentChange60d: 14.34,
        percentChange90d: 12.91,
        percentChange1y: -21.31,
        ytdPriceChangePercentage: 20.94,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "AAVEUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "AAVEUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "AAVE-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "AAVEUSDT", status: "normal" },
    ],
  },
  {
    symbol: "BTCUSDT",
    base_asset: "BTC",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    cmc_symbol: "BTC",
    cmc_match_strategy: "exact",
    coin_slug: "bitcoin",
    coin_name: "Bitcoin",
    cmc_rank: 1,
    circulating_supply: 19833878,
    self_reported_circulating_supply: 0,
    total_supply: 21000000,
    max_supply: 21000000,
    quotes: [
      {
        name: "USD",
        price: 67702.41,
        marketCap: 1342750554214.53,
        marketCapByTotalSupply: 1421930550000,
        fullyDilluttedMarketCap: 1421930550000,
        dominance: 62.45,
        volume24h: 72811789052.15,
        volumePercentChange: -12.43,
        turnover: 0.05421867,
        percentChange1h: 0.315,
        percentChange24h: 1.982,
        percentChange7d: 5.871,
        percentChange30d: 14.32,
        percentChange60d: 23.76,
        percentChange90d: 31.24,
        percentChange1y: 87.42,
        ytdPriceChangePercentage: 62.18,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "BTCUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "BTCUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "BTC-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "BTCUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "BTC_USDT", status: "active" },
      { exchange: "gate", market_type: "usdt-futures", source_symbol: "BTC_USDT", status: "active" },
    ],
  },
  {
    symbol: "ETHUSDT",
    base_asset: "ETH",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    cmc_symbol: "ETH",
    cmc_match_strategy: "exact",
    coin_slug: "ethereum",
    coin_name: "Ethereum",
    cmc_rank: 2,
    circulating_supply: 120456789,
    self_reported_circulating_supply: 0,
    total_supply: 120456789,
    quotes: [
      {
        name: "USD",
        price: 3595.42,
        marketCap: 433089045200.43,
        marketCapByTotalSupply: 433089045200.43,
        fullyDilluttedMarketCap: 433089045200,
        dominance: 14.82,
        volume24h: 38646389012.34,
        volumePercentChange: -8.76,
        turnover: 0.08923456,
        percentChange1h: 0.247,
        percentChange24h: 2.715,
        percentChange7d: 8.312,
        percentChange30d: 18.43,
        percentChange60d: 31.22,
        percentChange90d: 45.67,
        percentChange1y: 42.15,
        ytdPriceChangePercentage: 38.92,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "ETHUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "ETHUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "ETH-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "ETHUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "ETH_USDT", status: "active" },
      { exchange: "gate", market_type: "usdt-futures", source_symbol: "ETH_USDT", status: "active" },
    ],
  },
  {
    symbol: "SOLUSDT",
    base_asset: "SOL",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    cmc_symbol: "SOL",
    cmc_match_strategy: "exact",
    coin_slug: "solana",
    coin_name: "Solana",
    cmc_rank: 5,
    circulating_supply: 486321987,
    self_reported_circulating_supply: 0,
    total_supply: 588145876,
    quotes: [
      {
        name: "USD",
        price: 181.45,
        marketCap: 88243456789.12,
        marketCapByTotalSupply: 106689343200.32,
        fullyDilluttedMarketCap: 106689343200,
        dominance: 3.24,
        volume24h: 10892345678.90,
        volumePercentChange: 15.32,
        turnover: 0.12345678,
        percentChange1h: 0.518,
        percentChange24h: 4.231,
        percentChange7d: 11.847,
        percentChange30d: 22.18,
        percentChange60d: 38.92,
        percentChange90d: 56.34,
        percentChange1y: 112.43,
        ytdPriceChangePercentage: 45.67,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "SOLUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "SOLUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "SOL-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "SOLUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "SOL_USDT", status: "active" },
    ],
  },
  {
    symbol: "XRPUSDT",
    base_asset: "XRP",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
    cmc_symbol: "XRP",
    cmc_match_strategy: "exact",
    coin_slug: "xrp",
    coin_name: "XRP",
    cmc_rank: 4,
    circulating_supply: 57843521987,
    self_reported_circulating_supply: 57843521987,
    total_supply: 99987654321,
    max_supply: 100000000000,
    quotes: [
      {
        name: "USD",
        price: 2.22,
        marketCap: 128432109876.54,
        marketCapByTotalSupply: 222198765432.10,
        fullyDilluttedMarketCap: 222220000000,
        dominance: 3.56,
        volume24h: 12678901234.56,
        volumePercentChange: -5.43,
        turnover: 0.09876543,
        percentChange1h: 0.123,
        percentChange24h: -0.456,
        percentChange7d: 2.109,
        percentChange30d: 5.32,
        percentChange60d: 12.18,
        percentChange90d: 18.45,
        percentChange1y: 15.67,
        ytdPriceChangePercentage: 8.92,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "XRPUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "XRPUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "XRP-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "XRPUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "XRP_USDT", status: "active" },
    ],
  },
  {
    symbol: "DOGEUSDT",
    base_asset: "DOGE",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    cmc_symbol: "DOGE",
    cmc_match_strategy: "exact",
    coin_slug: "dogecoin",
    coin_name: "Dogecoin",
    cmc_rank: 8,
    circulating_supply: 148234567890,
    self_reported_circulating_supply: 148234567890,
    total_supply: 148234567890,
    quotes: [
      {
        name: "USD",
        price: 0.22,
        marketCap: 32617789123.40,
        marketCapByTotalSupply: 32617789123.40,
        fullyDilluttedMarketCap: 32617789123.40,
        dominance: 1.12,
        volume24h: 2498765432.10,
        volumePercentChange: 8.92,
        turnover: 0.07654321,
        percentChange1h: 0.287,
        percentChange24h: 1.876,
        percentChange7d: 6.543,
        percentChange30d: 12.34,
        percentChange60d: 28.76,
        percentChange90d: 42.18,
        percentChange1y: 45.23,
        ytdPriceChangePercentage: 32.18,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "DOGEUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "DOGEUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "DOGE-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "DOGEUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "DOGE_USDT", status: "active" },
    ],
  },
  {
    symbol: "SUIUSDT",
    base_asset: "SUI",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
    cmc_symbol: "SUI",
    cmc_match_strategy: "exact",
    coin_slug: "sui",
    coin_name: "Sui",
    cmc_rank: 16,
    circulating_supply: 3124567890,
    self_reported_circulating_supply: 3124567890,
    total_supply: 10000000000,
    quotes: [
      {
        name: "USD",
        price: 3.46,
        marketCap: 10812345678.90,
        marketCapByTotalSupply: 34567890123.40,
        fullyDilluttedMarketCap: 34567890123.40,
        dominance: 0.48,
        volume24h: 2034567890.12,
        volumePercentChange: 22.34,
        turnover: 0.18765432,
        percentChange1h: 0.456,
        percentChange24h: 3.456,
        percentChange7d: 14.567,
        percentChange30d: 28.92,
        percentChange60d: 52.34,
        percentChange90d: 78.92,
        percentChange1y: 234.56,
        ytdPriceChangePercentage: 156.78,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "SUIUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "SUIUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "SUI-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "SUIUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "SUI_USDT", status: "active" },
    ],
  },
  {
    symbol: "AVAXUSDT",
    base_asset: "AVAX",
    quote_asset: "USDT",
    categories: ["Layer-1"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
    cmc_symbol: "AVAX",
    cmc_match_strategy: "exact",
    coin_slug: "avalanche",
    coin_name: "Avalanche",
    cmc_rank: 15,
    circulating_supply: 412345678,
    self_reported_circulating_supply: 412345678,
    total_supply: 720000000,
    max_supply: 720000000,
    quotes: [
      {
        name: "USD",
        price: 40.05,
        marketCap: 16518765432.10,
        marketCapByTotalSupply: 28857600000,
        fullyDilluttedMarketCap: 28857600000,
        dominance: 0.52,
        volume24h: 2405678901.23,
        volumePercentChange: -12.34,
        turnover: 0.14567890,
        percentChange1h: 0.198,
        percentChange24h: -1.234,
        percentChange7d: 4.321,
        percentChange30d: 6.78,
        percentChange60d: 18.92,
        percentChange90d: 22.45,
        percentChange1y: -32.45,
        ytdPriceChangePercentage: 12.34,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "AVAXUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "AVAXUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "AVAX-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "AVAXUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "AVAX_USDT", status: "active" },
    ],
  },
  {
    symbol: "LINKUSDT",
    base_asset: "LINK",
    quote_asset: "USDT",
    categories: ["DeFi"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    cmc_symbol: "LINK",
    cmc_match_strategy: "exact",
    coin_slug: "chainlink",
    coin_name: "Chainlink",
    cmc_rank: 14,
    circulating_supply: 638971234,
    self_reported_circulating_supply: 0,
    total_supply: 1000000000,
    max_supply: 1000000000,
    quotes: [
      {
        name: "USD",
        price: 28.99,
        marketCap: 18523456789.01,
        marketCapByTotalSupply: 28987654321,
        fullyDilluttedMarketCap: 28987654321,
        dominance: 0.56,
        volume24h: 2901234567.89,
        volumePercentChange: -7.89,
        turnover: 0.15678901,
        percentChange1h: 0.234,
        percentChange24h: -0.567,
        percentChange7d: 3.456,
        percentChange30d: 11.23,
        percentChange60d: 25.67,
        percentChange90d: 34.56,
        percentChange1y: -8.92,
        ytdPriceChangePercentage: 18.92,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "LINKUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "LINKUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "LINK-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "LINKUSDT", status: "normal" },
      { exchange: "mexc", market_type: "usdt-futures", source_symbol: "LINK_USDT", status: "active" },
    ],
  },
  {
    symbol: "TRUMPUSDT",
    base_asset: "TRUMP",
    quote_asset: "USDT",
    categories: ["Meme"],
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/35336.png",
    cmc_symbol: "TRUMP",
    cmc_match_strategy: "exact",
    coin_slug: "official-trump",
    coin_name: "Official Trump",
    cmc_rank: 28,
    circulating_supply: 200000000,
    self_reported_circulating_supply: 200000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    quotes: [
      {
        name: "USD",
        price: 14.57,
        marketCap: 2913456789.01,
        marketCapByTotalSupply: 14567890123.40,
        fullyDilluttedMarketCap: 14567890123.40,
        dominance: 0.28,
        volume24h: 1006789012.34,
        volumePercentChange: -18.92,
        turnover: 0.34567890,
        percentChange1h: -0.345,
        percentChange24h: -2.345,
        percentChange7d: -5.678,
        percentChange30d: -15.67,
        percentChange60d: -8.92,
        percentChange90d: 0,
        percentChange1y: 0,
        ytdPriceChangePercentage: -42.18,
        lastUpdated: "2026-05-25T10:26:00.000Z",
      },
    ],
    markets: [
      { exchange: "binance", market_type: "usds-m-futures", source_symbol: "TRUMPUSDT", status: "TRADING" },
      { exchange: "bybit", market_type: "linear", source_symbol: "TRUMPUSDT", status: "Trading" },
      { exchange: "okx", market_type: "swap", source_symbol: "TRUMP-USDT-SWAP", status: "live" },
      { exchange: "bitget", market_type: "usdt-futures", source_symbol: "TRUMPUSDT", status: "normal" },
    ],
  },
];

// ─── Category list (legacy string format) ───
export const DUMMY_CATEGORIES = [...new Set(DUMMY_TOKENS.flatMap(t => t.categories ?? []))].sort();

// ─── Category items (new format: {name, symbol_count}) ───
export const dummyCategoryItems: CategoryItem[] = DUMMY_CATEGORIES.map(name => ({
  name,
  symbol_count: DUMMY_TOKENS.filter(t => t.categories?.includes(name)).length,
}));

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/** Get token by symbol (legacy) */
export function getDummyToken(symbol: string): SymbolData | undefined {
  return DUMMY_TOKENS.find(
    t => t.symbol === symbol || t.base_asset === symbol || t.symbol === `${symbol}USDT`
  );
}

/** Search dummy tokens (legacy) */
export function searchDummyTokens(query: string): SymbolData[] {
  if (!query) return DUMMY_TOKENS;
  const q = query.toLowerCase();
  return DUMMY_TOKENS.filter(
    t =>
      t.symbol.toLowerCase().includes(q) ||
      t.base_asset.toLowerCase().includes(q) ||
      t.coin_name?.toLowerCase().includes(q) ||
      t.coin_slug?.toLowerCase().includes(q) ||
      t.categories?.some(c => c.toLowerCase().includes(q))
  );
}

/** Filter by category (legacy) */
export function filterDummyByCategory(category: string): SymbolData[] {
  if (category === 'all') return DUMMY_TOKENS;
  return DUMMY_TOKENS.filter(t => t.categories?.includes(category));
}

/** Paginate dummy tokens */
export function paginateDummyTokens(
  page: number,
  limit: number,
  filtered?: SymbolData[]
): { data: SymbolData[]; meta: { page: number; limit: number; total: number; total_pages: number } } {
  const items = filtered ?? DUMMY_TOKENS;
  const total = items.length;
  const total_pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total, total_pages },
  };
}

/** Get top symbols by market cap */
export function getDummyTopSymbols(): SymbolData[] {
  return [...DUMMY_TOKENS]
    .sort((a, b) => (b.quotes?.[0]?.marketCap ?? 0) - (a.quotes?.[0]?.marketCap ?? 0))
    .slice(0, 10);
}

/** Get summary stats */
export function getDummySummary(): SummaryResponse {
  const total_symbols = DUMMY_TOKENS.length;
  const active_symbols = DUMMY_TOKENS.filter(t =>
    t.markets?.some(m => ['TRADING', 'Trading', 'live', 'normal', 'active'].includes(m.status))
  ).length;
  const total_markets = DUMMY_TOKENS.reduce((sum, t) => sum + (t.markets?.length ?? 0), 0);
  const average_market_count = total_markets / total_symbols;

  // Top categories by symbol count
  const catMap = new Map<string, number>();
  DUMMY_TOKENS.forEach(t => {
    t.categories?.forEach(c => {
      catMap.set(c, (catMap.get(c) ?? 0) + 1);
    });
  });
  const top_categories = [...catMap.entries()]
    .map(([name, symbol_count]) => ({ name, symbol_count }))
    .sort((a, b) => b.symbol_count - a.symbol_count);

  return {
    total_symbols,
    active_symbols,
    total_markets,
    average_market_count: Number(average_market_count.toFixed(2)),
    top_categories,
    last_normalized_at: DUMMY_TOKENS[0]?.quotes?.[0]?.lastUpdated ?? new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════
// CONVERTERS: Legacy SymbolData -> New API shapes
// ═══════════════════════════════════════════════════════════

/** Convert legacy SymbolData to SymbolListItem */
export function toSymbolListItem(t: SymbolData): SymbolListItem {
  const q = t.quotes?.[0];
  return {
    id: `${t.symbol}-${Date.now()}`,
    symbol: t.symbol,
    asset: {
      base: t.base_asset,
      quote: t.quote_asset,
      market_type: 'perpetual',
    },
    categories: t.categories ?? [],
    coin: {
      name: t.coin_name ?? t.base_asset,
      slug: t.coin_slug ?? t.base_asset.toLowerCase(),
      icon: t.icon ?? '',
      cmc_symbol: t.cmc_symbol ?? t.base_asset,
      cmc_rank: t.cmc_rank ?? 0,
      match_strategy: t.cmc_match_strategy ?? 'exact',
    },
    market_data: {
      market_cap: q?.marketCap ?? 0,
      market_cap_tier: getMarketCapTier(q?.marketCap),
      price: q?.price ?? 0,
      volume_24h: q?.volume24h ?? 0,
      volume_percent_change: q?.volumePercentChange ?? 0,
      turnover: q?.turnover ?? 0,
      fully_diluted_market_cap: q?.fullyDilluttedMarketCap ?? 0,
      dominance: q?.dominance ?? 0,
      percent_change: {
        '1h': q?.percentChange1h ?? 0,
        '24h': q?.percentChange24h ?? 0,
        '7d': q?.percentChange7d ?? 0,
        '30d': q?.percentChange30d ?? 0,
        '60d': q?.percentChange60d ?? 0,
        '90d': q?.percentChange90d ?? 0,
        '1y': q?.percentChange1y ?? 0,
        'ytd': q?.ytdPriceChangePercentage ?? 0,
      },
      supply: {
        circulating: t.circulating_supply ?? 0,
        self_reported_circulating: t.self_reported_circulating_supply ?? 0,
        total: t.total_supply ?? 0,
        max: t.max_supply,
      },
      last_updated: q?.lastUpdated ?? new Date().toISOString(),
    },
    exchanges: {
      count: t.markets?.length ?? 0,
      markets: t.markets ?? [],
    },
    source: {
      exchange: t.markets?.[0]?.exchange ?? 'binance',
      status: t.markets?.[0]?.status ?? 'TRADING',
      is_active: true,
    },
    timestamps: {
      last_normalized_at: q?.lastUpdated ?? new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}

/** Convert legacy SymbolData to SymbolDetail */
export function toSymbolDetail(t: SymbolData): SymbolDetail {
  const item = toSymbolListItem(t);
  return {
    ...item,
    id: `${t.symbol}-detail`,
  };
}

/** Determine market cap tier */
function getMarketCapTier(mcap: number | undefined): string {
  if (!mcap) return 'small';
  if (mcap > 10e9) return 'large';
  if (mcap > 1e9) return 'mid';
  return 'small';
}
