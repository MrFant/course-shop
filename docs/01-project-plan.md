# 跨境电商独立站 — 项目规划 v2

> 更新时间：2026-05-09
> 状态：规划阶段

---

## 一、项目定位

| 维度 | 决定 |
|---|---|
| **目标市场** | 全球 |
| **商品类型** | 数字商品（视频课程） |
| **核心诉求** | 极低成本启动，快速验证商业模式 |

**优势**：无物流、无库存、无仓储、边际成本趋近于零。一次制作，全球售卖。

---

## 二、极简成本方案

### 月度运营成本估算

| 项目 | 方案 | 费用 |
|---|---|---|
| **服务器** | Hetzner CX22 (2C/4G) 或 Vercel 免费层 + 轻量后端 | $4-6/月 |
| **域名** | Cloudflare 直购（成本价） | ~$10/年 |
| **CDN** | Cloudflare 免费版 | $0 |
| **SSL** | Cloudflare 自动 | $0 |
| **数据库** | Supabase 免费层 或 Neon 免费层 | $0 |
| **Redis** | Upstash 免费层（10K 命令/天） | $0 |
| **对象存储** | Cloudflare R2 免费 10GB 存储 + 1000万次读取 | $0 |
| **支付** | Stripe（2.9% + $0.30/笔） | 按交易扣 |
| **邮件** | Resend 免费 3000封/月 | $0 |
| **搜索** | 内置数据库搜索（数字商品量小够用） | $0 |

**月固定成本：约 $5-6**（服务器）+ 域名分摊 $1/月 ≈ **$6-7/月**

---

## 三、精简后的系统架构

数字商品不需要复杂的库存和物流系统，架构大幅简化：

```
┌──────────────────────────────────────────────┐
│            用户 (全球 Browser/Mobile)           │
└──────────────────┬───────────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────┐
│          Cloudflare (CDN + DDoS + SSL)        │
└──────────────────┬───────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐    ┌────────────────────────┐
│   前端 (Next.js) │    │    后端 API (Fastify)   │
│   Vercel 部署    │◄──►│    Hetzner / Railway    │
│   或 Cloudflare  │    │    或 Vercel Serverless │
│   Pages         │    │                        │
└──────────────┘    └──────────┬─────────────┘
                               │
                   ┌───────────┼───────────┐
                   ▼           ▼           ▼
            ┌───────────┐ ┌────────┐ ┌──────────┐
            │  Neon/    │ │ Upstash│ │  R2      │
            │ Supabase  │ │ Redis  │ │ 对象存储  │
            │ (Postgres)│ │        │ │ (视频文件) │
            └───────────┘ └────────┘ └──────────┘
```

**部署方案选择（二选一）：**

| 方案 | 说明 | 费用 |
|---|---|---|
| **A: Vercel + Railway** | 前端部署 Vercel 免费，后端 Railway $5/月 | ~$5/月 |
| **B: 全 Hetzner** | 前后端同机部署，Nginx/Caddy 反代 | ~$4-6/月 |
| **推荐 A** | 全球 CDN 快，部署简单，Vercel 免费额度大 | — |

---

## 四、核心功能（数字商品特化版）

### 4.1 用户端

```
├── 🏠 首页
│   ├── Hero Banner（课程宣传）
│   ├── 热门课程推荐
│   ├── 课程分类导航
│   └── 用户评价/成功案例
├── 📚 课程
│   ├── 课程列表页（分类筛选、排序）
│   ├── 课程详情页
│   │   ├── 课程介绍 & 大纲
│   │   ├── 预览视频（可嵌入 YouTube/Vimeo）
│   │   ├── 讲师介绍
│   │   └── 用户评价
│   └── 搜索
├── 🛒 结算
│   ├── 购物车
│   ├── 优惠码输入
│   └── Stripe 支付（信用卡 + Apple Pay + Google Pay）
├── 👤 用户中心
│   ├── 注册/登录（邮箱 + 密码）
│   ├── 我的课程（已购买课程列表）
│   ├── 视频播放器（受保护的流媒体）
│   ├── 学习进度
│   └── 购买历史 & 发票
└── 📄 静态页面
    ├── 关于我们
    ├── 退款政策（数字商品一般标注不退款）
    └── 隐私政策 / Terms of Service
```

### 4.2 管理后台（极简版）

