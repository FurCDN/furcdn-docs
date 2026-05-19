// 一次性遷移腳本:把 _docs_backup 的 8 個 md 轉成 Fumadocs 文檔
// 用法: node scripts/migrate-docs.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(import.meta.dirname, '..', '..', '_docs_backup');
const OUT = join(import.meta.dirname, '..', 'content', 'docs');

// 文檔順序(meta.json) + 友善的側欄顯示名
const ORDER = [
  ['cdn', 'CDN 加速指南'],
  ['manual', '完整使用手冊'],
  ['account', '帳號安全'],
  ['cache', '快取指南'],
  ['waf', 'WAF 規則手冊'],
  ['billing', '計費與套餐'],
  ['api', '開放 API'],
  ['troubleshooting', '常見問題排查'],
];

// 從正文抽一段純文字當 description
function extractDescription(body) {
  for (const raw of body.split('\n')) {
    let line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;       // 跳過標題
    if (line.startsWith('---')) continue;     // 跳過分隔線
    if (line.startsWith('|')) continue;       // 跳過表格
    line = line.replace(/^>\s*/, '');         // 去引用前綴
    line = line.replace(/^[-*]\s+/, '');      // 去列表前綴
    line = line.replace(/[*_`]/g, '');        // 去強調 / code 標記
    line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // 連結 -> 純文字
    line = line.replace(/[⚠️✅❌🔒]/gu, '').trim();
    if (line.length < 8) continue;
    return line.length > 110 ? line.slice(0, 110) + '…' : line;
  }
  return '';
}

// YAML 字串轉義
const yaml = (s) => `"${s.replace(/"/g, '\\"')}"`;

for (const [slug] of ORDER) {
  let text = readFileSync(join(SRC, `${slug}.md`), 'utf8').replace(/\r\n/g, '\n');

  // 1. 抽第一個 H1 當 title,並從正文移除
  const lines = text.split('\n');
  let title = slug;
  const idx = lines.findIndex((l) => /^#\s+/.test(l));
  if (idx !== -1) {
    title = lines[idx].replace(/^#\s+/, '').trim();
    lines.splice(idx, 1);
    if (lines[idx] === '') lines.splice(idx, 1); // 順手去掉標題下的空行
  }
  let body = lines.join('\n');

  // 2. 改寫內部連結: /dashboard/docs?doc=NAME[#anchor] -> /docs/NAME[#anchor]
  body = body.replace(/\/dashboard\/docs\?doc=([a-z]+)/g, '/docs/$1');

  const description = extractDescription(body);

  // 3. 組 frontmatter
  const fm = ['---', `title: ${yaml(title)}`];
  if (description) fm.push(`description: ${yaml(description)}`);
  fm.push('---', '');

  writeFileSync(join(OUT, `${slug}.md`), fm.join('\n') + body.trimStart() + '\n');
  console.log(`✓ ${slug}.md  ←  title: ${title}`);
}

// 4. 寫 meta.json 控制側欄順序
writeFileSync(
  join(OUT, 'meta.json'),
  JSON.stringify(
    { title: 'FurCDN 文檔', pages: ['index', ...ORDER.map(([s]) => s)] },
    null,
    2,
  ) + '\n',
);
console.log('✓ meta.json');

// 5. 清掉腳手架自帶的 test.mdx
for (const f of readdirSync(OUT)) {
  if (f === 'test.mdx') console.log('· 請手動刪除 test.mdx(腳手架範例)');
}
