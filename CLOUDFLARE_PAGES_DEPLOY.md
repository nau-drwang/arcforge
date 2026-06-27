# Arcforge Cloudflare Pages Full Stack 部署说明

这个版本是完整 Pages Full Stack：

- 前端：Cloudflare Pages 静态资源，输出目录 `dist`
- 后端：Cloudflare Pages Functions，目录 `functions/`
- 数据库：Cloudflare D1，绑定名必须是 `DB`
- 媒体：Cloudflare R2，绑定名必须是 `MEDIA`

## Cloudflare Pages 设置

Build command:

```bash
npm ci && npm run pages:build
```

Build output directory:

```text
dist
```

Root directory: 留空

Node.js version: 22

Compatibility flags: 如果页面要求，添加：

```text
nodejs_compat
```

## Bindings

在 Pages 项目 Settings -> Functions -> Bindings 中添加：

```text
D1 database binding
Variable name: DB
Database: arcforge-database
```

```text
R2 bucket binding
Variable name: MEDIA
Bucket: arcforge-media
```

## 初始化 D1

进入 D1 数据库 `arcforge-database` 的 Console，执行：

```text
drizze/0000_groovy_mongu.sql
```

注意：文件路径实际是：

```text
drizzle/0000_groovy_mongu.sql
```

执行后后台新增商品和订单功能才会正常写入数据库。

## 页面

- 首页：`/`
- 管理：`/admin.html`
- 支付/下单：`/checkout.html`
- 产品 API：`/api/products`
- 媒体上传 API：`/api/upload`
- R2 媒体访问：`/media/<storage_key>`
