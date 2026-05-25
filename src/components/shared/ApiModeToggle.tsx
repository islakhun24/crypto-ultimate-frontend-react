/**
 * ApiModeToggle - Switch between Dummy and Real API mode
 * Persisted to localStorage, triggers page reload on toggle
 */

import { useApiMode } from '@/shared/context/ApiModeContext';
import { Database, Wifi } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export default function ApiModeToggle() {
  const { useDummy, toggle } = useApiMode();

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all',
        'hover:scale-105 active:scale-95',
        useDummy
          ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:border-yellow-500/50'
          : 'border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-500/50'
      )}
      title={useDummy ? 'Click to switch to LIVE API' : 'Click to switch to DUMMY DATA'}
    >
      {useDummy ? (
        <>
          <Database className="w-3.5 h-3.5" />
          <span>DUMMY</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>LIVE API</span>
        </>
      )}
      {/* Toggle pill */}
      <div
        className={cn(
          'relative w-8 h-4 rounded-full transition-colors',
          useDummy ? 'bg-yellow-500/30' : 'bg-green-500/30'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 w-3 h-3 rounded-full transition-all',
            useDummy
              ? 'left-0.5 bg-yellow-400'
              : 'left-[calc(100%-14px)] bg-green-400'
          )}
        />
      </div>
    </button>
  );
}
