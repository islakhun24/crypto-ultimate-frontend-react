import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Clock, ChevronDown, Bell, Command, ChevronRight, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

// Breadcrumb mapping
const breadcrumbMap: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Dashboard' },
  '/market-overview': { label: 'Market Overview', parent: '/' },
  '/aggregator/overview': { label: 'Overview', parent: '/' },
  '/aggregator/oi-change': { label: 'OI Change', parent: '/aggregator/overview' },
  '/aggregator/funding': { label: 'Funding', parent: '/aggregator/overview' },
  '/aggregator/liquidations': { label: 'Liquidations', parent: '/aggregator/overview' },
  '/flow/cvd': { label: 'CVD Flow', parent: '/' },
  '/flow/taker-buy-sell': { label: 'Taker Buy/Sell', parent: '/' },
  '/flow/volume-spike': { label: 'Volume Spike', parent: '/' },
  '/intelligence/price-oi-divergence': { label: 'Price-OI Divergence', parent: '/' },
  '/intelligence/exchange-divergence': { label: 'Exchange Divergence', parent: '/' },
  '/intelligence/market-pressure': { label: 'Market Pressure', parent: '/' },
  '/intelligence/anomaly-detector': { label: 'Anomaly Detector', parent: '/' },
  '/signals/scanner': { label: 'Signal Scanner', parent: '/' },
  '/signals/history': { label: 'Signal History', parent: '/signals/scanner' },
  '/signals/strategy-builder': { label: 'Strategy Builder', parent: '/signals/scanner' },
  '/signals/signal-score': { label: 'Signal Score', parent: '/signals/scanner' },
  '/signals/pre-pump-scanner': { label: 'Pre-Pump Scanner', parent: '/signals/scanner' },
  '/watchlist': { label: 'Watchlist', parent: '/' },
  '/watchlist-scanner': { label: 'Watchlist Scanner', parent: '/watchlist' },
  '/exchanges': { label: 'Exchanges', parent: '/' },
  '/exchanges/binance': { label: 'Binance', parent: '/exchanges' },
  '/exchanges/bybit': { label: 'Bybit', parent: '/exchanges' },
  '/exchanges/okx': { label: 'OKX', parent: '/exchanges' },
  '/on-chain/whale-tracker': { label: 'Whale Tracker', parent: '/' },
  '/on-chain/gas-tracker': { label: 'Gas Tracker', parent: '/on-chain/whale-tracker' },
  '/on-chain/token-flows': { label: 'Token Flows', parent: '/on-chain/whale-tracker' },
  '/alerts': { label: 'Alerts', parent: '/' },
  '/portfolio': { label: 'Portfolio', parent: '/' },
  '/tokens': { label: 'Token List', parent: '/' },
  '/trading/trade-journal': { label: 'Trade Journal', parent: '/' },
  '/market-intelligence/correlation-matrix': { label: 'Correlation Matrix', parent: '/' },
  '/market-intelligence/ai-market-summary': { label: 'AI Market Summary', parent: '/' },
  '/scanners/volatility-scanner': { label: 'Volatility Scanner', parent: '/' },
  '/scanners/liquidity-spread-monitor': { label: 'Liquidity Monitor', parent: '/' },
  '/data/data-quality': { label: 'Data Quality', parent: '/' },
  '/data/exchange-symbol-mapping': { label: 'Symbol Mapping', parent: '/' },
  '/infrastructure/system-monitor': { label: 'System Monitor', parent: '/' },
  '/settings': { label: 'Settings', parent: '/' },
  '/admin/config': { label: 'Admin Config', parent: '/settings' },
};

function getBreadcrumbs(path: string): { label: string; path: string }[] {
  const crumbs: { label: string; path: string }[] = [];
  let current = breadcrumbMap[path];

  // Handle token detail dynamic route
  if (path.startsWith('/token/')) {
    const symbol = path.split('/').pop() || '';
    crumbs.unshift({ label: `${symbol} Detail`, path });
    crumbs.unshift({ label: 'Tokens', path: '/tokens' });
    return crumbs;
  }

  while (current) {
    crumbs.unshift({ label: current.label, path });
    if (current.parent) {
      path = current.parent;
      current = breadcrumbMap[path];
    } else {
      break;
    }
  }

  return crumbs;
}

