import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';
import { TranslateButton } from '@/components/translate-button';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        type: 'custom',
        children: <TranslateButton />,
        secondary: true,
      },
    ],
    // 有 GitHub 倉庫時填 gitConfig 並取消下行註解
    // githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
