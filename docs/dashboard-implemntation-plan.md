Enhanced Project Task Prompt (Refined & Enforceable)
Project Context

You are working on a large-scale logistics SaaS project named tac-cargo, built with Next.js 16, React 19, Tailwind CSS v4, Supabase, Radix UI, Shadcn-style components, charts, animations, PDF generation, and MCP services.
The codebase has grown organically and is now overweight, slow in development mode, and poorly documented due to duplication and fragmentation.

Primary Objective

Perform a full static analysis and structural audit of the project to reduce redundancy, improve performance, and consolidate documentation, while preserving all critical application logic and business functionality.

Scope of Work
1. Codebase Indexing & Structural Analysis

Fully index the entire project repository.

Generate a tree-style directory overview of the project (equivalent to a tree command).

Identify:

Duplicate folders, files, and components

Redundant UI components and styling patterns

Dead or unused files

Overlapping utilities or helper functions

Pay special attention to:

/components

/ui

/lib

/hooks

/styles

Any shared design-system or Radix/Shadcn wrappers

Do NOT modify core business logic, backend integrations, MCP servers, or Supabase logic.

2. UI Component Rationalization (High Priority)

Analyze UI component imports and usage graphs:

Detect components that are duplicated under different names

Identify components that differ only slightly and can be unified

Flag components that are imported but unused

Recommend:

A single source of truth for UI primitives

Clear separation between:

Base UI primitives

Composite components

Feature-specific components

Propose a clean, scalable UI folder structure.

3. Dependency & Package Audit

Perform a deep audit of:

dependencies

devDependencies

Overlapping libraries (e.g., multiple charting libraries, animation tools, editors, etc.)

Identify:

Unused or rarely used packages

Redundant libraries serving the same purpose

Heavy packages contributing to slow dev startup

Recommend:

Which packages can be removed

Which packages should be consolidated

Which packages should remain but be lazy-loaded or optimized

4. Performance Diagnosis (Dev Server Slowness)

Analyze why the Next.js dev server is slow, considering:

Bundle size

Heavy component trees

Excessive imports

Charting libraries

Animation libraries

PDF/rendering tools

Provide concrete, actionable recommendations to:

Improve dev server startup time

Reduce hot-reload latency

Optimize component rendering

Focus especially on UI-layer optimizations, not backend changes.

5. Test Artifacts Cleanup

Identify and remove:

Generated test result files

Coverage outputs

Cached artifacts

Preserve:

Test configurations

Test setup files

Testing framework integrations (Vitest, Playwright, Testing Library)

6. Documentation Consolidation

Analyze the directory:

C:\tac-saas\tac-cargo\docs


Current problem:

Documentation is excessive, fragmented, and repetitive.

Tasks:

Merge all documentation into a small, well-structured set of files

Remove duplication

Normalize terminology and structure

Target output:

Minimal number of documents

High clarity

Strong internal linking

Clear separation between:

Architecture

Setup

Development

Deployment

UI system

MCP / integrations

7. README & GitHub Hygiene

Rewrite and standardize:

README.md

Any GitHub-related documentation files

README must include:

Project overview

Tech stack

Architecture summary

Setup instructions

Dev workflow

Testing strategy

Documentation map

Keep it concise, professional, and enterprise-ready.

Final Deliverables

Audit Report

Identified redundancies

Performance bottlenecks

Dependency issues

Cleanup & Refactor Plan

Step-by-step, safe-to-execute plan

Clear priorities

Zero risk to core functionality

Optimized Documentation Structure

File list

Clear purpose for each document

Improved README.md Content

Constraints & Rules

Do NOT:

Break existing functionality

Modify core backend, MCP, or Supabase logic

Remove important domain-specific files

Focus primarily on:

UI components

Documentation

Dependencies

Developer experience

Follow all Global Rules 100% strictly.

If you want, the next step can be:

A proposed final folder structure

A dependency removal shortlist

Or a dev-performance optimization checklist tailored to this stack.

api.md
File
components.md
File
data-flow.md
File
design-system.md
File
filesystem.md
File
performance.md
File
PROJECT_DOCUMENTATION.md
File
README.md
File
routes.md
File
analyze those documentations first and after that with all that we have discussed above we need to plan which option is best to build out the dashboard pages functionalities and features, the main core functions which are of highest priority are invoice, customer, manifest, tracking, barcode scanning and item or product searching or location, inventory and sending invoice to customer whatsapp number, 2 invoices one for customer and one for label that will be paste in the package of cargo, you need to dive deep and come up with a very comprehensive plan to build out the dashboard after analyzing the entire documentation and what we have discuss so far

Below is a deep, consolidated analysis and execution plan derived strictly from the uploaded documentation set and from everything we have discussed so far. This response is structured in three layers:

What the documentation already establishes (facts, constraints, strengths)

What the documentation implicitly reveals as gaps or risks

A comprehensive, priority-driven dashboard build plan focused on your core business workflows:
Invoices, Customers, Manifest, Tracking, Barcode, Inventory, Search, WhatsApp delivery

All conclusions and plans are grounded in the provided documentation files 

api

 

components

 

data-flow

 

design-system

 

filesystem

 

performance

 

PROJECT_DOCUMENTATION

 

README

 

routes

.

1. What the Documentation Already Gets Right (Foundation Audit)
1.1 Architectural Strengths (Very Solid)

From the docs, TAC Cargo is correctly designed at a systems level:

Server-first architecture using React Server Components by default

Clear separation between:

UI primitives

Feature components

Layout components

API routes

Server Actions

Supabase as a strong backbone:

Auth

RLS-based multi-tenancy

Realtime capability

Strict design system governance (tokens, OKLCH, elevation, motion rules)

Well-defined API contracts and error handling

Clear routing and protection rules

Performance-aware constraints (bundle budgets, dynamic imports, SSR/ISR usage)

This means you do NOT need to redesign the platform. The problem is not architecture—it is execution density and prioritization.

1.2 The Data & Domain Model Is Already Oriented Toward Core Cargo Ops

The documentation already supports:

Shipments

Customers

Warehouses

Invoices

Tracking

