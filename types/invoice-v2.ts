
export interface Address {
    name: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email?: string;
}

export interface PackageItem {
    id: string;
    description: string;
    length: number;
    width: number;
    height: number;
    actualWeight: number;
}

export interface ShipmentData {
    invoiceId: string;
    awbNumber: string;
    date: string;

    consignor: Address;
    consignee: Address;

    items: PackageItem[];

    // Config
    volumetricFactor: number;
    ratePerKg: number;
    gstRate: number;

    // Meta
    paymentMode: 'To Pay' | 'Prepaid' | 'COD' | 'Account';
    natureOfQuantity: string;
    declaredValue: string;
    bookingRemarks?: string;

    // Ancillary Charges
    pickupCharge: number;
    packingCharge: number;
    docketCharges: number;
    insuranceCharge: number;

    // Payment
    advancePaid: number;
}

export interface FinancialTotals {
    totalActual: number;
    totalVolumetric: number;
    billable: number;
    freight: number;
    taxableAmount: number;
    taxAmount: number;
    grandTotal: number;
    balance: number;
}