```
├── 📊 数据看板
│   └── 今日销售额 / 订单量 / 总收入
├── 📚 课程管理
│   ├── 课程 CRUD
│   ├── 章节 & 课时管理
│   ├── 视频上传 → R2
│   └── 价格 / 上下架
├── 📋 订单管理
│   ├── 订单列表 & 详情
│   └── 退款处理
├── 🏷️ 营销
│   ├── 优惠码管理（折扣码 / 免费码）
│   └── 限时促销
├── 👥 用户管理
│   └── 用户列表 & 购买记录
└── ⚙️ 设置
    ├── 店铺信息
    ├── Stripe 配置
    └── 邮件模板
```

### 4.3 关键特性：视频保护

```
视频文件存储在 Cloudflare R2（私有桶）
         │
         ▼
用户购买后 → 后端生成签名 URL（有效期 2 小时）
         │
         ▼
前端拿到签名 URL → 嵌入视频播放器（禁止下载）
```

---

## 五、数据库设计（精简版）

```prisma
// ========== 用户 ==========
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt
  name      String?
  role      Role     @default(CUSTOMER)
  purchases Purchase[]
  reviews   Review[]
  createdAt DateTime @default(now())
}

// ========== 课程 ==========
model Course {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)  // USD
  compareAt   Decimal? @db.Decimal(10, 2)  // 划线原价
  coverImage  String?  // R2 URL
  previewUrl  String?  // YouTube/Vimeo 嵌入链接
  isActive    Boolean  @default(true)
  chapters    Chapter[]
  purchases   Purchase[]
  reviews     Review[]
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
}

// ========== 章节 ==========
model Chapter {
  id        String   @id @default(cuid())
  title     String
  sortOrder Int      @default(0)
  course    Course   @relation(fields: [courseId])
  courseId  String
  lessons   Lesson[]
}

// ========== 课时 ==========
model Lesson {
  id         String  @id @default(cuid())
  title      String
  sortOrder  Int     @default(0)
  videoKey   String? // R2 对象 key（私有）
  duration   Int?    // 秒
  chapter    Chapter @relation(fields: [chapterId])
  chapterId  String
}

// ========== 购买记录 ==========
model Purchase {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId])
  userId     String
  course     Course   @relation(fields: [courseId])
  courseId    String
  amount     Decimal  @db.Decimal(10, 2)
  stripeId   String?  @unique  // Stripe Payment Intent ID
  status     PurchaseStatus @default(PENDING)
  progress   Json?    // {"chapter1": [true, false, true], ...}
  createdAt  DateTime @default(now())

  @@unique([userId, courseId]) // 一个用户只能买一次
}

enum PurchaseStatus {
  PENDING
  COMPLETED
  REFUNDED
}

// ========== 评价 ==========
model Review {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId])
  userId    String
  course    Course   @relation(fields: [courseId])
  courseId  String
  rating    Int      // 1-5
  content   String?  @db.Text
  createdAt DateTime @default(now())

  @@unique([userId, courseId])
}

// ========== 优惠码 ==========
model Coupon {
  id        String   @id @default(cuid())
  code      String   @unique  // 大写
  type      CouponType
  value     Decimal  @db.Decimal(10, 2) // 百分比或固定金额
  maxUses   Int?     // 总使用次数上限
  usedCount Int      @default(0)
  expiresAt DateTime?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

enum CouponType {
  PERCENT   // 百分比折扣
  FIXED     // 固定金额折扣
}

// ========== 设置 ==========
model StoreSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
}

enum Role {
  CUSTOMER
  ADMIN
}
```

---

## 六、项目结构