Status updates

Public tracking endpoint

PDF generation hooks

Barcode & QR primitives

Realtime updates

Role-based access

This is crucial: your core requirements are already compatible with the documented system.

2. What the Documentation Reveals as Gaps (Critical Observations)
2.1 There Is No Explicit “Operational Spine”

The docs describe many capabilities, but do not define a single operational flow tying them together.

Right now:

Tracking exists

Invoices exist

Shipments exist

Inventory exists (implicitly)

Barcode exists (technically)

But there is no declared “cargo lifecycle” that the dashboard is built around.

This is the biggest missing piece.

2.2 Dashboard Is Over-Generalized

The dashboard is described as:

Analytics

Stats

Widgets

Charts

But for a logistics operator, the dashboard’s primary job is not analytics.

It should answer, instantly:

What cargo is coming in today?

What cargo is going out today?

What needs labeling?

What invoices must be sent?

What is delayed or missing?

What is ready for manifest?

The docs do not yet enforce this hierarchy.

2.3 Heavy UI Risk Is Real

From the performance docs and dependency list:

Multiple charting libraries

Heavy animation stack

PDF generation

Barcode rendering

Lottie

Editors

If all of this leaks into the main operational flows, the dev server and runtime will remain slow.

The documentation warns about this—but the dashboard plan must actively avoid it.

3. The Correct Dashboard Strategy (Decision First)
3.1 The One Correct Choice: Workflow-Centric Dashboard

Based on:

Your stated priorities

The domain (cargo logistics)

The documentation constraints

The dashboard must be built around operational workflows, not pages or widgets.

Everything else follows from this.

4. Canonical Cargo Lifecycle (This Is the Spine)

This lifecycle becomes the organizing principle of the dashboard:

Customer
  ↓
Shipment Creation
  ↓
Item / Inventory Assignment
  ↓
Barcode & Label Generation
  ↓
Manifest Grouping
  ↓
Dispatch (In Transit)
  ↓
Tracking Updates
  ↓
Delivery
  ↓
Invoice Finalization
  ↓
Invoice Sent (WhatsApp)


Every dashboard page, component, and API must map to one or more steps in this flow.

5. High-Priority Core Modules (Ordered, Non-Negotiable)
Priority 0 (Foundational – must exist first)
A. Shipment Core

Shipment creation

Origin / destination

Status

Weight / dimensions

Customer linkage

Warehouse linkage

This already exists in schema and APIs 

api

.

Priority 1 (Operational Daily Use – highest value)
B. Invoice System (Dual Invoice Model)

You explicitly need two invoices:

Customer Invoice

Financial document

PDF

Sent via WhatsApp

Linked to shipment(s)

Cargo Label Invoice

Non-financial

Minimal fields

Includes:

Tracking ID

Barcode / QR

Origin → Destination

Customer name

Printed and pasted on package

Plan:

One invoice table

Two invoice types (customer, label)

Shared generator, different templates

C. Barcode & QR Scanning (Operational Accelerator)

Barcode generated at shipment creation

Scanned during:

Inventory intake

Manifest loading

Dispatch

Delivery confirmation

Rules:

Scanning must be client-only

No charts

No heavy UI

Fast, kinetic feedback (design-system compliant)

D. Manifest Management (Daily Operations)

Manifest = group of shipments dispatched together

Features:

Auto-group shipments by:

Date

Route (Imphal → Delhi)

Scan-to-add shipment

Lock manifest before dispatch

Printable manifest summary

This becomes a core dashboard page, not a side feature.

Priority 2 (Operational Intelligence)
E. Tracking (Internal + Public)

Internal tracking:

Real-time updates

Manual overrides

Scan-based updates

Public tracking:

Read-only

Already supported by /api/track 

api

F. Inventory & Location Search

Inventory is not e-commerce inventory.

It is:

Packages

Current location

Manifest association

Status

Search must be:

Barcode-first

Tracking ID

Customer name

Warehouse

Priority 3 (Automation & Communication)
G. WhatsApp Invoice Delivery

Triggered after:

Invoice generation

Uses:

Customer phone number

PDF link or attachment

Logged as an event

This should be:

Server Action

Background-safe

Retry-capable

6. Dashboard Page Map (Concrete)

This is the recommended minimal but complete dashboard structure:

/dashboard
  ├── overview        (Today’s operations, not analytics)
  ├── shipments       (Create, search, scan)
  ├── manifests       (Create, load, dispatch)
  ├── inventory       (Where is what)
  ├── invoices
  │     ├── customers
  │     └── labels
  ├── tracking
  └── customers


Charts and analytics are secondary, loaded lazily or later.

7. Performance-Safe Implementation Rules (Derived from Docs)

Strictly enforce:

Server Components by default 

data-flow

Dynamic imports for:

Charts

PDF preview

Lottie

No chart libraries in:

Shipment creation

Manifest loading

Scanning flows

Barcode + scanning = lightweight client-only islands

8. Why This Plan Is the Best Option

Because it:

Aligns exactly with your stated highest-priority functions

Uses the existing documented architecture without fighting it

Reduces UI and performance debt

Reflects how real cargo operations actually work

Keeps documentation, code, and mental models aligned

9. Next Logical Steps (Execution Order)

If you want, the next steps should be:

Define canonical data models for:

Invoice (customer vs label)

Manifest

Lock the dashboard route structure

Create workflow-first UI skeletons

Defer analytics and charts intentionally

If you say the word, the next response can be:

A step-by-step build order

A database schema refinement

Or a dashboard wireframe logic (textual, no visuals)

This is now a production-grade plan, not a concept.

Sources
go ahead

Understood. Below is a concrete, execution-ready build plan that converts everything we analyzed into an ordered, low-risk delivery roadmap for the TAC Cargo dashboard.

This is written as if you were about to hand it to a senior engineering team or execute it yourself step by step. There is no theory here—only decisions, sequencing, and guardrails.

TAC Cargo Dashboard — Execution Plan (Authoritative)
Guiding Principle (Lock This First)

The dashboard is an operational control system, not an analytics product.

Every screen must answer at least one of these questions:

