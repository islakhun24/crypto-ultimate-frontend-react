import { Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TickerBar from './TickerBar';
import FooterBar from './FooterBar';
import CommandPalette from './CommandPalette';

export default function AppLayout() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 64 : 260;

  // Keyboard shortcut: Ctrl+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCloseCommand = useCallback(() => {
    setCommandOpen(false);
  }, []);

  return (
    <div
      className="flex min-h-screen relative"
      style={{ background: '#050508' }}
    >
      {/* Animated background grid - full viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none grid-bg" />

      {/* Radial glow effects */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(0,240,255,0.03) 0%, transparent 70%)',
        }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(184,41,221,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Ticker Bar (top) - Bloomberg style, z-index 35 so sidebar (50) covers it */}
      <TickerBar />

      {/* Sidebar - z-index 50, starts below ticker (top: 30px) */}
      {/* No width set here - let Sidebar control its own width */}
      {/* No overflow hidden - tooltips must not be clipped */}
      <div
        className="fixed left-0 z-[50]"
        style={{
          top: 30,
          height: 'calc(100vh - 30px - 26px)',
        }}
      >
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Main content - expands when sidebar collapses */}
      <main
        className="flex-1 relative z-10 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarWidth,
          marginTop: 30,
          marginBottom: 26,
          minWidth: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <Header onOpenCommandPalette={() => setCommandOpen(true)} />
        {/* Content area - allow horizontal scroll */}
        <div className="p-4 overflow-x-auto" style={{ minWidth: 0 }}>
          <Outlet />
        </div>
      </main>

      {/* Footer Bar - Bloomberg style */}
      <FooterBar />

      {/* Command Palette (Ctrl+K) - highest z-index */}
      <CommandPalette open={commandOpen} onClose={handleCloseCommand} />
    </div>
  );
}
