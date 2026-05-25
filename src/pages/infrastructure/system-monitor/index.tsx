import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, HardDrive, Wifi, Activity, Server, Clock } from 'lucide-react';

export default function SystemMonitorPage() {
  const [cpuData, setCpuData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 30 + Math.random() * 40 })));
  const [memData, setMemData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 40 + Math.random() * 30 })));
  const [wsData, setWsData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 50 + Math.random() * 100 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(prev => [...prev.slice(1), { time: Date.now(), value: 20 + Math.random() * 60 }]);
      setMemData(prev => [...prev.slice(1), { time: Date.now(), value: 35 + Math.random() * 35 }]);
      setWsData(prev => [...prev.slice(1), { time: Date.now(), value: 30 + Math.random() * 120 }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const systemStats = {
    cpu: cpuData[cpuData.length - 1].value.toFixed(1),
    memory: memData[memData.length - 1].value.toFixed(1),
    uptime: '99.97%',
    wsConnections: Math.floor(1200 + Math.random() * 300),
    apiLatency: (15 + Math.random() * 20).toFixed(0),
    activeFeeds: 24,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">System Monitor</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
      </div>

      <div className="stagger-children grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card-neon p-3 text-center"><Cpu className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><p className="text-lg font-bold text-white font-mono">{systemStats.cpu}%</p><p className="text-[10px] text-gray-400 font-mono">CPU</p></div>
        <div className="card-neon p-3 text-center"><HardDrive className="w-4 h-4 text-magenta-400 mx-auto mb-1" /><p className="text-lg font-bold text-white font-mono">{systemStats.memory}%</p><p className="text-[10px] text-gray-400 font-mono">MEMORY</p></div>
        <div className="card-neon p-3 text-center"><Activity className="w-4 h-4 text-green-400 mx-auto mb-1" /><p className="text-lg font-bold text-green-400 font-mono">{systemStats.uptime}</p><p className="text-[10px] text-gray-400 font-mono">UPTIME</p></div>
        <div className="card-neon p-3 text-center"><Wifi className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><p className="text-lg font-bold text-white font-mono">{systemStats.wsConnections}</p><p className="text-[10px] text-gray-400 font-mono">WS CONNS</p></div>
        <div className="card-neon p-3 text-center"><Server className="w-4 h-4 text-yellow-400 mx-auto mb-1" /><p className="text-lg font-bold text-white font-mono">{systemStats.apiLatency}ms</p><p className="text-[10px] text-gray-400 font-mono">API LATENCY</p></div>
        <div className="card-neon p-3 text-center"><Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><p className="text-lg font-bold text-white font-mono">{systemStats.activeFeeds}</p><p className="text-[10px] text-gray-400 font-mono">FEEDS</p></div>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-cyan mb-3">CPU Usage</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cpuData}>
              <defs><linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#555" fontSize={10} domain={[0, 100]} /><Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
              <Area type="monotone" dataKey="value" stroke="#00f0ff" fill="url(#cpuGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-magenta mb-3">Memory Usage</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={memData}>
              <defs><linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff00ff" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#555" fontSize={10} domain={[0, 100]} /><Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
              <Area type="monotone" dataKey="value" stroke="#ff00ff" fill="url(#memGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-green mb-3">WS Messages/sec</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={wsData}>
              <defs><linearGradient id="wsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} /><stop offset="95%" stopColor="#00ff88" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" /><YAxis stroke="#555" fontSize={10} /><Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
              <Area type="monotone" dataKey="value" stroke="#00ff88" fill="url(#wsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Service Status</h3>
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {['Price Feed', 'OI Feed', 'Funding Feed', 'Liquidation Feed', 'WS Gateway', 'REST API', 'Auth Service', 'Database', 'Cache', 'Queue', 'Notifier', 'Logger'].map(service => (
            <div key={service} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded border border-[#222]">
              <span className="text-xs font-mono text-white">{service}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 font-mono">HEALTHY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}