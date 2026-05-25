export interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  children?: { label: string; path: string }[];
}

export const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { label: 'Market Overview', icon: 'BarChart3', path: '/market-overview' },
  {
    label: 'Aggregator',
    icon: 'Layers',
    children: [
      { label: 'Overview', path: '/aggregator/overview' },
      { label: 'OI Change', path: '/aggregator/oi-change' },
      { label: 'Funding', path: '/aggregator/funding' },
      { label: 'Liquidations', path: '/aggregator/liquidations' },
    ],
  },
  {
    label: 'Signals',
    icon: 'Signal',
    children: [
      { label: 'Signal Scanner', path: '/signals/scanner' },
      { label: 'Signal History', path: '/signals/history' },
      { label: 'Strategy Builder', path: '/signals/strategy-builder' },
    ],
  },
  { label: 'Watchlist', icon: 'Star', path: '/watchlist' },
  {
    label: 'Exchanges',
    icon: 'Building2',
    children: [
      { label: 'Binance', path: '/exchanges/binance' },
      { label: 'Bybit', path: '/exchanges/bybit' },
      { label: 'OKX', path: '/exchanges/okx' },
    ],
  },
  {
    label: 'On-Chain',
    icon: 'Link2',
    children: [
      { label: 'Whale Tracker', path: '/on-chain/whale-tracker' },
      { label: 'Gas Tracker', path: '/on-chain/gas-tracker' },
      { label: 'Token Flows', path: '/on-chain/token-flows' },
    ],
  },
  { label: 'Alerts', icon: 'Bell', path: '/alerts' },
  { label: 'Portfolio', icon: 'Wallet', path: '/portfolio' },
  { label: 'Tokens', icon: 'Hexagon', path: '/tokens' },
  { label: 'Settings', icon: 'Settings', path: '/settings' },
];