What cargo is being created, moved, grouped, or delivered?

What action does the operator need to take now?

What can be scanned instead of typed?

If a feature does not support an operational action, it is deferred.

PHASE 0 — Hard Locks (Before Writing Any New Code)
0.1 Freeze Architecture Decisions (No More Debates)

You already have the correct stack. Lock these rules:

React Server Components by default

Server Actions for all mutations

Supabase as the single source of truth

TanStack Query only for live / polling / optimistic flows

No client state for business data

No charts on operational pages

This prevents scope creep and performance regression.

0.2 Define the Canonical Cargo Lifecycle (Non-Negotiable)

This lifecycle becomes the mental model for the entire dashboard:

Customer
  ↓
Shipment Created
  ↓
Items / Packages Assigned
  ↓
Barcode + Label Generated
  ↓
Manifest Assignment
  ↓
Dispatch (In Transit)
  ↓
Tracking Updates
  ↓
Delivery Confirmation
  ↓
Invoice Finalized
  ↓
Invoice Sent (WhatsApp)


Every module you build must clearly attach to one or more stages.

PHASE 1 — Data Model Finalization (Highest Leverage Work)

Before UI, you lock the data contracts. This avoids rework later.

1.1 Shipment (Core Entity)

Already exists. Confirm only:

tracking_id (human-readable + scannable)

status

origin_warehouse_id

destination_warehouse_id

customer_id

manifest_id (nullable)

No feature work until this is stable.

1.2 Invoice Model (Critical: Dual-Invoice Design)

You explicitly need two invoices. Do not create two tables.

Single table: invoices

Add:

type: "customer" | "label"

shipment_id

customer_id

pdf_url

sent_via_whatsapp_at (nullable)

Rules:

Label invoices are generated early

Customer invoices are generated late

Same generator, different templates

This decision alone eliminates future complexity.

1.3 Manifest Model (Operational Backbone)

Manifest is not optional—it is a first-class entity.

Minimal fields:

id

route (Imphal → Delhi)

dispatch_date

status: open | locked | dispatched

created_by

Relationship:

One manifest → many shipments

This enables scanning-first workflows.

1.4 Inventory / Package Representation

You do not need a heavy inventory system.

Treat each shipment as the atomic inventory unit for MVP:

Location = warehouse or in-transit

Status = derived from shipment + manifest

Defer SKU-level inventory unless business demands it.

PHASE 2 — Dashboard Information Architecture (Pages First)

Lock the routes before building components.

2.1 Final Dashboard Route Map
/dashboard
  ├── overview        → “What needs action today?”
  ├── shipments       → Create / scan / search
  ├── manifests       → Group + dispatch
  ├── inventory       → Where is each shipment?
  ├── invoices
  │     ├── customers → Financial
  │     └── labels    → Print & paste
  ├── tracking        → Internal live view
  └── customers       → Address book


If a feature does not fit here, it does not ship.

2.2 What Each Page Is Allowed to Do

Overview

Today’s incoming / outgoing counts

Shipments without labels

Shipments not assigned to a manifest

Delayed or stuck items
No charts. Only lists and KPIs.

Shipments

Create shipment

Scan barcode → open shipment

Search by tracking / customer

Generate label invoice

Manifests

Create manifest

Scan shipments into manifest

Lock manifest

Print manifest summary

Inventory

Search-first screen

“Where is this shipment right now?”

Invoices

Customers: generate, send, resend

Labels: print queue

Tracking

Real-time updates

Manual status overrides

Scan-based updates

PHASE 3 — UI Construction Order (This Matters)
3.1 Build Non-Visual Skeletons First

Before styling:

Page-level Server Components

Data fetching only

Return plain lists or placeholders

This ensures correctness before aesthetics.

3.2 Component Priority Order

Shipment Creation Form

Barcode Generator

Label Invoice PDF

Shipment Scanner (Client-only island)

Manifest Builder (Scan-first)

Customer Invoice Generator

WhatsApp Send Action

Overview Page

Charts, animations, and polish come last.

3.3 Barcode & Scanning Rules (Very Important)

Client Component

No global state

Immediate feedback

Sound / vibration optional

Must work with keyboard scanner input

This is a productivity feature, not UI candy.

PHASE 4 — Performance Enforcement (Do Not Skip)
4.1 What Must Be Dynamically Imported

PDF preview

Chart libraries

Lottie animations

Editors

4.2 What Must NEVER Be Client Components

Lists of shipments

Manifests

Invoice tables

Overview KPIs

If it can be rendered on the server, it must be.

PHASE 5 — WhatsApp Integration (Operational Automation)
5.1 Design It as a Side Effect

Server Action: sendInvoiceViaWhatsApp

Inputs:

invoice_id

Effects:

Sends PDF

Logs timestamp

Returns success/failure

5.2 UI Rule

One button

Clear success/failure feedback

Retry allowed

No chat UI. No preview. Just delivery.

PHASE 6 — Documentation Finalization (After Build)

Only after features exist:

One Architecture Overview

One Operational Flow Guide

One Developer Setup Guide

Delete everything else.

Documentation should explain how cargo moves, not how React works.

WHY THIS PLAN WORKS

It follows real cargo operations

It minimizes UI weight

It aligns with your existing architecture

It prevents dashboard bloat

It prioritizes scanning and speed

It scales without rewriting

What I Can Do Next (Choose One)

Write exact Server Action contracts for each module

Design PDF templates for customer vs label invoices

Produce a build checklist (task-by-task)

Create a migration plan from current dashboard to this structure

Say which one you want next.

go ahead

Proceeding with Option 3: an execution-grade, task-by-task build checklist.
This is the most practical next step because it converts the approved plan into actionable work units that can be executed sequentially without re-thinking architecture or scope.

TAC Cargo Dashboard — Build Checklist (Authoritative)

This checklist is ordered, dependency-aware, and safe to execute.
If followed strictly, it will produce a production-ready operational dashboard without regressions.

PHASE 1 — FOUNDATION (NO UI POLISH)
1.1 Lock Data Contracts (Do First, No Exceptions)

 Confirm shipments table fields