export default function Header({ onOpenCommandPalette }: HeaderProps) {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenCommandPalette]);

  return (
    <header
      className="flex flex-col sticky top-0 z-30"
      style={{ fontSize: 12 }}
    >
      {/* Main Header */}
      <div
        className="h-11 flex items-center justify-between px-4 shrink-0"
        style={{
          background: 'linear-gradient(180deg, rgba(8,8,28,0.95) 0%, rgba(5,5,20,0.97) 100%)',
          borderBottom: '1px solid rgba(0,240,255,0.08)',
        }}
      >
        {/* Left: Breadcrumb + Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 shrink-0">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} className="text-slate-700 mx-0.5" />}
                <Link
                  to={crumb.path}
                  className={`text-[11px] font-mono transition-colors hover:text-cyan-400 ${
                    i === breadcrumbs.length - 1
                      ? 'text-cyan-400 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="w-px h-5 bg-slate-800 mx-2" />

          {/* Search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="relative w-[220px] flex-shrink-0"
          >
            <div
              className="w-full h-7 rounded-lg flex items-center gap-2 px-3 text-xs transition-all duration-300"
              style={{
                background: 'rgba(0,240,255,0.03)',
                border: '1px solid rgba(0,240,255,0.1)',
              }}
            >
              <Search size={12} className="text-cyan-400/40" />
              <span className="text-slate-600">Search...</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="text-[9px] text-cyan-400/40 border border-cyan-500/15 rounded px-1">
                  Ctrl
                </kbd>
                <kbd className="text-[9px] text-cyan-400/40 border border-cyan-500/15 rounded px-1">
                  K
                </kbd>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Market Ticker */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Activity size={10} className="text-green-400 animate-pulse" />
            <span className="text-slate-400">MKT:</span>
            <span className="text-green-400 font-mono font-bold">OPEN</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">BTC</span>
            <span className="text-cyan-400 font-mono font-bold">$67,341.80</span>
            <span className="text-green-400 font-mono">+1.98%</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">ETH</span>
            <span className="text-cyan-400 font-mono font-bold">$3,642.57</span>
            <span className="text-green-400 font-mono">+2.71%</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">VOL</span>
            <span className="text-purple-400 font-mono">$98.4B</span>
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 ml-4">
          {/* Live Clock */}
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(0,240,255,0.04)',
              border: '1px solid rgba(0,240,255,0.08)',
            }}
          >
            <Clock size={11} className="text-cyan-400/60" />
            <span className="text-slate-300 font-mono text-[11px]">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-slate-600 text-[10px]">UTC</span>
          </button>

          {/* Timeframe */}
          <button
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(0,240,255,0.05)',
              border: '1px solid rgba(0,240,255,0.1)',
              color: '#00f0ff',
              fontSize: 11,
            }}
          >
            <span>1D</span>
            <ChevronDown size={11} className="text-cyan-400/50" />
          </button>

          {/* Notification */}
          <Link
            to="/alerts"
            className="relative h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,0,255,0.04)',
              border: '1px solid rgba(255,0,255,0.1)',
            }}
          >
            <Bell size={13} style={{ color: '#ff00ff' }} />
            <span
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #ff00ff, #b829dd)',
                boxShadow: '0 0 4px rgba(255,0,255,0.4)',
              }}
            >
              3
            </span>
          </Link>

          {/* User */}
          <button
            className="flex items-center gap-1.5 h-7 px-2 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(0,240,255,0.04)',
              border: '1px solid rgba(0,240,255,0.1)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #b829dd, #00f0ff)',
              }}
            />
            <span className="text-xs text-white font-mono">Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
