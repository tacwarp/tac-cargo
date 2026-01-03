# TAC Cargo - Project Overview

## Project Purpose
Enterprise-grade logistics and freight management platform for the Imphal–Delhi corridor. Provides real-time shipment tracking, fleet management, and operational analytics for B2B logistics operations.

## Domain
Transportation and Logistics SaaS

## Target Users
1. **Enterprise Clients**: Companies requiring freight services between Northeast India and Delhi
2. **Fleet Managers**: Internal operations team managing vehicles and drivers
3. **Logistics Coordinators**: Staff tracking shipments and handling exceptions
4. **C-Suite Executives**: Leadership requiring operational dashboards and metrics

## Core Workflows

### 1. Shipment Tracking
- Real-time GPS-based tracking of cargo
- Status updates and milestone notifications
- ETA calculations and delay alerts
- QR code-based shipment verification

### 2. Dashboard Analytics
- Fleet utilization metrics
- Revenue and performance KPIs
- Operational queue monitoring
- Route optimization insights

### 3. Authentication & Authorization
- Supabase-based authentication
- Role-based access control (RBAC)
- Protected routes for authenticated users
- Session management via cookies

### 4. Fleet Management
- Vehicle assignment and tracking
- Driver allocation
- Maintenance scheduling
- Fuel and expense tracking

## Non-Goals / Out of Scope
- Payment processing (handled externally)
- Customer-facing public tracking portal (future phase)
- Mobile native applications (web-first approach)
- Multi-tenant white-label solutions
- International shipping beyond India

## Project Maturity Level
**MVP → Production Transition**

- ✅ Core tracking functionality operational
- ✅ Authentication and authorization complete
- ✅ Dashboard and analytics deployed
- ✅ Monitoring (Sentry) integrated
- ⚠️ Performance optimization in progress
- ⚠️ Mobile responsiveness being refined
- 🔄 Design system standardization ongoing

## Success Criteria
1. Sub-2s page load times
2. 99.5% uptime SLA
3. WCAG AA accessibility compliance
4. Zero hardcoded colors (semantic tokens only)
5. <50KB initial JavaScript bundle per route

## Technical Constraints
- Server-first architecture (RSC by default)
- No client-side routing where avoidable
- Strict TypeScript enforcement
- OKLCH color space mandatory
- Tailwind v4 utility-first styling