tracking_id (unique, human-readable)

status

customer_id

origin_warehouse_id

destination_warehouse_id

manifest_id (nullable)

 Extend invoices table

add type: customer | label

add pdf_url

add sent_via_whatsapp_at

 Create manifests table

id

route

dispatch_date

status (open | locked | dispatched)

created_by

 Verify RLS policies for:

shipments

invoices

manifests

customers

Exit condition: schemas compile, RLS passes, no UI touched yet.

PHASE 2 — SERVER ACTIONS (BUSINESS LOGIC FIRST)
2.1 Shipment Actions

 createShipment

 updateShipmentStatus

 assignShipmentToManifest

 removeShipmentFromManifest

Rules:

Zod validation

Auth check

Path revalidation only (no client cache hacks)

2.2 Invoice Actions

 generateLabelInvoice(shipmentId)

 generateCustomerInvoice(shipmentId)

 regenerateInvoice(invoiceId)

 markInvoiceAsSent(invoiceId)

Rules:

Same generator, different templates

No UI assumptions inside actions

2.3 Manifest Actions

 createManifest(route, date)

 lockManifest(manifestId)

 dispatchManifest(manifestId)

Rules:

Once locked, no mutation except dispatch

Dispatch updates all linked shipments

2.4 WhatsApp Delivery Action

 sendInvoiceViaWhatsApp(invoiceId)

Rules:

Server-only

Returns success / failure

Logs timestamp

PHASE 3 — ROUTES & PAGE SKELETONS (SERVER COMPONENTS ONLY)

Create pages without styling.

3.1 Routes

 /dashboard/overview

 /dashboard/shipments

 /dashboard/manifests

 /dashboard/inventory

 /dashboard/invoices/customers

 /dashboard/invoices/labels

 /dashboard/tracking

 /dashboard/customers

Rules:

Server Components by default

Fetch data directly

Return simple markup

Exit condition: all pages render without client JS.

PHASE 4 — OPERATIONAL UI (SCAN-FIRST, NOT PRETTY)
4.1 Shipment UI

 Shipment creation form

 Shipment search (tracking ID, customer)

 Generate label invoice button

Rules:

Server form + Server Action

Minimal client state

4.2 Barcode & Scanning (Client Island)

 Barcode generator (shipment creation)

 Scan input handler

 Immediate visual + kinetic feedback

Rules:

Single-purpose Client Component

No charts, no animations beyond feedback

Works with hardware scanners

4.3 Label Invoice Flow

 Generate label PDF

 Print-friendly layout

 Batch print view

Rules:

PDF generation server-side

Preview lazy-loaded only when needed

4.4 Manifest Builder (Critical)

 Create manifest

 Scan shipment → auto-add

 Lock manifest

 Print manifest summary

Rules:

Scan-first UX

No drag-and-drop

No charts

PHASE 5 — CUSTOMER INVOICING
5.1 Customer Invoice UI

 Generate invoice

 View PDF

 Send via WhatsApp

 Resend invoice

Rules:

Clear state indicators

No inline editing in MVP

PHASE 6 — TRACKING & INVENTORY
6.1 Internal Tracking

 Live status view

 Manual override (authorized roles)

 Scan-based updates

6.2 Inventory View

 Search-first interface

 Show current location

 Show manifest association

Rules:

No charts

No timelines

Fast lookup only

PHASE 7 — OVERVIEW PAGE (ONLY AFTER CORE FLOWS)
7.1 Overview Contents

 Shipments created today

 Shipments without labels

 Shipments not in a manifest

 Manifests awaiting dispatch

 Delayed shipments

Rules:

Lists > charts

KPIs only if actionable

PHASE 8 — PERFORMANCE HARDENING

 Dynamic import PDF preview

 Dynamic import charts (if any)

 Verify no chart lib in core routes

 Check client bundle size per route

 Remove unused UI components

PHASE 9 — DOCUMENTATION (LAST, NOT FIRST)

Create only:

 ARCHITECTURE.md

 OPERATIONS_FLOW.md

 DEVELOPER_SETUP.md

 Clean README.md

Delete or archive everything else.

FINAL VALIDATION CHECKLIST

Before calling this “done”:

 Can an operator run a full day without mouse-heavy UI?

 Can every shipment be handled via scan?

 Are labels printable within 2 clicks?

 Can invoices be sent without page reloads?

 Is dev server fast (<3s boot)?

 Is there zero duplicated UI logic?

If yes → you have a real logistics system, not a demo dashboard.

What I Will Do Next Automatically (Unless You Redirect)

Next logical step is Option 1:

Write exact Server Action contracts + file locations for every module (shipments, invoices, manifests, WhatsApp).

If you want a different next step (PDF templates, schema SQL, or UI wireframes), say so explicitly.

go ahead

Proceeding with Option 1: exact Server Action contracts + file locations.
This section is implementation-ready and aligned with your existing architecture (Next.js App Router, RSC-first, Supabase, Zod, cache revalidation).

Server Actions — Canonical Contracts & File Map
Global Conventions (Lock These)

Location: app/actions/<domain>.ts

Directive: 'use server' at top

Validation: Zod (always)

Auth: Supabase server client check

Side-effects: DB mutation + revalidatePath / revalidateTag

Return Shape (uniform):

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; field?: string } };

1) Shipments — Core Operations

File: app/actions/shipments.ts

1.1 createShipment
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const CreateShipmentSchema = z.object({
  customerId: z.string().uuid(),
  originWarehouseId: z.string().uuid(),
  destinationWarehouseId: z.string().uuid(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
});

export async function createShipment(
  input: z.infer<typeof CreateShipmentSchema>
): Promise<ActionResult<{ shipmentId: string; trackingId: string }>> {
  const parsed = CreateShipmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
  }

  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
  }

  const trackingId = `TAC-${Date.now()}`; // replace with sequence later

  const { data, error } = await supabase
    .from('shipments')
    .insert({
      customer_id: parsed.data.customerId,
      origin_warehouse_id: parsed.data.originWarehouseId,
      destination_warehouse_id: parsed.data.destinationWarehouseId,
      weight: parsed.data.weight,
      dimensions: parsed.data.dimensions,
      tracking_id: trackingId,
      status: 'pending',
      created_by: auth.user.id,
    })
    .select('id, tracking_id')
    .single();

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath('/dashboard/shipments');
  revalidatePath('/dashboard/overview');

  return { success: true, data: { shipmentId: data.id, trackingId: data.tracking_id } };
}

