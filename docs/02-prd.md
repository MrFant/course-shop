# 跨境电商独立站 — 需求文档（PRD）

> 版本：v1.0 | 创建：2026-05-09 | 状态：待确认

---

## 一、产品概述

### 1.1 产品定位

面向全球用户的视频课程售卖独立站。用户可以浏览、购买视频课程，在线观看学习。

### 1.2 目标用户

| 角色 | 描述 |
|---|---|
| **学员（Customer）** | 全球用户，想购买和学习视频课程 |
| **管理员（Admin）** | 站点运营者，管理课程、订单、用户 |

### 1.3 产品范围

| 包含 | 不包含 |
|---|---|
| 课程展示 & 播放 | 直播功能 |
| 用户注册/登录 | 社交互动（评论区、论坛） |
| 在线支付（Stripe） | 多供应商/讲师入驻 |
| 购买后视频播放 | 移动端 App |
| 管理后台 | 多语言（Phase 2） |
| 优惠码 | 会员订阅制（Phase 3） |

---

## 二、功能清单

### 2.1 功能全景图

```
用户端（前台）                          管理端（后台）
┌──────────────────────┐              ┌──────────────────────┐
│ F1 首页              │              │ G1 数据看板           │
│ F2 课程浏览          │              │ G2 课程管理           │
│ F3 课程详情          │              │ G3 订单管理           │
│ F4 搜索              │              │ G4 用户管理           │
│ F5 用户注册/登录      │              │ G5 优惠码管理         │
│ F6 购物车            │              │ G6 系统设置           │
│ F7 结算支付          │              │                      │
│ F8 我的课程（学习中心）│              │                      │
│ F9 个人资料          │              │                      │
└──────────────────────┘              └──────────────────────┘
```

---

## 三、用户端功能详细设计

### F1 首页

**页面结构：**

```
┌─────────────────────────────────────────┐
│  Logo    [搜索框]     [登录] [🛒 购物车]  │  ← 顶部导航栏
├─────────────────────────────────────────┤
│                                         │
│          Hero Banner / 主视觉            │  ← 大图 + 主标题 + CTA 按钮
│        "Master XX Skills Today"          │
│         [Browse Courses →]              │
│                                         │
├─────────────────────────────────────────┤
│  📚 Featured Courses                    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │  ← 精选课程卡片
│  │ 🖼️  │ │ 🖼️  │ │ 🖼️  │ │ 🖼️  │      │
│  │课程1 │ │课程2 │ │课程3 │ │课程4 │      │
│  │$49.99│ │$39.99│ │$29.99│ │$59.99│    │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│            [View All Courses →]         │
├─────────────────────────────────────────┤
│  🏷️ Categories                         │
│  [Design] [Development] [Business]      │  ← 分类标签
│  [Marketing] [More →]                  │
├─────────────────────────────────────────┤
│  ⭐ Testimonials                        │
│  "Great course! Learned so much..."     │  ← 用户评价轮播
│   — John D., USA ⭐⭐⭐⭐⭐              │
├─────────────────────────────────────────┤
│  Footer                                 │
│  About | Terms | Privacy | Contact      │  ← 页脚
│  © 2026 YourBrand. All rights reserved. │
└─────────────────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F1-1 | 导航栏 | Logo + 搜索框 + 登录按钮 + 购物车图标（显示数量徽章） |
| F1-2 | Hero Banner | 全屏主视觉图 + 标题 + 副标题 + CTA 按钮，可配置 |
| F1-3 | 精选课程 | 显示 `isActive=true` 且 `sortOrder` 高的课程，最多 8 个 |
| F1-4 | 分类导航 | 显示所有分类，点击进入课程列表（带分类筛选） |
| F1-5 | 用户评价 | 展示最新好评，轮播形式 |
| F1-6 | 页脚 | 静态链接 + 版权信息 |
| F1-7 | 滚动加载 | 精选课程超过可视区域时支持横向滚动 |

---

### F2 课程浏览（列表页）

**页面结构：**

```
┌─────────────────────────────────────────┐
│  导航栏（同首页）                         │
├──────────┬──────────────────────────────┤
│          │                              │
│ 筛选侧栏  │  排序：[最新 ▾] [价格 ▾]      │
│          │                              │
│ 分类      │  ┌─────┐ ┌─────┐ ┌─────┐   │
│ ☑ All    │  │ 🖼️  │ │ 🖼️  │ │ 🖼️  │   │
│ ☐ Design │  │课程  │ │课程  │ │课程  │   │
│ ☐ Dev    │  │$49  │ │$39  │ │$29  │   │
│ ☐ Biz    │  └─────┘ └─────┘ └─────┘   │
│          │                              │
│ 价格区间  │  ┌─────┐ ┌─────┐ ┌─────┐   │
│ ○ All    │  │ 🖼️  │ │ 🖼️  │ │ 🖼️  │   │
│ ○ <$25   │  │课程  │ │课程  │ │课程  │   │
│ ○ $25-50 │  └─────┘ └─────┘ └─────┘   │
│ ○ >$50   │                              │
│          │  [← 1  2  3 →]              │
└──────────┴──────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F2-1 | 分类筛选 | 左侧分类复选框，支持多选 |
| F2-2 | 价格筛选 | 按预设区间筛选或自定义范围 |
| F2-3 | 排序 | 最新 / 价格低→高 / 价格高→低 / 评分最高 |
| F2-4 | 课程卡片 | 封面图 + 标题 + 价格 + 评分 + 课时数 |
| F2-5 | 分页 | 每页 12 个课程，翻页加载 |
| F2-6 | URL 参数 | 筛选/排序结果反映在 URL 中（可分享、可返回） |
| F2-7 | 空状态 | 无结果时显示友好提示 |

