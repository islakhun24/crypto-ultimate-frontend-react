import { useState } from 'react';
import { exchanges, tokens } from '@/shared/data/cryptoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const COLORS = ['#00ff88', '#f0e800', '#ff6b35', '#ff2d95'];

const qualityData = exchanges.map(ex => ({
  name: ex.name,
  uptime: ex.uptime,
  latency: ex.avgLatency,
  status: ex.status,
  dataQuality: ex.status === 'Operational' ? 95 + Math.random() * 5 : ex.status === 'Degraded' ? 80 + Math.random() * 10 : 60 + Math.random() * 15,
  missingData: ex.status === 'Operational' ? Math.random() * 0.5 : Math.random() * 3,
  staleData: ex.status === 'Operational' ? Math.random() * 0.2 : Math.random() * 2,
}));

const sectionNavItems = [
  { label: 'Data Quality', path: '/data/data-quality' },
  { label: 'Symbol Mapping', path: '/data/exchange-symbol-mapping' },
];

export default function DataQualityPage() {
  const [filter, setFilter] = useState<'all' | 'issues'>('all');

  const filtered = filter === 'all' ? qualityData : qualityData.filter(d => d.status !== 'Operational' || d.dataQuality < 95);
  const totalUptime = qualityData.reduce((s, d) => s + d.uptime, 0) / qualityData.length;
  const issues = qualityData.filter(d => d.status !== 'Operational').length;
  const avgLatency = qualityData.reduce((s, d) => s + d.latency, 0) / qualityData.length;

  const statusDist = [
    { name: 'Operational', value: qualityData.filter(d => d.status === 'Operational').length },
    { name: 'Degraded', value: qualityData.filter(d => d.status === 'Degraded').length },
    { name: 'Maintenance', value: qualityData.filter(d => d.status === 'Maintenance').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Data Quality Monitor</h1>
          <p className="text-sm text-gray-400 mt-1">Exchange data quality and health metrics</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'issues'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-mono rounded border ${filter === f ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-[#222] text-gray-400'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">AVG UPTIME</span></div><p className="text-xl font-bold text-green-400 font-mono">{totalUptime.toFixed(2)}%</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-magenta-400" /><span className="text-xs text-gray-400 font-mono">ISSUES</span></div><p className="text-xl font-bold text-magenta-400 font-mono">{issues}</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-cyan-400" /><span className="text-xs text-gray-400 font-mono">AVG LATENCY</span></div><p className="text-xl font-bold text-white font-mono">{avgLatency.toFixed(0)}ms</p></div>
        <div className="card-neon p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400 font-mono">HEALTHY</span></div><p className="text-xl font-bold text-green-400 font-mono">{qualityData.length - issues}/{qualityData.length}</p></div>
      </div>

      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Data Quality Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#555" fontSize={11} />
              <YAxis stroke="#555" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="dataQuality" radius={[4, 4, 0, 0]}>
                {filtered.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.dataQuality > 95 ? '#00ff88' : entry.dataQuality > 85 ? '#f0e800' : '#ff2d95'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-lg font-bold neon-text-cyan mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label>
                {statusDist.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: 8}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-neon p-4">
        <h3 className="text-lg font-bold neon-text-cyan mb-4">Exchange Health Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-2 text-gray-400 font-mono">EXCHANGE</th>
                <th className="text-right p-2 text-gray-400 font-mono">UPTIME</th>
                <th className="text-right p-2 text-gray-400 font-mono">LATENCY</th>
                <th className="text-right p-2 text-gray-400 font-mono">QUALITY</th>
                <th className="text-right p-2 text-gray-400 font-mono">MISSING</th>
                <th className="text-right p-2 text-gray-400 font-mono">STALE</th>
                <th className="text-left p-2 text-gray-400 font-mono">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.name} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                  <td className="p-2 font-mono font-bold text-white">{d.name}</td>
                  <td className="p-2 text-right font-mono text-green-400">{d.uptime.toFixed(2)}%</td>
                  <td className={`p-2 text-right font-mono ${d.latency > 100 ? 'text-red-400' : d.latency > 50 ? 'text-yellow-400' : 'text-green-400'}`}>{d.latency}ms</td>
                  <td className="p-2 text-right font-mono" style={{color: d.dataQuality > 95 ? '#00ff88' : d.dataQuality > 85 ? '#f0e800' : '#ff2d95'}}>{d.dataQuality.toFixed(1)}%</td>
                  <td className="p-2 text-right font-mono text-gray-300">{d.missingData.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono text-gray-300">{d.staleData.toFixed(2)}%</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-mono ${d.status === 'Operational' ? 'bg-green-500/20 text-green-400' : d.status === 'Degraded' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{d.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}