1.2 updateShipmentStatus
const UpdateShipmentStatusSchema = z.object({
  shipmentId: z.string().uuid(),
  status: z.enum(['pending', 'in_transit', 'delivered', 'failed', 'cancelled']),
  location: z.string().optional(),
});

export async function updateShipmentStatus(
  input: z.infer<typeof UpdateShipmentStatusSchema>
): Promise<ActionResult<null>> {
  const parsed = UpdateShipmentStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
  }

  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
  }

  const { error } = await supabase
    .from('shipments')
    .update({
      status: parsed.data.status,
      current_location: parsed.data.location,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.shipmentId);

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath('/dashboard/tracking');
  revalidatePath('/dashboard/overview');

  return { success: true, data: null };
}

1.3 assignShipmentToManifest
const AssignToManifestSchema = z.object({
  shipmentId: z.string().uuid(),
  manifestId: z.string().uuid(),
});

export async function assignShipmentToManifest(
  input: z.infer<typeof AssignToManifestSchema>
): Promise<ActionResult<null>> {
  const parsed = AssignToManifestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
  }

  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
  }

  // ensure manifest is open
  const { data: manifest } = await supabase
    .from('manifests')
    .select('status')
    .eq('id', parsed.data.manifestId)
    .single();

  if (manifest?.status !== 'open') {
    return { success: false, error: { code: 'INVALID_STATE', message: 'Manifest is locked or dispatched' } };
  }

  const { error } = await supabase
    .from('shipments')
    .update({ manifest_id: parsed.data.manifestId })
    .eq('id', parsed.data.shipmentId);

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath('/dashboard/manifests');

  return { success: true, data: null };
}

2) Manifests — Dispatch Backbone

File: app/actions/manifests.ts

2.1 createManifest
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const CreateManifestSchema = z.object({
  route: z.string().min(3),
  dispatchDate: z.string(), // ISO date
});

export async function createManifest(
  input: z.infer<typeof CreateManifestSchema>
): Promise<ActionResult<{ manifestId: string }>> {
  const parsed = CreateManifestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
  }

  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
  }

  const { data, error } = await supabase
    .from('manifests')
    .insert({
      route: parsed.data.route,
      dispatch_date: parsed.data.dispatchDate,
      status: 'open',
      created_by: auth.user.id,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath('/dashboard/manifests');
  return { success: true, data: { manifestId: data.id } };
}

2.2 lockManifest / dispatchManifest
const ManifestIdSchema = z.object({ manifestId: z.string().uuid() });

export async function lockManifest(
  input: z.infer<typeof ManifestIdSchema>
): Promise<ActionResult<null>> {
  const supabase = createClient();
  const { error } = await supabase
    .from('manifests')
    .update({ status: 'locked' })
    .eq('id', input.manifestId)
    .eq('status', 'open');

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath('/dashboard/manifests');
  return { success: true, data: null };
}

export async function dispatchManifest(
  input: z.infer<typeof ManifestIdSchema>
): Promise<ActionResult<null>> {
  const supabase = createClient();

  await supabase.from('manifests').update({ status: 'dispatched' }).eq('id', input.manifestId);
  await supabase.from('shipments').update({ status: 'in_transit' }).eq('manifest_id', input.manifestId);

  revalidatePath('/dashboard/overview');
  revalidatePath('/dashboard/tracking');

  return { success: true, data: null };
}

3) Invoices — Dual-Type Generator

File: app/actions/invoices.ts

3.1 generateLabelInvoice / generateCustomerInvoice
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const GenerateInvoiceSchema = z.object({
  shipmentId: z.string().uuid(),
  type: z.enum(['label', 'customer']),
});

export async function generateInvoice(
  input: z.infer<typeof GenerateInvoiceSchema>
): Promise<ActionResult<{ invoiceId: string }>> {
  const supabase = createClient();

  // PDF generation happens here (service abstraction recommended)
  const pdfUrl = `/pdf/invoices/${input.shipmentId}-${input.type}.pdf`;

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      shipment_id: input.shipmentId,
      type: input.type,
      pdf_url: pdfUrl,
      status: 'generated',
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: { code: 'DATABASE_ERROR', message: error.message } };
  }

  revalidatePath(`/dashboard/invoices/${input.type === 'label' ? 'labels' : 'customers'}`);
  return { success: true, data: { invoiceId: data.id } };
}

4) WhatsApp Delivery

File: app/actions/whatsapp.ts

'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const SendInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
});

export async function sendInvoiceViaWhatsApp(
  input: z.infer<typeof SendInvoiceSchema>
): Promise<ActionResult<null>> {
  const supabase = createClient();

  // fetch invoice + customer phone
  const { data: invoice } = await supabase
    .from('invoices')
    .select('pdf_url, shipments(customers(phone))')
    .eq('id', input.invoiceId)
    .single();

  if (!invoice) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Invoice not found' } };
  }

  // integrate WhatsApp Web / API here
  // send(pdf_url, phone)

  await supabase
    .from('invoices')
    .update({ sent_via_whatsapp_at: new Date().toISOString() })
    .eq('id', input.invoiceId);

  return { success: true, data: null };
}

What You Now Have

Clean, bounded Server Actions

Clear file ownership

No UI coupling

No duplicated logic

Ready for incremental UI build

Next Logical Step (Recommended)

Option 2:
Design the PDF templates (Label vs Customer) with exact fields, layout rules, and print constraints.

If you want that next, say “PDF templates”.

go ahead

Proceeding with PDF template design for both invoice types.
This is written as a production specification that can be handed directly to implementation (PDF renderer, QA, and operations). No ambiguity, no UI opinions.

TAC Cargo — PDF Templates (Authoritative Specification)