```
course-shop/
├── apps/
│   ├── web/                         # 前端 (Next.js 14)
│   │   ├── app/
│   │   │   ├── (shop)/              # 用户端路由组
│   │   │   │   ├── page.tsx         # 首页
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx     # 课程列表
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx # 课程详情
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   └── account/
│   │   │   │       ├── page.tsx     # 用户中心
│   │   │   │       ├── purchases/
│   │   │   │       │   └── [id]/    # 课程播放页
│   │   │   │       └── orders/
│   │   │   ├── (auth)/              # 登录/注册
│   │   │   ├── api/                 # Next.js API Routes (轻量)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui 组件
│   │   │   ├── CourseCard.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── ...
│   │   └── lib/
│   │
│   └── admin/                       # 管理后台 (也可用 Next.js Admin Template)
│       ├── app/
│       │   ├── page.tsx             # Dashboard
│       │   ├── courses/
│       │   ├── orders/
│       │   ├── coupons/
│       │   └── settings/
│       └── ...
│
├── packages/
│   └── shared/                      # 共享类型定义
│       └── types.ts
│
├── docker-compose.yml               # 本地开发用
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 七、开发计划

### Phase 1 — MVP（目标：能卖能收钱）⏱️ 10-14 天

```
Day 1-2:   项目脚手架 + 数据库 Schema + Prisma
Day 3-4:   用户系统（注册/登录/JWT）
Day 5-6:   课程展示（列表 + 详情 + 搜索）
Day 7-8:   购物车 + Stripe Checkout 集成
Day 9-10:  购买后视频播放（R2 签名 URL）
Day 11-12: 管理后台（课程 CRUD + 视频上传）
Day 13-14: 部署 + 域名 + 测试
```

**MVP 交付物：**
- ✅ 用户可以浏览课程
- ✅ 用户可以注册/登录
- ✅ 用户可以购买课程（Stripe）
- ✅ 用户可以观看已购课程视频
- ✅ 管理员可以管理课程和订单
- ✅ 部署上线，可公开访问

### Phase 2 — 体验优化 ⏱️ 7-10 天

- [ ] 优惠码功能
- [ ] 用户评价系统
- [ ] 学习进度记录
- [ ] 邮件通知（购买确认、发货通知）
- [ ] 多语言基础支持（中/英）
- [ ] 响应式移动端优化
- [ ] Google Analytics 接入

### Phase 3 — 增长 ⏱️ 持续

- [ ] SEO 深度优化（结构化数据、Sitemap）
- [ ] 课程预览视频（YouTube/Vimeo 嵌入）
- [ ] 用户头像 & 个人信息编辑
- [ ] 发票下载（PDF 生成）
- [ ] 课程完成后颁发证书
- [ ] 邮件营销集成（新课程推送）
- [ ] A/B 测试定价

---

## 八、关键技术方案

### 8.1 视频存储与播放

```
上传流程：
  管理员上传视频 → Fastify 后端接收 → 流式写入 Cloudflare R2 → 保存 videoKey 到 DB

播放流程：
  用户请求播放 → 后端验证购买状态 → 生成 R2 签名 URL（2h 有效）→ 返回给前端
  → 前端 VideoPlayer 组件加载签名 URL → 播放

安全措施：
  - R2 桶设为私有，无公开访问
  - 签名 URL 短时效（2小时）
  - 不暴露真实文件路径
  - 禁用右键（基础防护）
```

### 8.2 支付流程

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ 用户点击 │────►│ 创建   │────►│ Stripe │────►│ 支付   │
│ 购买    │     │ Checkout│     │ 托管页  │     │ 成功   │
└────────┘     │ Session │     └────────┘     └───┬────┘
               └────────┘                         │
                                                  ▼
┌────────────────────────────────────────────────────────┐
│ Webhook 回调（stripe listen → /api/webhooks/stripe）     │
│                                                        │
│  1. 验证签名                                             │
│  2. 更新 Purchase 状态为 COMPLETED                       │
│  3. 发送购买确认邮件                                      │
└────────────────────────────────────────────────────────┘
```

### 8.3 部署方案

```
Vercel（前端）                    Hetzner（后端）
┌────────────────────┐          ┌──────────────────┐
│ Next.js + Admin    │          │ Fastify API      │
│ 自动 CI/CD          │          │ Node.js 22       │
│ 全球边缘节点        │          │ Docker 容器       │
│ 免费额度充足        │          │ Caddy 反代        │
└────────────────────┘          └──────────────────┘
        │                              │
        └──────────── API 调用 ────────┘
```

---

## 九、成本总结

| | 月成本 | 备注 |
|---|---|---|
| 服务器（后端） | $4-6 | Hetzner CX22 |
| 前端托管 | $0 | Vercel 免费层 |
| 数据库 | $0 | Neon/Supabase 免费层 |
| Redis | $0 | Upstash 免费层 |
| 对象存储（视频） | $0 | Cloudflare R2 免费 10GB |
| CDN + SSL | $0 | Cloudflare 免费 |
| 邮件 | $0 | Resend 免费 3000封/月 |
| 域名 | ~$1 | 平摊到月 |
| **总计** | **~$6-7/月** | 不含广告费 |

> 💡 10GB R2 免费额度可存约 2-3 小时 1080p 视频。超出后 $0.015/GB/月，非常便宜。

---

## 十、下一步

**需要你确认：**
1. ✅ 目标市场：全球 — 已确认
2. ✅ 商品类型：数字商品（视频课程）— 已确认
3. ✅ 成本策略：极低成本启动 — 已确认
4. **域名** — 想好名字了吗？还是我帮你想几个？
5. **后端部署方案** — Vercel + Hetzner（推荐）还是全 Hetzner？
6. **是否需要管理后台** — 前期用简单的好还是功能全的？

确认后就可以开始 Phase 1 开发。
