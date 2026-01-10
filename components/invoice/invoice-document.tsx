"use client";

import React, { forwardRef } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/invoice/calculations";
import { cn } from "@/lib/utils";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export interface InvoiceDocumentData {
  // Company Details
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyGSTIN: string;
  branchOffice?: string;
  branchPhone?: string;

  // Invoice Details
  invoiceNo: string;
  consignmentNo: string;
  invoiceDate: Date;
  dueDate?: Date;
  awbNo?: string;

  // Consignor (Shipper) Details
  consignorName: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorPhone: string;
  consignorGSTIN?: string;

  // Consignee (Receiver) Details
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone: string;

  // Courier/Shipment Details
  origin: string;
  destination: string;
  transportMode: string;
  pieces: number;
  actualWeight: number;
  chargeableWeight: number;
  ratePerKg: number;
  declaredValue?: number;
  natureOfQuantity?: string;

  // Charges
  freightCharge: number;
  pickupCharge: number;
  packingCharge: number;
  deliveryCharge: number;
  insuranceCharge: number;
  handlingCharge?: number;
  otherCharges?: number;

  // Tax
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;

  // Payment
  paymentMode: "PREPAID" | "COD" | "TO PAY";
  advancePaid: number;
  balanceDue: number;

  // Additional
  remarks?: string;
  officeHoursDelhi?: string;
  officeHoursImphal?: string;
}

interface InvoiceDocumentProps {
  data: InvoiceDocumentData;
  className?: string;
  showTerms?: boolean;
}

const TERMS_AND_CONDITIONS = [
  "THE CONSIGNEE MUST DECLARE THE CONTAINS, VALUE AND CONDITIONS OF THE ITEM BEFORE THE CONSIGNMENT IS BOOKED.",
  "ANY ILLEGAL/PROHIBITED/CONTRABAND/HAZARDOUS ITEMS FOUND WILL SOLELY BE RESPONSIBLE BY CONSIGNOR.",
  "ANY CONSIGNMENT FOUND DAMAGED, LOST OR MISPLACED WILL BE COMPENSATED BY THE WEIGHT OF THE ITEMS WITH REGARD TO VALUE OF Rs.150/Kg.",
  "ANY FRAGILE/ELECTRONICS ITEMS WILL BE CONSIDER AS SHIPMENT AT OWNER RISK UNTIL OR UNLESS THE ITEM IS BOOKED UNDER A SPECIAL INSURANCE PROGRAMME.",
  "ANY CONSIGNMENT REACHED THE DESTINATION OFFICE MUST BE COLLECTED WITHIN A WEEK.",
  "ANY CONSIGNMENT AT THE DESTINATION OFFICE WHICH ARE RELUCTANT AND NEGLECTED TO COLLECT WILL BE CONSIDER AS UNCLAIM ITEMS AFTER 45 DAYS FROM THE RECEIVED DATE.",
  "ANY CONSIGNMENT AT THE DESTINATION OFFICE ARE LIABLE TO PAY GODOWN CHARGES OF Rs.5/DAY AFTER 21 DAY FROM THE RECEIVED DATE.",
  "ANY UNCLAIM ITEMS/CONSIGNMENT WILL DISPOSED AFTER 100 DAYS FROM THE RECEIVED DATE (DISPOSAL CAN BE DONE IMMEDIATELY WITHOUT ANY FURTHER COMMUNICATION TO THE CONSIGNOR OR CONSIGNEE).",
  "ANY CONSIGNMENT BOOKED IS ABIDE BY THE ABOVE TERMS AND CONDITIONS OF TAPAN ASSOCIATE COURIER AND CARGO SERVICE (ALL TERMS AND CONDITIONS WILL EXERCISE UNDER DELHI JURISDICTION).",
];