---

### F3 课程详情页

**页面结构：**

```
┌─────────────────────────────────────────┐
│  导航栏                                  │
├─────────────────────┬───────────────────┤
│                     │                   │
│  ┌───────────────┐  │  Course Title     │
│  │               │  │  ⭐ 4.8 (120)     │
│  │  预览视频      │  │  By Author Name  │
│  │  (YouTube)    │  │                   │
│  │               │  │  $49.99           │
│  └───────────────┘  │  ~~$79.99~~ -38%  │
│                     │                   │
│                     │  [Add to Cart]    │  ← 大按钮
│                     │  [Buy Now]        │
│                     │                   │
│                     │  📦 20 Lessons    │
│                     │  ⏱️ 8h 30m total  │
│                     │  📱 Access on all │
│                     │  🔄 Lifetime      │
│                     │     access        │
├─────────────────────┴───────────────────┤
│                                         │
│  [Overview] [Curriculum] [Reviews]      │  ← Tab 切换
│                                         │
│  ──── Overview ────                     │
│  课程详细描述（富文本）                     │
│  你将学到：                               │
│  ✅ Skill A                             │
│  ✅ Skill B                             │
│  ✅ Skill C                             │
│                                         │
│  ──── Curriculum ────                   │
│  ▶ Chapter 1: Introduction (3 lessons)  │
│    1.1 Lesson Title       12:30 ⬜      │
│    1.2 Lesson Title       15:45 ⬜      │
│    1.3 Lesson Title       20:00 ⬜      │
│  ▶ Chapter 2: Basics (4 lessons)        │
│    2.1 Lesson Title       18:00 🔒      │  ← 未购买显示锁
│    ...                                  │
│                                         │
│  ──── Reviews ────                      │
│  ⭐⭐⭐⭐⭐ "Amazing course!" - Alice    │
│  ⭐⭐⭐⭐ "Very helpful" - Bob           │
│                                         │
├─────────────────────────────────────────┤
│  Related Courses                        │
│  [课程卡片] [课程卡片] [课程卡片]          │
└─────────────────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F3-1 | 封面/预览 | 封面大图或嵌入 YouTube/Vimeo 预览视频 |
| F3-2 | 课程信息 | 标题、评分、讲师、价格、课时数、章节数 |
| F3-3 | 加入购物车 | 点击后导航到购物车，商品加入 |
| F3-4 | 立即购买 | 跳过购物车，直接进入 Stripe Checkout |
| F3-5 | 课程大纲 | 展示章节和课时列表（带时长），未购买显示🔒 |
| F3-6 | 用户评价 | 展示购买用户的评分和评论 |
| F3-7 | 相关推荐 | 同分类下的其他课程，最多 4 个 |
| F3-8 | 课程元数据 | 用于 SEO 的 JSON-LD 结构化数据 |
| F3-9 | 已购检测 | 已购买的用户看到"Start Learning"按钮代替购买按钮 |

---

### F4 搜索

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F4-1 | 搜索入口 | 导航栏搜索框，点击展开 |
| F4-2 | 搜索范围 | 课程标题 + 描述 |
| F4-3 | 即时搜索 | 输入时 debounced（300ms）请求，展示下拉结果 |
| F4-4 | 搜索结果页 | 完整搜索结果列表（复用 F2 列表页组件） |
| F4-5 | 无结果 | 显示"No courses found"提示 + 建议 |
| F4-6 | URL 参数 | 搜索词写入 URL（`/courses?q=python`），可分享 |

---

### F5 用户注册/登录

**页面结构：**

```
┌─────────────────────────────┐
│                             │
│      Logo / Brand Name      │
│                             │
│  ┌───────────────────────┐  │
│  │ Email                 │  │
│  ├───────────────────────┤  │
│  │ Password              │  │
│  ├───────────────────────┤  │
│  │ Confirm Password (注册)│  │
│  └───────────────────────┘  │
│                             │
│  [ Create Account / Login ] │
│                             │
│  ── or ──                   │
│                             │
│  [ Continue with Google ]   │
│                             │
│  已有账号？去登录              │
│  没有账号？注册                │
│                             │
└─────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F5-1 | 邮箱注册 | 邮箱 + 密码（最少 8 位） |
| F5-2 | 邮箱登录 | 邮箱 + 密码，错误提示；未验证邮箱可登录但不能购买 |
| F5-3 | Google 登录 | OAuth 2.0（Phase 2，MVP 先只做邮箱） |
| F5-4 | 忘记密码 | 邮箱输入 → 发送重置链接 → 设置新密码（Token 1h 有效，一次性） |
| F5-5 | 退出登录 | 清除 JWT Token |
| F5-6 | 邮箱验证 | 注册后发送验证邮件（Token 24h 有效），未验证可登录但不能购买 |
| F5-7 | 购物车合并 | 登录时将 localStorage 中的课程 ID 列表 POST 到服务端合并到 Cart 表 |
| F5-8 | 登录态持久化 | JWT 存 httpOnly Cookie，7 天有效期 |

