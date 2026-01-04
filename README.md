<p align="right">
  <strong>🌐 Language:</strong>
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

# 第N个我 | The Nth Me

<p align="center">
  <img src="public/logo.png" alt="The Nth Me Logo" width="120" />
</p>

<p align="center">
  <strong>The Ultimate Image Meta-Toolbox</strong><br/>
  <em>Aggregate N black-techs, handle all image needs</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#environment-variables">Environment</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey?style=flat-square" alt="License" />
</p>

---

## ✨ Features

**Nthme** is the ultimate image meta-toolbox that integrates AI computing power with traditional algorithms. 20+ professional tools at your fingertips.

- 🎭 **Dual Creation Modes** — Template mode (one-click presets) + Free mode (custom prompts)
- 🔮 **Standard & Pro Models** — Standard for speed, Pro for HD details + multiple aspect ratios
- 📚 **Prompt Library** — Growing collection of style templates with filtering & one-click copy
- 💳 **Global Payment** — Afdian (CNY) + Paddle (USD), auto region & currency detection
- 🔐 **Quick Login** — GitHub / Google OAuth authentication
- 🌍 **Bilingual** — Full i18n support (English & 简体中文), auto language detection
- 🎨 **Cyberpunk UI** — Dark theme + neon colors, tech-powered aesthetics
- 📱 **Responsive** — Desktop & mobile adaptive layout

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| Animation | Framer Motion |
| AI Backend | Nano Banana API |
| Payment | Afdian Webhook |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Trade-Offf/The-Nth-Me.git
cd The-Nth-Me

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI API
NANOBANANA_API_KEY="your-api-key"

# Afdian Payment (optional)
AFDIAN_USER_ID="your-afdian-user-id"
AFDIAN_TOKEN="your-afdian-token"
```

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Trade-Offf/The-Nth-Me)

1. Click the button above
2. Configure environment variables in Vercel dashboard
3. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes
│   ├── portal/           # AI image generation
│   ├── showcase/         # Prompt library
│   └── ...
├── components/           # React components
├── lib/
│   ├── i18n/             # Internationalization
│   ├── services/         # Business logic
│   └── ...
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🏗 Architecture

```mermaid
flowchart TB
    subgraph Frontend["🖥️ Frontend"]
        Home["🏠 Home<br/>app/page.tsx"]
        Portal["🧪 AI Image Gen<br/>app/portal/page.tsx"]
        Showcase["🌌 Prompt Library<br/>app/showcase/page.tsx"]
        Pricing["⚡ Buy Credits<br/>app/pricing/page.tsx"]
        User["👤 User Center<br/>app/user/page.tsx"]
        Login["🔐 Login<br/>app/login/page.tsx"]
    end

    subgraph Components["🧩 Components"]
        Navbar["Navbar"]
        ControlPanel["ControlPanel"]
        PreviewPanel["PreviewPanel"]
        TechCard["TechCard"]
    end

    subgraph API["⚙️ API Layer"]
        AuthAPI["🔑 Auth<br/>/api/auth"]
        GenerateAPI["🎨 Generate<br/>/api/generate"]
        UserAPI["👤 User<br/>/api/user/*"]
        WebhookAPI["💰 Webhook<br/>/api/webhook/*"]
    end

    subgraph Services["🔧 Services"]
        CreditService["Credit Service"]
        RedeemService["Redeem Service"]
        NanobananaAPI["AI Image API"]
    end

    subgraph Database["💾 Database"]
        Prisma["Prisma ORM"]
        PostgreSQL[("PostgreSQL")]
    end

    subgraph External["☁️ External Services"]
        NextAuth["NextAuth.js"]
        Afdian["Afdian"]
        Paddle["Paddle"]
        AIService["AI Service"]
    end

    Home --> Portal
    Home --> Showcase
    Home --> Pricing
    Portal --> ControlPanel
    Portal --> PreviewPanel

    ControlPanel -->|"Request"| GenerateAPI
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

### Core Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant F as 🖥️ Frontend
    participant A as ⚙️ API
    participant C as 💰 Credit Service
    participant AI as 🤖 AI Service
    participant DB as 💾 Database

    U->>F: Visit /portal
    U->>F: Configure & Submit
    F->>A: POST /api/generate
    A->>C: Check credits
    C->>DB: Query balance

    alt Insufficient credits
        A-->>F: Error response
        F-->>U: Show recharge prompt
    end

    A->>C: Deduct credits
    A->>AI: Call image generation
    AI-->>A: Return image URL
    A->>DB: Save generation record
    A-->>F: Success + image
    F-->>U: Display result
```

## ➕ Adding a New Prompt

### Step 1: Add Prompt Config

Edit `lib/prompts.ts` and add a new entry to the `prompts` array:

```typescript
{
  id: 'your-prompt-id',           // Unique ID, used for showcase image path
  name: '提示词名称',               // Display name (Chinese)
  prompt: 'Your AI prompt here',  // The actual prompt text
  negativePrompt: 'optional',     // Optional negative prompt
  sampleStrength: 0.8,            // Style strength (0-2)
  tags: ['portrait', 'your-tag'], // First tag = primary category
  showCompare: true,              // true: before/after slider, false: single image
}
```

### Step 2: Add Showcase Images

Place images in `/public/showcase/{id}/`:

| Mode | Files Required | Display |
|------|----------------|---------|
| **Compare mode** (`showCompare: true`) | `before.webp` + `after.webp` | Before/After slider |
| **Single mode** (`showCompare: false`) | `after.webp` only | Single image display |

### Step 3: Add i18n Translations

Add translations to both `lib/i18n/locales/en-US.ts` and `zh-CN.ts`:

```typescript
worldlines: {
  'your-prompt-id': {
    name: 'Tool Name',
    description: 'Short description for this tool',
  },
  // ...
}
```

### Step 4: (Optional) Add as Quick Template

If you want this prompt to appear in the AI Image Generation page template selector, add it to `lib/worldlines.ts`:

```typescript
{
  id: 'your-prompt-id',
  name: '模板名称',
  code: 'TL-XX',
  description: '模板描述',
  imageUrl: '/prompt_cover/xx_name.png',
  prompt: buildFullPrompt(prompts.find((p) => p.id === 'your-prompt-id')!),
  sampleStrength: prompts.find((p) => p.id === 'your-prompt-id')?.sampleStrength || 0.8,
  isPro: false,  // true = Pro users only
}
```

## 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature/fix) |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, etc. |
| `ci` | CI/CD configuration |
| `revert` | Revert a previous commit |

### Scopes (Optional)

| Scope | Description |
|-------|-------------|
| `portal` | AI image generation |
| `showcase` | Prompt library |
| `pricing` | Buy credits |
| `auth` | Authentication |
| `api` | API routes |
| `i18n` | Internationalization |
| `db` | Database/Prisma |
| `ui` | UI components |

### Examples

```bash
feat(portal): add random prompt button
fix(api): handle empty image response
docs: update README with commit convention
style(ui): format TechCard component
refactor(auth): extract session validation logic
perf(showcase): lazy load gallery images
chore: upgrade Next.js to 14.2
```

## 📄 License

This project is licensed under [CC BY-NC-SA 4.0](LICENSE).

- ✅ You can use, share, and adapt this project
- ❌ Commercial use is **not permitted**
- 📝 You must give appropriate credit
- 🔄 Derivatives must use the same license

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Trade-Offf">Trade-Offf</a>
</p>