export const InvoiceDocument = forwardRef<HTMLDivElement, InvoiceDocumentProps>(
  ({ data, className, showTerms = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white text-black font-sans text-sm p-6 max-w-[210mm] mx-auto",
          className
        )}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            {data.companyName}
          </h1>
          <p className="text-xs text-gray-600">(DELHI-IMPHAL-DELHI)</p>
          <p className="text-xs mt-1">{data.companyAddress}</p>
          <p className="text-xs">
            GSTIN: {data.companyGSTIN} | Mobile: {data.companyPhone}
          </p>
          {data.branchOffice && (
            <p className="text-xs mt-2">
              <strong>Branch Office:</strong> {data.branchOffice}
              <br />
              Phone: {data.branchPhone}
            </p>
          )}
        </div>

        {/* Invoice Header Row */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
          <div className="border border-gray-400 p-2">
            <div className="text-gray-600">Consignment No.</div>
            <div className="font-bold text-base">{data.consignmentNo}</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-gray-600">Date of Booking</div>
            <div className="font-bold">
              {format(data.invoiceDate, "dd MMM yyyy")}
            </div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-gray-600">Nature of Quantity</div>
            <div className="font-bold">{data.natureOfQuantity || "Others"}</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-gray-600">Declared Value</div>
            <div className="font-bold">
              {data.declaredValue ? formatCurrency(data.declaredValue) : "USED"}
            </div>
          </div>
        </div>

        {/* Consignor / Consignee Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Consignor */}
          <div className="border border-gray-400 p-3">
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-2 border-b pb-1">
              CONSIGNOR
            </h3>
            <div className="font-bold">{data.consignorName}</div>
            <div className="text-xs">
              {data.consignorAddress}
              <br />
              {data.consignorCity} - {data.consignorPincode}
              <br />
              Phone: {data.consignorPhone}
            </div>
            {data.consignorGSTIN && (
              <div className="text-xs mt-1">GSTIN: {data.consignorGSTIN}</div>
            )}
          </div>

          {/* Consignee */}
          <div className="border border-gray-400 p-3">
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-2 border-b pb-1">
              CONSIGNEE
            </h3>
            <div className="font-bold">{data.consigneeName}</div>
            <div className="text-xs">
              {data.consigneeAddress}
              <br />
              {data.consigneeCity} - {data.consigneePincode}
              <br />
              Phone: {data.consigneePhone}
            </div>
          </div>
        </div>

        {/* Courier Details & Payment Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Courier Details */}
          <div className="border border-gray-400 p-3">
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-2 border-b pb-1">
              Courier Details & Rate
            </h3>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Origin</td>
                  <td className="py-1 font-medium">{data.origin}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Destination</td>
                  <td className="py-1 font-medium">{data.destination}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">No. of Pieces</td>
                  <td className="py-1 font-medium">{data.pieces}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Actual Weight</td>
                  <td className="py-1 font-medium">{data.actualWeight} Kg</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Charged Weight</td>
                  <td className="py-1 font-medium">{data.chargeableWeight} Kg</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Rate</td>
                  <td className="py-1 font-medium">Rs. {data.ratePerKg}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Remarks</td>
                  <td className="py-1 font-medium">{data.remarks || data.paymentMode}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Details */}
          <div className="border border-gray-400 p-3">
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-2 border-b pb-1">
              Payment Details
            </h3>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Payment Mode</td>
                  <td className="py-1 text-right font-medium">{data.paymentMode}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Freight</td>
                  <td className="py-1 text-right">Rs. {data.freightCharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Pickup Charge</td>
                  <td className="py-1 text-right">Rs. {data.pickupCharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Packing</td>
                  <td className="py-1 text-right">Rs. {data.packingCharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Docket Charges</td>
                  <td className="py-1 text-right">Rs. {(data.handlingCharge || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Insurance Charge</td>
                  <td className="py-1 text-right">Rs. {data.insuranceCharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">GST ({data.igst > 0 ? "18" : "0"}%)</td>
                  <td className="py-1 text-right">Rs. {data.totalTax.toFixed(2)}</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="py-1 font-bold">Total</td>
                  <td className="py-1 text-right font-bold">Rs. {data.grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Advance Paid Amount</td>
                  <td className="py-1 text-right">Rs. {data.advancePaid.toFixed(2)}</td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td className="py-1 font-bold text-primary">Balance</td>
                  <td className="py-1 text-right font-bold text-primary">
                    Rs. {data.balanceDue.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Office Hours */}
        <div className="text-xs mb-4 flex justify-between">
          <div>
            <span className="font-bold">New Delhi Office Hours:</span>{" "}
            {data.officeHoursDelhi || "11 AM to 9 PM"}
          </div>
          <div>
            <span className="font-bold">Imphal Office Hours:</span>{" "}
            {data.officeHoursImphal || "9 AM to 6 PM"}
          </div>
        </div>

        {/* Terms and Conditions */}
        {showTerms && (
          <div className="border-t-2 border-black pt-3">
            <h3 className="font-bold text-xs uppercase mb-2">TERMS AND CONDITIONS:</h3>
            <ol className="text-[9px] leading-tight space-y-1 list-decimal list-inside">
              {TERMS_AND_CONDITIONS.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for choosing {data.companyName}!</p>
          <p className="mt-1">For queries, contact: {data.companyPhone}</p>
        </div>
      </div>
    );
  }
);

InvoiceDocument.displayName = "InvoiceDocument";

export default InvoiceDocument;
