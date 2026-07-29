import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy as CopyIcon,
  ExternalLink,
  Image as ImageIcon,
  Layers3,
  Monitor,
  Smartphone,
  Sparkles,
  X,
  createIcons,
} from 'lucide';
import './style.css';
import { contact, getProject, projects } from './data.js';

const app = document.querySelector('#app');
const announcer = document.querySelector('#announcer');
const iconSet = {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy: CopyIcon,
  ExternalLink,
  Image: ImageIcon,
  Layers3,
  Monitor,
  Smartphone,
  Sparkles,
  X,
};

let revealObserver;
let previousView = 'home';
let currentLightbox = null;
let entryIntroTimer;

const entryIntroTemplate = () => `
  <section class="entry-intro" aria-label="秋野作品集入场动画">
    <div class="entry-intro__topline" aria-hidden="true">
      <span>QIUYE / 01</span>
      <span>AI PRODUCT CREATOR</span>
    </div>
    <div class="entry-intro__stage" aria-hidden="true">
      <span class="entry-intro__panel entry-intro__panel--one">
        ${picture(projects[1].cover, { loading: 'eager', fetchPriority: 'high', className: 'entry-intro__image' })}
      </span>
      <span class="entry-intro__panel entry-intro__panel--two">
        ${picture(projects[0].cover, { loading: 'eager', fetchPriority: 'high', className: 'entry-intro__image' })}
      </span>
      <span class="entry-intro__panel entry-intro__panel--three">
        ${picture(projects[2].cover, { loading: 'eager', fetchPriority: 'high', className: 'entry-intro__image' })}
      </span>
      <p class="entry-intro__name">秋野</p>
      <p class="entry-intro__caption">把想法变成可体验的作品</p>
    </div>
    <div class="entry-intro__bottomline">
      <span class="entry-intro__progress" aria-hidden="true"><i></i></span>
      <button class="entry-intro__skip" type="button" data-intro-skip>跳过动画</button>
    </div>
  </section>
`;

const icon = (name, className = '') =>
  `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;

const hydrateIcons = () => {
  createIcons({
    icons: iconSet,
    attrs: {
      'stroke-width': 1.8,
      'aria-hidden': 'true',
    },
  });
};

const dismissEntryIntro = (immediate = false) => {
  const intro = document.querySelector('.entry-intro');
  if (!intro) return;
  window.clearTimeout(entryIntroTimer);
  document.body.classList.remove('entry-intro-open');
  intro.classList.add('is-leaving');
  window.setTimeout(() => intro.remove(), immediate ? 0 : 520);
};

const setupEntryIntro = (hash, cameFromDetail) => {
  const hasSeenIntro = sessionStorage.getItem('qiuye-entry-intro') === 'seen';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDeepLink = hash && hash !== '#top';
  if (hasSeenIntro || reducedMotion || cameFromDetail || isDeepLink) return;

  app.insertAdjacentHTML('afterend', entryIntroTemplate());
  const intro = document.querySelector('.entry-intro');
  document.body.classList.add('entry-intro-open');
  window.requestAnimationFrame(() => intro.classList.add('is-active'));

  const complete = () => {
    sessionStorage.setItem('qiuye-entry-intro', 'seen');
    dismissEntryIntro();
  };

  intro.querySelector('[data-intro-skip]').addEventListener('click', complete);
  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') complete();
    },
    { once: true },
  );
  entryIntroTimer = window.setTimeout(complete, 1850);
};

const picture = (
  image,
  {
    size = 'thumb',
    loading = 'lazy',
    fetchPriority = 'auto',
    className = '',
  } = {},
) => {
  const avif = size === 'full' ? image.fullAvif : image.thumbAvif;
  const webp = size === 'full' ? image.fullWebp : image.thumbWebp;
  return `
    <picture>
      <source srcset="${avif}" type="image/avif" />
      <img
        class="${className}"
        src="${webp}"
        alt="${image.alt}"
        width="${image.width}"
        height="${image.height}"
        loading="${loading}"
        fetchpriority="${fetchPriority}"
        decoding="async"
      />
    </picture>
  `;
};

const siteHeader = (detail = false) => `
  <header class="site-header">
    <div class="site-header__inner shell">
      <a class="brand-link" href="${detail ? '#' : '#top'}" aria-label="秋野个人网站首页">
        <span class="brand-mark" aria-hidden="true">秋</span>
        <span class="brand-name">秋野</span>
      </a>
      <span class="header-role" translate="no">AI PRODUCT CREATOR</span>
      <nav class="primary-nav" aria-label="主要导航">
        <a href="#work">作品</a>
        <a href="#contact">联系</a>
      </nav>
    </div>
  </header>
