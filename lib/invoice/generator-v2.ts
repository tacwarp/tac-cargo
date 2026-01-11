import { ShipmentData, FinancialTotals } from "@/types/invoice-v2";

// Constants
export const GENERATOR_DEFAULTS = {
    VOLUMETRIC_FACTOR: 5000,
    DEFAULT_GST: 18,
    DEFAULT_RATE: 180
};

// Generators
export const generateInvoiceId = () => {
    const prefix = "TAC";
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
};

export const generateAWB = () => {
    const prefix = "365";
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}${random}`;
};

export const calculateVolumetricWeight = (l: number, w: number, h: number, factor: number) => {
    return (l * w * h) / factor;
};

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// Core Ledger Logic
export const calculateLedger = (data: ShipmentData): FinancialTotals => {
    const totalActual = data.items.reduce((acc, i) => acc + i.actualWeight, 0);

    const totalVolumetric = data.items.reduce((acc, i) => {
        return acc + calculateVolumetricWeight(i.length, i.width, i.height, data.volumetricFactor);
    }, 0);

    const billable = Math.max(totalActual, totalVolumetric);
    const freight = billable * data.ratePerKg;

    const taxableAmount = freight +
        data.pickupCharge +
        data.packingCharge +
        data.docketCharges +
        data.insuranceCharge;

    const taxAmount = (taxableAmount * data.gstRate) / 100;
    const grandTotal = taxableAmount + taxAmount;
    const balance = grandTotal - data.advancePaid;

    return {
        totalActual,
        totalVolumetric,
        billable,
        freight,
        taxableAmount,
        taxAmount,
        grandTotal,
        balance
    };
};
