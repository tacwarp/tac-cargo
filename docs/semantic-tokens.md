# TAC Cargo Semantic Token System

## Overview

This document defines the complete semantic token vocabulary for the TAC Cargo design system. All UI components MUST use these tokens exclusively. Hardcoded colors are prohibited.

## Token Philosophy

1. **Semantic over Aesthetic**: Tokens represent meaning (status, state, priority) not visual appearance
2. **OKLCH Foundation**: All colors use OKLCH for perceptual uniformity and wide gamut support
3. **Mode Parity**: Dark and light modes share identical token names, only values differ
4. **Isolation**: Chart colors never used for UI chrome, state colors never used for decoration

## Complete Token Reference

See `app/globals.css` for the full implementation with OKLCH values.

### Shipment Status States
- `--state-pending`, `--state-scanned`, `--state-in-transit`, `--state-arrived`
- `--state-delivered`, `--state-delayed`, `--state-cancelled`, `--state-exception`

### Invoice Status States
- `--invoice-draft`, `--invoice-sent`, `--invoice-paid`, `--invoice-overdue`

### Manifest Status States
- `--manifest-open`, `--manifest-locked`, `--manifest-dispatched`

### Payment Status States
- `--payment-completed`, `--payment-pending`, `--payment-failed`

### Exception States
- Priority: `--priority-high`, `--priority-medium`, `--priority-low`
- Status: `--exception-open`, `--exception-investigating`, `--exception-resolved`

### Inventory States
- `--stock-critical`, `--stock-low`, `--stock-optimal`

### Scan States
- `--scan-success`, `--scan-duplicate`, `--scan-error`

### Tracking Timeline States
- `--tracking-pending`, `--tracking-picked-up`, `--tracking-in-transit`
- `--tracking-at-hub`, `--tracking-out-for-delivery`, `--tracking-delivered`

### KPI Indicators (for trends only, NOT values)
- `--kpi-positive`, `--kpi-negative`, `--kpi-neutral`, `--kpi-warning`

### Customer Status
- `--customer-active`, `--customer-inactive`

### Notification States
- `--notify-info`, `--notify-success`, `--notify-warning`, `--notify-error`

### Elevation Levels
- `--elevation-1` (cards, tables)
- `--elevation-2` (popovers, dropdowns)
- `--elevation-3` (modals, dialogs)

## Usage Examples

### Status Badges
```tsx
<Badge className="bg-state-pending/15 text-state-pending border-state-pending/30">
  Pending
</Badge>
```

### KPI Cards (IMPORTANT: Never color the value)
```tsx
<Card>
  <p className="text-sm text-muted-foreground">Revenue</p>
  <p className="text-3xl font-semibold">$125,430</p>
  <p className="text-sm text-kpi-positive">+12.5%</p>
</Card>
```

### Scan Feedback
```tsx
<div className="text-scan-success">
  <CheckCircle className="size-4" />
  Package scanned successfully
</div>
```

## Migration Patterns

| Old (Hardcoded) | New (Semantic) |
|----------------|----------------|
| `bg-amber-500/10 text-amber-500` | `bg-state-pending/15 text-state-pending` |
| `bg-emerald-500/10 text-emerald-500` | `bg-state-delivered/15 text-state-delivered` |
| `bg-rose-500/10 text-rose-500` | `bg-state-exception/15 text-state-exception` |
| `bg-blue-500/10 text-blue-500` | `bg-state-scanned/15 text-state-scanned` |
| `text-emerald-500` (KPI trend) | `text-kpi-positive` |

## Design System Rules

1. **Never** use hardcoded Tailwind colors (`bg-red-500`, `text-blue-600`, etc.)
2. **Never** color KPI values - only color trends/deltas
3. **Always** use semantic tokens that match semantic meaning
4. **If a token doesn't exist** - extend the system, never bypass it

**Last Updated**: 2026-01-11  
**Status**: Production Foundation
