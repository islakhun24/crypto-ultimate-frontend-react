import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChartIcon, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const holdings = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 1.25, avgBuy: 58200, currentPrice: 67341.80, value: 84177.25 },
  { symbol: 'ETH', name: 'Ethereum', amount: 12.5, avgBuy: 2850, currentPrice: 3642.57, value: 45532.12 },
  { symbol: 'SOL', name: 'Solana', amount: 250, avgBuy: 98.50, currentPrice: 168.13, value: 42032.50 },
  { symbol: 'LINK', name: 'Chainlink', amount: 1500, avgBuy: 11.20, currentPrice: 14.82, value: 22230.00 },
  { symbol: 'INJ', name: 'Injective', amount: 800, avgBuy: 18.40, currentPrice: 25.84, value: 20672.00 },
];

const totalValue = holdings.reduce((s, h) => s + h.value, 0);
const totalCost = holdings.reduce((s, h) => s + h.amount * h.avgBuy, 0);
const totalPnL = ((totalValue - totalCost) / totalCost * 100).toFixed(2);

const pnlData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: totalValue * (0.9 + Math.sin(i * 0.2) * 0.1 + i * 0.005),
}));

const COLORS = ['#00f0ff', '#ff00ff', '#b829dd', '#00ff88', '#ff6b35'];

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState('1M');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Wallet className="w-6 h-6" /> Portfolio
          </h1>
          <p className="text-muted-foreground text-sm">Track your crypto portfolio performance</p>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total Value</p>
            <p className="text-2xl font-bold neon-text-cyan">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total Invested</p>
            <p className="text-xl font-bold">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total P&L</p>
            <p className={`text-xl font-bold ${Number(totalPnL) > 0 ? 'neon-text-green' : 'neon-text-magenta'}`}>
              {Number(totalPnL) > 0 ? '+' : ''}{totalPnL}%
            </p>
          </CardContent>
        </Card>
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Holdings</p>
            <p className="text-2xl font-bold neon-text-purple">{holdings.length} assets</p>
          </CardContent>
        </Card>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-neon lg:col-span-2">
          <CardHeader>
            <CardTitle className="neon-text-cyan">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(0,240,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(0,240,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'rgba(10,10,35,0.95)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 8 }} />
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#00f0ff" fill="url(#portGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="neon-text-magenta">Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={holdings} dataKey="value" nameKey="symbol" cx="50%" cy="50%" outerRadius={80} label>
                  {holdings.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10,10,35,0.95)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {holdings.map((h, i) => (
                <div key={h.symbol} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span>{h.symbol}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold neon-text-cyan">Holdings</h2>
        {holdings.map(h => {
          const pnl = ((h.currentPrice - h.avgBuy) / h.avgBuy * 100).toFixed(2);
          return (
            <Card key={h.symbol} className="card-neon">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center font-bold text-sm">
                    {h.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold">{h.symbol}</p>
                    <p className="text-xs text-muted-foreground">{h.amount} {h.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-mono font-semibold">${h.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-mono text-sm">${h.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Avg Buy</p>
                    <p className="font-mono text-sm">${h.avgBuy.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={`font-mono text-sm ${Number(pnl) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Number(pnl) > 0 ? '+' : ''}{pnl}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
