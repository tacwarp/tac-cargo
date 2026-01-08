/**
 * Server Actions Index
 * Central export point for all server actions
 */

// Shipments
export {
  createShipment,
  updateShipmentStatus,
  assignShipmentToManifest,
  removeShipmentFromManifest,
  getShipmentByReference,
  searchShipments,
  deleteShipment,
} from "./shipments";

// Manifests
export {
  createManifest,
  addShipmentToManifest,
  lockManifest,
  dispatchManifest,
  getManifest,
  listManifests,
  completeManifest,
} from "./manifests";

// Invoices
export {
  generateLabelInvoice,
  generateCustomerInvoice,
  regenerateInvoice,
  markInvoiceAsSent,
  getInvoice,
  listInvoices,
  getInvoicesPendingDelivery,
} from "./invoices";

// Customers
export {
  createCustomer,
  updateCustomer,
  getCustomer,
  searchCustomers,
  listCustomers,
  getCustomerShipments,
  getCustomerInvoices,
} from "./customers";

// WhatsApp
export {
  sendInvoiceViaWhatsApp,
  getWhatsAppLink,
  batchSendInvoices,
  resendInvoice,
} from "./whatsapp";

// Scanning
export {
  processScan,
  lookupByBarcode,
  bulkScanToManifest,
  getRecentScans,
} from "./scanning";

// Tracking
export {
  getTrackingInfo,
  addTrackingEvent,
  getShipmentTrackingHistory,
  getShipmentsByStatus,
  getDelayedShipments,
  markAsDelivered,
  getTrackingStats,
} from "./tracking";

// Inventory
export {
  searchInventory,
  getShipmentLocation,
  updateInventoryLocation,
  getWarehouseInventory,
  getItemsAtLocation,
} from "./inventory";

// Payments
export {
  recordPayment,
  getInvoicePayments,
  getOutstandingInvoices,
  getPaymentStats,
  refundPayment,
  getCustomerPaymentHistory,
} from "./payments";