`;

const siteFooter = () => `
  <footer class="site-footer">
    <div class="shell site-footer__inner">
      <a class="footer-brand" href="#top">秋野 / QIUYE</a>
      <p>AI 产品创作者 · 个人作品网站</p>
      <p>© ${new Date().getFullYear()} 秋野</p>
    </div>
  </footer>
`;

const copyButton = (modifier = '') => `
  <button class="copy-button ${modifier}" type="button" data-copy-wechat>
    ${icon('copy')}
    <span>复制微信号</span>
  </button>
`;

const heroWork = (project, className, priority = false) => `
  <a
    class="hero-work ${className}"
    href="#/work/${project.slug}"
    data-project-link
    aria-label="查看案例：${project.title}"
  >
    <span class="hero-work__media">
      ${picture(project.cover, {
        loading: 'eager',
        fetchPriority: priority ? 'high' : 'auto',
      })}
    </span>
    <span class="hero-work__label">
      <span>${project.index}</span>
      <strong>${project.shortTitle}</strong>
      ${icon('arrow-up-right')}
    </span>
  </a>
`;

const projectRow = (project) => `
  <article class="project-row project-row--${project.theme} reveal" data-project="${project.slug}">
    <div class="project-row__meta">
      <span class="project-number">${project.index}</span>
      <span>${project.category}</span>
    </div>
    <a
      class="project-row__media"
      href="#/work/${project.slug}"
      data-project-link
      aria-label="查看案例：${project.title}"
    >
      ${picture(project.cover)}
      <span class="media-action">查看案例 ${icon('arrow-up-right')}</span>
    </a>
    <div class="project-row__copy">
      <p class="project-status">${project.status}</p>
      <h3>${project.title}</h3>
      <p>${project.homeCopy}</p>
      <a class="text-link" href="#/work/${project.slug}" data-project-link>
        打开完整案例 ${icon('arrow-right')}
      </a>
    </div>
  </article>
