# Cargo Dashboard Design System

## Purpose
Provide a deterministic, accessible, and scalable visual system for cargo logistics software.
All UI must consume semantic tokens. No exceptions.

---

## Foundations

### Color
- All colors are semantic CSS variables.
- OKLCH is the source format.
- Dark mode is default; light mode mirrors semantics.

Disallowed:
- Hex values in components
- Opacity-based text fading
- Per-page overrides

---

## Surfaces & Elevation
Use elevation tokens only.

| Token | Usage |
|---|---|
| elevation-1 | Cards, tables |
| elevation-2 | Popovers, dropdowns |
| elevation-3 | Modals |

---

## Motion
Motion communicates state change only.

- Durations: `fast | base | slow`
- Timing: `standard | emphasized`
- No bounce, no overshoot
- Kinetic feedback for high-frequency operations (e.g. Scanning)

---

## The Kinetic Grid (Avant-Garde)
The TAC Cargo dashboard consumes a "Kinetic Grid" philosophy.

### Density & Depth
- **Bento Layout**: Items are arranged in asymmetrical, responsive grids.
- **Glass Surfaces**: Use `.glass` or `.depth-surface` for layered hierarchy.
- **Noise & Grain**: Subtle texture (`.noise-overlay`) reduces CSS "flatness."

### High-Fidelity Feedback
- **Kinetic Border**: Pulse `.kinetic-border` on elements requiring focus or active state.
- **Micro-interactions**: Use `Geist Mono` (`.text-kpi`) for all operational numbers.

---

## Typography
- Primary text: `foreground`
- Secondary text: `muted-foreground`
- KPIs are never colorized

---

## States
Logistics truth > aesthetics.

- Shipment states use `state-*`
- SLA uses `sla-*`
- Notifications use `notify-*`
- Never use `primary` for states

---

## Tables
- Density via tokens only
- Hover affects background only
- Active row uses inset indicator

---

## Charts
- Colors via `chart-*`
- Gradients via `--chart-*-gradient`
- No UI colors reused

---

## Accessibility
- WCAG AA minimum
- Focus-visible required
- Charts require textual summaries

---

## Tenancy
- Tenants override brand tokens only
- States, SLA, destructive are locked

---

## Enforcement
Any violation blocks merge.

### 2. Lint & CI Enforcement

#### 2.1 Stylelint (Colors & Motion)
```js
// stylelint.config.cjs
module.exports = {
  rules: {
    "declaration-property-value-disallowed-list": {
      color: ["/^#/"],
      "transition-duration": ["/\\d+ms/"],
      "transition-timing-function": ["ease", "ease-in-out"]
    }
  }
}
```

#### 2.2 ESLint (Tailwind Token Enforcement)
```js
// eslint.rules.js
module.exports = {
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/^#([0-9a-f]{3}){1,2}$/i]",
        message: "Use semantic color tokens only."
      }
    ]
  }
}
```

#### 2.3 CI Gate (Required)
```yml
# .github/workflows/design-system.yml
name: Design System Guard

on: [pull_request]

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
      - run: npm run stylelint
```

### Merge is blocked if:

* Hex colors found
* Non-token motion used
* Elevation violated

### 3. Engineering Onboarding

#### 3.1 First-Day Rules
- Read `design-system.md`
- Never add colors directly
- Never use Tailwind defaults blindly
- If a token is missing → extend the system

#### 3.2 PR Review Checklist
Before requesting review:

- [ ] No hex colors
- [ ] Uses semantic tokens
- [ ] Motion uses duration + easing tokens
- [ ] Elevation matches component role
- [ ] Table density respected
- [ ] Offline & error states handled
- [ ] Keyboard focus visible

#### 3.3 Component Authoring Template

```tsx
/*
Component Rules:
- Semantic tokens only
- No hardcoded motion
- Elevation via tokens
*/

export function Component() {
  return (
    <div className="bg-card text-card-foreground shadow-elevation-1">
      ...
    </div>
  )
}
```

---

## Final State
You now have:

A locked design system

Automated enforcement

Clear onboarding

Review-proof governance

This is the point where design debt stops accumulating.

