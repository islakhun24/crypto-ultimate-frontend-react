// ===== TOP 100 CRYPTOCURRENCIES WITH REALISTIC DATA =====
export interface Token {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  category: string;
  tags: string[];
  oi: number;
  oiChange24h: number;
  fundingRate: number;
  liquidation24h: number;
  longLiquidation: number;
  shortLiquidation: number;
  longShortRatio: number;
  cvd24h: number;
  takerBuyRatio: number;
  rsi14: number;
  rsi4h: number;
  ema20: number;
  ema50: number;
  ema200: number;
  ath: number;
  athChange: number;
  atl: number;
  exchanges: string[];
  sparkline7d: number[];
}

export const tokens: Token[] = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: 67341.80, change24h: 1.98, change7d: 4.32, marketCap: 1328000000000, volume24h: 28450000000, circulatingSupply: 19740000, totalSupply: 19740000, maxSupply: 21000000, category: "Layer 1", tags: ["PoW","Store of Value","Digital Gold"], oi: 32610000000, oiChange24h: 3.21, fundingRate: 0.0081, liquidation24h: 16660000, longLiquidation: 12450000, shortLiquidation: 4210000, longShortRatio: 1.86, cvd24h: 342100000, takerBuyRatio: 63.9, rsi14: 62.4, rsi4h: 58.2, ema20: 65842, ema50: 62184, ema200: 48520, ath: 73750, athChange: -8.7, atl: 67.81, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [64500,65100,64800,66200,65800,67100,67341] },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: 3642.57, change24h: 2.71, change7d: 3.21, marketCap: 436200000000, volume24h: 16210000000, circulatingSupply: 120120000, totalSupply: 120120000, maxSupply: null, category: "Layer 1", tags: ["PoS","Smart Contracts","DeFi"], oi: 16210000000, oiChange24h: 2.15, fundingRate: 0.0059, liquidation24h: 11470000, longLiquidation: 8320000, shortLiquidation: 3150000, longShortRatio: 1.72, cvd24h: 218400000, takerBuyRatio: 62.6, rsi14: 58.6, rsi4h: 61.4, ema20: 3482, ema50: 3256, ema200: 2840, ath: 4878, athChange: -25.3, atl: 0.4329, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [3528,3560,3490,3610,3580,3630,3642] },
  { rank: 3, symbol: "BNB", name: "BNB", price: 595.21, change24h: 1.12, change7d: 2.18, marketCap: 87620000000, volume24h: 1920000000, circulatingSupply: 146580000, totalSupply: 146580000, maxSupply: null, category: "Exchange", tags: ["PoS","Exchange Token","BSC"], oi: 1720000000, oiChange24h: 0.84, fundingRate: 0.0021, liquidation24h: 2230000, longLiquidation: 1890000, shortLiquidation: 340000, longShortRatio: 1.79, cvd24h: 42100000, takerBuyRatio: 64.2, rsi14: 54.2, rsi4h: 56.8, ema20: 582, ema50: 548, ema200: 432, ath: 720, athChange: -17.3, atl: 0.09611, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [582,588,580,590,586,592,595] },
  { rank: 4, symbol: "SOL", name: "Solana", price: 168.13, change24h: 4.37, change7d: 6.95, marketCap: 79410000000, volume24h: 7340000000, circulatingSupply: 465550000, totalSupply: 584520000, maxSupply: null, category: "Layer 1", tags: ["PoS","High TPS","DeFi","NFT"], oi: 3920000000, oiChange24h: 6.48, fundingRate: 0.0102, liquidation24h: 8700000, longLiquidation: 6780000, shortLiquidation: 1920000, longShortRatio: 1.61, cvd24h: 156800000, takerBuyRatio: 60.1, rsi14: 68.4, rsi4h: 72.1, ema20: 156.4, ema50: 142.8, ema200: 98.5, ath: 260, athChange: -35.3, atl: 0.5008, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [157,160,155,162,159,165,168] },
  { rank: 5, symbol: "XRP", name: "XRP", price: 0.5128, change24h: -0.86, change7d: -1.24, marketCap: 28860000000, volume24h: 2880000000, circulatingSupply: 56120000000, totalSupply: 99980000000, maxSupply: 100000000000, category: "Payments", tags: ["Payments","Cross-border","Ripple"], oi: 2380000000, oiChange24h: -1.23, fundingRate: -0.0013, liquidation24h: 4100000, longLiquidation: 3210000, shortLiquidation: 890000, longShortRatio: 0.92, cvd24h: -42100000, takerBuyRatio: 48.5, rsi14: 42.6, rsi4h: 38.4, ema20: 0.524, ema50: 0.542, ema200: 0.528, ath: 3.84, athChange: -86.6, atl: 0.002802, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [0.524,0.521,0.518,0.515,0.516,0.514,0.512] },
  { rank: 6, symbol: "DOGE", name: "Dogecoin", price: 0.14235, change24h: 1.46, change7d: -2.18, marketCap: 20610000000, volume24h: 1250000000, circulatingSupply: 145820000000, totalSupply: 145820000000, maxSupply: null, category: "Meme", tags: ["PoW","Meme","Payments"], oi: 1260000000, oiChange24h: 1.02, fundingRate: 0.0021, liquidation24h: 2610000, longLiquidation: 2150000, shortLiquidation: 460000, longShortRatio: 1.46, cvd24h: 28400000, takerBuyRatio: 59.9, rsi14: 52.1, rsi4h: 48.7, ema20: 0.141, ema50: 0.138, ema200: 0.112, ath: 0.7376, athChange: -80.7, atl: 0.0000869, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [0.145,0.144,0.143,0.141,0.140,0.141,0.142] },
  { rank: 7, symbol: "ADA", name: "Cardano", price: 0.4721, change24h: -0.72, change7d: -1.85, marketCap: 16680000000, volume24h: 842000000, circulatingSupply: 35310000000, totalSupply: 36952000000, maxSupply: 45000000000, category: "Layer 1", tags: ["PoS","Smart Contracts","DeFi"], oi: 892400000, oiChange24h: -0.65, fundingRate: -0.0009, liquidation24h: 1420000, longLiquidation: 1180000, shortLiquidation: 240000, longShortRatio: 1.33, cvd24h: -18200000, takerBuyRatio: 52.1, rsi14: 44.8, rsi4h: 41.2, ema20: 0.481, ema50: 0.498, ema200: 0.462, ath: 3.10, athChange: -84.8, atl: 0.01925, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [0.485,0.482,0.479,0.476,0.474,0.473,0.472] },
  { rank: 8, symbol: "AVAX", name: "Avalanche", price: 34.67, change24h: 2.18, change7d: 3.12, marketCap: 13720000000, volume24h: 1280000000, circulatingSupply: 395200000, totalSupply: 436280000, maxSupply: 720000000, category: "Layer 1", tags: ["PoS","Subnet","DeFi"], oi: 1140000000, oiChange24h: 2.31, fundingRate: 0.0043, liquidation24h: 1980000, longLiquidation: 1420000, shortLiquidation: 560000, longShortRatio: 1.58, cvd24h: 38700000, takerBuyRatio: 58.2, rsi14: 56.4, rsi4h: 62.1, ema20: 33.2, ema50: 31.8, ema200: 28.4, ath: 146.22, athChange: -76.3, atl: 2.80, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [33.6,33.9,33.2,34.1,33.8,34.2,34.6] },
  { rank: 9, symbol: "LINK", name: "Chainlink", price: 14.82, change24h: 3.12, change7d: 5.48, marketCap: 9280000000, volume24h: 621300000, circulatingSupply: 626000000, totalSupply: 1000000000, maxSupply: 1000000000, category: "Oracle", tags: ["Oracle","DeFi","CCIP"], oi: 842100000, oiChange24h: 5.1, fundingRate: 0.0018, liquidation24h: 1240000, longLiquidation: 892000, shortLiquidation: 348000, longShortRatio: 1.24, cvd24h: 42100000, takerBuyRatio: 62.1, rsi14: 61.8, rsi4h: 64.2, ema20: 14.12, ema50: 13.28, ema200: 12.64, ath: 52.89, athChange: -72.0, atl: 0.1482, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [14.0,14.2,13.9,14.5,14.3,14.6,14.8] },
  { rank: 10, symbol: "SUI", name: "Sui", price: 1.78, change24h: 6.84, change7d: 12.45, marketCap: 5670000000, volume24h: 402100000, circulatingSupply: 3185000000, totalSupply: 10000000000, maxSupply: 10000000000, category: "Layer 1", tags: ["PoS","Move","DeFi","Gaming"], oi: 524000000, oiChange24h: 8.42, fundingRate: 0.0068, liquidation24h: 1840000, longLiquidation: 1520000, shortLiquidation: 320000, longShortRatio: 2.14, cvd24h: 68400000, takerBuyRatio: 68.4, rsi14: 72.8, rsi4h: 76.4, ema20: 1.58, ema50: 1.42, ema200: 1.08, ath: 2.36, athChange: -24.6, atl: 0.3643, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [1.58,1.62,1.55,1.68,1.65,1.72,1.78] },
  // More tokens for depth
  { rank: 11, symbol: "DOT", name: "Polkadot", price: 7.24, change24h: 1.85, change7d: 2.64, marketCap: 9852000000, volume24h: 256000000, circulatingSupply: 1360800000, totalSupply: 1360800000, maxSupply: null, category: "Layer 1", tags: ["PoS","Parachain","Interoperability"], oi: 342000000, oiChange24h: 1.42, fundingRate: 0.0012, liquidation24h: 580000, longLiquidation: 420000, shortLiquidation: 160000, longShortRatio: 1.38, cvd24h: 18400000, takerBuyRatio: 56.2, rsi14: 52.4, rsi4h: 54.8, ema20: 7.08, ema50: 6.82, ema200: 6.14, ath: 55.00, athChange: -86.8, atl: 2.70, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [7.05,7.12,7.08,7.18,7.14,7.20,7.24] },
  { rank: 12, symbol: "MATIC", name: "Polygon", price: 0.8421, change24h: 2.05, change7d: 1.28, marketCap: 7824000000, volume24h: 584000000, circulatingSupply: 9286000000, totalSupply: 10000000000, maxSupply: 10000000000, category: "Layer 2", tags: ["PoS","Scaling","ZK"], oi: 318000000, oiChange24h: 1.28, fundingRate: 0.0015, liquidation24h: 420000, longLiquidation: 310000, shortLiquidation: 110000, longShortRatio: 1.32, cvd24h: 12400000, takerBuyRatio: 55.8, rsi14: 51.2, rsi4h: 53.6, ema20: 0.828, ema50: 0.812, ema200: 0.748, ath: 2.92, athChange: -71.2, atl: 0.003143, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [0.825,0.832,0.828,0.838,0.834,0.840,0.842] },
  { rank: 13, symbol: "UNI", name: "Uniswap", price: 8.23, change24h: -1.24, change7d: -3.18, marketCap: 4928000000, volume24h: 124000000, circulatingSupply: 598900000, totalSupply: 1000000000, maxSupply: 1000000000, category: "DeFi", tags: ["DEX","AMM","Governance"], oi: 184000000, oiChange24h: -2.14, fundingRate: -0.0008, liquidation24h: 380000, longLiquidation: 290000, shortLiquidation: 90000, longShortRatio: 0.88, cvd24h: -8200000, takerBuyRatio: 42.6, rsi14: 38.4, rsi4h: 34.2, ema20: 8.48, ema50: 8.82, ema200: 8.56, ath: 44.97, athChange: -81.7, atl: 1.03, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [8.52,8.48,8.42,8.35,8.30,8.26,8.23] },
  { rank: 14, symbol: "LTC", name: "Litecoin", price: 78.42, change24h: 0.92, change7d: 1.48, marketCap: 5824000000, volume24h: 318000000, circulatingSupply: 74250000, totalSupply: 84000000, maxSupply: 84000000, category: "Payments", tags: ["PoW","Payments","Digital Silver"], oi: 156000000, oiChange24h: 0.68, fundingRate: 0.0009, liquidation24h: 210000, longLiquidation: 158000, shortLiquidation: 52000, longShortRatio: 1.28, cvd24h: 6200000, takerBuyRatio: 54.2, rsi14: 48.6, rsi4h: 50.2, ema20: 77.2, ema50: 74.8, ema200: 72.4, ath: 413.47, athChange: -81.0, atl: 1.11, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [77.2,77.8,77.4,78.0,77.8,78.2,78.4] },
  { rank: 15, symbol: "APT", name: "Aptos", price: 8.42, change24h: -2.18, change7d: -4.32, marketCap: 3784000000, volume24h: 142000000, circulatingSupply: 449200000, totalSupply: 1109200000, maxSupply: null, category: "Layer 1", tags: ["PoS","Move","Diem"], oi: 98200000, oiChange24h: -3.42, fundingRate: -0.0015, liquidation24h: 380000, longLiquidation: 310000, shortLiquidation: 70000, longShortRatio: 0.82, cvd24h: -12400000, takerBuyRatio: 38.4, rsi14: 35.2, rsi4h: 32.8, ema20: 8.72, ema50: 9.14, ema200: 8.68, ath: 19.92, athChange: -57.7, atl: 3.08, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [8.72,8.65,8.58,8.52,8.48,8.45,8.42] },
  { rank: 16, symbol: "ARB", name: "Arbitrum", price: 1.14, change24h: 1.68, change7d: 0.84, marketCap: 3428000000, volume24h: 218000000, circulatingSupply: 3008000000, totalSupply: 10000000000, maxSupply: 10000000000, category: "Layer 2", tags: ["Optimistic Rollup","Scaling","DeFi"], oi: 124000000, oiChange24h: 1.82, fundingRate: 0.0018, liquidation24h: 180000, longLiquidation: 128000, shortLiquidation: 52000, longShortRatio: 1.42, cvd24h: 8200000, takerBuyRatio: 56.8, rsi14: 50.4, rsi4h: 52.8, ema20: 1.12, ema50: 1.08, ema200: 1.02, ath: 2.40, athChange: -52.5, atl: 0.7448, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [1.12,1.13,1.11,1.13,1.12,1.13,1.14] },
  { rank: 17, symbol: "OP", name: "Optimism", price: 2.18, change24h: 0.85, change7d: -1.24, marketCap: 2284000000, volume24h: 156000000, circulatingSupply: 1047800000, totalSupply: 4297487621, maxSupply: 4297487621, category: "Layer 2", tags: ["Optimistic Rollup","Scaling","DeFi"], oi: 86000000, oiChange24h: -0.42, fundingRate: 0.0012, liquidation24h: 120000, longLiquidation: 82000, shortLiquidation: 38000, longShortRatio: 1.18, cvd24h: -2100000, takerBuyRatio: 48.2, rsi14: 46.8, rsi4h: 44.2, ema20: 2.20, ema50: 2.28, ema200: 2.18, ath: 3.28, athChange: -33.5, atl: 0.40, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [2.20,2.19,2.16,2.18,2.17,2.18,2.18] },
  { rank: 18, symbol: "INJ", name: "Injective", price: 25.84, change24h: 5.42, change7d: 8.78, marketCap: 2182000000, volume24h: 142000000, circulatingSupply: 84420000, totalSupply: 100000000, maxSupply: null, category: "DeFi", tags: ["DEX","Layer 1","Derivatives"], oi: 78200000, oiChange24h: 8.24, fundingRate: 0.0084, liquidation24h: 420000, longLiquidation: 340000, shortLiquidation: 80000, longShortRatio: 2.08, cvd24h: 24800000, takerBuyRatio: 64.2, rsi14: 68.2, rsi4h: 71.8, ema20: 24.12, ema50: 22.48, ema200: 18.24, ath: 52.75, athChange: -51.0, atl: 1.00, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [23.8,24.2,23.5,24.8,24.5,25.2,25.8] },
  { rank: 19, symbol: "NEAR", name: "NEAR Protocol", price: 6.42, change24h: 3.28, change7d: 4.82, marketCap: 6842000000, volume24h: 284000000, circulatingSupply: 1065800000, totalSupply: 1188900000, maxSupply: null, category: "Layer 1", tags: ["PoS","Sharding","DeFi"], oi: 148000000, oiChange24h: 3.42, fundingRate: 0.0032, liquidation24h: 280000, longLiquidation: 192000, shortLiquidation: 88000, longShortRatio: 1.62, cvd24h: 18400000, takerBuyRatio: 58.4, rsi14: 60.8, rsi4h: 64.2, ema20: 6.18, ema50: 5.82, ema200: 4.98, ath: 20.44, athChange: -68.6, atl: 0.526, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [6.12,6.18,6.08,6.28,6.24,6.35,6.42] },
  { rank: 20, symbol: "ATOM", name: "Cosmos", price: 8.92, change24h: -0.42, change7d: -2.18, marketCap: 3486000000, volume24h: 124000000, circulatingSupply: 390800000, totalSupply: null, maxSupply: null, category: "Layer 1", tags: ["PoS","IBC","Interoperability"], oi: 78000000, oiChange24h: -1.28, fundingRate: -0.0006, liquidation24h: 140000, longLiquidation: 108000, shortLiquidation: 32000, longShortRatio: 0.92, cvd24h: -4200000, takerBuyRatio: 44.2, rsi14: 42.8, rsi4h: 40.4, ema20: 9.02, ema50: 9.38, ema200: 9.12, ath: 44.70, athChange: -80.0, atl: 1.13, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [9.02,8.98,8.95,8.92,8.90,8.91,8.92] },
  // ... add more for completeness
  { rank: 21, symbol: "WIF", name: "Dogwifhat", price: 2.96, change24h: 24.81, change7d: 42.18, marketCap: 2960000000, volume24h: 892000000, circulatingSupply: 998900000, totalSupply: 998900000, maxSupply: null, category: "Meme", tags: ["Solana","Meme"], oi: 184000000, oiChange24h: 32.4, fundingRate: 0.0242, liquidation24h: 2400000, longLiquidation: 1980000, shortLiquidation: 420000, longShortRatio: 2.84, cvd24h: 124000000, takerBuyRatio: 72.4, rsi14: 82.4, rsi4h: 88.2, ema20: 2.42, ema50: 2.08, ema200: 1.42, ath: 4.85, athChange: -39.0, atl: 0.0677, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [2.08,2.18,2.35,2.42,2.58,2.78,2.96] },
  { rank: 22, symbol: "BONK", name: "Bonk", price: 0.00002842, change24h: 8.42, change7d: 15.78, marketCap: 1842000000, volume24h: 142000000, circulatingSupply: 64832000000000, totalSupply: 93526000000000, maxSupply: 100000000000000, category: "Meme", tags: ["Solana","Meme"], oi: 52000000, oiChange24h: 12.8, fundingRate: 0.0168, liquidation24h: 380000, longLiquidation: 310000, shortLiquidation: 70000, longShortRatio: 2.42, cvd24h: 18400000, takerBuyRatio: 68.2, rsi14: 74.2, rsi4h: 78.4, ema20: 0.000026, ema50: 0.000024, ema200: 0.000018, ath: 0.00005825, athChange: -51.2, atl: 0.00000009, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [0.000024,0.000025,0.000026,0.0000265,0.000027,0.000028,0.0000284] },
  { rank: 23, symbol: "RENDER", name: "Render", price: 10.72, change24h: 15.63, change7d: 28.42, marketCap: 4282000000, volume24h: 542000000, circulatingSupply: 399400000, totalSupply: 531000000, maxSupply: 531000000, category: "AI", tags: ["GPU","DePIN","AI"], oi: 124000000, oiChange24h: 18.42, fundingRate: 0.0124, liquidation24h: 980000, longLiquidation: 820000, shortLiquidation: 160000, longShortRatio: 2.64, cvd24h: 58400000, takerBuyRatio: 71.2, rsi14: 78.4, rsi4h: 82.1, ema20: 9.12, ema50: 8.24, ema200: 6.42, ath: 13.60, athChange: -21.2, atl: 0.2871, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [8.34,8.72,9.18,9.82,10.12,10.42,10.72] },
  { rank: 24, symbol: "TIA", name: "Celestia", price: 11.67, change24h: 9.85, change7d: 14.28, marketCap: 2348000000, volume24h: 318000000, circulatingSupply: 201200000, totalSupply: 1067100000, maxSupply: null, category: "Infrastructure", tags: ["Modular","Data Availability","DA"], oi: 68000000, oiChange24h: 12.42, fundingRate: 0.0098, liquidation24h: 420000, longLiquidation: 340000, shortLiquidation: 80000, longShortRatio: 2.28, cvd24h: 28400000, takerBuyRatio: 66.4, rsi14: 72.4, rsi4h: 76.8, ema20: 10.42, ema50: 9.68, ema200: 8.24, ath: 20.18, athChange: -42.2, atl: 2.08, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [10.28,10.58,10.82,11.12,11.28,11.45,11.67] },
  { rank: 25, symbol: "FET", name: "Fetch.ai", price: 2.21, change24h: 12.17, change7d: 22.48, marketCap: 1842000000, volume24h: 284000000, circulatingSupply: 833500000, totalSupply: 2631000000, maxSupply: 2631000000, category: "AI", tags: ["AI","Agents","Machine Learning"], oi: 52000000, oiChange24h: 14.82, fundingRate: 0.0112, liquidation24h: 340000, longLiquidation: 280000, shortLiquidation: 60000, longShortRatio: 2.18, cvd24h: 24800000, takerBuyRatio: 68.4, rsi14: 74.8, rsi4h: 78.2, ema20: 1.92, ema50: 1.72, ema200: 1.38, ath: 3.45, athChange: -35.9, atl: 0.00817, exchanges: ["Binance","Bybit","OKX","Bitget","MEXC","KuCoin"], sparkline7d: [1.82,1.88,1.95,2.02,2.08,2.14,2.21] },
];