`;

const homeTemplate = () => `
  ${siteHeader()}
  <main id="main-content" tabindex="-1">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-rules" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="hero-stage shell">
        <div class="hero-copy">
          <p class="eyebrow" translate="no">QIUYE / AI PRODUCT CREATOR</p>
          <h1 id="hero-title">秋野</h1>
          <p class="hero-roleline">AI 产品创作者</p>
          <p class="hero-lead">用 AI 把想法做成可体验的微信小程序、网站、独立站与品牌视觉。</p>
          <div class="hero-actions">
            <a class="button button--primary" href="#work">
              看代表作品 ${icon('arrow-right')}
            </a>
            <a class="button button--quiet" href="#contact">联系合作</a>
          </div>
        </div>
        <div class="hero-worktable" aria-label="代表作品预览">
          ${heroWork(projects[0], 'hero-work--browser', true)}
          ${heroWork(projects[1], 'hero-work--phone')}
          ${heroWork(projects[2], 'hero-work--poster')}
        </div>
        <p class="hero-note"><span>01—03</span> 三种载体，一套把想法落地的方法</p>
      </div>
    </section>

    <section class="work-section section-band" id="work" aria-labelledby="work-title">
      <div class="shell">
        <header class="section-heading">
          <p class="eyebrow">SELECTED WORK / 代表作品</p>
          <h2 id="work-title">从概念到可以打开的作品。</h2>
          <p>不堆砌技术名词，只展示实际做出的界面、流程和视觉结果。</p>
        </header>
        <div class="project-list">
          ${projects.map(projectRow).join('')}
        </div>
      </div>
    </section>

    <section class="capabilities section-band" id="capabilities" aria-labelledby="capabilities-title">
      <div class="shell capabilities__inner">
        <header class="capabilities__heading reveal">
          <p class="eyebrow">WHAT I BUILD / 创作方向</p>
          <h2 id="capabilities-title">AI 是工具，结果才是作品。</h2>
        </header>
        <div class="capability-grid">
          <article class="capability reveal">
            ${icon('sparkles')}
            <h3>AI 产品构建</h3>
            <p>从模糊想法出发，梳理目标、内容、流程和交互，推进到可演示成果。</p>
          </article>
          <article class="capability reveal">
            ${icon('smartphone')}
            <h3>微信小程序</h3>
            <p>围绕移动场景组织信息架构、关键页面和完整操作路径。</p>
          </article>
          <article class="capability reveal">
            ${icon('monitor')}
            <h3>网站与独立站</h3>
            <p>把品牌表达、响应式界面和核心业务流程放进同一套体验里。</p>
          </article>
          <article class="capability reveal">
            ${icon('image')}
            <h3>AI 广告视觉</h3>
            <p>完成视觉方向、图像生成、中文文案和系列版式的一致性控制。</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about-section section-band" id="about" aria-labelledby="about-title">
      <div class="shell about-layout">
        <div class="about-kicker reveal">
          <span class="about-kicker__mark">AI</span>
          <p>不是替代判断，<br />而是放大执行力。</p>
        </div>
        <div class="about-copy reveal">
          <p class="eyebrow">ABOUT / 关于秋野</p>
          <h2 id="about-title">我以 AI 为主要生产工具，把想法推进成可体验、可演示、可继续迭代的数字作品。</h2>
          <p>
            我关注的不是“看起来像做完了”，而是页面是否能打开、流程是否走得通、视觉是否前后一致。每个案例都保留真实边界：原型就是原型，概念视觉就是概念视觉。
          </p>
        </div>
        <ol class="process-list" aria-label="工作方式">
          <li class="reveal"><span>01</span><strong>明确目标</strong><p>先判断要解决什么问题，给谁使用。</p></li>
          <li class="reveal"><span>02</span><strong>组织体验</strong><p>梳理内容、页面结构和主要操作路径。</p></li>
          <li class="reveal"><span>03</span><strong>生成实现</strong><p>借助 AI 完成视觉、页面与功能原型。</p></li>
          <li class="reveal"><span>04</span><strong>测试迭代</strong><p>在真实设备尺寸里检查并持续修正。</p></li>
        </ol>
      </div>
    </section>

    <section class="contact-section" id="contact" aria-labelledby="contact-title">
      <div class="shell contact-layout">
        <p class="eyebrow">LET'S BUILD / 联系合作</p>
        <h2 id="contact-title">有一个想法，<br />先让它变得可以看见。</h2>
        <div class="contact-action">
          <p>微信号</p>
          <strong translate="no">${contact.wechat}</strong>
          ${copyButton('copy-button--light')}
        </div>
      </div>
    </section>
  </main>
  ${siteFooter()}
`;

const factMarkup = (project) =>
  project.facts
    .map(
      ([value, label]) => `
        <div class="project-fact">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      `,
    )
    .join('');

const storyMarkup = (project) =>
  project.story
    .map(
      (item) => `
        <article class="story-block reveal">
          <p>${item.label}</p>
          <h3>${item.title}</h3>
          <span>${item.copy}</span>
        </article>
      `,
    )
    .join('');

const galleryMarkup = (project) =>
  project.gallery
    .map(
      (image, index) => `
        <figure class="gallery-figure reveal">
          <button
            class="gallery-trigger"
            type="button"
            data-gallery-index="${index}"
            aria-label="放大查看：${image.caption}"
          >
            ${picture(image)}
            <span class="gallery-zoom">${icon('image')} 放大查看</span>
          </button>
          <figcaption><span>${String(index + 1).padStart(2, '0')}</span>${image.caption}</figcaption>
        </figure>
      `,
    )
    .join('');

const lightboxTemplate = () => `
  <dialog class="lightbox" id="lightbox" aria-label="作品图片浏览器">
    <div class="lightbox__toolbar">
      <p id="lightbox-caption"></p>
      <button class="icon-button" type="button" data-lightbox-close aria-label="关闭图片">
        ${icon('x')}
      </button>
    </div>
    <div class="lightbox__stage" id="lightbox-stage"></div>
    <div class="lightbox__controls">
      <button class="icon-button" type="button" data-lightbox-prev aria-label="上一张图片">
        ${icon('chevron-left')}
      </button>
      <span id="lightbox-count"></span>
      <button class="icon-button" type="button" data-lightbox-next aria-label="下一张图片">
        ${icon('chevron-right')}
      </button>
    </div>
  </dialog>
