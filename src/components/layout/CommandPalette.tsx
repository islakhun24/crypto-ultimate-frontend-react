import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownRight, ArrowRight } from 'lucide-react';

interface CommandItem {
  label: string;
  path: string;
  category: string;
  shortcut?: string;
}

const commands: CommandItem[] = [
  // Core
  { label: 'Dashboard', path: '/', category: 'Core' },
  { label: 'Market Overview', path: '/market-overview', category: 'Core', shortcut: 'G M' },
  // Aggregator
  { label: 'Aggregator Overview', path: '/aggregator/overview', category: 'Aggregator' },
  { label: 'OI Change', path: '/aggregator/oi-change', category: 'Aggregator', shortcut: 'G O' },
  { label: 'Funding Rates', path: '/aggregator/funding', category: 'Aggregator', shortcut: 'G F' },
  { label: 'Liquidations', path: '/aggregator/liquidations', category: 'Aggregator', shortcut: 'G L' },
  // Flow
  { label: 'CVD Flow', path: '/flow/cvd', category: 'Flow', shortcut: 'G C' },
  { label: 'Taker Buy/Sell', path: '/flow/taker-buy-sell', category: 'Flow' },
  { label: 'Volume Spike', path: '/flow/volume-spike', category: 'Flow' },
  // Intelligence
  { label: 'Price-OI Divergence', path: '/intelligence/price-oi-divergence', category: 'Intelligence' },
  { label: 'Exchange Divergence', path: '/intelligence/exchange-divergence', category: 'Intelligence' },
  { label: 'Market Pressure', path: '/intelligence/market-pressure', category: 'Intelligence' },
  { label: 'Anomaly Detector', path: '/intelligence/anomaly-detector', category: 'Intelligence' },
  // Signals
  { label: 'Signal Scanner', path: '/signals/scanner', category: 'Signals', shortcut: 'G S' },
  { label: 'Signal History', path: '/signals/history', category: 'Signals' },
  { label: 'Strategy Builder', path: '/signals/strategy-builder', category: 'Signals' },
  { label: 'Signal Score', path: '/signals/signal-score', category: 'Signals' },
  { label: 'Pre-Pump Scanner', path: '/signals/pre-pump-scanner', category: 'Signals' },
  // Market
  { label: 'All Exchanges', path: '/exchanges', category: 'Market', shortcut: 'G E' },
  { label: 'Token List', path: '/tokens', category: 'Market', shortcut: 'G T' },
  { label: 'BTC Detail', path: '/token/BTC', category: 'Market' },
  { label: 'ETH Detail', path: '/token/ETH', category: 'Market' },
  // Tools
  { label: 'Watchlist', path: '/watchlist', category: 'Tools', shortcut: 'G W' },
  { label: 'Alerts', path: '/alerts', category: 'Tools' },
  { label: 'Portfolio', path: '/portfolio', category: 'Tools' },
  // On-Chain
  { label: 'Whale Tracker', path: '/on-chain/whale-tracker', category: 'On-Chain' },
  { label: 'Gas Tracker', path: '/on-chain/gas-tracker', category: 'On-Chain' },
  { label: 'Token Flows', path: '/on-chain/token-flows', category: 'On-Chain' },
  // Advanced
  { label: 'Trade Journal', path: '/trading/trade-journal', category: 'Trading' },
  { label: 'Correlation Matrix', path: '/market-intelligence/correlation-matrix', category: 'Analysis' },
  { label: 'AI Market Summary', path: '/market-intelligence/ai-market-summary', category: 'Analysis' },
  { label: 'Volatility Scanner', path: '/scanners/volatility-scanner', category: 'Scanners' },
  { label: 'Liquidity Monitor', path: '/scanners/liquidity-spread-monitor', category: 'Scanners' },
  // System
  { label: 'Settings', path: '/settings', category: 'System', shortcut: 'G ,' },
  { label: 'Admin Config', path: '/admin/config', category: 'System' },
  { label: 'System Monitor', path: '/infrastructure/system-monitor', category: 'System' },
  { label: 'Data Quality', path: '/data/data-quality', category: 'System' },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleSelect = useCallback((item: CommandItem) => {
    navigate(item.path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selected]) {
          handleSelect(filtered[selected]);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, onClose, handleSelect]);

  // Group by category
  const grouped: Record<string, CommandItem[]> = {};
  filtered.forEach(c => {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  });

  let flatIndex = 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-[640px] max-w-[90vw] rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(12,12,40,0.98) 0%, rgba(8,8,28,0.99) 100%)',
          border: '1px solid rgba(0,240,255,0.15)',
          boxShadow: '0 0 40px rgba(0,240,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #00f0ff, #b829dd, #ff00ff)' }} />

        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/10">
          <Search size={18} className="text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none font-mono"
          />
          <kbd
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 text-slate-500"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-5 py-1.5 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                {category}
              </div>
              {items.map((item) => {
                const isSelected = flatIndex === selected;
                flatIndex++;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelected(flatIndex - 1)}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-100"
                    style={isSelected
                      ? {
                          background: 'rgba(0,240,255,0.08)',
                          borderLeft: '2px solid #00f0ff',
                        }
                      : {
                          background: 'transparent',
                          borderLeft: '2px solid transparent',
                        }
                    }
                  >
                    <CornerDownRight size={12} className={isSelected ? 'text-cyan-400' : 'text-slate-600'} />
                    <span className={`flex-1 text-xs font-medium ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {item.label}
                    </span>
                    {item.shortcut && (
                      <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700 text-slate-500">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] text-cyan-400/60">
                        <ArrowRight size={10} /> Jump
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <Search size={24} className="mb-2 opacity-30" />
              <p className="text-xs">No commands found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded border border-slate-700">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded border border-slate-700">↵</kbd> Select
            </span>
          </div>
          <span>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
}
