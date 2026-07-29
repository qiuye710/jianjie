import { access, copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const casesDir = join(repoRoot, 'public', 'assets', 'cases');
const demoDir = join(repoRoot, 'public', 'demos', 'sanyu');
const sanyuSource = resolve(
  process.env.QIUYE_SANYU_SOURCE ?? join(repoRoot, '..', '..', '\u8003\u9898'),
);
const tempDir = process.env.QIUYE_SOURCE_TEMP ?? join(process.env.LOCALAPPDATA ?? '', 'Temp');

const sources = {
  mailboxInbox: join(tempDir, 'codex-clipboard-0b00805f-481b-4b4e-abcc-ce0f119fe2a7.jpg'),
  mailboxSent: join(tempDir, 'codex-clipboard-73372cb2-151d-45c0-bf65-9ef96eea9fcb.jpg'),
  mailboxProfile: join(tempDir, 'codex-clipboard-1c7d0e00-d0ee-42fd-a8a2-5bb867f4af6f.jpg'),
  interior05: join(tempDir, 'codex-clipboard-d8b9c903-5cdf-46dd-934c-81dfaf58b805.jpg'),
  interior04: join(tempDir, 'codex-clipboard-660bd325-79bd-4a3a-8efb-68839d75fd3c.jpg'),
  interior02: join(tempDir, 'codex-clipboard-bb4172c6-f924-4506-b494-d0f557208bdf.jpg'),
  interior01: join(tempDir, 'codex-clipboard-c4c06fbf-0d9e-40ed-bd70-fb7816877d50.jpg'),
  mailboxCompose: join(tempDir, 'codex-clipboard-8eba48eb-c855-4c5d-a102-0c537af83f42.jpg'),
  interior03: join(tempDir, 'codex-clipboard-b961621c-04dc-4958-af83-25624474dfdc.jpg'),
  sanyuDesktop: join(sanyuSource, 'qa-desktop.png'),
  sanyuMobile: join(sanyuSource, 'qa-mobile.png'),
  sanyuFinder: join(sanyuSource, 'audit', 'step-2-finder-result.png'),
  marketZh: join(sanyuSource, 'audit', 'step-3-market-zh.png'),
  marketKo: join(sanyuSource, 'audit', 'step-3-market-ko.png'),
  marketJa: join(sanyuSource, 'audit', 'step-3-market-ja.png'),
};

const assertWithin = (parent, child) => {
  const candidate = relative(parent, child);
  if (!candidate || candidate.startsWith('..') || resolve(parent, candidate) !== resolve(child)) {
    throw new Error(`Refusing to replace unexpected path: ${child}`);
  }
};

const verifySources = async () => {
  await Promise.all(Object.values(sources).map((path) => access(path)));
  await Promise.all(
    ['index.html', 'app.js', 'styles.css'].map((name) => access(join(sanyuSource, name))),
  );
  await access(join(sanyuSource, 'assets', 'images'));
};

const toExactPng = async (path, width, height, position = 'centre') =>
  sharp(path)
    .rotate()
    .resize(width, height, { fit: 'cover', position })
    .png({ compressionLevel: 9 })
    .toBuffer();

const redactInterior05 = async () => {
  const overlay = Buffer.from(`
    <svg width="760" height="235" viewBox="0 0 760 235" xmlns="http://www.w3.org/2000/svg">
      <rect width="760" height="235" fill="#0c0b0a"/>
      <line x1="28" y1="30" x2="732" y2="30" stroke="#9f7a39" stroke-width="2"/>
      <text x="380" y="129" text-anchor="middle" dominant-baseline="middle"
        font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="42"
        font-weight="600" fill="#f1e5d1">\u8054\u7cfb\u65b9\u5f0f\u5df2\u9690\u53bb</text>
      <line x1="28" y1="205" x2="732" y2="205" stroke="#9f7a39" stroke-width="2"/>
    </svg>
  `);

  return sharp(sources.interior05)
    .rotate()
    .composite([{ input: overlay, left: 610, top: 1370 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const composeMarkets = async () => {
  const marketPaths = [sources.marketZh, sources.marketKo, sources.marketJa];
  const tiles = await Promise.all(
    marketPaths.map((path) =>
      sharp(path)
        .resize(760, 720, { fit: 'cover', position: 'top' })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  );

  return sharp({
    create: { width: 2320, height: 720, channels: 3, background: '#dfddd6' },
  })
    .composite(tiles.map((input, index) => ({ input, left: index * 780, top: 0 })))
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const jobs = [
  {
    name: 'sanyu-cover',
    width: 1600,
    height: 1000,
    thumbWidth: 800,
    create: () => toExactPng(sources.sanyuDesktop, 1600, 1000, 'top'),
  },
  {
    name: 'sanyu-homepage',
    width: 1440,
    height: 3397,
    thumbWidth: 600,
    create: () => toExactPng(sources.sanyuDesktop, 1440, 3397),
  },
  {
    name: 'sanyu-mobile',
    width: 375,
    height: 4908,
    thumbWidth: 240,
    create: () => toExactPng(sources.sanyuMobile, 375, 4908),
  },
  {
    name: 'sanyu-finder',
    width: 1440,
    height: 1769,
    thumbWidth: 720,
    create: () => toExactPng(sources.sanyuFinder, 1440, 1769),
  },
  {
    name: 'sanyu-markets',
    width: 2320,
    height: 720,
    thumbWidth: 960,
    create: composeMarkets,
  },
  ...[
    ['mailbox-inbox', sources.mailboxInbox],
    ['mailbox-sent', sources.mailboxSent],
    ['mailbox-profile', sources.mailboxProfile],
    ['mailbox-compose', sources.mailboxCompose],
  ].map(([name, path]) => ({
    name,
    width: 1080,
    height: 2408,
    thumbWidth: 360,
    create: () => toExactPng(path, 1080, 2408),
  })),
  ...[
    ['interior-01', sources.interior01],
    ['interior-02', sources.interior02],
    ['interior-03', sources.interior03],
    ['interior-04', sources.interior04],
  ].map(([name, path]) => ({
    name,
    width: 1440,
    height: 1920,
    thumbWidth: 600,
    create: () => toExactPng(path, 1440, 1920),
  })),
  {
    name: 'interior-05',
    width: 1440,
    height: 1920,
    thumbWidth: 600,
    create: redactInterior05,
  },
];

const writeVariants = async (job) => {
  const master = await job.create();
  const base = join(casesDir, job.name);
  const thumb = sharp(master).resize({ width: job.thumbWidth, withoutEnlargement: true });

  await Promise.all([
    sharp(master).webp({ quality: 84, smartSubsample: true }).toFile(`${base}-full.webp`),
    sharp(master).avif({ quality: 58, effort: 5, chromaSubsampling: '4:4:4' }).toFile(`${base}-full.avif`),
    thumb.clone().webp({ quality: 78, smartSubsample: true }).toFile(`${base}-thumb.webp`),
    thumb.clone().avif({ quality: 52, effort: 4, chromaSubsampling: '4:2:0' }).toFile(`${base}-thumb.avif`),
  ]);

  return job.name;
};

const copyDemo = async () => {
  assertWithin(repoRoot, demoDir);
  await rm(demoDir, { recursive: true, force: true });
  const imagesSource = join(sanyuSource, 'assets', 'images');
  const imagesDest = join(demoDir, 'assets', 'images');
  await mkdir(imagesDest, { recursive: true });

  await Promise.all(
    ['index.html', 'app.js', 'styles.css'].map((name) =>
      copyFile(join(sanyuSource, name), join(demoDir, name)),
    ),
  );

  const imageNames = (await readdir(imagesSource)).filter((name) =>
    ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(extname(name).toLowerCase()),
  );
  await Promise.all(
    imageNames.map((name) => copyFile(join(imagesSource, name), join(imagesDest, name))),
  );

  return imageNames.length;
};

await verifySources();
await mkdir(casesDir, { recursive: true });

const generated = [];
for (const job of jobs) generated.push(await writeVariants(job));
const demoImageCount = await copyDemo();

console.log(`Generated ${generated.length * 4} case assets for ${generated.length} media entries.`);
console.log(`Copied the SANYU demo with 3 source files and ${demoImageCount} image assets.`);
console.log('Redacted interior-05 at x=610..1369, y=1370..1604 before WebP/AVIF encoding.');