// ===== EXCHANGES DATA =====
export interface Exchange {
  name: string;
  logo: string;
  volume24h: number;
  volumeChange: number;
  markets: number;
  oi: number;
  oiChange: number;
  avgSpread: number;
  avgLatency: number;
  uptime: number;
  status: 'Operational' | 'Degraded' | 'Maintenance';
  pairs: { symbol: string; price: number; spread: number; depth: number; volume: number }[];
  health: { api: string; ws: string; matching: string; withdrawal: string };
  fees: { maker: number; taker: number };
}

export const exchanges: Exchange[] = [
  { name: "Binance", logo: "B", volume24h: 28450000000, volumeChange: 6.91, markets: 1842, oi: 16920000000, oiChange: 4.82, avgSpread: 0.002, avgLatency: 42, uptime: 99.99, status: "Operational", pairs: [{ symbol: "BTCUSDT", price: 67341.80, spread: 0.002, depth: 850, volume: 7310000000 }, { symbol: "ETHUSDT", price: 3642.57, spread: 0.003, depth: 620, volume: 4280000000 }, { symbol: "SOLUSDT", price: 168.13, spread: 0.008, depth: 480, volume: 2740000000 }], health: { api: "Normal", ws: "Connected", matching: "Normal", withdrawal: "Normal" }, fees: { maker: 0.0002, taker: 0.0004 } },
  { name: "Bybit", logo: "By", volume24h: 17620000000, volumeChange: 5.34, markets: 1242, oi: 8420000000, oiChange: 3.21, avgSpread: 0.004, avgLatency: 48, uptime: 99.98, status: "Operational", pairs: [{ symbol: "BTCUSDT", price: 67335.20, spread: 0.003, depth: 620, volume: 5240000000 }, { symbol: "ETHUSDT", price: 3641.12, spread: 0.004, depth: 480, volume: 3120000000 }, { symbol: "SOLUSDT", price: 167.82, spread: 0.012, depth: 320, volume: 1820000000 }], health: { api: "Normal", ws: "Connected", matching: "Normal", withdrawal: "Normal" }, fees: { maker: 0.0001, taker: 0.0006 } },
  { name: "OKX", logo: "OK", volume24h: 12310000000, volumeChange: 4.81, markets: 1084, oi: 6210000000, oiChange: 2.84, avgSpread: 0.005, avgLatency: 46, uptime: 99.97, status: "Operational", pairs: [{ symbol: "BTCUSDT", price: 67348.60, spread: 0.003, depth: 540, volume: 3980000000 }, { symbol: "ETHUSDT", price: 3644.85, spread: 0.005, depth: 420, volume: 2180000000 }, { symbol: "SOLUSDT", price: 168.45, spread: 0.014, depth: 280, volume: 1420000000 }], health: { api: "Normal", ws: "Connected", matching: "Normal", withdrawal: "Normal" }, fees: { maker: 0.0008, taker: 0.001 } },
  { name: "Bitget", logo: "Bg", volume24h: 9210000000, volumeChange: 5.98, markets: 856, oi: 3840000000, oiChange: 4.12, avgSpread: 0.012, avgLatency: 51, uptime: 99.96, status: "Operational", pairs: [{ symbol: "BTCUSDT", price: 67327.10, spread: 0.006, depth: 280, volume: 2140000000 }, { symbol: "ETHUSDT", price: 3638.42, spread: 0.008, depth: 220, volume: 1420000000 }, { symbol: "SOLUSDT", price: 167.95, spread: 0.022, depth: 180, volume: 980000000 }], health: { api: "Normal", ws: "Connected", matching: "Normal", withdrawal: "Normal" }, fees: { maker: 0.0002, taker: 0.0006 } },
  { name: "MEXC", logo: "Mx", volume24h: 6840000000, volumeChange: 4.32, markets: 2184, oi: 1240000000, oiChange: 1.82, avgSpread: 0.042, avgLatency: 124, uptime: 99.82, status: "Degraded", pairs: [{ symbol: "BTCUSDT", price: 67309.50, spread: 0.018, depth: 95, volume: 1280000000 }, { symbol: "ETHUSDT", price: 3632.18, spread: 0.024, depth: 72, volume: 842000000 }, { symbol: "SOLUSDT", price: 167.42, spread: 0.084, depth: 45, volume: 524000000 }], health: { api: "Degraded", ws: "Connected", matching: "Normal", withdrawal: "Delayed" }, fees: { maker: 0.0002, taker: 0.0006 } },
  { name: "KuCoin", logo: "KC", volume24h: 5980000000, volumeChange: 4.15, markets: 942, oi: 2180000000, oiChange: 2.14, avgSpread: 0.008, avgLatency: 57, uptime: 99.95, status: "Operational", pairs: [{ symbol: "BTCUSDT", price: 67338.70, spread: 0.004, depth: 340, volume: 1820000000 }, { symbol: "ETHUSDT", price: 3640.85, spread: 0.006, depth: 260, volume: 1120000000 }, { symbol: "SOLUSDT", price: 168.02, spread: 0.016, depth: 160, volume: 724000000 }], health: { api: "Normal", ws: "Connected", matching: "Normal", withdrawal: "Normal" }, fees: { maker: 0.0001, taker: 0.001 } },
];

