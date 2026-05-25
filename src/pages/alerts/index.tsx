import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Target, Percent } from 'lucide-react';

interface Alert {
  id: number;
  token: string;
  type: 'price' | 'change' | 'oi' | 'funding';
  condition: string;
  value: string;
  active: boolean;
}

const defaultAlerts: Alert[] = [
  { id: 1, token: 'BTC', type: 'price', condition: 'above', value: '70000', active: true },
  { id: 2, token: 'ETH', type: 'price', condition: 'below', value: '3000', active: true },
  { id: 3, token: 'SOL', type: 'change', condition: 'above', value: '10', active: true },
  { id: 4, token: 'WIF', type: 'oi', condition: 'above', value: '500000000', active: false },
  { id: 5, token: 'BTC', type: 'funding', condition: 'above', value: '0.01', active: true },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [showAdd, setShowAdd] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({ token: '', type: 'price', condition: 'above', value: '', active: true });

  const addAlert = () => {
    if (newAlert.token && newAlert.value) {
      setAlerts([...alerts, { ...newAlert, id: Date.now() } as Alert]);
      setShowAdd(false);
      setNewAlert({ token: '', type: 'price', condition: 'above', value: '', active: true });
    }
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const typeIcons = {
    price: Target,
    change: Percent,
    oi: TrendingUp,
    funding: TrendingDown,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Bell className="w-6 h-6" /> Price Alerts
          </h1>
          <p className="text-muted-foreground text-sm">Set custom alerts for price movements</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="btn-neon-cyan">
          <Plus className="w-4 h-4 mr-2" /> Add Alert
        </Button>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-neon">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Total Alerts</p>
            <p className="text-2xl font-bold neon-text-cyan">{alerts.length}</p>
          </CardContent>
        </Card>
        <Card className="card-neon border-green-500/20">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Active</p>
            <p className="text-2xl font-bold text-green-400">{alerts.filter(a => a.active).length}</p>
          </CardContent>
        </Card>
        <Card className="card-neon border-gray-500/20">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Inactive</p>
            <p className="text-2xl font-bold text-gray-400">{alerts.filter(a => !a.active).length}</p>
          </CardContent>
        </Card>
      </div>

      {showAdd && (
        <Card className="card-neon border-cyan-500/30">
          <CardHeader>
            <CardTitle className="neon-text-cyan">New Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="stagger-children grid grid-cols-4 gap-3">
              <Input placeholder="Token (e.g. BTC)" value={newAlert.token} onChange={e => setNewAlert({ ...newAlert, token: e.target.value.toUpperCase() })} className="glass" />
              <select value={newAlert.type} onChange={e => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })} className="bg-transparent border border-cyan-500/30 rounded px-3 text-sm">
                <option value="price">Price</option>
                <option value="change">Change %</option>
                <option value="oi">OI</option>
                <option value="funding">Funding</option>
              </select>
              <select value={newAlert.condition} onChange={e => setNewAlert({ ...newAlert, condition: e.target.value })} className="bg-transparent border border-cyan-500/30 rounded px-3 text-sm">
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <Input placeholder="Value" value={newAlert.value} onChange={e => setNewAlert({ ...newAlert, value: e.target.value })} className="glass" type="number" />
            </div>
            <div className="flex gap-2">
              <Button onClick={addAlert} className="btn-neon-cyan">Create Alert</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="glass">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {alerts.map(alert => {
          const Icon = typeIcons[alert.type];
          return (
            <Card key={alert.id} className={`card-neon ${!alert.active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.active ? 'bg-cyan-500/20' : 'bg-gray-500/20'}`}>
                    <Icon className={`w-5 h-5 ${alert.active ? 'text-cyan-400' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.token}</span>
                      <Badge variant="outline" className="text-xs capitalize">{alert.type}</Badge>
                      <span className="text-sm text-muted-foreground">{alert.condition}</span>
                      <span className="font-mono text-sm neon-text-cyan">{Number(alert.value).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={alert.active} onCheckedChange={() => toggleAlert(alert.id)} />
                  <Button size="sm" variant="ghost" onClick={() => deleteAlert(alert.id)} className="text-red-400 hover:text-red-300 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