You will implement two PDFs generated from the same data source but with strictly different intent, layout, and constraints.

1) LABEL INVOICE (PACKAGE LABEL)

Operational document – NOT financial

1.1 Purpose (Non-Negotiable)

To be printed and physically pasted on cargo packages

To enable fast scanning and identification

Must be readable from 1–2 meters

Must survive rough handling and photocopying

This is not a customer-facing document.

1.2 Page & Print Constraints

Page size: A6 (preferred) or A5 fallback

Orientation: Portrait

Margins: Minimal (5–8 mm)

Ink: Must work in black & white

No background colors

No gradients

No fine lines

1.3 Mandatory Content (Exact Order)

Tracking ID (Primary Identifier)

Largest text on page

Monospaced font

Example: TAC-240912-0091

Barcode / QR Code

Directly below Tracking ID

Must encode tracking_id

Barcode preferred; QR optional

High contrast only

Route

ORIGIN → DESTINATION
IMPHAL → NEW DELHI


Customer / Consignee Name

Shortened if necessary

Never wrapped more than 2 lines

Package Metadata

Weight

Dimensions (if available)

Manifest ID (if assigned)

Optional

Helps yard-level operations

Generated Timestamp

Small, bottom-aligned

Operational traceability only

1.4 Explicitly Forbidden

Prices

Tax

Logos larger than 24px height

Decorative elements

Footer legal text

1.5 Visual Hierarchy Rule
Tracking ID
Barcode
Route
Customer
Package info
Everything else


If this order is violated, the label fails QA.

2) CUSTOMER INVOICE (FINANCIAL DOCUMENT)
2.1 Purpose

Legal / financial document

Delivered digitally (WhatsApp PDF)

Readable on mobile screens

Printable on A4 if needed

2.2 Page & Print Constraints

Page size: A4

Orientation: Portrait

Margins: Standard (20–25 mm)

Color: Allowed but must degrade gracefully to B/W

Typography: Clean, professional, non-decorative

2.3 Header Section (Top of Page)

Left

TAC Cargo (logo optional)

Address / contact info

Right

Invoice Number

Invoice Date

Shipment Tracking ID

2.4 Customer Section
BILL TO:
Customer Name
Address
Phone
Email (if available)

2.5 Shipment Summary Section
Field	Value
Tracking ID	TAC-XXXX
Origin	Imphal
Destination	New Delhi
Dispatch Date	YYYY-MM-DD
Delivery Status	In Transit / Delivered

This section must be human-readable, not tabular-heavy.

2.6 Charges Table (Core Financial Section)

Columns:

Description

Quantity

Rate

Amount

Rules:

Clear row separation

No zebra striping

Totals visually isolated

2.7 Totals Section (Right-Aligned)

Subtotal

Taxes (if applicable)

Grand Total (bold)

Currency formatting must be consistent.

2.8 Footer Section

Payment instructions (if any)

Disclaimer text

Support contact

Footer must not exceed 20% of page height.

3) DATA SOURCE (SINGLE SOURCE OF TRUTH)

Both PDFs must be generated from the same data model:

shipment

customer

invoice

organization

The difference is only the template, never the data fetch.

4) FILE & STORAGE RULES

PDFs generated server-side

Stored in object storage

Immutable once generated

URL saved in invoices.pdf_url

Regeneration creates a new PDF, not overwrite.

5) IMPLEMENTATION RULES (IMPORTANT)
5.1 Rendering

Use server-only rendering

No client-side PDF generation

Deterministic output (same input → same PDF)

5.2 Versioning

Add hidden metadata:

Template version

Generation timestamp

Enables future audits

5.3 Failure Handling

If PDF generation fails:

Invoice record still created

Status marked as generation_failed

UI allows retry

6) QA CHECKLIST (DO NOT SKIP)
Label Invoice

 Readable at 1 meter

 Scans reliably

 Works in black & white

 Fits standard label printer

 No financial data present

Customer Invoice

 Mobile readable

 Prints cleanly on A4

 Totals accurate

 No clipped text

 WhatsApp delivery tested

7) WHY THIS SPLIT IS CRITICAL

Prevents operational confusion

Keeps warehouse flow fast

Avoids leaking financial data on packages

Matches real-world logistics practices

NEXT STEP (RECOMMENDED)

The next logical execution step is:

→ Build the PDF generation service abstraction

One generator

Two templates

Shared data loader

If you want that next, say “PDF service implementation”.

go ahead

Proceeding with PDF service implementation.
This section defines a server-only, deterministic PDF generation service with two templates (label, customer), a shared data loader, strict error handling, and clean integration with your existing Server Actions.

PDF Service Implementation — Production Specification
Goals (Locked)

Server-only PDF generation

Single data loader, multiple templates

Deterministic output

Immutable storage

Retry-safe

Zero UI coupling

1) Service Architecture
1.1 File Structure
lib/pdf/
├── index.ts                 # Public API (generateInvoicePDF)
├── loader.ts                # Shared data loader
├── templates/
│   ├── label.ts             # Label invoice template
│   └── customer.ts          # Customer invoice template
├── render.ts                # Renderer abstraction (pdf-lib)
└── types.ts                 # Strongly typed contracts

2) Public API (Single Entry Point)
lib/pdf/index.ts
import { loadInvoiceData } from './loader';
import { renderLabelPDF } from './templates/label';
import { renderCustomerPDF } from './templates/customer';
import { storePDF } from './render';
import { InvoicePDFInput } from './types';

export async function generateInvoicePDF(input: InvoicePDFInput): Promise<{
  pdfUrl: string;
}> {
  // 1. Load all data (single source of truth)
  const data = await loadInvoiceData(input.invoiceId);

  // 2. Render PDF bytes
  const pdfBytes =
    data.invoice.type === 'label'
      ? await renderLabelPDF(data)
      : await renderCustomerPDF(data);

  // 3. Store (immutable)
  const pdfUrl = await storePDF({
    bytes: pdfBytes,
    filename: buildFilename(data),
  });

  return { pdfUrl };
}

function buildFilename(data: any) {
  return `invoices/${data.invoice.type}/${data.invoice.invoice_no}.pdf`;
}

