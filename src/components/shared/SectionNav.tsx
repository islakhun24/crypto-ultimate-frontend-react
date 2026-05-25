import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  label: string;
  path: string;
}

interface SectionNavProps {
  items: NavItem[];
  title?: string;
}

export default function SectionNav({ items, title }: SectionNavProps) {
  const location = useLocation();

  return (
    <div className="mb-4">
      {title && (
        <h3 className="text-[10px] font-bold text-slate-600 font-mono uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.06)' }}>
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-all duration-200',
                isActive
                  ? 'text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              )}
              style={isActive
                ? {
                    background: 'rgba(0,240,255,0.08)',
                    border: '1px solid rgba(0,240,255,0.15)',
                    boxShadow: '0 0 8px rgba(0,240,255,0.06)',
                  }
                : { border: '1px solid transparent' }
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
