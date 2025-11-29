# 第N个我 | The Nth Me

<p align="center">
  <img src="public/logo.png" alt="The Nth Me Logo" width="120" />
</p>

<p align="center">
  <strong>🌌 AI-Powered Parallel Universe Portrait Generator</strong>
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

- 🎭 **6 Parallel Worldlines** — Transform your portrait into different universe styles
- 🔐 **NextAuth Authentication** — Email/Password + Google OAuth
- ⚡ **Credit System** — Pay-per-use with Afdian integration
- 🌍 **i18n Support** — English & 简体中文
- 🎨 **Cyberpunk UI** — Steins;Gate inspired design with binary rain effects
- 📱 **Responsive Design** — Mobile-first approach

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
│   ├── portal/           # Main generation page
│   ├── showcase/         # Worldline gallery
│   └── ...
├── components/           # React components
├── lib/
│   ├── i18n/             # Internationalization
│   ├── services/         # Business logic
│   └── ...
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🌐 Worldlines

| ID | Name (EN) | Name (ZH) |
|----|-----------|-----------|
| studio-portrait | Photon Lab | 光影实验室 |
| tech-startup | Silicon Prototype | 硅谷原型体 |
| collectible-figure | Quantum Figurine | 量子人偶 |
| federal-diplomat | Federal Envoy | 联邦特使 |
| puzzle-deconstruction | Deconstruction Protocol | 解构协议 |
| reverse-engineering | Reverse Engineering | 逆向工程 |

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
