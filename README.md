# 秋野个人作品网站

面向个人品牌、求职与合作咨询的中文作品集。网站使用 Vite、原生 JavaScript 和 Lucide 构建，案例内容来自秋野的真实个人作品原型。

## 本地运行

```powershell
npm install
npm run assets
npm run dev
```

生产检查：

```powershell
npm run build
npm run verify
npm run preview
```

## 内容边界

- 三个案例均标注为 AI 协作完成的个人作品原型。
- 山屿香氛是可交互的前端商业原型，不包含真实支付、订单或后台系统。
- 广告视觉为概念方案，公开版本已移除原图中的联系方式。
- 网站只公开微信号 `wxid_5cezqqgmgvi122`。

## 发布

`.github/workflows/deploy-pages.yml` 会在 `main` 分支更新后构建并发布 GitHub Pages。
