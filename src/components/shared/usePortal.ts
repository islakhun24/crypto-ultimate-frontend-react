import { useEffect, useState } from 'react';

export function usePortal() {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById('sidebar-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sidebar-portal';
      el.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:9999;pointer-events:none;';
      document.body.appendChild(el);
    }
    el.style.pointerEvents = 'auto';
    setPortalEl(el);
    return () => {
      if (el) el.style.pointerEvents = 'none';
    };
  }, []);

  return portalEl;
}
