# TAC Cargo - Enterprise Logistics Platform

> Comprehensive documentation for the TAC Cargo logistics management system.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Authentication](#authentication)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Components](#components)
8. [Security](#security)
9. [Deployment](#deployment)

---

## Overview

TAC Cargo is a full-stack enterprise logistics management platform built with Next.js 16, Supabase, and a modern React component library. It provides:

- **Shipment Management**: Track and manage cargo shipments end-to-end
- **Invoice Generation**: Automated invoicing with PDF generation
- **Real-time Tracking**: Live shipment tracking with route visualization
- **Multi-tenant Architecture**: Organization-based data isolation with RLS
- **Analytics Dashboard**: Business intelligence and performance metrics

---

## Tech Stack

### Frontend

| Technology     | Version    | Purpose                         |
| -------------- | ---------- | ------------------------------- |
| Next.js        | 16.1.1     | React framework with App Router |
| React          | 19.x       | UI library                      |
| TailwindCSS    | 4.x        | Utility-first CSS               |
| shadcn/ui      | radix-mira | Component library               |
| TanStack Query | 5.x        | Server state management         |
| Framer Motion  | 12.x       | Animations                      |
| Recharts       | 2.x        | Data visualization              |

### Backend

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| Supabase           | PostgreSQL database, Auth, Real-time |
| Next.js API Routes | REST API endpoints                   |
| Zod                | Schema validation                    |

### DevOps

| Technology       | Purpose          |
| ---------------- | ---------------- |
| Sentry           | Error monitoring |
| Vitest           | Unit testing     |
| Playwright       | E2E testing      |
| ESLint/Stylelint | Code quality     |

---

## Project Structure

```
tac-cargo/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Authenticated dashboard routes
│   │   └── dashboard/     # Main dashboard pages
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   └── track/             # Public tracking pages
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── ui/                # shadcn/ui components
│   └── shadcn-studio/     # Custom UI blocks
├── hooks/                 # React hooks
├── lib/                   # Utilities and services
│   ├── supabase/         # Supabase client
│   ├── security/         # Security utilities
│   └── services/         # Business logic
├── supabase/
│   └── migrations/       # Database migrations
└── docs/                  # Documentation
```

---

## Authentication

### Flow

1. User navigates to `/login`
2. Supabase Auth handles email/password or OAuth
3. Session stored in cookies via Supabase SSR helpers
4. Middleware validates session on protected routes
5. Redirect to `/dashboard` on success

### Protected Routes

All routes under `/(dashboard)` require authentication. The layout checks auth state:

```typescript
// app/(dashboard)/layout.tsx
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect("/login");
```

### Roles

- **admin**: Full access, can manage API keys and webhooks
- **user**: Standard access to shipments and invoices
- **viewer**: Read-only access

---

## Database Schema

### Core Tables

#### `organizations`

Multi-tenant root entity.

#### `profiles`

User profiles linked to auth.users.

- `organization_id`: Tenant isolation
- `role`: Permission level

#### `shipments`

Core shipment records.

- `reference`: Unique AWB number
- `status`: pending | in_transit | delivered | cancelled
- `origin_warehouse_id`, `destination_warehouse_id`: Route

#### `invoices`

Financial records linked to shipments.

- `invoice_no`: Auto-generated unique number
- `status`: draft | sent | paid | overdue | cancelled

#### `warehouses`

Physical locations for routing.

#### `customers`

Customer/consignee records.

### Row Level Security (RLS)

All tables use RLS policies for tenant isolation:

- Users can only access data from their organization
- Public tracking endpoint has limited read-only access

---

## API Reference

### Authentication Required

All API routes require valid session except `/api/track`.

### Endpoints

#### Shipments

```
GET    /api/shipments         - List shipments (paginated)
POST   /api/shipments         - Create shipment
PUT    /api/shipments         - Update shipment
DELETE /api/shipments?id=     - Delete shipment
```

#### Invoices

```
GET    /api/invoices          - List invoices
POST   /api/invoices          - Create invoice
PUT    /api/invoices          - Update invoice status
GET    /api/invoices/[id]/pdf - Generate PDF
GET    /api/invoices/analytics - Revenue analytics
```

#### Tracking (Public)

```
GET    /api/track?awb=        - Track shipment by AWB
```

- Rate limited: 60 requests/minute per IP
- Returns sanitized shipment data (no PII)

#### Webhooks

```
GET    /api/webhooks          - List webhooks
POST   /api/webhooks          - Create webhook
DELETE /api/webhooks?id=      - Delete webhook (admin only)
```

#### API Keys

```
GET    /api/api-keys          - List API keys
POST   /api/api-keys          - Create API key (admin only)
DELETE /api/api-keys?id=      - Revoke API key (admin only)
```

---

## Components

### Dashboard Components

Located in `components/dashboard/`:

- **AppShell**: Main layout wrapper with sidebar
- **AppSidebar**: Navigation sidebar
- **AppHeader**: Top header with breadcrumbs
- **StatCard**: KPI display cards
- **PageLayout**: Consistent page structure
- **EmptyState**: No-data placeholder

### UI Components

Located in `components/ui/`:

- Full shadcn/ui library (40+ components)
- **RiveMap**: Animated route visualization
- **TrackerCard**: Shipment status display

### Route Tracker

Located in `components/dashboard/route-tracker/`:

- **RouteInfoCard**: Route metrics display
- **RouteTimeline**: Waypoint progression
- **ActiveShipmentCard**: Live shipment status
- **RouteConditions**: Road segment status

---

## Security

### CSRF Protection

- Token-based CSRF protection for mutations
- Requires `CSRF_SECRET` environment variable

### Rate Limiting

- In-memory rate limiter for API protection
- Configurable limits per endpoint type

### Input Sanitization

- Zod schema validation on all inputs
- HTML/SQL injection prevention

### Environment Variables

Required for production:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CSRF_SECRET=
SENTRY_DSN=
```

---

## Deployment

### Prerequisites

1. Supabase project with migrations applied
2. Environment variables configured
3. Node.js 20+

### Build

```bash
npm install
npm run build
```

### Production

```bash
npm start
```

### Vercel Deployment

- Configure environment variables in Vercel dashboard
- Enable Supabase integration
- Set `SENTRY_AUTH_TOKEN` for source maps

---

## Development

### Setup

```bash
git clone <repo>
cd tac-cargo
npm install
cp .env.example .env.local
# Configure .env.local
npm run dev
```

### Testing

```bash
npm test           # Unit tests (Vitest)
npm run test:e2e   # E2E tests (Playwright)
```

### Linting

```bash
npm run lint       # ESLint
npm run lint:css   # Stylelint
```

---

## Changelog

### v0.1.0 (Current)

- Initial release
- Core shipment management
- Invoice generation
- Real-time tracking
- Route visualization with Rive
- Multi-tenant architecture

---

_Last updated: January 2026_
