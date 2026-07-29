import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const required = [
  'dist/index.html',
  'dist/favicon.svg',
  'dist/demos/sanyu/index.html',
];

const mediaNames = [
  'sanyu-cover',
  'sanyu-homepage',
  'sanyu-mobile',
  'sanyu-finder',
  'sanyu-markets',
  'mailbox-inbox',
  'mailbox-sent',
  'mailbox-profile',
  'mailbox-compose',
  'interior-01',
  'interior-02',
  'interior-03',
  'interior-04',
  'interior-05',
];

required.push(
  ...mediaNames.flatMap((name) =>
    ['thumb', 'full'].flatMap((size) =>
      ['webp', 'avif'].map((format) => `dist/assets/cases/${name}-${size}.${format}`),
    ),
  ),
);

await Promise.all(required.map((path) => access(path)));

const collect = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else files.push(path);
  }
  return files;
};

const files = await collect('dist');
const textFiles = files.filter((file) => /\.(html|css|js|json|txt|svg)$/i.test(file));
const text = (await Promise.all(textFiles.map((file) => readFile(file, 'utf8')))).join('\n');

for (const expected of ['秋野', 'wxid_5cezqqgmgvi122', 'AI 产品创作者']) {
  if (!text.includes(expected)) throw new Error(`Build is missing required content: ${expected}`);
}

if (text.includes('18568230411')) {
  throw new Error('Build contains the original private phone number.');
}

console.log(`Verified ${files.length} build files.`);