---

### F6 购物车

**页面结构：**

```
┌─────────────────────────────────────────┐
│  导航栏                                  │
├─────────────────────────────────────────┤
│                                         │
│  Shopping Cart (2 items)                │
│                                         │
│  ┌────┬──────────────────┬──────┬────┐  │
│  │ 🖼️ │ Course Title A    │$49.99│ ❌ │  │
│  └────┴──────────────────┴──────┴────┘  │
│  ┌────┬──────────────────┬──────┬────┐  │
│  │ 🖼️ │ Course Title B    │$39.99│ ❌ │  │
│  └────┴──────────────────┴──────┴────┘  │
│                                         │
│  ─────────────────────────────────────  │
│  优惠码: [___________] [Apply]          │
│                                         │
│  Subtotal:          $89.98              │
│  Discount (-10%):   -$9.00              │
│  Total:             $80.98              │
│                                         │
│  [ Proceed to Checkout → ]              │
│                                         │
│  ← Continue Shopping                    │
└─────────────────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F6-1 | 购物车列表 | 显示课程封面、标题、价格、删除按钮 |
| F6-2 | 数量 | 数字商品每门课程只能买 1 次，不需要数量 |
| F6-3 | 删除 | 移除购物车中的课程 |
| F6-4 | 优惠码 | 输入优惠码 → 验证 → 显示折扣金额和最终总价 |
| F6-5 | 已购过滤 | 自动隐藏已购买的课程 |
| F6-6 | 价格计算 | 小计、折扣、总计实时计算 |
| F6-7 | 空购物车 | 显示空状态 + 引导去浏览课程 |
| F6-8 | 未登录 | 未登录用户可添加购物车（存 localStorage），结算时要求登录并合并到服务端 Cart 表 |
| F6-9 | 持久化 | 未登录存 localStorage（课程 ID 列表），登录后 POST 合并到服务端 |

---

### F7 结算 & 支付

**页面结构（简洁版 — Stripe Checkout 跳转模式）：**

```
┌─────────────────────────────────────────┐
│  导航栏（简化版）                          │
├─────────────────────────────────────────┤
│                                         │
│  Order Summary                          │
│  ┌─────────────────────────────────┐    │
│  │ 🖼️ Course A              $49.99 │    │
│  │ 🖼️ Course B              $39.99 │    │
│  ├─────────────────────────────────┤    │
│  │ Subtotal:              $89.98   │    │
│  │ Discount (-10%):       -$9.00   │    │
│  │ Total:                 $80.98   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [ Proceed to Checkout → ]              │  ← 跳转到 Stripe 托管支付页
│                                         │
│  🔒 Secure payment powered by Stripe    │
│  💳 Visa / Mastercard / Apple Pay       │
│  📱 Google Pay                          │
│                                         │
│  Refund Policy: 30-day guarantee        │
└─────────────────────────────────────────┘
```

> **注意**：MVP 不使用 Stripe Elements 嵌入模式，全部跳转 Stripe Checkout 托管页面。
> 好处：无需 PCI 合规、开发简单、自动支持 Apple Pay / Google Pay。

**业务流程：**

```
用户点击 "Proceed to Checkout"
        │
        ▼
检查登录状态 ──→ 未登录 ──→ 弹出登录/注册框
        │
        ▼ 已登录
创建 Stripe Checkout Session（后端）
        │
        ▼
跳转 Stripe 托管支付页（或 Stripe Element 内嵌）
        │
        ▼
用户输入信用卡信息并支付
        │
        ├── 成功 ──→ Stripe Webhook 回调
        │              │
        │              ▼
        │         验证 Webhook 签名
        │              │
        │              ▼
        │         更新 Purchase 状态为 COMPLETED
        │              │
        │              ▼
        │         发送购买确认邮件
        │              │
        │              ▼
        │         重定向到 "购买成功" 页面
        │
        └── 失败 ──→ 显示错误信息，允许重试
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F7-1 | Stripe Checkout | 跳转到 Stripe 托管页面，简单安全 |
| F7-2 | 支付方式 | 信用卡 + Apple Pay + Google Pay（Stripe 自动支持） |
| F7-3 | 货币 | 默认 USD，支持多货币显示（Phase 2） |
| F7-4 | Webhook | 接收支付成功回调，自动激活课程 |
| F7-5 | 购买成功页 | 显示确认信息 + "开始学习" 按钮 |
| F7-6 | 邮件确认 | 自动发送购买确认邮件（含订单号、金额） |
| F7-7 | 失败处理 | 支付失败显示提示，订单保持 PENDING 状态 |
| F7-8 | 幂等性 | Webhook 重复调用不会重复创建购买记录 |

---

### F8 我的课程（学习中心）

**页面结构：**

