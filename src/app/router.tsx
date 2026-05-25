import { createHashRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/dashboard';
import MarketOverviewPage from '@/pages/market-overview';
import AggregatorOverviewPage from '@/pages/aggregator/overview';
import AggregatorOIChangePage from '@/pages/aggregator/oi-change';
import AggregatorFundingPage from '@/pages/aggregator/funding';
import AggregatorLiquidationsPage from '@/pages/aggregator/liquidations';
import SignalScannerPage from '@/pages/signals/scanner';
import SignalHistoryPage from '@/pages/signals/history';
import StrategyBuilderPage from '@/pages/signals/strategy-builder';
import SignalScorePage from '@/pages/signals/signal-score';
import PrePumpScannerPage from '@/pages/signals/pre-pump-scanner';
import WatchlistPage from '@/pages/watchlist';
import WatchlistScannerPage from '@/pages/watchlist-scanner';
import ExchangeBinancePage from '@/pages/exchanges';
import ExchangeBybitPage from '@/pages/exchanges/bybit';
import ExchangeOKXPage from '@/pages/exchanges/okx';
import WhaleTrackerPage from '@/pages/on-chain/whale-tracker';
import GasTrackerPage from '@/pages/on-chain/gas-tracker';
import TokenFlowsPage from '@/pages/on-chain/token-flows';
import AlertsPage from '@/pages/alerts';
import PortfolioPage from '@/pages/portfolio';
import TokensPage from '@/pages/tokens';
import TokenDetailPage from '@/pages/token-detail';
import SettingsPage from '@/pages/settings';

// Flow
import CVDPage from '@/pages/flow/cvd';
import TakerBuySellPage from '@/pages/flow/taker-buy-sell';
import VolumeSpikePage from '@/pages/flow/volume-spike';

// Intelligence
import PriceOIDivergencePage from '@/pages/intelligence/price-oi-divergence';
import ExchangeDivergencePage from '@/pages/intelligence/exchange-divergence';
import MarketPressurePage from '@/pages/intelligence/market-pressure';
import AnomalyDetectorPage from '@/pages/intelligence/anomaly-detector';

// Trading
import TradeJournalPage from '@/pages/trading/trade-journal';

// Market Intelligence
import CorrelationMatrixPage from '@/pages/market-intelligence/correlation-matrix';
import AIMarketSummaryPage from '@/pages/market-intelligence/ai-market-summary';

// Scanners
import VolatilityScannerPage from '@/pages/scanners/volatility-scanner';
import LiquiditySpreadMonitorPage from '@/pages/scanners/liquidity-spread-monitor';

// Data
import DataQualityPage from '@/pages/data/data-quality';
import ExchangeSymbolMappingPage from '@/pages/data/exchange-symbol-mapping';

// Infrastructure
import SystemMonitorPage from '@/pages/infrastructure/system-monitor';

// Admin
import AdminConfigPage from '@/pages/admin/config';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Core
      { path: '/', element: <DashboardPage /> },
      { path: '/market-overview', element: <MarketOverviewPage /> },

      // Aggregator
      { path: '/aggregator/overview', element: <AggregatorOverviewPage /> },
      { path: '/aggregator/oi-change', element: <AggregatorOIChangePage /> },
      { path: '/aggregator/funding', element: <AggregatorFundingPage /> },
      { path: '/aggregator/liquidations', element: <AggregatorLiquidationsPage /> },

      // Flow
      { path: '/flow/cvd', element: <CVDPage /> },
      { path: '/flow/taker-buy-sell', element: <TakerBuySellPage /> },
      { path: '/flow/volume-spike', element: <VolumeSpikePage /> },

      // Intelligence
      { path: '/intelligence/price-oi-divergence', element: <PriceOIDivergencePage /> },
      { path: '/intelligence/exchange-divergence', element: <ExchangeDivergencePage /> },
      { path: '/intelligence/market-pressure', element: <MarketPressurePage /> },
      { path: '/intelligence/anomaly-detector', element: <AnomalyDetectorPage /> },

      // Signals
      { path: '/signals/scanner', element: <SignalScannerPage /> },
      { path: '/signals/history', element: <SignalHistoryPage /> },
      { path: '/signals/strategy-builder', element: <StrategyBuilderPage /> },
      { path: '/signals/signal-score', element: <SignalScorePage /> },
      { path: '/signals/pre-pump-scanner', element: <PrePumpScannerPage /> },

      // Watchlist
      { path: '/watchlist', element: <WatchlistPage /> },
      { path: '/watchlist-scanner', element: <WatchlistScannerPage /> },

      // Exchanges
      { path: '/exchanges', element: <ExchangeBinancePage /> },
      { path: '/exchanges/binance', element: <ExchangeBinancePage /> },
      { path: '/exchanges/bybit', element: <ExchangeBybitPage /> },
      { path: '/exchanges/okx', element: <ExchangeOKXPage /> },

      // On-Chain
      { path: '/on-chain/whale-tracker', element: <WhaleTrackerPage /> },
      { path: '/on-chain/gas-tracker', element: <GasTrackerPage /> },
      { path: '/on-chain/token-flows', element: <TokenFlowsPage /> },

      // Other
      { path: '/alerts', element: <AlertsPage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/tokens', element: <TokensPage /> },
      { path: '/token/:symbol', element: <TokenDetailPage /> },

      // Trading
      { path: '/trading/trade-journal', element: <TradeJournalPage /> },

      // Market Intelligence
      { path: '/market-intelligence/correlation-matrix', element: <CorrelationMatrixPage /> },
      { path: '/market-intelligence/ai-market-summary', element: <AIMarketSummaryPage /> },

      // Scanners
      { path: '/scanners/volatility-scanner', element: <VolatilityScannerPage /> },
      { path: '/scanners/liquidity-spread-monitor', element: <LiquiditySpreadMonitorPage /> },

      // Data
      { path: '/data/data-quality', element: <DataQualityPage /> },
      { path: '/data/exchange-symbol-mapping', element: <ExchangeSymbolMappingPage /> },

      // Infrastructure
      { path: '/infrastructure/system-monitor', element: <SystemMonitorPage /> },

      // Settings & Admin
      { path: '/settings', element: <SettingsPage /> },
      { path: '/admin/config', element: <AdminConfigPage /> },
    ],
  },
]);
