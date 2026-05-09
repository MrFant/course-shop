# Course Shop

跨境电商独立站 — 视频课程售卖平台

面向全球用户的视频课程售卖独立站，支持课程展示、在线支付（Stripe）、视频播放、学习进度追踪。

## 技术栈

- **前端**: Next.js 14 + Tailwind CSS + shadcn/ui
- **后端**: Node.js + Fastify
- **数据库**: PostgreSQL (Neon) + Redis (Upstash)
- **存储**: Cloudflare R2 (视频文件)
- **支付**: Stripe
- **部署**: Vercel (前端) + Hetzner (后端)

## 项目结构

```
course-shop/
├── docs/               # 项目文档
│   ├── 01-project-plan.md   # 项目规划
│   └── 02-prd.md            # 需求文档 (PRD)
├── apps/
│   ├── web/            # 前端 (Next.js)
│   └── admin/          # 管理后台 (Next.js)
├── packages/
│   └── shared/         # 共享类型定义
├── docker/
│   └── docker-compose.yml
└── README.md
```

## 文档

- [项目规划](docs/01-project-plan.md) — 技术架构、成本估算、开发计划
- [需求文档 PRD](docs/02-prd.md) — 完整功能设计、业务流程、数据库设计、API 路由

## 月运营成本

| 项目 | 费用 |
|---|---|
| 服务器 (Hetzner) | ~$5/月 |
| 前端 (Vercel) | 免费 |
| 数据库 (Neon) | 免费 |
| CDN + SSL (Cloudflare) | 免费 |
| 对象存储 (R2) | 免费 10GB |
| **总计** | **~$6/月** |

## License

MIT
