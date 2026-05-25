import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Layers, Signal, Star, Building2,
  Link2, Bell, Wallet, Settings, ChevronDown, ChevronRight,
  Diamond, Moon, Sparkles, Hexagon, TrendingUp, BookOpen,
  Activity, Zap, Brain, ScanLine, Database, Server, Shield,
  GitFork, BarChart4, Box, Cpu, ChevronLeft,
  PanelLeftClose, PanelRightOpen, Search, X, Circle
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, BarChart3, Layers, Signal, Star, Building2,
  Link2, Bell, Wallet, Settings, Hexagon, TrendingUp, BookOpen,
  Activity, Zap, Brain, ScanLine, Database, Server, Shield,
  GitFork, BarChart4, Box, Cpu
};

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  children?: { label: string; path: string }[];
  section?: string;
}

const menuItems: MenuItem[] = [
  // Core
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/', section: 'Core' },
  { label: 'Market Overview', icon: 'BarChart3', path: '/market-overview', section: 'Core' },

  // Aggregator
  {
    label: 'Aggregator', icon: 'Layers', section: 'Data Aggregator',
    children: [
      { label: 'Overview', path: '/aggregator/overview' },
      { label: 'OI Change', path: '/aggregator/oi-change' },
      { label: 'Funding', path: '/aggregator/funding' },
      { label: 'Liquidations', path: '/aggregator/liquidations' },
    ],
  },
  {
    label: 'Flow', icon: 'GitFork', section: 'Data Aggregator',
    children: [
      { label: 'CVD', path: '/flow/cvd' },
      { label: 'Taker Buy/Sell', path: '/flow/taker-buy-sell' },
      { label: 'Volume Spike', path: '/flow/volume-spike' },
    ],
  },

  // Intelligence
  {
    label: 'Intelligence', icon: 'Brain', section: 'Intelligence',
    children: [
      { label: 'Price-OI Divergence', path: '/intelligence/price-oi-divergence' },
      { label: 'Exchange Divergence', path: '/intelligence/exchange-divergence' },
      { label: 'Market Pressure', path: '/intelligence/market-pressure' },
      { label: 'Anomaly Detector', path: '/intelligence/anomaly-detector' },
    ],
  },
  {
    label: 'Signals', icon: 'Zap', section: 'Intelligence',
    children: [
      { label: 'Signal Scanner', path: '/signals/scanner' },
      { label: 'Signal History', path: '/signals/history' },
      { label: 'Strategy Builder', path: '/signals/strategy-builder' },
      { label: 'Signal Score', path: '/signals/signal-score' },
      { label: 'Pre-Pump Scanner', path: '/signals/pre-pump-scanner' },
    ],
  },

  // Market
  {
    label: 'Exchanges', icon: 'Building2', section: 'Market',
    children: [
      { label: 'All Exchanges', path: '/exchanges' },
      { label: 'Binance', path: '/exchanges/binance' },
      { label: 'Bybit', path: '/exchanges/bybit' },
      { label: 'OKX', path: '/exchanges/okx' },
    ],
  },
  {
    label: 'Tokens', icon: 'Hexagon', section: 'Market',
    children: [
      { label: 'Token List', path: '/tokens' },
      { label: 'Token Detail', path: '/token/BTC' },
    ],
  },

  // Tools
  { label: 'Watchlist', icon: 'Star', path: '/watchlist', section: 'Tools' },
  { label: 'Alerts', icon: 'Bell', path: '/alerts', section: 'Tools' },
  { label: 'Portfolio', icon: 'Wallet', path: '/portfolio', section: 'Tools' },
  {
    label: 'On-Chain', icon: 'Link2', section: 'Tools',
    children: [
      { label: 'Whale Tracker', path: '/on-chain/whale-tracker' },
      { label: 'Gas Tracker', path: '/on-chain/gas-tracker' },
      { label: 'Token Flows', path: '/on-chain/token-flows' },
    ],
  },

  // Advanced
  {
    label: 'Trading', icon: 'TrendingUp', section: 'Advanced',
    children: [
      { label: 'Trade Journal', path: '/trading/trade-journal' },
    ],
  },
  {
    label: 'Market Intelligence', icon: 'BarChart4', section: 'Advanced',
    children: [
      { label: 'Correlation Matrix', path: '/market-intelligence/correlation-matrix' },
      { label: 'AI Market Summary', path: '/market-intelligence/ai-market-summary' },
    ],
  },
  {
    label: 'Scanners', icon: 'ScanLine', section: 'Advanced',
    children: [
      { label: 'Volatility Scanner', path: '/scanners/volatility-scanner' },
      { label: 'Liquidity / Spread Monitor', path: '/scanners/liquidity-spread-monitor' },
    ],
  },
  {
    label: 'Data', icon: 'Database', section: 'Advanced',
    children: [
      { label: 'Data Quality', path: '/data/data-quality' },
      { label: 'Exchange Symbol Mapping', path: '/data/exchange-symbol-mapping' },
    ],
  },
  {
    label: 'Infrastructure', icon: 'Server', section: 'Advanced',
    children: [
      { label: 'System Monitor', path: '/infrastructure/system-monitor' },
    ],
  },

  // System
  {
    label: 'Admin', icon: 'Shield', section: 'System',
    children: [
      { label: 'Settings', path: '/settings' },
      { label: 'Admin / Config', path: '/admin/config' },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/* ===== Collapsed Submenu Trigger - Simplified robust hover ===== */
function CollapsedSubmenuTrigger({ item }: { item: MenuItem }) {
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const IconComp = iconMap[item.icon] || LayoutDashboard;
  const isGroupActive = item.children?.some(c => location.pathname.startsWith(c.path)) ?? false;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHide = () => {
    cancelHide();
    hideTimer.current = setTimeout(() => {
      // Double-check: is mouse still over wrapper or panel?
      setOpen(false);
    }, 300);
  };

  const handleWrapperEnter = () => {
    cancelHide();
    if (wrapperRef.current) {
      const btn = wrapperRef.current.querySelector('button');
      if (btn) setRect(btn.getBoundingClientRect());
    }
    setOpen(true);
  };

  const handleWrapperLeave = (e: React.MouseEvent) => {
    // Check if moving to panel
    const related = e.relatedTarget as HTMLElement;
    if (related && panelRef.current?.contains(related)) {
      return; // Moving to panel, don't hide
    }
    scheduleHide();
  };

  const handlePanelEnter = () => {
    cancelHide();
  };

  const handlePanelLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement;
    if (related && wrapperRef.current?.contains(related)) {
      return; // Moving back to wrapper, don't hide
    }
    scheduleHide();
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        wrapperRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative mb-1"
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      <button
        className={cn(
          'w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-200',
          isGroupActive
            ? 'text-cyan-400'
            : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5'
        )}
        style={
          isGroupActive
            ? {
                background: 'rgba(0,240,255,0.08)',
                border: '1px solid rgba(0,240,255,0.15)',
                boxShadow: '0 0 8px rgba(0,240,255,0.06)',
              }
            : { border: '1px solid transparent' }
        }
      >
        <IconComp
          size={18}
          style={isGroupActive ? { filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' } : {}}
        />
      </button>
      {isGroupActive && (
        <div
          className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-cyan-400"
          style={{ boxShadow: '0 0 5px rgba(0,240,255,0.6)' }}
        />
      )}
      {/* Floating panel rendered inline (NOT portal) - to share DOM tree for mouse events */}
      {open && rect && (
        <div
          ref={panelRef}
          className="absolute z-[60]"
          style={{
            top: 0,
            left: '100%',
            marginLeft: 4,
          }}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
        >
          <div
            className="rounded-xl py-2 px-1"
            style={{
              background: 'linear-gradient(180deg, rgba(12,12,40,0.98) 0%, rgba(8,8,28,0.99) 100%)',
              border: '1px solid rgba(0,240,255,0.2)',
              boxShadow: '0 0 20px rgba(0,240,255,0.15), 0 4px 20px rgba(0,0,0,0.5)',
              minWidth: 170,
            }}
          >
            <div className="px-3 py-1.5 mb-1 border-b border-cyan-500/10">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            {item.children?.map(child => {
              const isChildActive = location.pathname === child.path;
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150',
                    isChildActive
                      ? 'text-cyan-300'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5'
                  )}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={
                      isChildActive
                        ? { background: '#00f0ff', boxShadow: '0 0 5px rgba(0,240,255,0.6)' }
                        : { background: 'rgba(100,116,139,0.35)' }
                    }
                  />
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed: controlledCollapsed, onCollapsedChange }: SidebarProps) {
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = (v: boolean) => {
    setInternalCollapsed(v);
    onCollapsedChange?.(v);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.children) {
        init[item.label] = item.children.some(c => location.pathname.startsWith(c.path));
      }
    });
    return init;
  });
  const sidebarWidth = collapsed ? 'w-[64px]' : 'w-[260px]';

  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children) {
        const isActive = item.children.some(c => location.pathname.startsWith(c.path));
        if (isActive) {
          setExpanded(prev => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleExpand = useCallback((label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const filteredItems = searchQuery.trim()
    ? menuItems.filter(item => {
        const q = searchQuery.toLowerCase();
        if (item.label.toLowerCase().includes(q)) return true;
        if (item.children?.some(c => c.label.toLowerCase().includes(q))) return true;
        return false;
      })
    : menuItems;

  const sections = ['Core', 'Data Aggregator', 'Intelligence', 'Market', 'Tools', 'Advanced', 'System'];

  return (
    <aside
      className={cn(sidebarWidth, 'h-full flex flex-col transition-all duration-300 ease-in-out')}
      style={{
        background: 'linear-gradient(180deg, rgba(8,8,28,0.98) 0%, rgba(5,5,20,0.99) 100%)',
        borderRight: '1px solid rgba(0,240,255,0.08)',
        boxShadow: collapsed ? '2px 0 20px rgba(0,0,0,0.3)' : '4px 0 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* Neon glow line top */}
      <div className="h-[2px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, #00f0ff, #b829dd, #ff00ff)' }} />

      {/* Logo & Collapse */}
      <div className="p-3 flex items-center gap-3 border-b border-cyan-500/10 shrink-0" style={{ minHeight: 56 }}>
        <Link to="/" className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center relative shrink-0 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))',
              border: '1px solid rgba(0,240,255,0.3)',
              boxShadow: '0 0 10px rgba(0,240,255,0.15)',
            }}
          >
            <Sparkles size={18} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.6))' }} />
          </div>
          {!collapsed && (
            <span className="font-bold text-base gradient-text tracking-tight truncate animate-in fade-in duration-200">
              Crypto Ultimate
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 shrink-0"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={14} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-[18px] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-50"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.3), rgba(184,41,221,0.3))',
              border: '1px solid rgba(0,240,255,0.3)',
              boxShadow: '0 0 10px rgba(0,240,255,0.3)',
            }}
            title="Expand sidebar"
          >
            <PanelRightOpen size={10} className="text-cyan-300" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative group">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-7 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-slate-300 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-cyan-500/[0.03] focus:shadow-[0_0_10px_rgba(0,240,255,0.05)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}
      {collapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0 flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
            title="Open search"
          >
            <Search size={16} />
          </button>
        </div>
      )}

      {/* Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 sidebar-scroll" style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable', overflowX: 'visible' }}>
        {sections.map(section => {
          const sectionItems = filteredItems.filter(item => item.section === section);
          if (sectionItems.length === 0) return null;

          return (
            <div key={section} className="mb-2">
              {/* Section Header */}
              {!collapsed && !searchQuery && (
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-600">{section}</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                </div>
              )}

              {sectionItems.map((item) => {
                const IconComp = iconMap[item.icon] || LayoutDashboard;

                // === EXPANDED: items with children ===
                if (item.children && !collapsed) {
                  const isExpanded = expanded[item.label] || !!searchQuery;
                  const isGroupActive = item.children.some(c => location.pathname.startsWith(c.path));

                  return (
                    <div key={item.label} className="mb-0.5">
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-sm transition-all duration-200 group',
                          isGroupActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                        )}
                        style={isGroupActive
                          ? { background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.12)', boxShadow: '0 0 8px rgba(0,240,255,0.04)' }
                          : { border: '1px solid transparent' }
                        }
                      >
                        <IconComp size={16} className={cn('shrink-0 transition-all duration-200', isGroupActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400')} style={isGroupActive ? { filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' } : {}} />
                        <span className="flex-1 text-left text-[13px] font-medium truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-600 shrink-0 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                          <ChevronDown size={12} />
                        </span>
                      </button>

                      {/* Children */}
                      <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isExpanded ? `${item.children.length * 32 + 10}px` : '0px', opacity: isExpanded ? 1 : 0 }}>
                        <div className="ml-5 mt-0.5 relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ background: 'linear-gradient(180deg, rgba(0,240,255,0.25), rgba(184,41,221,0.1), transparent)' }} />
                          {item.children.map(child => {
                            const isChildActive = location.pathname === child.path;
                            return (
                              <Link key={child.path} to={child.path}
                                className={cn('block px-3 py-[6px] rounded-lg text-xs transition-all duration-200 mb-0.5 ml-2', isChildActive ? 'text-cyan-300' : 'text-slate-500 hover:text-cyan-300')}
                                style={isChildActive ? { background: 'rgba(0,240,255,0.06)' } : {}}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-200" style={isChildActive ? { background: '#00f0ff', boxShadow: '0 0 5px rgba(0,240,255,0.6)' } : { background: 'rgba(100,116,139,0.35)' }} />
                                  <span className="truncate">{child.label}</span>
                                  {isChildActive && <span className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shrink-0" style={{ boxShadow: '0 0 4px rgba(0,240,255,0.6)' }} />}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // === COLLAPSED: items with children ===
                if (item.children && collapsed) {
                  return <CollapsedSubmenuTrigger key={item.label} item={item} />;
                }

                // === Single item ===
                const isActive = location.pathname === item.path;

                if (collapsed) {
                  return (
                    <div key={item.label} className="relative mb-1 flex justify-center">
                      <Link to={item.path || '#'}
                        className={cn('flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 w-full', isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5')}
                        style={isActive ? { background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)', boxShadow: '0 0 8px rgba(0,240,255,0.06)' } : { border: '1px solid transparent' }}
                        title={item.label}
                      >
                        <IconComp size={18} style={isActive ? { filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' } : {}} />
                      </Link>
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-cyan-400" style={{ boxShadow: '0 0 5px rgba(0,240,255,0.6)' }} />
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={item.label} to={item.path || '#'}
                    className={cn('flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-sm transition-all duration-200 mb-0.5 group', isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300')}
                    style={isActive ? { background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 10px rgba(0,240,255,0.08)' } : { border: '1px solid transparent' }}
                  >
                    <IconComp size={16} className={cn('shrink-0 transition-all duration-200', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400')} style={isActive ? { filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' } : {}} />
                    <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" style={{ boxShadow: '0 0 6px rgba(0,240,255,0.8)' }} />}
                  </Link>
                );
              })}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-600">
            <Search size={20} className="mb-2 opacity-50" />
            <p className="text-xs">No menu items found</p>
          </div>
        )}
      </nav>

      {/* Pro Card */}
      {!collapsed ? (
        <div className="p-3 shrink-0">
          <div className="rounded-xl p-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(184,41,221,0.08))', border: '1px solid rgba(0,240,255,0.15)' }}>
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.5), rgba(184,41,221,0.5), transparent)' }} />
            <div className="flex items-center gap-2 mb-2">
              <Diamond size={14} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' }} />
              <span className="text-sm font-semibold text-white">Unlock Pro</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">Advanced analytics, more signals, and exclusive tools.</p>
            <button className="w-full py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1 hover:brightness-110" style={{ background: 'linear-gradient(135deg, #00f0ff, #b829dd)', boxShadow: '0 0 15px rgba(0,240,255,0.3)' }}>
              Upgrade <ChevronRight size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 shrink-0 flex justify-center">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(184,41,221,0.2))', border: '1px solid rgba(0,240,255,0.3)', boxShadow: '0 0 8px rgba(0,240,255,0.15)' }}>
            <Diamond size={16} className="text-cyan-400" />
          </button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-2 border-t border-cyan-500/10 flex items-center gap-1 shrink-0">
        {!collapsed && (
          <>
            <button className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Dark mode"><Moon size={15} /></button>
            <button className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Documentation"><BookOpen size={15} /></button>
            <div className="flex-1" />
            <Link to="/settings" className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Settings"><Settings size={15} /></Link>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-1 w-full">
            <button className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Dark mode"><Moon size={15} /></button>
            <Link to="/settings" className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Settings"><Settings size={15} /></Link>
          </div>
        )}
      </div>
    </aside>
  );
}
