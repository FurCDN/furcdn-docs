import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { pinyin } from 'pinyin-pro';

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// 把標題文字正規化成乾淨的 ASCII 錨點:小寫、非字母數字轉連字號
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 中文標題自動轉無聲調拼音當錨點;同一份文件內的重複錨點補上 -1、-2…
// 仍可在標題後用 `## 標題 [#custom-id]` 手動覆寫
const seenSlugs = new WeakMap<object, Map<string, number>>();

function pinyinSlug(root: object, text: string): string {
  let counts = seenSlugs.get(root);
  if (!counts) {
    counts = new Map();
    seenSlugs.set(root, counts);
  }

  const romanized = pinyin(text, {
    toneType: 'none',
    nonZh: 'consecutive',
    v: true, // ü → v(如「率」lǜ → lv),避免被正規化丟棄
  });
  const base = normalizeSlug(romanized) || 'section';

  const n = counts.get(base) ?? 0;
  counts.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}

export default defineConfig({
  mdxOptions: {
    remarkHeadingOptions: {
      slug: (root, _heading, text) => pinyinSlug(root, text),
    },
  },
});
