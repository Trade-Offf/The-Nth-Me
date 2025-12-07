<p align="right">
  <strong>🌐 语言:</strong>
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

# 第N个我 | The Nth Me

<p align="center">
  <img src="public/logo.png" alt="The Nth Me Logo" width="120" />
</p>

<p align="center">
  <strong>🌌 AI 驱动的平行宇宙肖像生成器</strong>
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-技术栈">技术栈</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-环境变量">环境变量</a> •
  <a href="#-部署">部署</a> •
  <a href="#-许可证">许可证</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey?style=flat-square" alt="License" />
</p>

---

## ✨ 功能特性

- 🎭 **双模式生成** — 模板模式（预设风格一键生成）+ 自由模式（自定义 Prompt）
- 🔮 **标准/Pro 双模型** — 标准模型快速出图，Pro 模型高清细节 + 多尺寸输出
- 📚 **Prompt 库** — 持续更新的风格模板，支持分类筛选与一键复制
- 💳 **双渠道支付** — 国内爱发电 + 海外 Paddle，自动识别地区与货币
- 🔐 **NextAuth 认证** — GitHub / Google OAuth 快速登录
- 🌍 **中英双语** — 完整 i18n 支持，自动识别浏览器语言
- 🎨 **赛博朋克 UI** — 命运石之门风格，二进制雨 + 3D 科技感动效
- 📱 **响应式设计** — 桌面端/移动端自适应布局

## 🛠 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | PostgreSQL + Prisma ORM |
| 认证 | NextAuth.js |
| 动画 | Framer Motion |
| AI 后端 | 银河杂货铺 API |
| 支付 | 爱发电 + Paddle |

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/Trade-Offf/The-Nth-Me.git
cd The-Nth-Me

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填写配置

# 初始化数据库
npx prisma generate
npx prisma db push

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🔑 环境变量

在根目录创建 `.env.local` 文件：

```env
# 数据库
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (可选)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI API
NANOBANANA_API_KEY="your-api-key"

# 爱发电支付 (可选)
AFDIAN_USER_ID="your-afdian-user-id"
AFDIAN_TOKEN="your-afdian-token"
```

## 📦 部署

### Vercel (推荐)

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Trade-Offf/The-Nth-Me)

1. 点击上方按钮
2. 在 Vercel 控制台配置环境变量
3. 部署

### 手动部署

```bash
npm run build
npm start
```

## 📁 项目结构

```
├── app/                  # Next.js App Router 页面
│   ├── api/              # API 路由
│   ├── portal/           # 图片生成页面
│   ├── showcase/         # 世界线画廊
│   └── ...
├── components/           # React 组件
├── lib/
│   ├── i18n/             # 国际化
│   ├── services/         # 业务逻辑
│   └── ...
├── prisma/               # 数据库 Schema
└── public/               # 静态资源
```

## 🏗 架构

```mermaid
flowchart TB
    subgraph 前端["🖥️ 前端"]
        Home["🏠 首页<br/>app/page.tsx"]
        Portal["🧪 实验室<br/>app/portal/page.tsx"]
        Showcase["🌌 时空坐标库<br/>app/showcase/page.tsx"]
        Pricing["⚡ 充能站<br/>app/pricing/page.tsx"]
        User["👤 个人中心<br/>app/user/page.tsx"]
        Login["🔐 登录<br/>app/login/page.tsx"]
    end

    subgraph 组件["🧩 组件层"]
        Navbar["导航栏"]
        ControlPanel["控制面板"]
        PreviewPanel["预览面板"]
        TechCard["科技卡片"]
    end

    subgraph API["⚙️ API 层"]
        AuthAPI["🔑 认证<br/>/api/auth"]
        GenerateAPI["🎨 生成<br/>/api/generate"]
        UserAPI["👤 用户<br/>/api/user/*"]
        WebhookAPI["💰 支付回调<br/>/api/webhook/*"]
    end

    subgraph 服务["🔧 服务层"]
        CreditService["积分服务"]
        RedeemService["兑换服务"]
        NanobananaAPI["AI 图像 API"]
    end

    subgraph 数据库["💾 数据层"]
        Prisma["Prisma ORM"]
        PostgreSQL[("PostgreSQL")]
    end

    subgraph 外部["☁️ 外部服务"]
        NextAuth["NextAuth.js"]
        Afdian["爱发电"]
        Paddle["Paddle"]
        AIService["AI 服务"]
    end

    Home --> Portal
    Home --> Showcase
    Home --> Pricing
    Portal --> ControlPanel
    Portal --> PreviewPanel

    ControlPanel -->|"请求"| GenerateAPI
    GenerateAPI --> CreditService
    GenerateAPI --> NanobananaAPI
    NanobananaAPI --> AIService

    Login --> AuthAPI
    AuthAPI --> NextAuth

    Pricing --> Afdian
    Pricing --> Paddle
    Afdian --> WebhookAPI
    Paddle --> WebhookAPI
    WebhookAPI --> CreditService

    CreditService --> Prisma
    Prisma --> PostgreSQL
```

