/**
 * Lazy-loaded components for code splitting and performance
 */

import dynamic from 'next/dynamic'

/**
 * Dashboard components (heavy charts)
 */
export const StatusChart = dynamic(
  () => import('@/components/dashboard/status-chart').then(mod => ({ default: mod.StatusChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded" /> }
)

export const TrendChart = dynamic(
  () => import('@/components/dashboard/trend-chart').then(mod => ({ default: mod.TrendChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded" /> }
)

/**
 * Shipments components
 */
export const ShipmentsTable = dynamic(
  () => import('@/components/shipments/shipments-table').then(mod => ({ default: mod.ShipmentsTable })),
  { loading: () => <div className="h-96 bg-muted animate-pulse rounded" /> }
)

export const CreateShipmentForm = dynamic(
  () => import('@/components/shipments/create-shipment-form').then(mod => ({ default: mod.CreateShipmentForm })),
  { ssr: false }
)

/**
 * Heavy utilities
 */
export const BarcodeScanner = dynamic(
  () => import('@/components/barcode/scanner'),
  { ssr: false }
)

export const PDFViewer = dynamic(
  () => import('@/components/pdf/viewer'),
  { ssr: false }
)
