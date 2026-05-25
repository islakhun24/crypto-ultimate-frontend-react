import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { tokens } from '@/shared/data/cryptoData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, TrendingUp, TrendingDown, Bell, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_WATCHLIST = ['BTC', 'ETH', 'SOL', 'WIF', 'RENDER', 'TIA', 'FET', 'INJ'];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [search, setSearch] = useState('');
  const [alerts, setAlerts] = useState<Record<string, { price?: number; change?: number }>>({});

  const watchlistTokens = tokens.filter(t => watchlist.includes(t.symbol));
  const searchTokens = tokens.filter(t =>
    !watchlist.includes(t.symbol) &&
    (t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const addToWatchlist = (symbol: string) => {
    setWatchlist([...watchlist, symbol]);
    setSearch('');
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" /> My Watchlist
          </h1>
          <p className="text-muted-foreground text-sm">Track your favorite tokens</p>
        </div>
        <Badge className="glass neon-text-cyan">{watchlist.length} tokens</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Add token to watchlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 glass"
        />
        {search && (
          <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg overflow-hidden z-50">
            {searchTokens.slice(0, 5).map(t => (
              <button key={t.symbol} onClick={() => addToWatchlist(t.symbol)}
                className="w-full px-4 py-3 flex items-center justify-between table-row-animate text-left">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">{t.symbol}</span>
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">${t.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="stagger-children grid gap-3">
        {watchlistTokens.map(token => (
          <Card key={token.symbol} className="card-neon group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Link to={`/token/${token.symbol}`} className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center font-bold text-sm">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-mono font-semibold">${token.price.toLocaleString()}</p>
                    <p className={`text-xs font-mono ${token.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h > 0 ? '+' : ''}{token.change24h}%
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground">OI</p>
                    <p className="font-mono text-sm">${(token.oi / 1e9).toFixed(2)}B</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground">L/S</p>
                    <p className="font-mono text-sm">{token.longShortRatio.toFixed(2)}x</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFromWatchlist(token.symbol)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
