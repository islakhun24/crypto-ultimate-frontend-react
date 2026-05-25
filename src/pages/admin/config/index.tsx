import { useState } from 'react';
import { Save, RefreshCw, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfigItem {
  id: string;
  name: string;
  description: string;
  value: boolean | string | number;
  type: 'boolean' | 'string' | 'number';
  category: string;
}

export default function AdminConfigPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([
    { id: '1', name: 'Enable Real-Time Feed', description: 'Enable WebSocket real-time data feeds', value: true, type: 'boolean', category: 'Data' },
    { id: '2', name: 'Signal Notifications', description: 'Send push notifications for new signals', value: true, type: 'boolean', category: 'Notifications' },
    { id: '3', name: 'Auto-Refresh Interval', description: 'Dashboard auto-refresh interval in seconds', value: 5, type: 'number', category: 'UI' },
    { id: '4', name: 'Alert Threshold', description: 'Minimum signal score to trigger alerts', value: 70, type: 'number', category: 'Signals' },
    { id: '5', name: 'Max Tokens Displayed', description: 'Maximum number of tokens in tables', value: 100, type: 'number', category: 'UI' },
    { id: '6', name: 'Dark Mode', description: 'Enable dark mode theme', value: true, type: 'boolean', category: 'UI' },
    { id: '7', name: 'Funding Alert Threshold', description: 'Funding rate threshold for alerts', value: 0.01, type: 'number', category: 'Alerts' },
    { id: '8', name: 'Whale Min Amount', description: 'Minimum transaction amount for whale alerts', value: 1000000, type: 'number', category: 'Alerts' },
    { id: '9', name: 'Enable Backtesting', description: 'Enable strategy backtesting features', value: false, type: 'boolean', category: 'Features' },
    { id: '10', name: 'API Endpoint', description: 'Primary API endpoint URL', value: 'wss://api.crypto-ultimate.pro', type: 'string', category: 'API' },
  ]);
  const [saved, setSaved] = useState(false);

  const updateConfig = (id: string, value: boolean | string | number) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, value } : c));
    setSaved(false);
  };

  const saveConfigs = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = [...new Set(configs.map(c => c.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Admin Configuration</h1>
          <p className="text-sm text-gray-400 mt-1">System settings and configuration</p>
        </div>
        <button onClick={saveConfigs} className={`flex items-center gap-2 px-4 py-2 rounded border text-xs font-mono transition-colors ${saved ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30'}`}>
          {saved ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />} {saved ? 'SAVED' : 'SAVE'}
        </button>
      </div>

      {categories.map(cat => (
        <div key={cat} className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-cyan mb-3 font-mono">{cat.toUpperCase()}</h3>
          <div className="space-y-3">
            {configs.filter(c => c.category === cat).map(config => (
              <div key={config.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded border border-[#222]">
                <div>
                  <p className="text-xs font-mono font-bold text-white">{config.name}</p>
                  <p className="text-[10px] text-gray-500">{config.description}</p>
                </div>
                <div>
                  {config.type === 'boolean' && (
                    <button onClick={() => updateConfig(config.id, !config.value)} className="transition-colors">
                      {config.value ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-gray-600" />}
                    </button>
                  )}
                  {config.type === 'number' && (
                    <input
                      type="number"
                      value={config.value as number}
                      onChange={e => updateConfig(config.id, Number(e.target.value))}
                      className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-2 py-1 font-mono w-24 text-right focus:border-cyan-500 outline-none"
                    />
                  )}
                  {config.type === 'string' && (
                    <input
                      type="text"
                      value={config.value as string}
                      onChange={e => updateConfig(config.id, e.target.value)}
                      className="bg-[#0a0a0a] border border-[#222] text-white text-xs rounded px-2 py-1 font-mono w-48 text-right focus:border-cyan-500 outline-none"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card-neon p-4 border-red-500/20">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-400" /><h3 className="text-sm font-bold text-red-400 font-mono">DANGER ZONE</h3></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-red-500/5 rounded border border-red-500/10">
            <div><p className="text-xs font-mono text-white">Reset All Settings</p><p className="text-[10px] text-gray-500">Restore default configuration</p></div>
            <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded border border-red-500/30 text-xs font-mono table-row-animate">RESET</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-500/5 rounded border border-red-500/10">
            <div><p className="text-xs font-mono text-white">Clear Cache</p><p className="text-[10px] text-gray-500">Clear all cached data</p></div>
            <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded border border-red-500/30 text-xs font-mono table-row-animate">CLEAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}