```
┌─────────────────────────────────────────┐
│  导航栏                                  │
├─────────────────────────────────────────┤
│                                         │
│  My Learning                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🖼️ │ Course Title A              │    │
│  │     │ ████████░░░░ 60% complete  │    │  ← 进度条
│  │     │ [Continue Learning →]      │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 🖼️ │ Course Title B              │    │
│  │     │ ██░░░░░░░░░░ 15% complete  │    │
│  │     │ [Continue Learning →]      │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

### F8b 课程播放页

**页面结构：**

```
┌─────────────────────────────────────────┐
│  ← Back to My Courses                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         Video Player              │  │  ← 大播放器
│  │         (HTML5 Video)             │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Lesson 3.2: Advanced Techniques        │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ▶ Chapter 1: Introduction         │  │
│  │   ✅ 1.1 Lesson One      12:30   │  │  ← 已完成
│  │   ✅ 1.2 Lesson Two      15:45   │  │
│  │ ▶ Chapter 2: Fundamentals         │  │
│  │   ✅ 2.1 Lesson One      18:00   │  │
│  │   🔵 2.2 Lesson Two ←当前  22:00  │  │  ← 当前播放
│  │   ⬜ 2.3 Lesson Three    10:30   │  │  ← 未看
│  │ ▶ Chapter 3: Advanced             │  │
│  │   ⬜ 3.1 Lesson One      25:00   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F8-1 | 已购列表 | 按购买时间倒序显示，带学习进度条（从 LessonCompletion 计算） |
| F8-2 | 视频播放 | HTML5 Video 播放器，加载 R2 签名 URL |
| F8-3 | 章节列表 | 右侧/下方显示课程大纲，标记已完成/当前/未开始 |
| F8-4 | 进度追踪 | 播放完成（>90%）自动写入 LessonCompletion.completed=true |
| F8-5 | 记住位置 | LessonCompletion.lastPosition 记录上次播放秒数，打开自动跳转 |
| F8-6 | 上/下一课 | 播放完毕自动跳转下一课，或手动切换 |
| F8-7 | 全屏播放 | 支持全屏 |
| F8-8 | 进度保存 | 定期上报播放进度到后端（每 30 秒更新 LessonCompletion） |
| F8-9 | URL 过期处理 | 前端 VideoPlayer 监听 error 事件，签名 URL 过期时自动请求新 URL（限制每 30 分钟一次） |

---

### F9 个人资料

**功能点：**

| # | 功能 | 说明 |
|---|---|---|
| F9-1 | 基本信息 | 修改姓名 |
| F9-2 | 修改密码 | 输入旧密码 + 新密码 |
| F9-3 | 购买历史 | 历史订单列表（金额、日期、课程、状态），已支付订单显示"申请退款"按钮 |
| F9-4 | 发票下载 | 生成 PDF 发票下载（Phase 2） |

**用户自助退款流程：**

```
用户在订单历史点击"申请退款"
        │
        ▼
填写退款原因（必填）
        │
        ▼
提交 → Purchase 状态变为 REFUND_PENDING
        │
        ▼
管理员在后台审核（通过/拒绝）
        │
  ├── 通过 ──→ 调用 Stripe Refund API → 状态变为 REFUNDED → 撤销课程权限 → 发送邮件
  └── 拒绝 ──→ 状态变为 REFUND_REJECTED → 发送拒绝通知邮件（含原因）
```

---

## 十、管理后台功能详细设计

### G1 数据看板

**展示内容：**

```
┌──────────┬──────────┬──────────┬──────────┐
│ 今日销售额 │ 本月销售额 │ 总订单数  │ 总用户数  │
│  $159.97 │ $3,240   │   128    │   89     │
├──────────┴──────────┴──────────┴──────────┤
│                                           │
│  📈 销售趋势图（近 30 天）                   │
│                                           │
│  📊 最近 7 天订单量                         │
│                                           │
├───────────────────────────────────────────┤
│  🏆 热销课程 Top 5                         │
│  1. Course A  — 45 sales  — $2,249.55    │
│  2. Course B  — 32 sales  — $1,279.68    │
│  ...                                      │
├───────────────────────────────────────────┤
│  📋 最近订单                               │
│  #1028 | john@.. | Course A | $49.99 | 2h │
│  #1027 | alice@..| Course B | $39.99 | 5h │
│  ...                                      │
└───────────────────────────────────────────┘
```

---

### G2 课程管理

**课程列表页：**

| 字段 | 说明 |
|---|---|
| 封面缩略图 | 可更换 |
| 课程标题 | 可编辑 |
| 价格 (USD) | 数字输入 |
| 划线价 | 可选，用于显示折扣 |
| 分类 | 下拉选择 |
| 状态 | 已发布 / 草稿 |
| 课时数 | 自动统计 |
| 创建时间 | 自动 |

**课程编辑页：**

```
┌─ 基本信息 ──────────────────────────────┐
│  标题: [____________________]            │
│  Slug: [____________________] (自动生成) │
│  描述: [富文本编辑器                     ] │
│  分类: [下拉选择          ▾]            │
│  封面: [上传图片          ]              │
│  预览视频链接: [YouTube/Vimeo URL]       │
├─ 价格 ─────────────────────────────────┤
│  价格: [$ 49.99]                        │
│  划线价: [$ 79.99] (可选)               │
├─ 课程大纲 ──────────────────────────────┤
│  [+ Add Chapter]                        │
│                                         │
│  Chapter 1: Introduction          [✕]   │
│    1.1 [Lesson title] [video] [duration]│
│    1.2 [Lesson title] [video] [duration]│
│    [+ Add Lesson]                       │
│                                         │
│  Chapter 2: Basics              [✕]     │
│    2.1 [Lesson title] [video] [duration]│
│    [+ Add Lesson]                       │
│                                         │
│  [+ Add Chapter]                        │
├─ 设置 ─────────────────────────────────┤
│  排序权重: [0]                           │
│  状态: [Published ▾]                     │
│  显示在首页: [✓]                          │
└─────────────────────────────────────────┘
  [Save as Draft]  [Publish]
```

