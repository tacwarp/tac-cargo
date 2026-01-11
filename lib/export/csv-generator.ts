/**
 * CSV/Excel Export Utilities
 * Generates downloadable exports for shipments, invoices, and reports
 */

import { format } from "date-fns";

type ExportableRecord = Record<string, unknown>;

interface ColumnConfig {
  key: string;
  header: string;
  formatter?: (value: unknown, row: ExportableRecord) => string;
}

/**
 * Convert array of objects to CSV string
 */
export function toCSV<T extends ExportableRecord>(
  data: T[],
  columns: ColumnConfig[]
): string {
  if (data.length === 0) return "";

  // Header row
  const headers = columns.map((col) => escapeCSVValue(col.header));
  const headerRow = headers.join(",");

  // Data rows
  const dataRows = data.map((row) => {
    return columns
      .map((col) => {
        const value = getNestedValue(row, col.key);
        const formatted = col.formatter
          ? col.formatter(value, row)
          : formatValue(value);
        return escapeCSVValue(formatted);
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Get nested object value using dot notation
 */
function getNestedValue(obj: ExportableRecord, path: string): unknown {
  return path.split(".").reduce((current: unknown, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Format value for CSV
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return format(value, "yyyy-MM-dd HH:mm:ss");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Create downloadable CSV blob
 */
export function createCSVBlob(csvContent: string): Blob {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\uFEFF";
  return new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" });
}

/**
 * Trigger browser download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = createCSVBlob(csvContent);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =====================================================
// SHIPMENTS EXPORT
// =====================================================

export const SHIPMENT_COLUMNS: ColumnConfig[] = [
  { key: "reference", header: "Reference" },
  { key: "status", header: "Status" },
  { key: "consignee_name", header: "Consignee Name" },
  { key: "consignee_city", header: "Consignee City" },
  { key: "consignee_state", header: "Consignee State" },
  { key: "consignee_phone", header: "Consignee Phone" },
  { key: "pieces", header: "Pieces" },
  { key: "weight_kg", header: "Weight (Kg)" },
  { key: "transport_mode", header: "Transport Mode" },
  { key: "origin_warehouse.name", header: "Origin Warehouse" },
  { key: "destination_warehouse.name", header: "Destination Warehouse" },
  { key: "customers.name", header: "Customer" },
  { key: "manifest_number", header: "Manifest" },
  {
    key: "created_at",
    header: "Created At",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
  {
    key: "updated_at",
    header: "Updated At",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
];

export function exportShipmentsToCSV(shipments: ExportableRecord[]): string {
  return toCSV(shipments, SHIPMENT_COLUMNS);
}

// =====================================================
// INVOICES EXPORT
// =====================================================

export const INVOICE_COLUMNS: ColumnConfig[] = [
  { key: "invoice_no", header: "Invoice No" },
  { key: "awb_no", header: "AWB No" },
  { key: "status", header: "Status" },
  { key: "shipper_name", header: "Shipper Name" },
  { key: "consignee_name", header: "Consignee Name" },
  { key: "consignee_city", header: "Consignee City" },
  { key: "consignee_phone", header: "Consignee Phone" },
  { key: "total_pieces", header: "Pieces" },
  { key: "total_weight", header: "Weight (Kg)" },
  { key: "chargeable_weight", header: "Chargeable Weight" },
  { key: "freight_charge", header: "Freight Charge" },
  { key: "total_tax", header: "Tax" },
  { key: "total_amount", header: "Total Amount" },
  { key: "paid_amount", header: "Paid Amount" },
  { key: "balance_due", header: "Balance Due" },
  { key: "payment_mode", header: "Payment Mode" },
  {
    key: "invoice_date",
    header: "Invoice Date",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd") : ""),
  },
  {
    key: "due_date",
    header: "Due Date",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd") : ""),
  },
];

export function exportInvoicesToCSV(invoices: ExportableRecord[]): string {
  return toCSV(invoices, INVOICE_COLUMNS);
}

// =====================================================
// MANIFESTS EXPORT
// =====================================================

export const MANIFEST_COLUMNS: ColumnConfig[] = [
  { key: "manifest_number", header: "Manifest No" },
  { key: "status", header: "Status" },
  { key: "origin_warehouse.name", header: "Origin" },
  { key: "destination_warehouse.name", header: "Destination" },
  { key: "transport_mode", header: "Transport Mode" },
  { key: "vehicle_number", header: "Vehicle No" },
  { key: "driver_name", header: "Driver Name" },
  { key: "driver_phone", header: "Driver Phone" },
  { key: "total_pieces", header: "Total Pieces" },
  { key: "total_weight", header: "Total Weight" },
  {
    key: "planned_departure",
    header: "Planned Departure",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
  {
    key: "actual_departure",
    header: "Actual Departure",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
  {
    key: "actual_arrival",
    header: "Actual Arrival",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
];

export function exportManifestsToCSV(manifests: ExportableRecord[]): string {
  return toCSV(manifests, MANIFEST_COLUMNS);
}

// =====================================================
// PAYMENTS EXPORT
// =====================================================

export const PAYMENT_COLUMNS: ColumnConfig[] = [
  { key: "id", header: "Payment ID" },
  { key: "invoice.invoice_no", header: "Invoice No" },
  { key: "invoice.customer.name", header: "Customer" },
  { key: "amount", header: "Amount" },
  { key: "payment_mode", header: "Payment Mode" },
  { key: "transaction_ref", header: "Transaction Ref" },
  { key: "status", header: "Status" },
  {
    key: "paid_at",
    header: "Paid At",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm") : ""),
  },
  { key: "notes", header: "Notes" },
];

export function exportPaymentsToCSV(payments: ExportableRecord[]): string {
  return toCSV(payments, PAYMENT_COLUMNS);
}

// =====================================================
// SCAN EVENTS EXPORT
// =====================================================

export const SCAN_EVENT_COLUMNS: ColumnConfig[] = [
  { key: "shipments.reference", header: "Shipment Reference" },
  { key: "scan_type", header: "Scan Type" },
  { key: "warehouse.name", header: "Warehouse" },
  { key: "profiles.full_name", header: "Scanned By" },
  { key: "notes", header: "Notes" },
  {
    key: "created_at",
    header: "Scan Time",
    formatter: (v) => (v ? format(new Date(v as string), "yyyy-MM-dd HH:mm:ss") : ""),
  },
];

export function exportScanEventsToCSV(scanEvents: ExportableRecord[]): string {
  return toCSV(scanEvents, SCAN_EVENT_COLUMNS);
}
