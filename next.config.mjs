import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    // 鎖定本項目為 workspace 根,消除上層 lockfile 造成的推斷警告
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
};

export default withMDX(config);