**视频上传流程：**

```
点击上传按钮
    │
    ▼
选择本地视频文件（最大 500MB，前端校验文件大小）
    │
    ▼
前端直传 Cloudflare R2（预签名 URL）
    │
    ▼
上传进度条显示
    │
    ▼
上传完成 → 后端保存 R2 Object Key 到 lesson.videoKey
    │
    ▼
后端通过 ffprobe 自动检测视频时长 → 填充 lesson.duration
（检测失败时允许管理员手动输入时长）
```

**静态页面管理（MVP）：**
- About / Terms / Privacy / Contact / Refund Policy 页面内容**硬编码在代码中**
- Phase 2 在管理后台增加富文本编辑功能

---

### G3 订单管理

**订单列表：**

| 字段 | 说明 |
|---|---|
| 订单号 | 自动生成（如 #CS-20260509-001） |
| 用户邮箱 | 点击查看用户详情 |
| 课程 | 点击查看课程详情 |
| 金额 | USD |
| 状态 | Pending / Completed / Refunded |
| 支付方式 | Stripe |
| 时间 | 购买时间 |

**订单操作：**

| 操作 | 条件 | 说明 |
|---|---|---|
| 查看详情 | 任何状态 | 查看完整订单信息 |
| 标记退款 | Completed | 手动标记 + 调用 Stripe Refund API |
| 重发邮件 | Completed | 重新发送购买确认邮件 |

---

### G4 用户管理

**用户列表：**

| 字段 | 说明 |
|---|---|
| 邮箱 | 主要标识 |
| 姓名 | 可选 |
| 注册时间 | 自动 |
| 购买数量 | 统计 |
| 总消费额 | 统计 |

---

### G5 优惠码管理

**创建优惠码表单：**

| 字段 | 说明 |
|---|---|
| 优惠码 | 手动输入（自动转大写） |
| 类型 | 百分比折扣 / 固定金额折扣 |
| 折扣值 | 如 10（表示 10% 或 $10） |
| 最大使用次数 | 可选，不限制 |
| 过期时间 | 可选 |
| 状态 | 启用 / 停用 |

**使用流程：**

```
用户在购物车输入优惠码
        │
        ▼
后端验证：
  - 优惠码是否存在
  - 是否启用
  - 是否过期
  - 使用次数是否超限
        │
  ├── 有效 ──→ 返回折扣信息，更新总价
  └── 无效 ──→ 返回错误原因（码不存在/已过期/已用完）
```

**折扣计算规则：**

| 类型 | 计算方式 | 示例 |
|---|---|---|
| **PERCENT（百分比）** | 按购物车总价计算 | 总价 $80，10% 折扣 → 减 $8，实付 $72 |
| **FIXED（固定金额）** | 从总价中直接扣除 | 总价 $80，$10 折扣 → 实付 $70 |
| **最低金额** | 固定折扣 ≥ 总价时，最低支付 $0.01 | 总价 $5，$10 折扣 → 实付 $0.01 |
| **限制** | 一个订单只能使用一个优惠码 | — |
| **适用范围** | 所有课程通用（不做课程级别限制） | — |

---

### G6 系统设置

| 配置项 | 说明 |
|---|---|
| 店铺名称 | 显示在页面标题和邮件中 |
| 店铺 Logo | 上传 Logo 图片 |
| 联系邮箱 | 显示在页脚，接收通知 |
| Stripe 密钥 | Secret Key + Webhook Secret |
| 邮件模板 | 购买确认邮件内容编辑 |
| SEO 设置 | 默认 Meta Title / Description |
| 页脚链接 | 管理页脚导航链接 |

---

## 五、数据库设计（完整版）

