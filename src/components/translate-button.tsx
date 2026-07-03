'use client';

import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { siteUrl } from '@/lib/shared';
import { cn } from '@/lib/cn';

interface LangOption {
  /** Google Translate 目標語言代碼，等於 SOURCE_LANG 代表「原文，不翻譯」 */
  code: string;
  /** 顯示名稱，使用對應語言書寫 */
  label: string;
  /** flagcdn 用的 ISO 3166-1 alpha-2 國家代碼 */
  flag: string;
}

const SOURCE_LANG = 'zh-TW';

const LANGUAGES: LangOption[] = [
  { code: 'zh-TW', label: '繁體中文',          flag: 'tw' },
  { code: 'en',    label: 'English',           flag: 'us' },
  { code: 'zh-CN', label: '简体中文',           flag: 'cn' },
  { code: 'yue-hant', label: '粵語',            flag: 'hk' },
  { code: 'ja',    label: '日本語',             flag: 'jp' },
  { code: 'ko',    label: '한국어',             flag: 'kr' },
  { code: 'ru',    label: 'Русский',           flag: 'ru' },
  { code: 'de',    label: 'Deutsch',           flag: 'de' },
  { code: 'fr',    label: 'Français',          flag: 'fr' },
  { code: 'es',    label: 'Español',           flag: 'es' },
  { code: 'pt',    label: 'Português',         flag: 'br' },
  { code: 'it',    label: 'Italiano',          flag: 'it' },
  { code: 'nl',    label: 'Nederlands',        flag: 'nl' },
  { code: 'pl',    label: 'Polski',            flag: 'pl' },
  { code: 'tr',    label: 'Türkçe',            flag: 'tr' },
  { code: 'vi',    label: 'Tiếng Việt',        flag: 'vn' },
  { code: 'id',    label: 'Bahasa Indonesia',  flag: 'id' },
  { code: 'th',    label: 'ไทย',              flag: 'th' },
  { code: 'hi',    label: 'हिन्दी',              flag: 'in' },
  { code: 'ar',    label: 'العربية',           flag: 'sa' },
];

// Google Translate proxy 主機名規則：- → --，. → -
function toProxyHost(host: string): string {
  return host.replace(/-/g, '--').replace(/\./g, '-');
}

// 反向：把 proxy 主機名還原為原始主機
function fromProxyHost(proxyHost: string): string {
  const stripped = proxyHost.replace(/\.translate\.goog$/, '');
  return stripped
    .split('--')
    .map((seg) => seg.split('-').join('.'))
    .join('-');
}

function buildTargetUrl(origin: string, pathname: string, tl: string): string {
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    host = origin.replace(/^https?:\/\//, '');
  }

  // 原文 — 不走翻譯，直接回到原網站
  if (tl === SOURCE_LANG) {
    if (host.endsWith('.translate.goog')) {
      return `https://${fromProxyHost(host)}${pathname}`;
    }
    return `${origin}${pathname}`;
  }

  const params = new URLSearchParams({
    _x_tr_sl: SOURCE_LANG,
    _x_tr_tl: tl,
    _x_tr_hl: tl,
  });

  // 已在 proxy 上 → 主機保持不變，只換目標語言
  if (host.endsWith('.translate.goog')) {
    return `${origin}${pathname}?${params}`;
  }
  return `https://${toProxyHost(host)}.translate.goog${pathname}?${params}`;
}

function FlagIcon({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={20}
      height={15}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        'rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shrink-0',
        className,
      )}
    />
  );
}

function detectCurrent(): LangOption {
  if (typeof window === 'undefined') return LANGUAGES[0];
  if (window.location.hostname.endsWith('.translate.goog')) {
    const tl = new URLSearchParams(window.location.search).get('_x_tr_tl');
    return LANGUAGES.find((l) => l.code === tl) ?? LANGUAGES[0];
  }
  return LANGUAGES[0];
}

export function TranslateButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState<LangOption>(LANGUAGES[0]);
  const origin = typeof window !== 'undefined' ? window.location.origin : siteUrl;

  useEffect(() => {
    setCurrent(detectCurrent());
  }, [pathname]);

  return (
    <Popover>
      <PopoverTrigger
        aria-label="切換語言"
        className={cn(
          buttonVariants({ color: 'ghost', size: 'sm' }),
          'gap-2',
          className,
        )}
      >
        <FlagIcon code={current.flag} />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className="size-3.5 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex flex-col p-1 max-h-[24rem] overflow-y-auto w-56"
      >
        {LANGUAGES.map((lang) => {
          const isCurrent = lang.code === current.code;
          return (
            <a
              key={lang.code}
              href={buildTargetUrl(origin, pathname, lang.code)}
              rel="noreferrer noopener"
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'text-sm px-2 py-1.5 rounded-lg inline-flex items-center gap-3 hover:text-fd-accent-foreground hover:bg-fd-accent',
                isCurrent && 'bg-fd-accent text-fd-accent-foreground',
              )}
            >
              <FlagIcon code={lang.flag} />
              <span className="truncate">{lang.label}</span>
            </a>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
