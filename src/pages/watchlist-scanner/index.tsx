import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tokens } from '@/shared/data/cryptoData';
import { Badge } from '@/components/ui/badge';
import { Scan, TrendingUp, Activity, Volume2, Bell } from 'lucide-react';

const WATCHLIST_SYMBOLS = ['BTC', 'ETH', 'SOL', 'WIF', 'RENDER', 'TIA', 'FET', 'INJ'];

export default function WatchlistScannerPage() {
  const watchlistTokens = tokens.filter(t => WATCHLIST_SYMBOLS.includes(t.symbol));

  const signals = watchlistTokens.map(t => {
    const signals: { type: string; message: string; severity: 'info' | 'warning' | 'critical' }[] = [];
    if (t.oiChange24h > 10) signals.push({ type: 'OI Surge', message: `OI up ${t.oiChange24h}% in 24h`, severity: 'warning' });
    if (Math.abs(t.fundingRate) > 0.01) signals.push({ type: 'Extreme Funding', message: `Funding at ${(t.fundingRate * 100).toFixed(4)}%`, severity: 'critical' });
    if (t.rsi14 > 70) signals.push({ type: 'Overbought', message: `RSI at ${t.rsi14.toFixed(1)}`, severity: 'warning' });
    if (t.rsi14 < 30) signals.push({ type: 'Oversold', message: `RSI at ${t.rsi14.toFixed(1)}`, severity: 'info' });
    if (t.cvd24h > 100e6) signals.push({ type: 'Buying Pressure', message: `CVD +$${(t.cvd24h / 1e6).toFixed(1)}M`, severity: 'info' });
    if (t.liquidation24h > 5e6) signals.push({ type: 'High Liquidations', message: `$${(t.liquidation24h / 1e6).toFixed(1)}M liquidated`, severity: 'critical' });
    return { token: t, signals };
  });

  const totalSignals = signals.reduce((s, t) => s + t.signals.length, 0);
  const criticalSignals = signals.reduce((s, t) => s + t.signals.filter(sig => sig.severity === 'critical').length, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Scan className="w-6 h-6" /> Watchlist Scanner
        </h1>
        <p className="text-muted-foreground text-sm">Automated scanning for watchlist tokens</p>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total Signals</p>
            <p className="text-2xl font-bold neon-text-cyan">{totalSignals}</p>
          </CardContent>
        </Card>
        <Card className="card-neon border-red-500/20">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Critical</p>
            <p className="text-2xl font-bold text-red-400">{criticalSignals}</p>
          </CardContent>
        </Card>
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Monitoring</p>
            <p className="text-2xl font-bold neon-text-green">{WATCHLIST_SYMBOLS.length} tokens</p>
          </CardContent>
        </Card>
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Status</p>
            <p className="text-2xl font-bold neon-text-green flex items-center gap-2">
              <Activity className="w-4 h-4" /> Active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="stagger-children grid gap-4">
        {signals.map(({ token, signals }) => (
          <Card key={token.symbol} className="card-neon">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center font-bold text-xs">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{token.symbol}</CardTitle>
                    <p className="text-xs text-muted-foreground">${token.price.toLocaleString()}</p>
                  </div>
                </div>
                <Badge className={signals.length > 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20'}>
                  {signals.length} signals
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {signals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {signals.map((sig, i) => (
                    <Badge key={i} className={
                      sig.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      sig.severity === 'warning' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }>
                      {sig.type}: {sig.message}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No significant signals detected</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
