import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Settings, Bell, Eye, Moon, Globe, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState([5]);
  const [compactView, setCompactView] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Settings className="w-6 h-6" /> Settings
        </h1>
        <p className="text-muted-foreground text-sm">Configure your dashboard preferences</p>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="neon-text-cyan">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Use dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-xs text-muted-foreground">Reduce padding and font sizes</p>
                </div>
              </div>
              <Switch checked={compactView} onCheckedChange={setCompactView} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="neon-text-magenta">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-magenta-400" style={{ color: '#ff00ff' }} />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive browser notifications</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="font-medium">Sound Alerts</p>
                  <p className="text-xs text-muted-foreground">Play sound on alerts</p>
                </div>
              </div>
              <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="neon-text-green">Data Refresh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium">Auto Refresh</p>
                  <p className="text-xs text-muted-foreground">Automatically refresh data</p>
                </div>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            {autoRefresh && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-muted-foreground">Refresh Interval</label>
                  <span className="text-sm font-bold neon-text-cyan">{refreshRate[0]}s</span>
                </div>
                <Slider value={refreshRate} onValueChange={setRefreshRate} max={60} step={1} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="neon-text-purple">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium">API Key</p>
                  <p className="text-xs text-muted-foreground">Configure exchange API keys</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="glass">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium">Region</p>
                  <p className="text-xs text-muted-foreground">Set your region</p>
                </div>
              </div>
              <select className="bg-transparent border border-purple-500/30 rounded px-3 py-1 text-sm">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>CET</option>
                <option>JST</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
