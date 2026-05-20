'use client';

import { useEffect } from 'react';

export function TranslateProxyHandler() {
  useEffect(() => {
    if (!window.location.hostname.endsWith('.translate.goog')) return;

    // 把目前 URL 上所有 _x_tr_* 參數記下來，導航時帶到下一頁
    const carryParams = () => {
      const carried = new URLSearchParams();
      const here = new URLSearchParams(window.location.search);
      here.forEach((value, key) => {
        if (key.startsWith('_x_tr_')) carried.set(key, value);
      });
      return carried;
    };

    const handler = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.defaultPrevented) return;

      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const carried = carryParams();
      carried.forEach((value, key) => {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      });

      if (url.href === window.location.href) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.assign(url.href);
    };

    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  return null;
}
