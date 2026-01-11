import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Canonical StatusBadge - Uses semantic OKLCH tokens exclusively
 * Supports all status categories across the application
 */

type ShipmentStatus = 'pending' | 'scanned' | 'in-transit' | 'arrived' | 'delivered' | 'delayed' | 'cancelled' | 'exception'
type InvoiceStatus = 'invoice-draft' | 'invoice-sent' | 'invoice-paid' | 'invoice-overdue'
type ManifestStatus = 'manifest-open' | 'manifest-locked' | 'manifest-dispatched'
type PaymentStatus = 'payment-completed' | 'payment-pending' | 'payment-failed'
type ExceptionPriority = 'priority-high' | 'priority-medium' | 'priority-low'
type ExceptionStatus = 'exception-open' | 'exception-investigating' | 'exception-resolved'
type StockStatus = 'stock-critical' | 'stock-low' | 'stock-optimal'
type ScanStatus = 'scan-success' | 'scan-duplicate' | 'scan-error'
type TrackingStatus = 'tracking-pending' | 'tracking-picked-up' | 'tracking-in-transit' | 'tracking-at-hub' | 'tracking-out-for-delivery' | 'tracking-delivered'
type CustomerStatus = 'customer-active' | 'customer-inactive'

export type Status = ShipmentStatus | InvoiceStatus | ManifestStatus | PaymentStatus | ExceptionPriority | ExceptionStatus | StockStatus | ScanStatus | TrackingStatus | CustomerStatus

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-state-pending/15 text-state-pending border-state-pending/30' },
  scanned: { label: 'Scanned', className: 'bg-state-scanned/15 text-state-scanned border-state-scanned/30' },
  'in-transit': { label: 'In Transit', className: 'bg-state-in-transit/15 text-state-in-transit border-state-in-transit/30' },
  arrived: { label: 'Arrived', className: 'bg-state-arrived/15 text-state-arrived border-state-arrived/30' },
  delivered: { label: 'Delivered', className: 'bg-state-delivered/15 text-state-delivered border-state-delivered/30' },
  delayed: { label: 'Delayed', className: 'bg-state-delayed/15 text-state-delayed border-state-delayed/30' },
  cancelled: { label: 'Cancelled', className: 'bg-state-cancelled/15 text-state-cancelled border-state-cancelled/30' },
  exception: { label: 'Exception', className: 'bg-state-exception/15 text-state-exception border-state-exception/30' },
  'invoice-draft': { label: 'Draft', className: 'bg-invoice-draft/15 text-invoice-draft border-invoice-draft/30' },
  'invoice-sent': { label: 'Sent', className: 'bg-invoice-sent/15 text-invoice-sent border-invoice-sent/30' },
  'invoice-paid': { label: 'Paid', className: 'bg-invoice-paid/15 text-invoice-paid border-invoice-paid/30' },
  'invoice-overdue': { label: 'Overdue', className: 'bg-invoice-overdue/15 text-invoice-overdue border-invoice-overdue/30' },
  'manifest-open': { label: 'Open', className: 'bg-manifest-open/15 text-manifest-open border-manifest-open/30' },
  'manifest-locked': { label: 'Locked', className: 'bg-manifest-locked/15 text-manifest-locked border-manifest-locked/30' },
  'manifest-dispatched': { label: 'Dispatched', className: 'bg-manifest-dispatched/15 text-manifest-dispatched border-manifest-dispatched/30' },
  'payment-completed': { label: 'Completed', className: 'bg-payment-completed/15 text-payment-completed border-payment-completed/30' },
  'payment-pending': { label: 'Pending', className: 'bg-payment-pending/15 text-payment-pending border-payment-pending/30' },
  'payment-failed': { label: 'Failed', className: 'bg-payment-failed/15 text-payment-failed border-payment-failed/30' },
  'priority-high': { label: 'High', className: 'bg-priority-high/15 text-priority-high border-priority-high/30' },
  'priority-medium': { label: 'Medium', className: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30' },
  'priority-low': { label: 'Low', className: 'bg-priority-low/15 text-priority-low border-priority-low/30' },
  'exception-open': { label: 'Open', className: 'bg-exception-open/15 text-exception-open border-exception-open/30' },
  'exception-investigating': { label: 'Investigating', className: 'bg-exception-investigating/15 text-exception-investigating border-exception-investigating/30' },
  'exception-resolved': { label: 'Resolved', className: 'bg-exception-resolved/15 text-exception-resolved border-exception-resolved/30' },
  'stock-critical': { label: 'Critical', className: 'bg-stock-critical/15 text-stock-critical border-stock-critical/30' },
  'stock-low': { label: 'Low', className: 'bg-stock-low/15 text-stock-low border-stock-low/30' },
  'stock-optimal': { label: 'Optimal', className: 'bg-stock-optimal/15 text-stock-optimal border-stock-optimal/30' },
  'scan-success': { label: 'Success', className: 'bg-scan-success/15 text-scan-success border-scan-success/30' },
  'scan-duplicate': { label: 'Duplicate', className: 'bg-scan-duplicate/15 text-scan-duplicate border-scan-duplicate/30' },
  'scan-error': { label: 'Error', className: 'bg-scan-error/15 text-scan-error border-scan-error/30' },
  'tracking-pending': { label: 'Pending', className: 'bg-tracking-pending/15 text-tracking-pending border-tracking-pending/30' },
  'tracking-picked-up': { label: 'Picked Up', className: 'bg-tracking-picked-up/15 text-tracking-picked-up border-tracking-picked-up/30' },
  'tracking-in-transit': { label: 'In Transit', className: 'bg-tracking-in-transit/15 text-tracking-in-transit border-tracking-in-transit/30' },
  'tracking-at-hub': { label: 'At Hub', className: 'bg-tracking-at-hub/15 text-tracking-at-hub border-tracking-at-hub/30' },
  'tracking-out-for-delivery': { label: 'Out for Delivery', className: 'bg-tracking-out-for-delivery/15 text-tracking-out-for-delivery border-tracking-out-for-delivery/30' },
  'tracking-delivered': { label: 'Delivered', className: 'bg-tracking-delivered/15 text-tracking-delivered border-tracking-delivered/30' },
  'customer-active': { label: 'Active', className: 'bg-customer-active/15 text-customer-active border-customer-active/30' },
  'customer-inactive': { label: 'Inactive', className: 'bg-customer-inactive/15 text-customer-inactive border-customer-inactive/30' }
} as const

export interface StatusBadgeProps {
  status: Status
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn(config.className, 'border', className)} role="status">
      {label ?? config.label}
    </Badge>
  )
}

