"use client";

import React, { useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Plane } from "lucide-react";

export interface AWBLabelData {
  awbNumber: string;
  shipDate: Date;
  deliveryDate?: Date;
  
  // Shipper (From)
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperState: string;
  shipperPincode: string;
  shipperPhone?: string;
  shipperGSTIN?: string;
  
  // Consignee (To)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone?: string;
  
  // Package Details
  weight: number;
  volumetricWeight?: number;
  pieces: number;
  dimensions?: string;
  packageType?: "SMALL" | "MEDIUM" | "LARGE" | "XLARGE";
  
  // Shipment Details
  transportMode: "AIR" | "SURFACE" | "EXPRESS";
  paymentMode: "PREPAID" | "COD" | "TO PAY";
  declaredValue?: number;
  contentDescription?: string;
  specialInstructions?: string;
  
  // Station Codes
  originStation?: string;
  destinationStation?: string;
  sortCode?: string;
  sector?: string;
  
  // Invoice Reference
  invoiceNo?: string;
  invoiceDate?: Date;
}

interface AWBLabelProps {
  data: AWBLabelData;
  className?: string;
  showPrintButton?: boolean;
}

export function AWBLabel({ data, className, showPrintButton = true }: AWBLabelProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barcodeRef.current && data.awbNumber) {
      try {
        JsBarcode(barcodeRef.current, data.awbNumber, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
          margin: 5,
          background: "#ffffff",
        });
      } catch (error) {
        console.error("Barcode generation error:", error);
      }
    }
  }, [data.awbNumber]);

  const handlePrint = () => {
    if (labelRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AWB Label - ${data.awbNumber}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; }
                @media print {
                  @page { size: 4in 6in; margin: 0; }
                  body { width: 4in; height: 6in; }
                }
              </style>
            </head>
            <body>
              ${labelRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const qrData = JSON.stringify({
    awb: data.awbNumber,
    to: data.consigneeName,
    city: data.consigneeCity,
    pin: data.consigneePincode,
  });

  // Determine package size label
  const getPackageSize = () => {
    if (data.packageType) return data.packageType;
    if (data.weight > 30) return "XLARGE";
    if (data.weight > 15) return "LARGE";
    if (data.weight > 5) return "MEDIUM";
    return "SMALL";
  };

  return (
    <div className={cn("bg-white", className)}>
      {showPrintButton && (
        <div className="mb-4 flex justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Print Label
          </button>
        </div>
      )}

      <div
        ref={labelRef}
        className="w-[4in] min-h-[6in] border-2 border-black bg-white p-3 text-black font-sans text-sm"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header with Logo and Barcode */}
        <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
          <div className="flex items-center gap-2">
            <svg ref={barcodeRef} className="h-14" />
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 border-2 border-black px-2 py-1">
              <span className="font-bold text-lg">{data.originStation || "SUR"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Plane className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Weight and Package Info Row */}
        <div className="grid grid-cols-4 gap-1 border-b-2 border-black pb-2 mb-2">
          <div className="border-2 border-black p-1 text-center">
            <div className="text-xs text-gray-600">WEIGHT</div>
            <div className="font-bold text-lg">{data.weight} kg</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-xs text-gray-600">SIZE</div>
            <div className="font-bold">{getPackageSize()}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-xs text-gray-600">DATE</div>
            <div className="font-bold">{format(data.shipDate, "dd/MM")}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-xs text-gray-600">MODE</div>
            <div className="font-bold">{data.paymentMode}</div>
          </div>
        </div>

        {/* Ship To Section */}
        <div className="border-b-2 border-black pb-2 mb-2">
          <div className="text-xs font-bold text-gray-600 mb-1">Ship To:</div>
          <div className="font-bold text-base uppercase">{data.consigneeName}</div>
          <div className="text-sm leading-tight">
            {data.consigneeAddress}
            <br />
            {data.consigneeCity} - {data.consigneeState}
            <br />
            {data.consigneePincode}
          </div>
          {data.consigneePhone && (
            <div className="text-sm mt-1">Ph: {data.consigneePhone}</div>
          )}
        </div>

        {/* Delivery Station Info */}
        <div className="grid grid-cols-3 gap-1 border-b-2 border-black pb-2 mb-2">
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[10px] text-gray-600">DELIVERY STATION</div>
            <div className="font-bold text-lg">{data.destinationStation || "GAUA"}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[10px] text-gray-600">SECTOR</div>
            <div className="font-bold">{data.sector || "S-05"}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[10px] text-gray-600">SORTZONE</div>
            <div className="font-bold">{data.sortCode || "GAUA"}</div>
          </div>
        </div>

        {/* Invoice and Date Row */}
        <div className="grid grid-cols-2 gap-2 border-b-2 border-black pb-2 mb-2 text-xs">
          <div>
            <span className="text-gray-600">Ship Date:</span>{" "}
            <span className="font-bold">{format(data.shipDate, "dd/MM/yyyy")}</span>
          </div>
          <div>
            <span className="text-gray-600">Invoice ID:</span>{" "}
            <span className="font-bold">{data.invoiceNo || "-"}</span>
          </div>
          {data.shipperGSTIN && (
            <div className="col-span-2">
              <span className="text-gray-600">GST#</span>{" "}
              <span className="font-bold">{data.shipperGSTIN}</span>
            </div>
          )}
        </div>

        {/* Ordered From Section */}
        <div className="border-b-2 border-black pb-2 mb-2">
          <div className="text-xs text-gray-600 mb-1">Ordered From:</div>
          <div className="font-bold uppercase">{data.shipperName}</div>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center py-2 border-b-2 border-black mb-2">
          <QRCodeSVG
            value={qrData}
            size={100}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Ship From Section */}
        <div className="text-xs border-b border-black pb-2 mb-2">
          <div className="font-bold">Ship From: {data.shipperName}</div>
          <div className="text-[10px] leading-tight">
            Return Address: {data.shipperAddress}, {data.shipperCity}, {data.shipperState} {data.shipperPincode}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[8px] text-gray-600 leading-tight mb-2">
          Shipper declares that package does not contain any products that are prohibited or restricted by law or otherwise under the conditions of carriage. Any claims arising from or in connection with this carriage are limited by limit of liabilities set forth in the conditions of carriage.
        </div>

        {/* Item Description */}
        {data.contentDescription && (
          <div className="border-t border-black pt-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">#</th>
                  <th className="text-left py-1">Item description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">1</td>
                  <td className="py-1 uppercase">{data.contentDescription}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Sort Codes */}
        <div className="mt-2 grid grid-cols-4 gap-1 border-t-2 border-black pt-2">
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-600">DLIN</div>
            <div className="font-bold flex items-center justify-center gap-1">
              <span className="bg-black text-white px-1 text-xs">1</span>
              <span>3AX</span>
            </div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-600">MDEA</div>
            <div className="font-bold flex items-center justify-center gap-1">
              <span className="bg-black text-white px-1 text-xs">4</span>
              <span>U35</span>
            </div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-600">GAUZ</div>
            <div className="font-bold">GAUA</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-600">GAUA</div>
            <div className="font-bold flex items-center justify-center gap-1">
              <span className="bg-black text-white px-1 text-xs">A</span>
              <span>X08</span>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-3 text-right">
          <div className="text-xl font-bold tracking-wide">
            <span className="text-gray-800">TAC</span>{" "}
            <span className="text-primary">cargo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AWBLabel;
