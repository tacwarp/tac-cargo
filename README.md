# TAC Cargo

Enterprise-grade logistics and freight management platform for the Imphal–Delhi corridor.  
Real-time shipment tracking, fleet operations, and analytics – built on Next.js 16 and Supabase.

## Project Overview

TAC Cargo is a full-stack logistics SaaS that provides:

- **Real-time shipment and fleet tracking**
- **Operational dashboards and KPIs**
- **Invoice generation with PDF export**
- **Webhook and API integrations for partners**

The system is designed as **server-first** (React Server Components by default) with a strict, token-driven design system (OKLCH colors, Tailwind CSS v4, shadcn/ui).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4, OKLCH tokens, shadcn/ui |
| **State & Data** | Supabase (Postgres + Auth + Realtime), TanStack Query, Zustand |
| **UI & Visualization** | Radix UI, Recharts, Framer Motion, Lottie, Rive |
| **Testing** | Vitest, Testing Library, Playwright |
| **Monitoring** | Sentry |

## Project Structure

```
tac-cargo/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Authenticated dashboard routes
│   ├── api/                # API route handlers
│   ├── login/              # Auth pages
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Base UI primitives (shadcn/Radix)
│   ├── layout/             # Layout components (shell, sidebar, header)
│   ├── dashboard/          # Dashboard widgets and features
│   ├── analytics/          # Analytics charts and KPIs
│   ├── landing/            # Marketing/landing sections
│   ├── shipments/          # Shipment management
│   ├── tracking/           # Tracking features
│   └── dev-playground/     # Experimental components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, Supabase, MCP, services
├── types/                  # TypeScript definitions
├── docs/                   # Documentation
│   ├── archive/            # Historical/legacy docs
│   └── ...                 # Active documentation
└── public/                 # Static assets
```

## Getting Started

```bash
# Clone repository
git clone <repo-url>
cd tac-cargo

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in Supabase and Sentry keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:css` | Run Stylelint for CSS/Tailwind |
| `npm test` | Run Vitest unit tests |
| `npm run test:coverage` | Run tests with coverage |

## Documentation

| Document | Description |
|----------|-------------|
| `docs/tech-stack.md` | Tech stack and constraints |
| `docs/components.md` | Component architecture rules |
| `docs/design-system.md` | Design tokens, colors, typography |
| `docs/performance.md` | Performance guidelines |
| `docs/routes.md` | Routing and navigation |
| `docs/filesystem.md` | Folder structure |
| `docs/known-issues.md` | Active tech debt |
| `docs/CODERABBIT_SETUP.md` | AI code review setup |

Legacy and historical documents are archived in `docs/archive/`.

## Code Quality

This project uses [CodeRabbit](https://coderabbit.ai) for AI-powered code reviews on every pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for details on the review process.

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional
SENTRY_DSN=
NEXT_PUBLIC_SITE_URL=
```

## License

Proprietary - All rights reserved.
