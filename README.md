# Arcforge Studio

幻想人物雕塑展示与售卖网站原型。

## Included

- 用户界面: 首页作品展示、价格、材质、库存标签和购买入口。
- 管理员界面: `/admin` 可填写作品信息并批量选择照片和视频。
- 支付界面: `/checkout` 保留订单确认、Stripe 和 PayPal 入口。
- 后端入口: `/api/products` 将作品元数据写入 D1，将媒体文件写入 R2。
- 免费起步方案: Sites/Workers 免费子域名、D1 免费额度、R2 免费额度。

## Assumptions

- 作品可以是幻想英雄风格，但不要直接复制魔兽争霸或其他受版权保护的角色。
- 支付账号通常可以免费开通，但 Stripe、PayPal 等会对成功交易收取手续费。
- 免费网址通常是平台子域名；自定义域名一般需要购买域名。

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
```

## Deployment path

1. 用 Sites 部署前端和 Worker-compatible 后端。
2. 用 D1 保存作品、订单、媒体元数据。
3. 用 R2 保存上传的照片和视频。
4. 用 Stripe Checkout 或 PayPal Checkout 做真实收款。
5. 管理员页面上线前，用 Cloudflare Access 或工作区身份保护。
