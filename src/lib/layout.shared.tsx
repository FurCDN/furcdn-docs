import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    // 有 GitHub 倉庫時填 gitConfig 並取消下行註解
    // githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