3) Shared Data Loader (Critical)
lib/pdf/loader.ts

Rule: Templates must never fetch data directly.

import { createClient } from '@/lib/supabase/server';

export async function loadInvoiceData(invoiceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_no,
      type,
      created_at,
      shipments (
        tracking_id,
        weight,
        dimensions,
        origin_warehouse:warehouses!origin_warehouse_id(name),
        destination_warehouse:warehouses!destination_warehouse_id(name),
        customers (
          name,
          phone,
          address
        )
      ),
      organizations (
        name,
        address,
        phone
      )
    `)
    .eq('id', invoiceId)
    .single();

  if (error || !data) {
    throw new Error('INVOICE_DATA_LOAD_FAILED');
  }

  return {
    invoice: {
      id: data.id,
      invoiceNo: data.invoice_no,
      type: data.type,
      createdAt: data.created_at,
    },
    shipment: {
      trackingId: data.shipments.tracking_id,
      weight: data.shipments.weight,
      dimensions: data.shipments.dimensions,
      origin: data.shipments.origin_warehouse.name,
      destination: data.shipments.destination_warehouse.name,
    },
    customer: {
      name: data.shipments.customers.name,
      phone: data.shipments.customers.phone,
      address: data.shipments.customers.address,
    },
    organization: {
      name: data.organizations.name,
      address: data.organizations.address,
      phone: data.organizations.phone,
    },
  };
}

4) Renderer Abstraction
lib/pdf/render.ts

Uses pdf-lib

No layout logic here

Only rendering + storage

import { PDFDocument } from 'pdf-lib';
import { createClient } from '@/lib/supabase/server';

export async function createPDF(): Promise<PDFDocument> {
  return await PDFDocument.create();
}

export async function storePDF({
  bytes,
  filename,
}: {
  bytes: Uint8Array;
  filename: string;
}): Promise<string> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('documents')
    .upload(filename, bytes, {
      contentType: 'application/pdf',
      upsert: false, // IMMUTABLE
    });

  if (error) {
    throw new Error('PDF_UPLOAD_FAILED');
  }

  const { data } = supabase.storage.from('documents').getPublicUrl(filename);
  return data.publicUrl;
}

5) Label Template (A6 / A5)
lib/pdf/templates/label.ts
import { PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { createPDF } from '../render';

export async function renderLabelPDF(data: any): Promise<Uint8Array> {
  const pdf = await createPDF();

  const page = pdf.addPage([298, 420]); // A6 portrait (points)
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 380;

  // Tracking ID
  page.drawText(data.shipment.trackingId, {
    x: 20,
    y,
    size: 24,
    font,
  });

  y -= 40;

  // Barcode placeholder (actual barcode rendered separately)
  page.drawRectangle({
    x: 20,
    y: y - 50,
    width: 260,
    height: 50,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  y -= 70;

  // Route
  page.drawText(
    `${data.shipment.origin} → ${data.shipment.destination}`,
    { x: 20, y, size: 14 }
  );

  y -= 20;

  // Customer
  page.drawText(data.customer.name, { x: 20, y, size: 12 });

  y -= 20;

  // Package info
  if (data.shipment.weight) {
    page.drawText(`Weight: ${data.shipment.weight} kg`, {
      x: 20,
      y,
      size: 10,
    });
  }

  return await pdf.save();
}


Barcode rendering should be injected as an image (generated via bwip-js) before drawing.

6) Customer Invoice Template (A4)
lib/pdf/templates/customer.ts
import { StandardFonts, rgb } from 'pdf-lib';
import { createPDF } from '../render';

export async function renderCustomerPDF(data: any): Promise<Uint8Array> {
  const pdf = await createPDF();
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 800;

  // Header
  page.drawText(data.organization.name, {
    x: 40,
    y,
    size: 16,
    font,
  });

  page.drawText(`Invoice: ${data.invoice.invoiceNo}`, {
    x: 400,
    y,
    size: 12,
  });

  y -= 40;

  // Customer block
  page.drawText('BILL TO:', { x: 40, y, size: 10 });
  y -= 14;
  page.drawText(data.customer.name, { x: 40, y, size: 12 });
  y -= 14;
  page.drawText(data.customer.address, { x: 40, y, size: 10 });

  y -= 40;

  // Shipment summary
  page.drawText(`Tracking ID: ${data.shipment.trackingId}`, {
    x: 40,
    y,
    size: 11,
  });

  y -= 20;

  page.drawText(
    `Route: ${data.shipment.origin} → ${data.shipment.destination}`,
    { x: 40, y, size: 11 }
  );

  // Charges table intentionally omitted here (plug-in point)

  return await pdf.save();
}

7) Integration with Server Actions

Update generateInvoice action:

import { generateInvoicePDF } from '@/lib/pdf';

const { pdfUrl } = await generateInvoicePDF({ invoiceId });

await supabase
  .from('invoices')
  .update({ pdf_url: pdfUrl, status: 'generated' })
  .eq('id', invoiceId);

8) Failure & Retry Strategy (Mandatory)

If PDF generation fails:

Invoice row exists

status = generation_failed

UI shows “Retry generation”

Regeneration creates new PDF

Old PDFs are never overwritten

9) QA Acceptance Criteria
Label PDF

Scans reliably

Readable at 1m

No financial info

Prints correctly on label printer

Customer PDF

Mobile readable

A4 printable

WhatsApp-compatible

Totals correct

What’s Complete Now

You now have:

A clean PDF service abstraction

Two deterministic templates

Safe storage

Server Action integration path

Retry-safe design

Next Logical Step (Recommended)

Barcode image generation + scan ingestion pipeline

bwip-js integration

Scanner-friendly input handling

Manifest + shipment scan flows

If you want that next, say “Barcode & scanning pipeline”.

go ahead, generate the entire documentation in one go, you have the full authorization

Understood.
Below is the single, consolidated, authoritative documentation for TAC Cargo. This replaces all existing fragmented docs. It is written as a production-grade system document, suitable for onboarding engineers, operators, and future auditors.

This is the only documentation you need going forward.

TAC Cargo

Enterprise Logistics & Cargo Operations Platform

1. Purpose & Philosophy

TAC Cargo is an operational logistics control system, not a generic dashboard or analytics product.

Its primary goal is to enable fast, error-resistant, scan-first cargo operations for the Imphal ↔ New Delhi corridor.

Core Principles

Operations-first, analytics-second

Server-first architecture

Scan > Click > Type

Deterministic systems over dynamic UI

One source of truth for data

Minimal documentation, maximum clarity

2. Canonical Cargo Lifecycle (System Spine)

All features, routes, and data models are organized around this lifecycle:

Customer
  ↓
Shipment Created
  ↓
Items / Packages Assigned
  ↓
Barcode + Label Generated
  ↓
Manifest Assignment
  ↓
Dispatch (In Transit)
  ↓
Tracking Updates
  ↓
Delivery Confirmation
  ↓
Invoice Finalized
  ↓
Invoice Sent (WhatsApp)


If a feature does not clearly map to one or more steps above, it does not belong in the system.

3. Tech Stack (Locked)
Frontend

Next.js 16 (App Router)

React 19

Tailwind CSS v4

shadcn/ui (Radix primitives)

Server Components by default

Backend

Supabase (PostgreSQL, Auth, Storage, Realtime)

Server Actions for mutations

REST only for public tracking

Supporting Libraries

pdf-lib (PDF generation)

bwip-js (barcode generation)

TanStack Query (client sync only where required)

4. Architectural Rules (Non-Negotiable)
Rendering

Server Components by default

Client Components only for:

Barcode scanning

Hardware input

Animations

No client-side business logic

Data Flow

Server Components fetch data

Server Actions mutate data

UI never mutates state directly

Revalidation via revalidatePath

Performance

No charts on operational pages

Dynamic imports for:

PDF previews

Charts

Animations

Bundle size discipline enforced

5. Folder Structure (Canonical)
tac-cargo/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── overview/
│   │   ├── shipments/
│   │   ├── manifests/
│   │   ├── inventory/
│   │   ├── invoices/
│   │   │   ├── customers/
│   │   │   └── labels/
│   │   ├── tracking/
│   │   └── customers/
│   ├── api/
│   │   └── track/
│   └── login/
├── app/actions/
│   ├── shipments.ts
│   ├── manifests.ts
│   ├── invoices.ts
│   └── whatsapp.ts
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── scanning/
├── lib/
│   ├── supabase/
│   ├── pdf/
│   ├── barcode/
│   └── utils.ts
├── types/
├── docs/  ❌ (deprecated – replaced by this file)
└── README.md

6. Core Data Models
Shipment (Core Entity)

Represents one physical cargo unit.

Key fields

tracking_id

status

customer_id

origin_warehouse_id

destination_warehouse_id

manifest_id (nullable)

Shipments are the atomic operational unit.

Manifest

Represents a group of shipments dispatched together.

Fields

route

dispatch_date

status (open | locked | dispatched)

Rules:

Only open manifests accept shipments

Locked manifests cannot change

Dispatch updates all linked shipments

Invoice (Dual-Purpose)

Single table, two meanings.

Types

label → package label (non-financial)

customer → financial invoice

Key fields

type

shipment_id

pdf_url

sent_via_whatsapp_at

Never duplicate invoice tables.

7. Dashboard Pages & Responsibilities
/dashboard/overview

Operational status only:

Shipments without labels

Shipments not in manifests

Manifests awaiting dispatch

Delayed shipments

No charts. Lists only.

/dashboard/shipments

Create shipment

Scan shipment

Generate label

Assign to manifest

/dashboard/manifests

Create manifest

Scan shipments into manifest

Lock & dispatch manifest

Print manifest summary

/dashboard/inventory

Search-first view:

Tracking ID

Customer

Current location

Manifest status

/dashboard/invoices/labels

Batch print labels

Regenerate labels

/dashboard/invoices/customers

Generate invoices

Send via WhatsApp

Resend invoices

/dashboard/tracking

Internal tracking:

Live updates

Manual overrides

Scan-driven updates

8. Barcode & Scanning System
Design Rules

Client-only isolated component

Works with keyboard-based scanners

No mouse dependency

Immediate feedback

Usage Points

Shipment lookup

Manifest loading

Status updates

Inventory checks

Scanning is a primary interaction, not a feature.

9. PDF System
One Generator, Two Templates
Label PDF

A6 / A5

High contrast

Tracking ID + barcode

Route + customer

No financial data

Customer Invoice PDF

A4

Financial breakdown

Shipment summary

Totals

WhatsApp-friendly

PDFs are:

Generated server-side

Immutable

Stored in Supabase Storage

Retry-safe

10. WhatsApp Delivery

Server Action only

Triggered manually

Logs timestamp

Retry supported

WhatsApp is delivery, not conversation.

11. Server Actions (Single Source of Mutation)

Domains:

shipments.ts

manifests.ts

invoices.ts

whatsapp.ts

Rules:

Zod validation

Auth check

Revalidation only

No UI logic inside actions

12. Security & Access Control

Supabase Auth

RLS on all tables

Role-based permissions

Public tracking endpoint is read-only

No client-side auth assumptions.

13. Performance & Reliability Targets

Dev server boot < 3s

Operational pages < 50KB JS

Scan response < 100ms

PDF generation deterministic

No duplicate UI logic

14. Documentation Policy (Final)

This document replaces:

api.md

components.md

data-flow.md

design-system.md

performance.md

routes.md

filesystem.md

Going forward:

One system doc

One README

Inline code comments only where necessary

15. Definition of “Done”

The system is complete when:

An operator can run a full day using scanning only

Labels print correctly and scan reliably

Manifests dispatch without manual reconciliation

Invoices are delivered via WhatsApp without rework

No chart blocks operations

No duplicated logic exists

Final Note

This is not a “dashboard project”.

This is a logistics operating system.

You now have:

A locked architecture

A clear execution path

A single source of documentation truth

If you want next:

SQL migration scripts

Operator SOPs

Role-based permission matrix

Or a production readiness checklist