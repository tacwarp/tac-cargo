"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PlaneIcon, TruckIcon } from "lucide-react";

interface ShippingLabelProps {
  awb: string;
  shipTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  shipFrom: {
    name: string;
    address?: string;
  };
  shipDate: string;
  weight: number;
  pieces: number;
  transportMode: "air" | "surface" | "express";
  paymentMode: "prepaid" | "to_pay" | "credit";
  invoiceNo?: string;
  gstNo?: string;
  contentDescription?: string;
  className?: string;
}

export function ShippingLabelPreview({
  awb,
  shipTo,
  shipFrom,
  shipDate,
  weight,
  pieces,
  transportMode,
  paymentMode,
  invoiceNo,
  gstNo,
  contentDescription,
  className,
}: ShippingLabelProps) {
  // Calculate delivery date from shipDate, not current date
  const baseDate = shipDate ? new Date(shipDate) : new Date();
  const deliveryDate = new Date(baseDate);
  deliveryDate.setDate(
    deliveryDate.getDate() +
      (transportMode === "air" ? 2 : transportMode === "express" ? 1 : 5),
  );

  const TransportIcon = transportMode === "air" ? PlaneIcon : TruckIcon;

  return (
    <div
      className={cn(
        "w-full max-w-[300px] bg-white font-sans text-xs text-black",
        "overflow-hidden rounded-none border-2 border-black",
        className,
      )}
    >
      {/* Header with AWB and Mode */}
      <div className="flex items-stretch border-b-2 border-black">
        <div className="flex-1 border-r-2 border-black p-2">
          <div className="text-muted-foreground text-[8px] tracking-wider uppercase">
            AWB
          </div>
          <div className="font-mono text-sm font-bold tracking-wide">
            {awb || "TAC0000000"}
          </div>
        </div>
        <div className="flex min-w-[70px] flex-col items-center justify-center gap-1 p-2">
          <div className="text-[10px] font-bold uppercase">
            {transportMode.toUpperCase()}
          </div>
          <div className="font-mono text-[10px]">{weight.toFixed(2)} kgs</div>
          <div className="bg-black px-2 py-0.5 text-[10px] font-bold text-white uppercase">
            {pieces > 1 ? "LARGE" : "SMALL"}
          </div>
        </div>
        <div className="flex items-center justify-center border-l-2 border-black p-2">
          <TransportIcon className="size-8" />
        </div>
      </div>

      {/* Ship To Section */}
      <div className="border-b border-black p-2">
        <div className="text-muted-foreground text-[8px] font-bold uppercase">
          Ship To:
        </div>
        <div className="mt-0.5 text-sm font-bold">
          {shipTo.name || "Consignee Name"}
        </div>
        <div className="mt-1 text-[10px] leading-tight">
          {shipTo.address || "Address Line 1"}
          <br />
          {shipTo.city || "City"}, {shipTo.state || "State"}
          <br />
          {shipTo.pincode || "000000"}
        </div>
      </div>

      {/* Delivery Date & Payment */}
      <div className="flex border-b border-black">
        <div className="flex-1 border-r border-black p-2 text-center">
          <div className="text-muted-foreground text-[8px] uppercase">
            Delivery
          </div>
          <div className="font-mono text-lg font-bold">
            {deliveryDate.getDate()}/{deliveryDate.getMonth() + 1}
          </div>
        </div>
        <div className="flex-1 p-2 text-center">
          <div className="text-muted-foreground text-[8px] uppercase">
            Payment
          </div>
          <div className="mt-0.5 inline-block bg-black px-2 py-0.5 text-sm font-bold text-white uppercase">
            {paymentMode.replace("_", " ")}
          </div>
        </div>
      </div>

      {/* Zone Info */}
      <div className="flex border-b border-black text-center">
        <div className="flex-1 border-r border-black p-1">
          <div className="text-muted-foreground text-[7px] uppercase">
            Delivery Station
          </div>
          <div className="text-sm font-bold">
            {shipTo.city?.substring(0, 4).toUpperCase() || "CITY"}
          </div>
        </div>
        <div className="flex-1 border-r border-black p-1">
          <div className="text-muted-foreground text-[7px] uppercase">
            Sector
          </div>
          <div className="text-sm font-bold">
            S—{shipTo.pincode?.charAt(0) || "0"}
          </div>
        </div>
        <div className="flex-1 p-1">
          <div className="text-muted-foreground text-[7px] uppercase">
            Sortzone
          </div>
          <div className="text-sm font-bold">
            {shipTo.state?.substring(0, 4).toUpperCase() || "ZONE"}
          </div>
        </div>
      </div>

      {/* Ship Date & GST */}
      <div className="flex border-b border-black text-[9px]">
        <div className="flex-1 p-1.5">
          <span className="font-bold">Ship Date:</span>{" "}
          {shipDate || new Date().toLocaleDateString("en-IN")}
        </div>
        {gstNo && (
          <div className="flex-1 border-l border-black p-1.5">
            <span className="font-bold">GST#</span> {gstNo}
          </div>
        )}
      </div>

      {/* Invoice Info */}
      <div className="flex border-b border-black text-[9px]">
        <div className="flex-1 border-r border-black p-1.5">
          <span className="font-bold">Invoice ID:</span>{" "}
          {invoiceNo || "INV-XXXX"}
        </div>
        <div className="flex-1 p-1.5">
          <span className="font-bold">Date:</span>{" "}
          {new Date().toLocaleDateString("en-IN")}
        </div>
      </div>

      {/* Ship From */}
      <div className="border-b border-black p-2">
        <div className="text-muted-foreground text-[8px] font-bold uppercase">
          Ordered From:
        </div>
        <div className="text-sm font-bold">
          {shipFrom.name || "TAC CARGO SERVICE"}
        </div>
      </div>

      {/* Barcode Placeholder */}
      <div className="flex justify-center bg-white p-3">
        <div className="text-center">
          <div className="font-mono text-3xl font-bold tracking-[0.3em]">
            |||||||||||||||
          </div>
          <div className="mt-1 font-mono text-[8px]">{awb || "TAC0000000"}</div>
        </div>
      </div>

      {/* Return Address */}
      <div className="border-t border-black bg-gray-50 p-1.5 text-[8px]">
        <span className="font-bold">Ship From:</span>{" "}
        {shipFrom.name || "TAC CARGO SERVICE"}
        <br />
        <span className="font-bold">Return Address:</span>{" "}
        {shipFrom.address || "Main Office, Imphal, Manipur"}
      </div>

      {/* Item Description */}
      {contentDescription && (
        <div className="border-t-2 border-black">
          <table className="w-full text-[9px]">
            <thead>
              <tr className="border-b border-black">
                <th className="w-6 border-r border-black p-1 text-left">#</th>
                <th className="p-1 text-left">Item description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-black p-1">1</td>
                <td className="p-1 uppercase">{contentDescription}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer with Route Codes */}
      <div className="flex border-t-2 border-black">
        <div className="flex-1 border-r-2 border-black p-1.5 text-center">
          <div className="text-muted-foreground text-[7px]">DLIN</div>
          <div className="inline-block bg-black px-1 font-mono text-sm font-bold text-white">
            {shipTo.pincode?.charAt(0) || "1"}
          </div>
          <span className="ml-0.5 font-mono font-bold">
            {transportMode === "air" ? "AIR" : "SUR"}
          </span>
        </div>
        <div className="flex-1 border-r-2 border-black p-1.5 text-center">
          <div className="text-muted-foreground text-[7px]">ROUTE</div>
          <div className="font-mono font-bold">
            {shipTo.city?.substring(0, 4).toUpperCase() || "CITY"}
          </div>
        </div>
        <div className="flex-1 p-1.5 text-center">
          <div className="text-muted-foreground text-[7px]">ZONE</div>
          <div className="font-mono font-bold">
            {shipTo.state?.substring(0, 4).toUpperCase() || "ZONE"}
          </div>
        </div>
      </div>

      {/* Brand Footer */}
      <div className="border-t-2 border-black p-2 text-right">
        <span className="text-lg font-bold tracking-tight">tac</span>
        <span className="text-lg font-light"> cargo</span>
      </div>
    </div>
  );
}
