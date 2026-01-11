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
  shipperStateCode?: string;
  shipperPincode: string;
  shipperPhone?: string;
  shipperGSTIN?: string;
  
  // Consignee (To)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeStateCode?: string;
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
  itemsList?: Array<{ description: string; quantity?: number }>;
  
  // Station Codes
  originStation?: string;
  destinationStation?: string;
  sortCode?: string;
  sector?: string;
  
  // Routing codes (for bottom section)
  routingCodes?: {
    dlin?: { code: string; subCode: string };
    mdea?: { code: string; subCode: string };
    gauz?: string;
    gaua?: { code: string; subCode: string };
  };
  
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

  // Generate routing codes based on destination
  const getRoutingCodes = () => {
    if (data.routingCodes) return data.routingCodes;
    const destCode = (data.destinationStation || "GAUA").substring(0, 4);
    return {
      dlin: { code: "1", subCode: "3AX" },
      mdea: { code: "4", subCode: "U35" },
      gauz: destCode,
      gaua: { code: "A", subCode: "X08" },
    };
  };

  const routingCodes = getRoutingCodes();

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
        {/* Header Row: Barcode + Station Info */}
        <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
          {/* Left: AWB Barcode */}
          <div className="flex flex-col">
            <svg ref={barcodeRef} className="h-12" />
            <div className="text-[10px] text-center font-mono">AWB {data.awbNumber}</div>
          </div>
          
          {/* Right: Station & Package Info */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="border-2 border-black px-3 py-1 text-center">
                <div className="font-bold text-xl">{data.originStation || "SUR"}</div>
              </div>
              <div className="p-1">
                <Plane className="w-6 h-6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-center">
              <div className="border-2 border-black px-2 py-0.5">
                <div className="font-bold text-sm">{data.weight.toFixed(2)} kgs</div>
              </div>
              <div className="border-2 border-black px-2 py-0.5">
                <div className="font-bold text-sm">{getPackageSize()}</div>
              </div>
              <div className="border-2 border-black px-2 py-0.5">
                <div className="font-bold text-sm">{format(data.shipDate, "dd/MM")}</div>
              </div>
              <div className="border-2 border-black px-2 py-0.5">
                <div className="font-bold text-sm">{data.paymentMode}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ship To Section */}
        <div className="border-b-2 border-black pb-2 mb-2">
          <div className="text-xs font-bold text-gray-600 mb-1">Ship To:</div>
          <div className="font-bold text-base uppercase">{data.consigneeName}</div>
          <div className="text-sm leading-tight">
            {data.consigneeAddress}
            <br />
            {data.consigneeCity} {data.consigneeState && `- ${data.consigneeState}`}
            <br />
            {data.consigneePincode}
            <br />
            {data.consigneeStateCode || data.consigneeState?.substring(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Delivery Station Info - Amazon Style */}
        <div className="grid grid-cols-3 gap-0 border-b-2 border-black mb-2">
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[9px] text-gray-500 uppercase">Delivery Station</div>
            <div className="font-bold text-xl">{data.destinationStation || "GAUA"}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[9px] text-gray-500 uppercase">Sector</div>
            <div className="font-bold text-lg">{data.sector || "S-05"}</div>
          </div>
          <div className="border-2 border-black p-1 text-center">
            <div className="text-[9px] text-gray-500 uppercase">Sortzone</div>
            <div className="font-bold text-xl">{data.sortCode || "GAUA"}</div>
          </div>
        </div>

        {/* Ship Date, GST, Invoice ID, Date Row */}
        <div className="grid grid-cols-4 gap-1 border-b-2 border-black pb-2 mb-2 text-[10px]">
          <div>
            <span className="text-gray-500">Ship Date:</span>{" "}
            <span className="font-bold">{format(data.shipDate, "dd/MM/yyyy")}</span>
          </div>
          <div>
            <span className="text-gray-500">GST#</span>{" "}
            <span className="font-bold">{data.shipperGSTIN || "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">INVOICE ID:</span>{" "}
            <span className="font-bold">{data.invoiceNo || "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">DATE:</span>{" "}
            <span className="font-bold">
              {data.invoiceDate ? format(data.invoiceDate, "MM-dd-yyyy") : "-"}
            </span>
          </div>
        </div>

        {/* Ordered From Section with QR Code */}
        <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">Ordered From:</div>
            <div className="font-bold uppercase text-sm">{data.shipperName}</div>
          </div>
          <QRCodeSVG
            value={qrData}
            size={80}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Ship From Section */}
        <div className="text-[10px] border-b border-black pb-2 mb-2">
          <div className="font-bold">Ship From: {data.shipperName.toUpperCase()}</div>
          <div className="text-[9px] leading-tight text-gray-700">
            Return Address: {data.shipperAddress}, {data.shipperCity}, {data.shipperState} {data.shipperPincode}
            <br />India
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[7px] text-gray-500 leading-tight mb-2 border-b border-black pb-2">
          Shipper declares that package does not contain any products that are prohibited or restricted by law or otherwise under the conditions of carriage. Any claims arising from or in connection with this carriage are limited by limit of liabilities set forth in the conditions of carriage published on Ship.taccargo.in
        </div>

        {/* Item Description Table */}
        <div className="border-b border-black pb-2 mb-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left py-1 w-8 font-bold">#</th>
                <th className="text-left py-1 font-bold">Item description</th>
              </tr>
            </thead>
            <tbody>
              {data.itemsList && data.itemsList.length > 0 ? (
                data.itemsList.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1">{idx + 1}</td>
                    <td className="py-1 uppercase">{item.description}</td>
                  </tr>
                ))
              ) : data.contentDescription ? (
                <tr>
                  <td className="py-1">1</td>
                  <td className="py-1 uppercase">{data.contentDescription}</td>
                </tr>
              ) : (
                <tr>
                  <td className="py-1">1</td>
                  <td className="py-1 uppercase">GENERAL GOODS</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Routing Codes - Amazon Style */}
        <div className="grid grid-cols-4 gap-0 border-2 border-black">
          <div className="border-r-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-500 font-bold">DLIN</div>
            <div className="font-bold flex items-center justify-center gap-0.5 text-sm">
              <span className="bg-black text-white px-1.5 py-0.5">{routingCodes.dlin?.code || "1"}</span>
              <span>{routingCodes.dlin?.subCode || "3AX"}</span>
            </div>
          </div>
          <div className="border-r-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-500 font-bold">MDEA</div>
            <div className="font-bold flex items-center justify-center gap-0.5 text-sm">
              <span className="bg-black text-white px-1.5 py-0.5">{routingCodes.mdea?.code || "4"}</span>
              <span>{routingCodes.mdea?.subCode || "U35"}</span>
            </div>
          </div>
          <div className="border-r-2 border-black p-1 text-center">
            <div className="text-[8px] text-gray-500 font-bold">GAUZ</div>
            <div className="font-bold text-lg">{routingCodes.gauz || "GAUA"}</div>
          </div>
          <div className="p-1 text-center">
            <div className="text-[8px] text-gray-500 font-bold">GAUA</div>
            <div className="font-bold flex items-center justify-center gap-0.5 text-sm">
              <span className="bg-black text-white px-1.5 py-0.5">{routingCodes.gaua?.code || "A"}</span>
              <span>{routingCodes.gaua?.subCode || "X08"}</span>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-3 text-right">
          <div className="text-xl font-bold tracking-wide">
            <span className="text-gray-800">TAC</span>{" "}
            <span className="font-normal">cargo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AWBLabel;