`;

const detailTemplate = (project) => `
  ${siteHeader(true)}
  <main id="main-content" class="project-detail project-detail--${project.theme}" tabindex="-1">
    <section class="detail-hero">
      <div class="shell">
        <a class="back-link" href="#work">${icon('arrow-left')} 返回作品</a>
        <div class="detail-heading">
          <div>
            <p class="eyebrow">CASE ${project.index} / ${project.category}</p>
            <h1>${project.title}</h1>
          </div>
          <p>${project.summary}</p>
        </div>
        <div class="detail-cover">
          ${picture(project.cover, { loading: 'eager', fetchPriority: 'high', size: 'full' })}
        </div>
        <div class="detail-overview">
          <p class="project-status">${project.status}</p>
          <div class="project-facts">${factMarkup(project)}</div>
          <ul class="capability-tags" aria-label="案例能力标签">
            ${project.capabilities.map((item) => `<li>${item}</li>`).join('')}
          </ul>
          ${
            project.demoUrl
              ? `<a class="button button--primary detail-demo" href="${project.demoUrl}" target="_blank" rel="noreferrer">
                  打开互动演示 ${icon('external-link')}
                </a>`
              : ''
          }
        </div>
      </div>
    </section>

    <section class="detail-story section-band" aria-labelledby="story-title">
      <div class="shell">
        <header class="section-heading reveal">
          <p class="eyebrow">THINKING / 项目思路</p>
          <h2 id="story-title">从目标到结果，保留真实边界。</h2>
        </header>
        <div class="story-grid">${storyMarkup(project)}</div>
      </div>
    </section>

    <section class="detail-gallery section-band" aria-labelledby="gallery-title">
      <div class="shell">
        <header class="section-heading reveal">
          <p class="eyebrow">GALLERY / 界面与视觉</p>
          <h2 id="gallery-title">查看实际完成的画面。</h2>
        </header>
        <div class="gallery-grid gallery-grid--${project.slug}">${galleryMarkup(project)}</div>
      </div>
    </section>

    <section class="next-project">
      <div class="shell">
        <p>继续查看</p>
        <a href="#/work/${projects[(projects.indexOf(project) + 1) % projects.length].slug}" data-project-link>
          <span>${projects[(projects.indexOf(project) + 1) % projects.length].title}</span>
          ${icon('arrow-up-right')}
        </a>
      </div>
    </section>
  </main>
  ${siteFooter()}
  ${lightboxTemplate()}