```prisma
// ========== 用户 ==========
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // bcrypt
  name          String?
  emailVerified DateTime? // 邮箱验证时间，null 表示未验证
  role          Role     @default(CUSTOMER)
  cart          Cart?    // 一对一购物车
  purchases     Purchase[]
  reviews       Review[]
  completions   LessonCompletion[]
  tokens        VerificationToken[]
  createdAt     DateTime @default(now())
}

// ========== 邮箱/密码重置 Token ==========
model VerificationToken {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId])
  userId    String
  token     String   @unique // 随机 32 字节 hex
  type      TokenType
  expiresAt DateTime
  usedAt    DateTime? // null 表示未使用
  createdAt DateTime @default(now())
}

enum TokenType {
  EMAIL_VERIFICATION
  PASSWORD_RESET
}

// ========== 分类 ==========
model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  sortOrder Int       @default(0)
  courses   Course[]
  createdAt DateTime  @default(now())
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
  ratingAvg   Float    @default(0)         // 平均评分
  ratingCount Int      @default(0)         // 评价数量
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)     // 是否首页精选
  sortOrder   Int      @default(0)
  category    Category @relation(fields: [categoryId])
  categoryId  String
  chapters    Chapter[]
  purchases   Purchase[]
  reviews     Review[]
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
  id          String  @id @default(cuid())
  title       String
  sortOrder   Int     @default(0)
  videoKey    String? // R2 对象 key（私有）
  duration    Int?    // 秒（上传时 ffprobe 自动检测）
  chapter     Chapter @relation(fields: [chapterId])
  chapterId   String
  completions LessonCompletion[]
}

// ========== 课时完成记录 ==========
model LessonCompletion {
  id           String   @id @default(cuid())
  user         User     @relation(fields: [userId])
  userId       String
  lesson       Lesson   @relation(fields: [lessonId])
  lessonId     String
  progress     Int      @default(0)  // 播放百分比 0-100
  completed    Boolean  @default(false)
  lastPosition Int      @default(0)  // 上次播放位置（秒）
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, lessonId])
}

// ========== 购物车 ==========
model Cart {
  id        String     @id @default(cuid())
  user      User       @relation(fields: [userId])
  userId    String     @unique // 一对一
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  cart      Cart     @relation(fields: [cartId])
  cartId    String
  course    Course   @relation(fields: [courseId])
  courseId  String
  createdAt DateTime @default(now())

  @@unique([cartId, courseId]) // 同一购物车不重复添加
}

// ========== 购买记录 ==========
model Purchase {
  id               String         @id @default(cuid())
  user             User           @relation(fields: [userId])
  userId           String
  course           Course         @relation(fields: [courseId])
  courseId          String
  amount           Decimal        @db.Decimal(10, 2)
  stripeId         String?        @unique // Stripe Payment Intent ID
  status           PurchaseStatus @default(PENDING)
  orderNumber      String         @unique // 如 #CS-20260509-001
  refundRequestedAt DateTime?     // 用户申请退款时间
  refundReason     String?        @db.Text
  createdAt        DateTime       @default(now())

  @@unique([userId, courseId]) // 一个用户只能买一次
}

enum PurchaseStatus {
  PENDING
  COMPLETED
  REFUND_PENDING  // 用户已申请退款，等待审核
  REFUND_REJECTED // 退款被拒绝
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
  id        String     @id @default(cuid())
  code      String     @unique  // 大写
  type      CouponType
  value     Decimal    @db.Decimal(10, 2) // 百分比或固定金额
  maxUses   Int?       // 总使用次数上限
  usedCount Int        @default(0)
  expiresAt DateTime?
  isActive  Boolean    @default(true)
  createdAt DateTime   @default(now())
}

enum CouponType {
  PERCENT   // 百分比折扣（按购物车总价计算）
  FIXED     // 固定金额折扣（从总价中扣除，最低支付 $0.01）
}

// ========== 系统设置 ==========
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

### 数据库模型修复说明

| 修复项 | 说明 |
|---|---|
| **Category** | 新增完整模型（id, name, slug, sortOrder, courses 关联） |
| **Cart + CartItem** | 新增购物车模型，User 一对一关联 Cart |
| **LessonCompletion** | 新增课时完成记录，替代 Purchase.progress JSON |
| **VerificationToken** | 新增 Token 表，支持邮箱验证和密码重置 |
| **Course.ratingAvg/ratingCount** | 新增评分聚合字段 |
| **User.emailVerified** | 新增邮箱验证时间字段 |
| **Purchase** | 新增 orderNumber, refundRequestedAt, refundReason；新增 REFUND_PENDING/REFUND_REJECTED 状态 |
| **删除 ProductImage** | 课程封面用 coverImage String 字段即可 |
| **删除 User.cart/wishlist** | 改为 Cart 模型一对一关联 |

---

## 六、完整业务流程

### 6.1 新用户购买流程

```
┌──────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│ 访问  │───►│ 浏览课程  │───►│ 课程详情  │───►│ 加入购物车│
│ 首页  │    │ 列表页   │    │ 页       │    │ 或立即买 │
└──────┘    └──────────┘    └──────────┘    └────┬────┘
                                                 │
                    ┌─────────────────────────────┘
                    ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │ 输入优惠码 │───►│ 确认订单  │───►│ 跳转支付  │
              │ (可选)    │    │ 总价确认  │    │ Stripe   │
              └──────────┘    └──────────┘    └────┬────┘
                                                   │
                                    ┌───────────────┼───────────────┐
                                    ▼               ▼               ▼
                              ┌──────────┐   ┌──────────┐   ┌──────────┐
                              │ 支付成功  │   │ 支付失败  │   │ 用户取消  │
                              └────┬─────┘   └────┬─────┘   └────┬─────┘
                                   │              │              │
                                   ▼              ▼              ▼
                              ┌──────────┐   ┌──────────┐   ┌──────────┐
                              │ Webhook  │   │ 显示错误  │   │ 返回购物车│
                              │ 激活课程  │   │ 允许重试  │   │          │
                              └────┬─────┘   └──────────┘   └──────────┘
                                   │
                                   ▼
                              ┌──────────┐    ┌──────────┐
                              │ 发送邮件  │───►│ 学习中心  │
                              │ 确认购买  │    │ 开始学习  │
                              └──────────┘    └──────────┘
```

### 6.2 视频播放流程

```
用户点击 "Continue Learning"
        │
        ▼
后端验证购买状态 ──→ 未购买 ──→ 返回 403
        │
        ▼ 已购买
后端查询 lesson.videoKey
        │
        ▼
向 Cloudflare R2 请求签名 URL（有效期 2h）
        │
        ▼
返回签名 URL 给前端
        │
        ▼
