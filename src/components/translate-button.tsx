'use client';

import { Languages } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { siteUrl } from '@/lib/shared';
import { cn } from '@/lib/cn';

// Google Translate 的 proxy 主機名規則：- → --，. → -
function toProxyHost(host: string): string {
  return host.replace(/-/g, '--').replace(/\./g, '-');
}

function buildTranslateUrl(origin: string, pathname: string): string {
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    host = origin.replace(/^https?:\/\//, '');
  }

  // 已經在 proxy 內就不要再包一層
  if (host.endsWith('.translate.goog')) return `${origin}${pathname}`;

  const proxiedHost = toProxyHost(host);
  const params = new URLSearchParams({
    _x_tr_sl: 'zh-TW',
    _x_tr_tl: 'en',
    _x_tr_hl: 'en',
  });
  return `https://${proxiedHost}.translate.goog${pathname}?${params}`;
}

export function TranslateButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const origin = typeof window !== 'undefined' ? window.location.origin : siteUrl;
  const href = buildTranslateUrl(origin, pathname);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Translate to English"
      className={cn(
        buttonVariants({ color: 'ghost', size: 'sm' }),
        'gap-2',
        className,
      )}
    >
      <Languages className="size-4 text-fd-muted-foreground" />
      English
    </a>
  );
}