`;

const announce = (message) => {
  announcer.textContent = '';
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 20);
};

const fallbackCopy = (value) => {
  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  return copied;
};

const copyWechat = async (button) => {
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(contact.wechat);
      copied = true;
    } else {
      copied = fallbackCopy(contact.wechat);
    }
  } catch {
    copied = fallbackCopy(contact.wechat);
  }

  const label = button.querySelector('span');
  if (copied) {
    button.dataset.copied = 'true';
    button.innerHTML = `${icon('check')}<span>已复制微信号</span>`;
    announce(`微信号 ${contact.wechat} 已复制`);
    hydrateIcons();
    window.setTimeout(() => {
      button.dataset.copied = 'false';
      button.innerHTML = `${icon('copy')}<span>复制微信号</span>`;
      hydrateIcons();
    }, 1800);
  } else {
    label.textContent = `微信号：${contact.wechat}`;
    announce(`复制失败，请手动复制微信号 ${contact.wechat}`);
  }
};

const setupReveal = () => {
  revealObserver?.disconnect();
  const items = [...document.querySelectorAll('.reveal')];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((item) => revealObserver.observe(item));
};

const updateLightbox = (project, index) => {
  const normalized = (index + project.gallery.length) % project.gallery.length;
  currentLightbox.index = normalized;
  const image = project.gallery[normalized];
  document.querySelector('#lightbox-stage').innerHTML = picture(image, {
    size: 'full',
    loading: 'eager',
  });
  document.querySelector('#lightbox-caption').textContent = image.caption;
  document.querySelector('#lightbox-count').textContent = `${normalized + 1} / ${project.gallery.length}`;
};

const openLightbox = (project, index, trigger) => {
  const dialog = document.querySelector('#lightbox');
  currentLightbox = { project, index, trigger };
  updateLightbox(project, index);
  dialog.showModal();
  document.body.classList.add('dialog-open');
};

const closeLightbox = () => {
  const dialog = document.querySelector('#lightbox');
  if (!dialog?.open) return;
  dialog.close();
};

const setupLightbox = (project) => {
  const dialog = document.querySelector('#lightbox');
  if (!dialog) return;

  document.querySelectorAll('[data-gallery-index]').forEach((button) => {
    button.addEventListener('click', () => {
      openLightbox(project, Number(button.dataset.galleryIndex), button);
    });
  });

  document.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
  document.querySelector('[data-lightbox-prev]').addEventListener('click', () =>
    updateLightbox(project, currentLightbox.index - 1),
  );
  document.querySelector('[data-lightbox-next]').addEventListener('click', () =>
    updateLightbox(project, currentLightbox.index + 1),
  );

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    currentLightbox?.trigger?.focus();
    currentLightbox = null;
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') updateLightbox(project, currentLightbox.index - 1);
    if (event.key === 'ArrowRight') updateLightbox(project, currentLightbox.index + 1);
  });
};

const bindCommonInteractions = () => {
  hydrateIcons();
  document.querySelectorAll('[data-copy-wechat]').forEach((button) => {
    button.addEventListener('click', () => copyWechat(button));
  });
  document.querySelectorAll('[data-project-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (previousView === 'home') sessionStorage.setItem('qiuye-home-scroll', String(window.scrollY));
    });
  });
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.closest('picture')?.classList.add('image-error');
    });
  });
  setupReveal();
};

const restoreHomePosition = (hash, cameFromDetail) => {
  window.requestAnimationFrame(() => {
    if (cameFromDetail) {
      const saved = Number(sessionStorage.getItem('qiuye-home-scroll') || 0);
      window.scrollTo({ top: saved, behavior: 'auto' });
      document.querySelector('#main-content')?.focus({ preventScroll: true });
      return;
    }
    if (hash && !hash.startsWith('#/')) {
      const target = document.querySelector(hash);
      target?.scrollIntoView({ block: 'start' });
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
};

const renderRoute = () => {
  dismissEntryIntro(true);
  closeLightbox();
  const hash = decodeURIComponent(window.location.hash || '');
  const match = hash.match(/^#\/work\/([a-z-]+)$/);
  const project = match ? getProject(match[1]) : null;

  if (project) {
    app.innerHTML = detailTemplate(project);
    document.body.dataset.route = 'detail';
    document.body.dataset.theme = project.theme;
    document.title = `${project.title}｜秋野`;
    previousView = 'detail';
    bindCommonInteractions();
    setupLightbox(project);
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      document.querySelector('#main-content')?.focus({ preventScroll: true });
    });
    return;
  }

  const cameFromDetail = previousView === 'detail';
  app.innerHTML = homeTemplate();
  document.body.dataset.route = 'home';
  delete document.body.dataset.theme;
  document.title = '秋野｜AI 产品创作者';
  previousView = 'home';
  bindCommonInteractions();
  restoreHomePosition(hash, cameFromDetail);
  setupEntryIntro(hash, cameFromDetail);
};

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('hashchange', renderRoute);
renderRoute();