前端 VideoPlayer 加载视频
        │
        ├── 每 30s ──→ 上报播放进度到后端
        │
        └── 播放完成（>90%）──→ 标记该课时已完成
                                  │
                                  ▼
                            更新课程完成百分比
```

### 6.3 退款流程

```
管理员在后台找到订单
        │
        ▼
点击 "Refund"
        │
        ▼
确认退款弹窗（显示金额和用户）
        │
        ├── 确认 ──→ 调用 Stripe Refund API
        │              │
        │              ├── 成功 ──→ 更新订单状态为 REFUNDED
        │              │              ──→ 撤销课程访问权限
        │              │              ──→ 发送退款通知邮件
        │              │
        │              └── 失败 ──→ 显示错误，记录日志
        │
        └── 取消 ──→ 返回订单列表
```

---

## 七、页面路由设计

### 用户端路由

| 路由 | 页面 | 认证 |
|---|---|---|
| `/` | 首页 | 公开 |
| `/courses` | 课程列表 | 公开 |
| `/courses/[slug]` | 课程详情 | 公开 |
| `/search?q=xxx` | 搜索结果 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/forgot-password` | 忘记密码 | 公开 |
| `/reset-password?token=xxx` | 重置密码 | 公开 |
| `/cart` | 购物车 | 登录 |
| `/checkout` | 结算 | 登录 |
| `/checkout/success` | 支付成功 | 登录 |
| `/account` | 个人资料 | 登录 |
| `/account/purchases` | 已购课程列表 | 登录 |
| `/account/purchases/[id]` | 课程播放页 | 登录+已购 |
| `/account/orders` | 订单历史 | 登录 |

### 管理后台路由

| 路由 | 页面 | 认证 |
|---|---|---|
| `/admin` | 数据看板 | Admin |
| `/admin/courses` | 课程列表 | Admin |
| `/admin/courses/new` | 创建课程 | Admin |
| `/admin/courses/[id]` | 编辑课程 | Admin |
| `/admin/orders` | 订单列表 | Admin |
| `/admin/orders/[id]` | 订单详情 | Admin |
| `/admin/users` | 用户列表 | Admin |
| `/admin/coupons` | 优惠码管理 | Admin |
| `/admin/settings` | 系统设置 | Admin |
| `/admin/login` | 管理员登录 | 公开 |

**管理员账号创建方式：**
- 首次部署时通过种子脚本创建：`npx prisma db seed`
- 管理员邮箱和密码从环境变量读取：`ADMIN_EMAIL` + `ADMIN_PASSWORD`
- 管理后台使用独立登录页 `/admin/login`，不和用户共用登录
- Admin API 所有路由验证 JWT + `role=ADMIN`

### API 路由

| 方法 | 路由 | 说明 | 认证 |
|---|---|---|---|
| POST | `/api/auth/register` | 注册 | 公开 |
| POST | `/api/auth/login` | 登录 | 公开 |
| POST | `/api/auth/forgot-password` | 忘记密码 | 公开 |
| POST | `/api/auth/reset-password` | 重置密码 | 公开 |
| POST | `/api/auth/verify-email` | 邮箱验证 | 公开 |
| GET | `/api/courses` | 课程列表（分页+筛选） | 公开 |
| GET | `/api/courses/[slug]` | 课程详情 | 公开 |
| POST | `/api/cart` | 添加到购物车 | 登录 |
| GET | `/api/cart` | 获取购物车 | 登录 |
| DELETE | `/api/cart/[courseId]` | 移除购物车项 | 登录 |
| POST | `/api/coupon/validate` | 验证优惠码 | 登录 |
| POST | `/api/checkout` | 创建 Stripe Checkout Session | 登录 |
| POST | `/api/webhooks/stripe` | Stripe Webhook 回调 | Stripe签名 |
| GET | `/api/purchases` | 已购课程列表 | 登录 |
| POST | `/api/purchases/[id]/video-url` | 获取视频签名 URL | 登录+已购 |
| POST | `/api/purchases/[id]/progress` | 上报播放进度 | 登录+已购 |
| POST | `/api/orders/[id]/refund-request` | 申请退款 | 登录 |
| GET | `/api/account` | 获取个人信息 | 登录 |
| PUT | `/api/account` | 更新个人信息 | 登录 |
| PUT | `/api/account/password` | 修改密码 | 登录 |

### Admin API 路由

| 方法 | 路由 | 说明 |
|---|---|---|
| GET | `/api/admin/dashboard` | 看板数据 |
| GET/POST | `/api/admin/courses` | 课程 CRUD |
| PUT | `/api/admin/courses/[id]` | 更新课程 |
| DELETE | `/api/admin/courses/[id]` | 删除课程 |
| POST | `/api/admin/upload/presign` | 获取 R2 上传预签名 URL |
| GET | `/api/admin/orders` | 订单列表 |
| POST | `/api/admin/orders/[id]/refund` | 退款 |
| GET | `/api/admin/users` | 用户列表 |
| CRUD | `/api/admin/coupons` | 优惠码管理 |
| GET/PUT | `/api/admin/settings` | 系统设置 |
| POST | `/api/admin/orders/[id]/review-refund` | 审核退款申请 |

---

## 八、非功能需求

### 7.1 性能

| 指标 | 目标 |
|---|---|
| 首页加载时间 | < 2s（LCP） |
| API 响应时间 | < 200ms（P95） |
| 视频播放启动 | < 3s |
| 并发用户支持 | 100+ |

