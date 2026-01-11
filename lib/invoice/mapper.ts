import { Invoice } from "@/types/database";
import { ShipmentData, Address, PackageItem } from "@/types/invoice-v2";
import { GENERATOR_DEFAULTS } from "./generator-v2";

export function mapDatabaseInvoiceToV2(dbInvoice: any): ShipmentData {
    // defaults
    const consignor: Address = {
        name: "TAPAN ASSOCIATE CARGO",
        line1: "1498, Gr. Floor, Wazir Nagar",
        city: "New Delhi",
        state: "Delhi",
        zip: "110003",
        phone: "9711011416",
        email: "contact@tac.in"
    };

    const consignee: Address = {
        name: dbInvoice.consignee_name || "",
        line1: dbInvoice.consignee_address || "",
        city: dbInvoice.consignee_city || "",
        state: dbInvoice.consignee_state || "",
        zip: dbInvoice.consignee_pincode || "",
        phone: dbInvoice.customers?.phone || "", // Fallback to customer phone if available
        email: dbInvoice.customers?.email || ""
    };

    // Map items
    // If invoice_items exists, use them. Each likely has description, etc.
    // If not, fall back to shipment details if available.
    let items: PackageItem[] = [];

    if (dbInvoice.invoice_items && dbInvoice.invoice_items.length > 0) {
        items = dbInvoice.invoice_items.map((item: any, idx: number) => ({
            id: item.id || `item-${idx}`,
            description: item.description || "General Cargo",
            length: item.length || 30,
            width: item.width || 30,
            height: item.height || 30,
            actualWeight: item.weight || item.quantity || 1 // Assuming quantity or weight field
        }));
    } else if (dbInvoice.shipments) {
        // Fallback to shipment level info
        items = [{
            id: dbInvoice.shipments.id,
            description: "Shipment Cargo",
            length: 30, // details might be missing in shipment summary
            width: 30,
            height: 30,
            actualWeight: dbInvoice.shipments.weight_kg || 1
        }];
    } else {
        items = [{
            id: "default-1",
            description: "Consignment",
            length: 30,
            width: 30,
            height: 30,
            actualWeight: 1
        }];
    }

    return {
        invoiceId: dbInvoice.invoice_no,
        awbNumber: dbInvoice.awb_no || "",
        date: new Date(dbInvoice.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
        consignor,
        consignee,
        items,
        volumetricFactor: 5000, // Standard assumption
        ratePerKg: 0, // derived or static? 
        // We can try to reverse engineer rate if total / weight? 
        // Or just let the widget confirm it. 
        // For View mode, we simply pass these. The 'totals' will be recalculated based on valid fields.
        // BUT: The DB invoice has specific 'total_amount'. If we recalculate, we might drift.
        // IMPORTANT: The InvoicePrint component takes `totals` as a prop.
        // We should probably rely on DB totals for the View if we want exactness.
        // However, `InvoicePrint` uses `data` to display line items.
        gstRate: 18, // Default
        paymentMode: "To Pay", // Default or map if exists
        natureOfQuantity: "General",
        declaredValue: "N/A",
        bookingRemarks: dbInvoice.notes || "",
        pickupCharge: 0,
        packingCharge: 0,
        docketCharges: 0,
        insuranceCharge: 0,
        advancePaid: 0
    };
}
