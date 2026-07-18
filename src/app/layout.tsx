import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { appName, siteUrl } from '@/lib/shared';
import { TranslateProxyHandler } from '@/components/translate-proxy-handler';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// 繁體中文字體。CJK 字體體積大,關閉 preload 改由 unicode-range 按需載入
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-tc',
  preload: false,
});

const ogImage = 'https://oss.furcdn.us/og.png';
const ogDescription =
  'CN2 GIA · CUG · CMIN2 · Voxility · GSL — Global Edge, Optimized for CN';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — FurCDN 多節點 CDN 加速平台`,
    template: `%s | ${appName}`,
  },
  description:
    'FurCDN 多節點 CDN 加速平台的官方文檔 —— 涵蓋域名接入、快取、WAF、計費與開放 API。',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: 'https://oss.furcdn.us/furcdn_favicon.svg',
    shortcut: 'https://oss.furcdn.us/furcdn_favicon.svg',
    apple: 'https://oss.furcdn.us/furcdn_favicon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'FurCDN',
    description: ogDescription,
    url: 'https://www.furcdn.us',
    siteName: 'FurCDN',
    locale: 'zh_TW',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'FurCDN — Content Delivery Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FurCDN',
    description: ogDescription,
    images: [ogImage],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: appName,
  alternateName: 'FurCDN Docs',
  url: siteUrl,
  description:
    'FurCDN 多節點 CDN 加速平台的官方文檔 —— 涵蓋域名接入、快取、WAF、計費與開放 API。',
  inLanguage: 'zh-Hant',
  publisher: {
    '@type': 'Organization',
    name: 'Taipei101 Network',
    url: 'https://www.furcdn.us',
    logo: 'https://oss.furcdn.us/furcdn_favicon.svg',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="zh-TW"
      className={`${inter.variable} ${notoSansTC.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <TranslateProxyHandler />
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