### 核心流程

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 用户
    participant F as 🖥️ 前端
    participant A as ⚙️ API
    participant C as 💰 积分服务
    participant AI as 🤖 AI 服务
    participant DB as 💾 数据库

    U->>F: 访问 /portal
    U->>F: 配置参数并提交
    F->>A: POST /api/generate
    A->>C: 检查积分
    C->>DB: 查询余额

    alt 积分不足
        A-->>F: 返回错误
        F-->>U: 显示充值提示
    end

    A->>C: 扣除积分
    A->>AI: 调用图像生成
    AI-->>A: 返回图片 URL
    A->>DB: 保存生成记录
    A-->>F: 成功 + 图片
    F-->>U: 显示结果
```

## ➕ 如何新增 Prompt

### 第一步：添加 Prompt 配置

编辑 `lib/prompts.ts`，在 `prompts` 数组中添加新条目：

```typescript
{
  id: 'your-prompt-id',           // 唯一 ID，也用于展示图片路径
  name: '提示词名称',               // 显示名称
  prompt: 'Your AI prompt here',  // 实际的提示词内容
  negativePrompt: 'optional',     // 可选的负面提示词
  sampleStrength: 0.8,            // 风格强度 (0-2)
  tags: ['portrait', 'your-tag'], // 第一个 tag = 主分类
  showCompare: true,              // true: 前后对比滑块, false: 仅显示单张图
}
```

### 第二步：添加展示图片

将图片放入 `/public/showcase/{id}/` 目录：

| 模式 | 所需文件 | 展示效果 |
|------|----------|----------|
| **对比模式** (`showCompare: true`) | `before.webp` + `after.webp` | 前后对比滑块 |
| **单图模式** (`showCompare: false`) | 仅需 `after.webp` | 单张图片展示 |

### 第三步：添加 i18n 翻译

在 `lib/i18n/locales/en-US.ts` 和 `zh-CN.ts` 中添加翻译：

```typescript
worldlines: {
  'your-prompt-id': {
    name: '显示名称',
    description: '风格的简短描述',
  },
  // ...
}
```

### 第四步：（可选）添加为世界线模板

如果希望该 Prompt 出现在 Portal 模板选择器中，需编辑 `lib/worldlines.ts`：

```typescript
{
  id: 'your-prompt-id',
  name: '模板名称',
  code: 'TL-XX',
  description: '模板描述',
  imageUrl: '/prompt_cover/xx_name.png',
  prompt: buildFullPrompt(prompts.find((p) => p.id === 'your-prompt-id')!),
  sampleStrength: prompts.find((p) => p.id === 'your-prompt-id')?.sampleStrength || 0.8,
  isPro: false,  // true = 仅 Pro 用户可用
}
```

## 📝 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
<类型>(<作用域>): <描述>

[可选正文]

[可选脚注]
```

### 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 仅文档更新 |
| `style` | 代码风格（格式化、分号等） |
| `refactor` | 代码重构（无功能变更） |
| `perf` | 性能优化 |
| `test` | 添加或更新测试 |
| `chore` | 构建过程、依赖等 |
| `ci` | CI/CD 配置 |
| `revert` | 回滚提交 |

### 作用域（可选）

| 作用域 | 说明 |
|--------|------|
| `portal` | 实验室/生成页面 |
| `showcase` | 时空坐标库 |
| `pricing` | 充能站 |
| `auth` | 认证 |
| `api` | API 路由 |
| `i18n` | 国际化 |
| `db` | 数据库/Prisma |
| `ui` | UI 组件 |

### 示例

```bash
feat(portal): 添加随机提示词按钮
fix(api): 处理空图片响应
docs: 更新 README 提交规范
style(ui): 格式化 TechCard 组件
refactor(auth): 提取会话验证逻辑
perf(showcase): 延迟加载画廊图片
chore: 升级 Next.js 到 14.2
```

## 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](LICENSE) 许可证。

- ✅ 你可以使用、分享和改编本项目
- ❌ **禁止**商业用途
- 📝 必须注明出处
- 🔄 衍生作品必须使用相同许可证

---

<p align="center">
  用 ❤️ 制作 by <a href="https://github.com/Trade-Offf">Trade-Offf</a>
</p>