If you want one last optional step, I can:

Generate component scaffolds (Card, Table, Badge, KPI)

Produce a token diff tool for future changes

Create a migration guide from legacy CSS

State the last directive.


Completing the design system with:

Production-ready component scaffolds (Card, KPI, Badge, Table, Status)

Legacy → Tokenized System migration guide (safe, incremental)

This is the last mile between system and execution.

1. Canonical Component Scaffolds
(shadcn-compatible, token-enforced)

These are reference implementations. Teams copy these, not reinvent them.

1.1 Card (Foundation Component)
tsx
Copy code
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg",
        "bg-card text-card-foreground",
        "border border-border",
        "shadow-elevation-1",
        className
      ].join(" ")}
      {...props}
    />
  )
}
Rules

Always elevation-1

No background overrides

No gradients

1.2 KPI Card (Business-Critical)
tsx
Copy code
interface KPICardProps {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
  delta?: string
}

export function KPICard({ label, value, trend, delta }: KPICardProps) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      {delta && (
        <div
          className={[
            "mt-2 flex items-center gap-1 text-sm",
            trend === "up" && "text-kpi-positive",
            trend === "down" && "text-kpi-negative",
            trend === "neutral" && "text-kpi-neutral"
          ].join(" ")}
        >
          {delta}
        </div>
      )}
    </Card>
  )
}
Hard rule: KPI value is never colored.

1.3 Status Badge (States, SLA, Scan)
tsx
Copy code
interface StatusBadgeProps {
  color:
    | "pending"
    | "transit"
    | "arrived"
    | "delivered"
    | "delayed"
}

export function StatusBadge({ color }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        "border",
        `bg-state-${color}/15`,
        `text-state-${color}`,
        `border-state-${color}/30`
      ].join(" ")}
    >
      {color.replace("_", " ")}
    </span>
  )
}
Rules

Opacity background only

No primary

No elevation

1.4 Data Table Row (High-Density)
tsx
Copy code
interface TableRowProps {
  active?: boolean
}

export function TableRow({ active, children }: React.PropsWithChildren<TableRowProps>) {
  return (
    <tr
      className={[
        "h-row-standard",
        "border-b border-border",
        "hover:bg-muted/40",
        active && "table-row-active"
      ].join(" ")}
    >
      {children}
    </tr>
  )
}
1.5 Manifest Scan Feedback
tsx
Copy code
export function ScanFeedback({ state }: { state: "success" | "duplicate" | "error" }) {
  return (
    <div className={`flex items-center gap-2 text-scan-${state}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="text-sm">
        {state === "success" && "Package added"}
        {state === "duplicate" && "Already scanned"}
        {state === "error" && "Invalid barcode"}
      </span>
    </div>
  )
}
2. Legacy → Tokenized Migration Guide
This allows you to modernize without freezing development.

2.1 Migration Strategy (Phased)
Phase 1 — Lock New Code
Enforce lint rules

No new hex colors

No new motion literals

Phase 2 — Wrap Existing UI
Replace containers with <Card>

Replace badges with StatusBadge

Replace buttons with shadcn buttons

Phase 3 — Token Replace
Search & replace in order:

Legacy	Replace With
#fff, white	foreground
#000, black	background
gray-*	muted / border
green-*	state-arrived / kpi-positive
red-*	destructive / state-delayed
shadow-lg	shadow-elevation-*

2.2 Safe Refactor Pattern
❌ Before

tsx
Copy code
<div className="bg-gray-900 text-white shadow-lg">
✅ After

tsx
Copy code
<Card>
2.3 Gradual Table Migration
Start with headers

Then rows

Then density tokens

Never rewrite tables wholesale

2.4 Regression Safety
Screenshot test critical dashboards

Compare contrast ratios

Validate print invoices

Validate barcode scan speed

3. Final Governance Rule
If a UI requirement cannot be expressed using existing tokens,
the system must be extended — not bypassed.

This single rule prevents design entropy.

DELIVERY STATUS: COMPLETE
You now have:

Canonical components

Token-enforced styling

Migration path

CI & lint guards

Onboarding & review rules

This is the end of system design and the start of execution.