// ===== MARKET OVERVIEW =====
export const marketOverview = {
  totalMarketCap: 2610000000000,
  marketCapChange24h: 1.85,
  volume24h: 98420000000,
  volumeChange24h: 6.27,
  btcDominance: 52.18,
  ethDominance: 18.42,
  stableCoinVolume: 48200000000,
  defiTVL: 58420000000,
  totalOI: 54780000000,
  oiChange24h: 3.12,
  avgFunding: 0.0036,
  liquidation24h: 458700000,
  fearGreedIndex: 72,
  fearGreedLabel: "Greed",
  activeCryptos: 10254,
  activeExchanges: 723,
  activeMarkets: 40682,
};

// ===== HELPER FUNCTIONS =====
export function formatUSD(num: number, compact = false): string {
  if (compact) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

export function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getSparklineData(basePrice: number, points = 24): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = [];
  let price = basePrice * 0.92;
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.45) * 0.02);
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      value: price,
    });
  }
  return data;
}

export function getSignalScore(token: Token): { score: number; label: string; color: string } {
  const trendScore = token.price > token.ema20 ? 25 : token.price > token.ema50 ? 15 : 5;
  const momentumScore = token.rsi14 > 50 ? 20 : 10;
  const oiScore = token.oiChange24h > 0 ? 20 : 10;
  const volumeScore = token.volume24h > token.marketCap * 0.1 ? 15 : 10;
  const fundingScore = token.fundingRate > 0 ? 10 : 15;
  const score = trendScore + momentumScore + oiScore + volumeScore + fundingScore;
  if (score >= 80) return { score, label: 'Strong Buy', color: '#00ff88' };
  if (score >= 60) return { score, label: 'Buy', color: '#00f0ff' };
  if (score >= 40) return { score, label: 'Neutral', color: '#f0e800' };
  if (score >= 20) return { score, label: 'Sell', color: '#ff6b35' };
  return { score, label: 'Strong Sell', color: '#ff2d95' };
}
