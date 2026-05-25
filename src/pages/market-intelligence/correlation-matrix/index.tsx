import { useState } from 'react';
import { tokens } from '@/shared/data/cryptoData';
import { Grid3X3, TrendingUp } from 'lucide-react';
import { TokenLink } from '@/components/shared';
import { SectionNav } from '@/components/shared';

const topTokens = tokens.slice(0, 10);

// Generate correlation matrix
const correlationMatrix = topTokens.map((t1, i) => {
  return topTokens.map((t2, j) => {
    if (i === j) return 1;
    // Simulate correlation based on category similarity
    let corr = 0.3 + Math.random() * 0.5;
    if (t1.category === t2.category) corr += 0.2;
    if (Math.abs(t1.change24h - t2.change24h) < 1) corr += 0.15;
    return Math.min(corr, 0.98);
  });
});

function getColor(corr: number): string {
  if (corr > 0.8) return '#00ff88';
  if (corr > 0.6) return '#00f0ff';
  if (corr > 0.4) return '#f0e800';
  if (corr > 0.2) return '#ff6b35';
  return '#ff2d95';
}

const sectionNavItems = [
  { label: 'Correlation', path: '/market-intelligence/correlation-matrix' },
  { label: 'AI Summary', path: '/market-intelligence/ai-market-summary' },
];

export default function CorrelationMatrixPage() {
  const [hoveredCell, setHoveredCell] = useState<{i: number, j: number} | null>(null);

  return (
    <div className="space-y-6">
      <SectionNav items={sectionNavItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Correlation Matrix</h1>
          <p className="text-sm text-gray-400 mt-1">24h price correlation between top tokens</p>
        </div>
      </div>

      <div className="card-neon p-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-gray-400 font-mono">LEGEND:</span>
          {[0.9, 0.7, 0.5, 0.3, 0.1].map(v => (
            <div key={v} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getColor(v) }} />
              <span className="text-[10px] text-gray-400 font-mono">{v.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1"></th>
                {topTokens.map(t => (
                  <th key={t.symbol} className="p-1 text-[10px] text-gray-400 font-mono text-center rotate-0">{t.symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topTokens.map((t1, i) => (
                <tr key={t1.symbol}>
                  <td className="p-1 text-[10px] text-gray-400 font-mono font-bold">{t1.symbol}</td>
                  {topTokens.map((t2, j) => (
                    <td
                      key={t2.symbol}
                      className="p-0.5 text-center cursor-pointer"
                      onMouseEnter={() => setHoveredCell({i, j})}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-[9px] font-mono transition-all hover:scale-110"
                        style={{ backgroundColor: `${getColor(correlationMatrix[i][j])}33`, color: getColor(correlationMatrix[i][j]), border: hoveredCell?.i === i && hoveredCell?.j === j ? `1px solid ${getColor(correlationMatrix[i][j])}` : '1px solid transparent' }}
                      >
                        {correlationMatrix[i][j].toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hoveredCell && (
          <div className="mt-4 p-3 bg-[#0a0a0a] rounded border border-[#222]">
            <p className="text-xs font-mono text-gray-400">
              <span className="text-white font-bold">{topTokens[hoveredCell.i].symbol}</span> vs <span className="text-white font-bold">{topTokens[hoveredCell.j].symbol}</span>
              <span className="ml-2" style={{ color: getColor(correlationMatrix[hoveredCell.i][hoveredCell.j]) }}>
                Correlation: {correlationMatrix[hoveredCell.i][hoveredCell.j].toFixed(3)}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-cyan mb-3">Highest Correlations</h3>
          <div className="space-y-2">
            {topTokens.slice(0, 5).map((t, i) => {
              const partner = topTokens[(i + 1) % topTokens.length];
              const corr = correlationMatrix[i][(i + 1) % topTokens.length];
              return (
                <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-[#0a0a0a] rounded">
                  <span className="font-mono text-white">{t.symbol} - {partner.symbol}</span>
                  <span className="font-mono" style={{ color: getColor(corr) }}>{corr.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card-neon p-4">
          <h3 className="text-sm font-bold neon-text-cyan mb-3">Lowest Correlations</h3>
          <div className="space-y-2">
            {topTokens.slice(0, 5).map((t, i) => {
              const partner = topTokens[(i + 5) % topTokens.length];
              const corr = correlationMatrix[i][(i + 5) % topTokens.length];
              return (
                <div key={t.symbol} className="flex items-center justify-between text-xs p-2 bg-[#0a0a0a] rounded">
                  <span className="font-mono text-white">{t.symbol} - {partner.symbol}</span>
                  <span className="font-mono" style={{ color: getColor(corr) }}>{corr.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}