### 7.2 安全

| 措施 | 说明 |
|---|---|
| HTTPS | 全站强制 HTTPS（Cloudflare + Vercel） |
| 密码加密 | bcrypt，12 rounds |
| JWT 安全 | httpOnly Cookie，7 天过期 |
| CORS | 仅允许前端域名 |
| Rate Limiting | API 限流（登录 5次/分钟，其他 60次/分钟） |
| 输入验证 | 所有输入使用 Zod 验证 |
| SQL 注入 | Prisma ORM 自动防护 |
| CSRF | 同站 Cookie + Origin 检查 |
| 视频保护 | R2 签名 URL + 短时效 + 禁止下载 |
| Stripe Webhook | 验证签名，防止伪造 |

### 7.3 SEO

| 措施 | 说明 |
|---|---|
| SSR/SSG | Next.js 服务端渲染，搜索引擎可抓取 |
| Meta Tags | 每个页面独立的 title + description |
| Open Graph | 社交分享预览（图片、标题、描述） |
| JSON-LD | 课程页面的结构化数据（Product + Review） |
| Sitemap | 自动生成 sitemap.xml |
| Robots.txt | 允许搜索引擎爬取公开页面 |
| Canonical URL | 防止重复内容 |
| 图片优化 | Next.js Image 组件自动 WebP + lazy load |

### 7.4 监控

| 工具 | 用途 |
|---|---|
| Vercel Analytics | 前端性能监控（免费） |
| Uptime Robot | 网站可用性监控（免费） |
| Stripe Dashboard | 支付数据监控 |
| 自建日志 | 后端错误日志（Docker 日志 + 文件） |

---

## 九、邮件模板

### 8.1 购买确认邮件

```
Subject: 🎉 Your purchase is confirmed!

Hi [Name],

Thanks for purchasing "[Course Title]"!

Order #: #CS-20260509-001
Amount: $49.99
Date: May 9, 2026

You can start learning right away:
[Start Learning →]

If you have any questions, reply to this email.

Best,
[Brand Name]
```

### 9.2 密码重置邮件

```
Subject: Reset your password

Hi [Name],

Click the link below to reset your password:
[Reset Password →]

This link expires in 1 hour.

If you didn't request this, ignore this email.
```

### 9.3 邮箱验证邮件

```
Subject: Verify your email address

Hi [Name],

Please verify your email address by clicking the link below:
[Verify Email →]

This link expires in 24 hours.

If you didn't create an account, ignore this email.
```

### 9.4 退款申请确认邮件

```
Subject: Your refund request has been received

Hi [Name],

We've received your refund request for "[Course Title]" (Order #CS-XXXX).

Our team will review your request within 3 business days.
You'll receive an email once a decision has been made.

Best,
[Brand Name]
```

### 9.5 退款结果通知邮件

```
Subject: Your refund has been [approved/denied]

Hi [Name],

Your refund request for "[Course Title]" (Order #CS-XXXX) has been [approved/denied].

[If approved] The refund of $XX.XX will appear on your statement within 5-10 business days.
[If denied] Reason: [refund reason]

If you have questions, reply to this email.

Best,
[Brand Name]
```

---

## 十、静态页面内容定义（MVP）

### /refund-policy 退款政策

```
Refund Policy

All digital products (video courses) are non-refundable once delivered.

Exception: If the course content is materially different from what was 
advertised, you may request a refund within 30 days of purchase.

To request a refund, please contact support@yourbrand.com or use the 
"Request Refund" button in your order history.

Refund decisions are made within 3 business days.
```

### /about 关于我们

```
About [Brand Name]

We are passionate about helping people learn new skills through 
high-quality video courses. Our courses are created by industry 
experts and designed for practical, real-world application.

Contact: support@yourbrand.com
```

### /terms 服务条款

```
Terms of Service

1. You receive lifetime access to purchased courses
2. Courses are for personal use only, not for redistribution
3. We reserve the right to update course content
4. Abuse of the platform may result in account termination
```

### /privacy 隐私政策

```
Privacy Policy

We collect: email, name, payment info (via Stripe), and learning progress.
We do not sell your data to third parties.
Payment info is handled by Stripe and never stored on our servers.
Contact: support@yourbrand.com
```

---

## 十、技术依赖清单

```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "fastify": "^5.0",
    "@fastify/cors": "^10.0",
    "@fastify/jwt": "^9.0",
    "@fastify/rate-limit": "^10.0",
    "prisma": "^6.0",
    "@prisma/client": "^6.0",
    "stripe": "^17.0",
    "bcryptjs": "^2.4",
    "zod": "^3.23",
    "resend": "^4.0",
    "@aws-sdk/client-s3": "^3.0",
    "@aws-sdk/s3-request-presigner": "^3.0",
    "tailwindcss": "^4.0",
    "class-variance-authority": "^0.7",
    "clsx": "^2.1",
    "lucide-react": "^0.400"
  }
}
```

---

## 十一、下一步行动

- [ ] **确认需求**：本文档是否有遗漏或需要调整的功能？
- [ ] **确定域名**：想好品牌名和域名
- [ ] **注册 Stripe**：需要提前注册并完成验证
- [ ] **开始开发**：确认后进入 Phase 1 实施
