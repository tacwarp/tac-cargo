# TAC Cargo - Server Actions API Reference

**Version**: 1.0  
**Last Updated**: January 11, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Invoice Workflows](#invoice-workflows)
3. [Manifest Workflows](#manifest-workflows)
4. [Inventory Workflows](#inventory-workflows)
5. [Common Types](#common-types)
6. [Error Handling](#error-handling)
7. [Usage Examples](#usage-examples)

---

## Overview

This document describes the production-hardened Server Actions API for TAC Cargo. All operations include:

- ✅ State machine enforcement
- ✅ Atomic transactions with rollback
- ✅ Optimistic locking for concurrency
- ✅ Comprehensive audit logging
- ✅ Type-safe error handling

### Common Return Type

```typescript
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};
```

---

## Invoice Workflows

**Module**: `app/actions/invoice-workflows.ts`

### State Machine

```
draft ──→ sent ──→ paid
  │         │
  └────→ overdue ──→ paid
  │         │
  └────→ cancelled
```

### Functions

#### `updateInvoiceStatus()`

Update invoice status with state machine validation.

**Signature**:
```typescript
async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
  notes?: string
): Promise<ActionResult<Invoice>>
```

**Parameters**:
- `invoiceId` - UUID of the invoice
- `newStatus` - Target status (must be valid transition)
- `notes` - Optional notes about the status change

**Returns**: Updated invoice object

**Validation**:
- Checks valid state transition
- Uses optimistic locking (`updated_at` check)
- Creates audit log entry

**Example**:
```typescript
const result = await updateInvoiceStatus(
  'invoice-uuid',
  'sent',
  'Sent via WhatsApp'
);

if (result.success) {
  console.log('Invoice updated:', result.data);
} else {
  console.error('Error:', result.error?.message);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Invoice not found
- `VALIDATION_ERROR` - Invalid status transition
- `CONFLICT` - Invoice modified by another user
- `DATABASE_ERROR` - Database operation failed

---

#### `sendInvoiceWithRetry()`

Send invoice via WhatsApp with automatic retry logic.

**Signature**:
```typescript
async function sendInvoiceWithRetry(
  invoiceId: string
): Promise<ActionResult<{ sent: boolean; attempts: number }>>
```

**Parameters**:
- `invoiceId` - UUID of the invoice to send

**Returns**: 
- `sent` - Whether send was successful
- `attempts` - Number of attempts made

**Retry Logic**:
- Max attempts: 3
- Base delay: 1000ms
- Max delay: 10000ms
- Exponential backoff with ±25% jitter

**Validation**:
- Invoice status must be `draft` or `sent`
- Customer must have phone number
- Invoice must have generated PDF

**Example**:
```typescript
const result = await sendInvoiceWithRetry('invoice-uuid');

if (result.success) {
  console.log(`Sent after ${result.data.attempts} attempts`);
} else {
  console.error('Failed to send:', result.error?.message);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Invoice not found
- `VALIDATION_ERROR` - Missing phone/PDF or invalid status
- `INTERNAL_ERROR` - WhatsApp API failed after all retries

---

#### `markInvoiceAsPaid()`

Mark invoice as paid with validation.

**Signature**:
```typescript
async function markInvoiceAsPaid(
  invoiceId: string,
  paymentReference?: string,
  paidAmount?: number
): Promise<ActionResult<Invoice>>
```

**Parameters**:
- `invoiceId` - UUID of the invoice
- `paymentReference` - Optional payment reference/transaction ID
- `paidAmount` - Optional amount paid (must match invoice total)

**Returns**: Updated invoice with `paid_at` timestamp

**Validation**:
- Valid transition to `paid` status
- If `paidAmount` provided, must match invoice total
- Sets `paid_at` timestamp automatically

**Example**:
```typescript
const result = await markInvoiceAsPaid(
  'invoice-uuid',
  'TXN-12345',
  5000.00
);

if (result.success) {
  console.log('Paid at:', result.data.paid_at);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Invoice not found
- `VALIDATION_ERROR` - Invalid transition or amount mismatch
- `DATABASE_ERROR` - Database operation failed

---

## Manifest Workflows

**Module**: `app/actions/manifest-workflows.ts`

### State Machine

```
open ──→ locked ──→ dispatched ──→ completed
  │         │
  │         └──→ open (reopen if needed)
  │
  └──→ cancelled
```

### Functions

#### `addShipmentToManifest()`

Add shipment to manifest with idempotent behavior.

**Signature**:
```typescript
async function addShipmentToManifest(
  manifestId: string,
  shipmentReference: string
): Promise<ActionResult<ScanResult>>
```

**Parameters**:
- `manifestId` - UUID of the manifest
- `shipmentReference` - Shipment reference/AWB number

**Returns**: `ScanResult` with type and message

```typescript
type ScanResult = {
  type: 'success' | 'duplicate' | 'error';
  message: string;
  shipment?: Shipment;
  manifestId?: string;
};
```

**Behavior**:
- **Idempotent**: Scanning same shipment twice returns `duplicate`, not error
- **Atomic**: All operations succeed or all fail
- Updates: manifest_items + shipment.status + tracking_event

**Validation**:
- Manifest must be in `open` status
- Shipment must exist
- Duplicate check prevents double-adding

**Example**:
```typescript
const result = await addShipmentToManifest(
  'manifest-uuid',
  'AWB12345'
);

if (result.success) {
  switch (result.data.type) {
    case 'success':
      showToast('✅ Shipment added', 'success');
      break;
    case 'duplicate':
      showToast('⚠️ Already in manifest', 'warning');
      break;
    case 'error':
      showToast('❌ ' + result.data.message, 'error');
      break;
  }
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `INTERNAL_ERROR` - Unexpected system error

**Scan Result Types**:
- `success` - Shipment added successfully
- `duplicate` - Shipment already in manifest (safe to ignore)
- `error` - Validation failed or shipment not found

---

#### `lockManifest()`

Lock manifest to prevent further modifications.

**Signature**:
```typescript
async function lockManifest(
  manifestId: string
): Promise<ActionResult<Manifest>>
```

**Parameters**:
- `manifestId` - UUID of the manifest to lock

**Returns**: Updated manifest with `locked_at` and `locked_by`

**Validation**:
- Current status must allow transition to `locked`
- Manifest must have at least 1 item
- Gets item count and stores in manifest record

**Example**:
```typescript
const result = await lockManifest('manifest-uuid');

if (result.success) {
  console.log('Locked with', result.data.item_count, 'items');
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Manifest not found
- `VALIDATION_ERROR` - Cannot lock (wrong status or empty)
- `DATABASE_ERROR` - Database operation failed

---

#### `dispatchManifest()`

Dispatch manifest and update all contained shipments.

**Signature**:
```typescript
async function dispatchManifest(
  manifestId: string,
  vehicleNumber?: string,
  driverName?: string
): Promise<ActionResult<Manifest>>
```

**Parameters**:
- `manifestId` - UUID of the manifest
- `vehicleNumber` - Optional vehicle registration number
- `driverName` - Optional driver name

**Returns**: Updated manifest with dispatch details

**Operations**:
1. Update manifest status to `dispatched`
2. Update ALL shipments in manifest to `in_transit`
3. Create tracking event for each shipment
4. Store vehicle and driver information

**Validation**:
- Current status must allow transition to `dispatched`

**Example**:
```typescript
const result = await dispatchManifest(
  'manifest-uuid',
  'KA-01-AB-1234',
  'John Doe'
);

if (result.success) {
  console.log('Dispatched at:', result.data.dispatched_at);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Manifest not found
- `VALIDATION_ERROR` - Invalid status transition
- `DATABASE_ERROR` - Database operation failed

---

#### `removeShipmentFromManifest()`

Remove shipment from open manifest.

**Signature**:
```typescript
async function removeShipmentFromManifest(
  manifestId: string,
  shipmentId: string
): Promise<ActionResult<{ removed: boolean }>>
```

**Parameters**:
- `manifestId` - UUID of the manifest
- `shipmentId` - UUID of the shipment to remove

**Returns**: Confirmation of removal

**Operations**:
1. Delete manifest_item record
2. Reset shipment status to `pending`
3. Clear shipment's manifest_id

**Validation**:
- Manifest must be in `open` status (cannot remove from locked/dispatched)

**Example**:
```typescript
const result = await removeShipmentFromManifest(
  'manifest-uuid',
  'shipment-uuid'
);

if (result.success && result.data.removed) {
  console.log('Shipment removed from manifest');
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Manifest not found
- `VALIDATION_ERROR` - Manifest is locked/dispatched
- `DATABASE_ERROR` - Database operation failed

---

## Inventory Workflows

**Module**: `app/actions/inventory-workflows.ts`

### Functions

#### `adjustInventoryWithShipment()`

Atomic cross-system inventory adjustment.

**Signature**:
```typescript
async function adjustInventoryWithShipment(input: {
  warehouseId: string;
  itemSku: string;
  quantity: number;
  shipmentId: string;
  manifestId?: string;
  notes?: string;
}): Promise<ActionResult<{
  inventoryUpdated: boolean;
  shipmentUpdated: boolean;
  trackingCreated: boolean;
}>>
```

**Parameters**:
- `warehouseId` - UUID of the warehouse
- `itemSku` - SKU of the inventory item
- `quantity` - Quantity to adjust (decrement)
- `shipmentId` - UUID of the shipment
- `manifestId` - Optional manifest UUID (if adding to manifest)
- `notes` - Optional adjustment notes

**Returns**: Status of each operation

**Atomic Operations** (all succeed or all fail):
1. Update inventory (decrement quantity)
2. Update shipment status
3. Create tracking event
4. Add to manifest (if manifestId provided)

**Rollback Behavior**:
- If Step 2 fails → Rollback Step 1
- If Step 3 fails → Rollback Steps 1-2
- If Step 4 fails → Rollback Steps 1-3

**Validation**:
- Inventory item must exist in warehouse
- Sufficient quantity must be available
- Optimistic locking prevents concurrent modifications

**Example**:
```typescript
const result = await adjustInventoryWithShipment({
  warehouseId: 'wh-uuid',
  itemSku: 'SKU-12345',
  quantity: 5,
  shipmentId: 'ship-uuid',
  manifestId: 'manifest-uuid', // optional
  notes: 'Scanned for manifest'
});

if (result.success) {
  console.log('All systems updated:', result.data);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Inventory item not found
- `VALIDATION_ERROR` - Insufficient quantity
- `CONFLICT` - Concurrent modification detected
- `DATABASE_ERROR` - Operation failed (with automatic rollback)

---

#### `reconcileInventory()`

Find and optionally fix inventory discrepancies.

**Signature**:
```typescript
async function reconcileInventory(
  warehouseId: string,
  autoFix: boolean = false
): Promise<ActionResult<{
  discrepancies: Array<{
    itemSku: string;
    expectedQuantity: number;
    actualQuantity: number;
    difference: number;
  }>;
  fixed: boolean;
}>>
```

**Parameters**:
- `warehouseId` - UUID of the warehouse
- `autoFix` - Whether to automatically fix discrepancies

**Returns**: List of discrepancies and fix status

**What it checks**:
- Negative inventory (indicates corruption)
- Quantity mismatches between inventory and shipments
- Cross-system consistency

**Example**:
```typescript
// Check only
const result = await reconcileInventory('wh-uuid', false);

console.log('Found', result.data.discrepancies.length, 'issues');

// Check and fix
const fixed = await reconcileInventory('wh-uuid', true);
console.log('Fixed:', fixed.data.fixed);
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `DATABASE_ERROR` - Database operation failed

---

#### `getInventoryStatus()`

Get real-time inventory levels with status indicators.

**Signature**:
```typescript
async function getInventoryStatus(
  warehouseId: string
): Promise<ActionResult<{
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    status: 'stock-critical' | 'stock-low' | 'stock-optimal';
    reorderPoint: number;
  }>;
  summary: {
    critical: number;
    low: number;
    optimal: number;
  };
}>>
```

**Parameters**:
- `warehouseId` - UUID of the warehouse

**Returns**: Inventory items with calculated status

**Status Calculation**:
- `stock-critical`: quantity ≤ reorderPoint * 0.5
- `stock-low`: quantity ≤ reorderPoint
- `stock-optimal`: quantity > reorderPoint

**Example**:
```typescript
const result = await getInventoryStatus('wh-uuid');

if (result.success) {
  const { summary } = result.data;
  console.log(`Critical: ${summary.critical}`);
  console.log(`Low: ${summary.low}`);
  console.log(`Optimal: ${summary.optimal}`);
}
```

**Possible Errors**:
- `UNAUTHORIZED` - User not authenticated
- `DATABASE_ERROR` - Database query failed

---

## Common Types

### InvoiceStatus

```typescript
type InvoiceStatus = 
  | 'draft' 
  | 'sent' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled';
```

### ManifestStatus

```typescript
type ManifestStatus = 
  | 'open' 
  | 'locked' 
  | 'dispatched' 
  | 'completed' 
  | 'cancelled';
```

### ShipmentStatus

```typescript
type ShipmentStatus = 
  | 'pending' 
  | 'picked_up' 
  | 'in_transit' 
  | 'at_hub'
  | 'out_for_delivery' 
  | 'delivered' 
  | 'failed'
  | 'returned' 
  | 'cancelled' 
  | 'exception';
```

### ActionResult

```typescript
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 
          'CONFLICT' | 'DATABASE_ERROR' | 'INTERNAL_ERROR';
  };
};
```

---

## Error Handling

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `UNAUTHORIZED` | User not authenticated | Redirect to login |
| `NOT_FOUND` | Resource doesn't exist | Show not found message |
| `VALIDATION_ERROR` | Invalid input or state | Show validation error |
| `CONFLICT` | Concurrent modification | Refresh and retry |
| `DATABASE_ERROR` | Database operation failed | Show error, log for debugging |
| `INTERNAL_ERROR` | Unexpected system error | Show generic error, alert team |

### Best Practices

#### Always Check `success` Flag

```typescript
const result = await someAction();

if (result.success) {
  // Handle success
  const data = result.data; // TypeScript knows this exists
} else {
  // Handle error
  const error = result.error; // TypeScript knows this exists
  showToast(error.message, 'error');
}
```

#### Handle Specific Error Codes

```typescript
const result = await updateInvoiceStatus(id, 'sent');

if (!result.success) {
  switch (result.error?.code) {
    case 'UNAUTHORIZED':
      router.push('/login');
      break;
    case 'VALIDATION_ERROR':
      showToast(result.error.message, 'error');
      break;
    case 'CONFLICT':
      // Refresh data and show conflict message
      await refreshInvoice();
      showToast('Invoice was modified. Please try again.', 'warning');
      break;
    default:
      showToast('An error occurred', 'error');
      logError(result.error);
  }
}
```

#### Retry on Conflict

```typescript
async function updateWithRetry(id: string, status: InvoiceStatus, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await updateInvoiceStatus(id, status);
    
    if (result.success) {
      return result;
    }
    
    if (result.error?.code !== 'CONFLICT') {
      // Don't retry non-conflict errors
      return result;
    }
    
    if (attempt < maxRetries) {
      // Wait before retry (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
}
```

---

## Usage Examples

### Complete Invoice Flow

```typescript
'use client';

import { useState } from 'react';
import { 
  updateInvoiceStatus, 
  sendInvoiceWithRetry,
  markInvoiceAsPaid 
} from '@/app/actions/invoice-workflows';

export function InvoiceActions({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    
    // Send invoice
    const result = await sendInvoiceWithRetry(invoiceId);
    
    if (result.success) {
      showToast(
        `Invoice sent after ${result.data.attempts} attempts`, 
        'success'
      );
    } else {
      showToast(result.error?.message || 'Failed to send', 'error');
    }
    
    setLoading(false);
  }

  async function handleMarkPaid(reference: string, amount: number) {
    setLoading(true);
    
    const result = await markInvoiceAsPaid(invoiceId, reference, amount);
    
    if (result.success) {
      showToast('Invoice marked as paid', 'success');
    } else {
      showToast(result.error?.message || 'Failed to mark as paid', 'error');
    }
    
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleSend} disabled={loading}>
        Send Invoice
      </button>
      <button onClick={() => handleMarkPaid('TXN-123', 5000)} disabled={loading}>
        Mark as Paid
      </button>
    </div>
  );
}
```

### Barcode Scanning with Idempotency

```typescript
'use client';

import { useState } from 'react';
import { addShipmentToManifest } from '@/app/actions/manifest-workflows';

export function BarcodeScanner({ manifestId }: { manifestId: string }) {
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);

  async function handleScan() {
    if (!barcode.trim()) return;
    
    setScanning(true);
    
    const result = await addShipmentToManifest(manifestId, barcode);
    
    if (result.success) {
      switch (result.data.type) {
        case 'success':
          playSound('success');
          showToast(`✅ ${barcode} added`, 'success');
          break;
        case 'duplicate':
          playSound('warning');
          showToast(`⚠️ ${barcode} already in manifest`, 'warning');
          break;
        case 'error':
          playSound('error');
          showToast(`❌ ${result.data.message}`, 'error');
          break;
      }
    } else {
      showToast('Scan failed', 'error');
    }
    
    setBarcode(''); // Clear for next scan
    setScanning(false);
  }

  return (
    <div>
      <input
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        placeholder="Scan barcode"
        autoFocus
      />
      <button onClick={handleScan} disabled={scanning}>
        Scan
      </button>
    </div>
  );
}
```

### Inventory Adjustment with Rollback

```typescript
'use client';

import { adjustInventoryWithShipment } from '@/app/actions/inventory-workflows';

export async function processWarehousePickup(
  warehouseId: string,
  itemSku: string,
  quantity: number,
  shipmentId: string,
  manifestId?: string
) {
  const result = await adjustInventoryWithShipment({
    warehouseId,
    itemSku,
    quantity,
    shipmentId,
    manifestId,
    notes: 'Warehouse pickup scan'
  });

  if (result.success) {
    // All systems updated atomically
    console.log('✅ Inventory updated:', result.data.inventoryUpdated);
    console.log('✅ Shipment updated:', result.data.shipmentUpdated);
    console.log('✅ Tracking created:', result.data.trackingCreated);
    
    return { success: true };
  } else {
    // Automatic rollback already occurred
    console.error('❌ Operation failed:', result.error?.message);
    console.log('🔄 All changes have been rolled back');
    
    return { success: false, error: result.error };
  }
}
```

---

## Security Considerations

### Authentication

All Server Actions verify authentication:

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return error('Unauthorized', 'UNAUTHORIZED');
}
```

### Authorization

RLS policies enforce organization isolation:

```sql
CREATE POLICY invoices_org_isolation ON invoices
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### Audit Logging

All operations create audit log entries:

```typescript
await supabase.from('audit_logs').insert({
  user_id: user.id,
  action: 'invoice_status_update',
  entity_type: 'invoice',
  entity_id: invoiceId,
  details: { from_status, to_status },
  organization_id: invoice.organization_id,
});
```

---

**Last Updated**: January 11, 2026  
**Version**: 1.0  
**Maintained By**: Engineering Team

