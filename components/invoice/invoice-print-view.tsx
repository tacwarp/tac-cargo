"use client";

import React from "react";
import { format } from "date-fns";
// import { QRCodeSVG } from "qrcode.react"; // Removed to prevent build issues
import { cn } from "@/lib/utils";
import { InvoiceCalculation } from "@/lib/invoice/calculations";
import { VOLUMETRIC_FACTORS } from "@/lib/invoice/calculations";

// Google Font for Barcode
// Ideally this should be loaded in layout.tsx, but for print specific we can ensure it's available
// <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">

interface InvoicePrintViewProps {
    invoiceNo: string;
    awbNo: string;
    invoiceDate: Date;
    consignor: {
        name: string;
        phone: string;
        gstin?: string;
        address: { address: string; city: string; state: string; pincode: string };
    };
    consignee: {
        name: string;
        phone: string;
        address: { address: string; city: string; state: string; pincode: string };
    };
    packages: Array<{
        description: string;
        quantity: number;
        weight: number;
        declaredValue: number;
    }>;
    calculation: InvoiceCalculation;
    paymentMode: string;
}

export function InvoicePrintView({
    invoiceNo,
    awbNo,
    invoiceDate,
    consignor,
    consignee,
    packages,
    calculation,
    paymentMode,
}: InvoicePrintViewProps) {

    // Total packages count
    const totalPieces = packages.reduce((sum, pkg) => sum + pkg.quantity, 0);

    return (
        <div className="print-area hidden print:block bg-white text-black p-0 m-0 font-sans text-[11px] leading-tight">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap');
        @media print {
            @page { margin: 0.5cm; size: A4 portrait; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-area { display: block !important; width: 210mm; height: 297mm; }
            /* Hide everything else */
            body > *:not(.print-area) { display: none !important; }
            /* Zebra striping */
            .zebra-row:nth-child(even) { background-color: #f3f4f6 !important; }
        }
        .barcode-font { font-family: 'Libre Barcode 128', cursive; }
      `}</style>

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold tracking-tighter">TAC<span className="text-orange-500">.</span></h1>
                        <span className="text-xs font-semibold px-2 py-0.5 border border-black rounded">ORIGINAL FOR RECIPIENT</span>
                    </div>
                    <div className="text-xs space-y-0.5 text-gray-600">
                        <p className="font-bold text-black">Tapan Associate Cargo</p>
                        <p>Regd. Office: Imphal-Delhi Logistics Zone</p>
                        <p>GSTIN: 15AABCT1234F1Z5</p>
                        <p>Support: +91-9876543210</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold mb-1">TAX INVOICE</h2>
                    <div className="text-sm font-mono font-bold mb-1">{invoiceNo}</div>
                    <p className="text-xs text-gray-600">Date: {format(invoiceDate, "dd MMM yyyy")}</p>
                    <div className="mt-2">
                        <span className="barcode-font text-5xl leading-none block">{awbNo}</span>
                        <span className="text-[10px] tracking-widest">{awbNo}</span>
                    </div>
                </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-8 mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500 mb-2">Shipped From (Consignor)</h3>
                    <div className="text-sm font-semibold">{consignor.name}</div>
                    <div className="text-xs mt-1 whitespace-pre-line text-gray-700">
                        {consignor.address.address}
                        <br />
                        {consignor.address.city}, {consignor.address.state} - {consignor.address.pincode}
                    </div>
                    <div className="text-xs mt-2">
                        <span className="font-semibold">Ph:</span> {consignor.phone}
                    </div>
                    {consignor.gstin && <div className="text-xs mt-0.5"><span className="font-semibold">GST:</span> {consignor.gstin}</div>}
                </div>
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500 mb-2">Shipped To (Consignee)</h3>
                    <div className="text-sm font-semibold">{consignee.name}</div>
                    <div className="text-xs mt-1 whitespace-pre-line text-gray-700">
                        {consignee.address.address}
                        <br />
                        {consignee.address.city}, {consignee.address.state} - {consignee.address.pincode}
                    </div>
                    <div className="text-xs mt-2">
                        <span className="font-semibold">Ph:</span> {consignee.phone}
                    </div>
                </div>
            </div>

            {/* Shipment Details Table */}
            <div className="mb-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="py-2 text-xs font-bold w-12">#</th>
                            <th className="py-2 text-xs font-bold">Nature of Goods</th>
                            <th className="py-2 text-xs font-bold text-center w-20">Pieces</th>
                            <th className="py-2 text-xs font-bold text-right w-24">Weight (Kg)</th>
                            <th className="py-2 text-xs font-bold text-right w-24">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg, idx) => (
                            <tr key={idx} className="border-b border-gray-200 zebra-row">
                                <td className="py-2 align-top">{idx + 1}</td>
                                <td className="py-2 align-top">
                                    <div className="font-semibold">{pkg.description}</div>
                                    <div className="text-[10px] text-gray-500">Volumetric Divisor: {VOLUMETRIC_FACTORS['air']}</div>
                                </td>
                                <td className="py-2 align-top text-center">{pkg.quantity}</td>
                                <td className="py-2 align-top text-right">{pkg.weight.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{pkg.declaredValue > 0 ? pkg.declaredValue.toFixed(2) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t-2 border-black bg-gray-50">
                        <tr>
                            <td colSpan={2} className="py-2 font-bold text-right pr-4">Total:</td>
                            <td className="py-2 font-bold text-center">{totalPieces}</td>
                            <td className="py-2 font-bold text-right">{calculation.actualWeight.toFixed(2)}</td>
                            <td className="py-2 font-bold text-right"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-7">
                    <div className="border rounded p-4 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xs uppercase mb-2">Terms & Conditions</h3>
                            <ul className="list-disc list-inside text-[10px] text-gray-600 space-y-1">
                                <li>Goods carried at owner's risk unless insured.</li>
                                <li>Disputes subject to Imphal jurisdiction.</li>
                                <li>Interest @ 24% p.a. charged if bill not paid on due date.</li>
                            </ul>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed">
                            <div className="flex items-center gap-4">
                                {/* QR Code Placeholder using API */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(awbNo)}`}
                                    alt="QR"
                                    className="w-16 h-16"
                                />
                                <div className="text-[10px] text-gray-500">
                                    Scan to verify invoice<br />
                                    & track shipment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5">
                    <div className="bg-gray-50 border rounded p-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Freight Charge</span>
                                <span>₹{calculation.charges.freightCharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Pickup & Delivery</span>
                                <span>₹{(calculation.charges.pickupCharge + calculation.charges.deliveryCharge).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Packing & Handling</span>
                                <span>₹{(calculation.charges.packingCharge + calculation.charges.handlingCharge).toFixed(2)}</span>
                            </div>
                            {calculation.charges.insuranceCharge > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Insurance</span>
                                    <span>₹{calculation.charges.insuranceCharge.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-300 my-2"></div>

                            <div className="flex justify-between font-semibold">
                                <span>Subtotal</span>
                                <span>₹{calculation.tax.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>GST ({calculation.tax.isInterState ? "IGST" : "CGST+SGST"})</span>
                                <span>₹{calculation.tax.totalTax.toFixed(2)}</span>
                            </div>

                            <div className="border-t-2 border-black my-2"></div>

                            <div className="flex justify-between text-lg font-bold">
                                <span>Grand Total</span>
                                <span>₹{calculation.tax.grandTotal.toFixed(2)}</span>
                            </div>

                            {calculation.advancePaid > 0 && (
                                <div className="flex justify-between text-green-600 text-sm font-medium mt-1">
                                    <span>Less: Advance</span>
                                    <span>- ₹{calculation.advancePaid.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm font-bold bg-black text-white p-2 mt-2 rounded">
                                <span>Balance Due</span>
                                <span>₹{calculation.balanceDue.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <div className="inline-block px-3 py-1 border border-black rounded text-xs font-bold uppercase">
                                {paymentMode}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Auth */}
            <div className="flex justify-between items-end mt-auto pt-8">
                <div className="text-[10px] text-gray-500">
                    Generated by TAC Enterprise System v4.0.0<br />
                    {format(new Date(), "PPpp")}
                </div>
                <div className="text-center">
                    <div className="h-12 w-32 border-b border-gray-400 mb-1"></div>
                    <div className="text-xs font-bold">Authorized Signatory</div>
                    <div className="text-[10px] text-gray-500">Tapan Associate Cargo</div>
                </div>
            </div>
        </div>
    );
}
