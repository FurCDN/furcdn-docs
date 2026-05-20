'use client';

import { Languages } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { siteUrl } from '@/lib/shared';
import { cn } from '@/lib/cn';

export function TranslateButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const origin = typeof window !== 'undefined' ? window.location.origin : siteUrl;
  const target = `${origin}${pathname}`;
  const href = `https://translate.google.com/translate?sl=zh-TW&tl=en&u=${encodeURIComponent(target)}`;

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
