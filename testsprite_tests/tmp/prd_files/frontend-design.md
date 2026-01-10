# Frontend Design System & Implementation Contract  
**Project:** TAC Cargo – Enterprise Logistics Platform  
**Skill:** frontend-design  
**Status:** Production-Binding Specification  
**License:** See LICENSE.txt  

---

## 1. Why This Document Exists

This file **overrides generic frontend-design behavior** and binds design decisions to:

- Real-world logistics workflows
- Print + barcode constraints
- High-density operational UIs
- Your existing Tailwind v4 + OKLCH token system
- shadcn/radix-mira component architecture

This is **not a style guide**.  
This is a **design + engineering contract**.

---

## 2. Non-Negotiable Context

### 2.1 Product Reality
This system handles:
- Legal invoices
- Physical cargo
- Financial records
- Chain-of-custody data

Errors have **financial and legal consequences**.

### 2.2 Users
- Warehouse operators (speed, clarity)
- Dispatch & ops managers (density, overview)
- Finance & audit (accuracy, traceability)
- Customers (trust, transparency)

---

## 3. Chosen Aesthetic Direction (Locked)

### Direction
**Industrial / Utilitarian / Command-Console Minimalism**

### Explicitly NOT
- SaaS marketing minimalism
- Rounded, playful UI
- Decorative gradients
- Trend-driven typography

### Must Feel Like
- Cargo terminal console
- Airline ops desk
- Customs documentation system

---

## 4. Typography System (Aligned to globals.css)

### Current Fonts (From Codebase)
Defined in `globals.css` :contentReference[oaicite:4]{index=4}

```css
--font-sans: "Inter", sans-serif;
--font-serif: "Source Serif 4", serif;
--font-mono: "JetBrains Mono", monospace;
Enforced Usage Rules
Use Case	Font
UI chrome, labels	--font-sans
Legal / invoice blocks	--font-serif
AWB, Invoice IDs, weights, barcodes	--font-mono

Rules

All numeric tables MUST use tabular numerals

All IDs MUST use mono

No additional font families without approval

5. Color System (OKLCH-Only, Semantic)
Source of Truth
All colors come from globals.css tokens 
globals


Stylelint enforces OKLCH and forbids RGB/HSL 
stylelint.config


Semantic Mapping (Must Be Followed)
Token	Meaning
--primary	Primary actions
--success	Delivered / completed
--warning	Delay / attention
--destructive	Exception / overdue
--info	Informational
--muted	Secondary text
--border	Structural separation

Rules

Color is state, not decoration

No ad-hoc colors

No inline hex/rgb values

Dark mode parity is mandatory

6. Layout & Density Rules
6.1 Grid Discipline
Tables are first-class citizens

Alignment > whitespace

Predictable column structure

6.2 Density Modes (Required)
Comfortable (management)

Compact (operations)

Ultra-compact (warehouse / finance)

Density is a system feature, not a CSS afterthought.

7. Component Rules (shadcn / Radix)
Source
shadcn config (radix-mira) 
components


Tables
Sticky headers mandatory

Monospaced numeric columns

No zebra striping unless necessary

Hover = subtle only

Cards
Low radius (--radius)

No excessive shadow

Used for grouping, not decoration

Forms (Invoices, Manifests)
Sectioned, not long-scroll chaos

Inline calculations visible

Errors explain why, not just what

8. Motion & Feedback (Bounded)
Available Motion Utilities
From globals.css 
globals


animate-scan

animate-ping-slow

animate-shimmer

Rules
Motion must explain state change

Scanner success/error feedback is mandatory

No continuous decorative animation

9. Documents Are First-Class UI
9.1 Invoice UI
Screen layout mirrors PDF exactly

WYSIWYG: what you see is what prints

Serif body + mono identifiers

No web-only embellishments

9.2 Shipping Labels (4×6)
Pixel-to-inch accurate

Fixed layout (no responsive reflow)

SVG barcodes only

Black on white only

Printer DPI aware (203 / 300)

10. Barcode & Tracking UI Rules
Barcodes
Code 128 / GS1-128 only

SVG only (no canvas, no PNG)

Human-readable text mandatory

Tracking Timeline
Append-only events

No visual noise

Clear state transitions

11. Error Handling & Trust
Global Errors
Handled via global-error.tsx 
global-error


Rules:

Errors must feel serious, not playful

Clear recovery path

No humorous copy

Production-safe messaging

12. Accessibility & Performance
Accessibility
WCAG AA minimum

Keyboard-first navigation

High contrast in all states

Screen-reader friendly tables

Performance
Sub-200ms interactions

Aggressive code splitting

Avoid heavy animation libs unless justified

13. Hard Prohibitions
❌ New fonts without approval

❌ RGB / HSL colors

❌ Decorative gradients

❌ Over-rounded components

❌ Generic SaaS layouts

❌ AI-generic visual patterns

14. Design Litmus Test
A screen is correct if:

A warehouse operator can scan faster

An auditor trusts the numbers instantly

A CFO feels the system is serious

A printed document looks official

If it looks “cool” but fails those tests —
it is wrong.

Final Statement
This frontend is not here to impress.
It is here to hold weight, money, and accountability.

Design accordingly.