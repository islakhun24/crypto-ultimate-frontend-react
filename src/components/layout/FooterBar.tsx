import { useState, useEffect } from 'react';
import {
  Wifi, WifiOff, Activity, Clock, Keyboard, Zap,
  Globe, Server, Database, Cpu, Radio
} from 'lucide-react';

export default function FooterBar() {
  const [time, setTime] = useState(new Date());
  const [wsStatus, setWsStatus] = useState<'connected' | 'degraded' | 'disconnected'>('connected');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const connections = [
    { name: 'BNB', status: true, color: '#F3BA2F' },
    { name: 'By', status: true, color: '#00F0FF' },
    { name: 'OK', status: true, color: '#8247E5' },
    { name: 'BG', status: true, color: '#FF6B35' },
    { name: 'MX', status: true, color: '#00FF88' },
    { name: 'KC', status: true, color: '#FF2D95' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[45] flex items-center px-2"
      style={{
        height: 26,
        background: 'linear-gradient(0deg, #020205 0%, #0a0a18 100%)',
        borderTop: '1px solid rgba(0,240,255,0.08)',
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace",
        fontSize: 10,
      }}
    >
      {/* Left: System info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {wsStatus === 'connected' ? (
            <Wifi size={10} className="text-green-400" />
          ) : (
            <WifiOff size={10} className="text-red-400" />
          )}
          <span className={wsStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>
            WS:{wsStatus === 'connected' ? 'OK' : 'OFF'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Radio size={10} className="text-cyan-400" />
          <span>6 EXCH</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Cpu size={10} className="text-purple-400" />
          <span>23ms</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Database size={10} />
          <span>DB:OK</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Activity size={10} className="text-cyan-400" />
          <span>SCAN:ON</span>
        </div>

        {/* Exchange connections */}
        <div className="flex items-center gap-1 ml-2">
          {connections.map(c => (
            <span
              key={c.name}
              className="px-1 rounded-sm text-[9px] font-bold"
              style={{
                background: c.status ? `${c.color}20` : '#ff000020',
                color: c.status ? c.color : '#ff2d5f',
                border: `1px solid ${c.status ? `${c.color}40` : '#ff000030'}`,
              }}
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Keyboard hints */}
      <div className="flex items-center gap-3 text-slate-500">
        <div className="flex items-center gap-1">
          <Keyboard size={10} />
          <span><kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-400">Ctrl+K</kbd> CMD</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe size={10} />
          <span>25 TKNS</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={10} className="text-yellow-400" />
          <span>v2.4.1</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400">
          <Clock size={10} />
          <span>{time.toLocaleTimeString('en-US', { hour12: false })} UTC</span>
        </div>
      </div>
    </div>
  );
}
