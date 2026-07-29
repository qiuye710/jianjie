const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const media = (name, width, height, alt, caption) => ({
  width,
  height,
  alt,
  caption,
  thumbAvif: publicAsset(`assets/cases/${name}-thumb.avif`),
  thumbWebp: publicAsset(`assets/cases/${name}-thumb.webp`),
  fullAvif: publicAsset(`assets/cases/${name}-full.avif`),
  fullWebp: publicAsset(`assets/cases/${name}-full.webp`),
});

export const contact = {
  wechat: 'wxid_5cezqqgmgvi122',
};

export const projects = [
  {
    slug: 'sanyu',
    index: '01',
    title: '山屿香氛独立站',
    shortTitle: '山屿香氛',
    category: '独立站 / 电商体验',
    status: 'AI 协作完成的前端商业原型',
    summary:
      '从品牌概念到购物流程，构建一套可操作的香氛独立站体验，让“选香”不只是浏览商品，而是从情绪和空间出发做选择。',
    homeCopy:
      '包含品牌首页、商品筛选、四步选香器、收藏、购物车、模拟结算与中日韩市场切换。',
    cover: media(
      'sanyu-cover',
      1600,
      1000,
      '山屿香氛独立站首页，暖白背景上陈列香薰产品',
      '品牌首页与商品陈列',
    ),
    gallery: [
      media(
        'sanyu-homepage',
        1440,
        3397,
        '山屿香氛独立站完整桌面首页',
        '完整桌面首页',
      ),
      media(
        'sanyu-mobile',
        375,
        4908,
        '山屿香氛独立站移动端完整首页',
        '375 px 移动端适配',
      ),
      media(
        'sanyu-finder',
        1440,
        1769,
        '山屿香氛四步选香器推荐结果',
        '按场景、情绪、空间与送礼对象完成选香',
      ),
      media(
        'sanyu-markets',
        2320,
        720,
        '山屿香氛中文、韩文和日文市场界面对照',
        '中文、韩文、日文市场与币种切换',
      ),
    ],
    capabilities: ['品牌概念', '信息架构', '交互流程', '响应式前端', '多市场体验', '自动化验收'],
    facts: [
      ['6 个', '演示商品'],
      ['4 步', '选香流程'],
      ['3 种', '语言与币种'],
    ],
    story: [
      {
        label: '目标',
        title: '把生活方式品牌做成完整体验',
        copy: '不只制作一个好看的首页，而是补全从了解品牌、寻找商品到加入购物车和提交模拟订单的主要路径。',
      },
      {
        label: '做法',
        title: '让用户从自己的生活场景开始选香',
        copy: '用四步选香器替代复杂术语，再通过筛选、收藏和商品详情承接选择结果。',
      },
      {
        label: '边界',
        title: '可演示的前端原型，不冒充真实商城',
        copy: '项目没有真实支付、数据库、账户或物流系统；品牌、商品和评价均为演示内容。',
      },
    ],
    demoUrl: publicAsset('demos/sanyu/index.html'),
    theme: 'pine',
  },
  {
    slug: 'mailbox',
    index: '02',
    title: '茉莉时刻信箱',
    shortTitle: '时刻信箱',
    category: '微信小程序 / 情感产品',
    status: 'AI 协作完成的微信小程序个人作品原型',
    summary:
      '围绕“把话寄给未来”的情感表达场景，设计一套从写信、选择抵达时间到管理信件的完整移动端体验。',
    homeCopy:
      '用柔和而克制的视觉语言，组织收件箱、已发送、个人中心与写信流程。',
    cover: media(
      'mailbox-inbox',
      1080,
      2408,
      '茉莉时刻信箱微信小程序收件箱页面',
      '收件箱首页',
    ),
    gallery: [
      media(
        'mailbox-inbox',
        1080,
        2408,
        '茉莉时刻信箱收件箱页面',
        '收件箱与时刻状态',
      ),
      media(
        'mailbox-sent',
        1080,
        2408,
        '茉莉时刻信箱已发送页面',
        '投递记录',
      ),
      media(
        'mailbox-profile',
        1080,
        2408,
        '茉莉时刻信箱个人中心页面',
        '个人中心与信箱管理',
      ),
      media(
        'mailbox-compose',
        1080,
        2408,
        '茉莉时刻信箱写信页面',
        '选择对象、抵达时间与信件内容',
      ),
    ],
    capabilities: ['需求概念化', '信息架构', '移动端 UI', '流程设计', '视觉规范', 'AI 产品构建'],
    facts: [
      ['4 个', '核心界面'],
      ['1 条', '完整写信路径'],
      ['移动端', '优先设计'],
    ],
    story: [
      {
        label: '起点',
        title: '让一封信拥有明确的抵达感',
        copy: '产品从“立即发送”之外寻找新的表达方式，让用户可以写给未来的自己，也可以写给指定的人。',
      },
      {
        label: '结构',
        title: '用三个步骤降低写信负担',
        copy: '先选择投递对象，再设置抵达时间，最后专注内容与附件；界面顺序与用户的真实决定保持一致。',
      },
      {
        label: '视觉',
        title: '安静，但不失去行动指引',
        copy: '茉莉绿负责主要操作，琥珀与紫色区分步骤，插图和空状态为情绪服务而不干扰写信。',
      },
    ],
    theme: 'jasmine',
  },
  {
    slug: 'interior-visual',
    index: '03',
    title: '高端全屋定制广告视觉',
    shortTitle: '全屋定制视觉',
    category: 'AI 广告制作 / 品牌视觉',
    status: 'AI 协作完成的广告视觉概念方案',
    summary:
      '为高端家装业务组织一套五页竖版广告，从品牌主张到服务范围、设计理念、施工流程和品质价值形成完整传播顺序。',
    homeCopy:
      '通过统一的影调、版式和中文文案，把零散服务信息整理成可连续阅读的品牌叙事。',
    cover: media(
      'interior-01',
      1440,
      1920,
      '高端全屋定制广告视觉第一页，深色客厅与品牌主张',
      '01 / 品牌主张',
    ),
    gallery: [
      media(
        'interior-01',
        1440,
        1920,
        '高端全屋定制广告视觉第一页',
        '01 / 品牌主张',
      ),
      media(
        'interior-02',
        1440,
        1920,
        '高端全屋定制广告视觉第二页',
        '02 / 设计理念',
      ),
      media(
        'interior-03',
        1440,
        1920,
        '高端全屋定制广告视觉第三页',
        '03 / 服务内容',
      ),
      media(
        'interior-04',
        1440,
        1920,
        '高端全屋定制广告视觉第四页',
        '04 / 施工流程',
      ),
      media(
        'interior-05',
        1440,
        1920,
        '高端全屋定制广告视觉第五页，联系方式已隐去',
        '05 / 品质价值',
      ),
    ],
    capabilities: ['广告信息编排', '系列版式', '品牌调性', '中文文案', 'AI 图像生成', '视觉一致性'],
    facts: [
      ['5 张', '系列海报'],
      ['1 套', '统一视觉系统'],
      ['竖版', '传播格式'],
    ],
    story: [
      {
        label: '定位',
        title: '不把高端只理解成暗色和金色',
        copy: '画面用深色空间建立质感，再通过大面积留白、细线和克制的金色标签维持阅读秩序。',
      },
      {
        label: '叙事',
        title: '五张海报各自成立，也能连续阅读',
        copy: '内容依次回答“是谁、怎么想、做什么、怎么做、为什么值得”，避免每张图重复同一句销售口号。',
      },
      {
        label: '说明',
        title: '视觉概念，不冒充实景项目',
        copy: '空间画面为 AI 生成效果，仅用于设计展示；公开版本已移除原始联系方式。',
      },
    ],
    theme: 'copper',
  },
];

export const getProject = (slug) => projects.find((project) => project.slug === slug);
