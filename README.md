# FurCDN 文檔

[FurCDN](https://www.furcdn.us) 官方文檔站原始碼 —— 部署在 [docs.furcdn.us](https://docs.furcdn.us)。

以 [Next.js 16](https://nextjs.org) + [fumadocs](https://fumadocs.dev) 建構，內容以繁體中文撰寫，內建一鍵翻譯成英文。

## 本地開發

```bash
pnpm install
pnpm dev
```

開啟 http://localhost:3000 即可預覽。

其他指令：

```bash
pnpm build         # 正式建置
pnpm types:check   # 型別檢查 (fumadocs-mdx + next typegen + tsc)
pnpm lint
```

## 專案結構

```
content/docs/              # 文檔內容 (.mdx)
src/
├── app/
│   ├── (docs)/            # 文檔路由 (網站根目錄)
│   ├── api/search/        # 搜尋 API
│   ├── llms.mdx/          # llms.txt 端點 (供 AI 抓取)
│   ├── og/                # OG 圖動態生成
│   └── layout.tsx
├── components/
│   ├── translate-button.tsx         # 導覽列「English」按鈕
│   ├── translate-proxy-handler.tsx  # Google Translate proxy 內的點擊修正
│   ├── view-options.tsx             # 自製 Open 下拉 (移除 GitHub/Scira AI)
│   ├── footer.tsx
│   └── mdx.tsx
└── lib/
    ├── source.ts          # fumadocs content source adapter
    ├── layout.shared.tsx  # 共用 layout 設定 (navbar、links)
    └── shared.ts          # 站點常數 (網址、appName)
```

## 特色

- 繁體中文內容、`<html lang="zh-TW">`，瀏覽器會主動提示翻譯
- 導覽列 **English** 按鈕：透過 Google Translate 翻譯目前頁面（含 `*.translate.goog` 內 SPA 路由修正）
- TOC 採用 fumadocs `clerk` 樣式（彎曲滑動軌道）
- `llms.mdx` / `llms.txt` 端點，方便 AI 抓取文檔
- 自動生成 OG 圖 / Sitemap / robots
- Vercel Analytics

## 撰寫文檔

於 `content/docs/` 新增 `.mdx`，frontmatter 與排序由 `meta.json` 控制。詳見：

- [fumadocs MDX](https://fumadocs.dev/docs/mdx)
- [fumadocs UI](https://fumadocs.dev/docs/ui)

## 部署

Push 至 `main` 後由 Vercel 自動部署。

## License

文檔內容遵循 FurCDN 服務條款；網站程式碼 MIT。
