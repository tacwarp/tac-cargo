"use client";

import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Tag,
  Printer,
  Download,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InvoiceDocument, type InvoiceDocumentData } from "./invoice-document";
import { AWBLabel, type AWBLabelData } from "./awb-label";

export interface InvoicePreviewData {
  // Invoice basic info
  id: string;
  invoiceNo: string;
  awbNo: string;
  consignmentNo: string;
  status: "draft" | "pending" | "paid" | "partial" | "overdue" | "cancelled";
  invoiceDate: Date;
  dueDate?: Date;

  // Company Details
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyGSTIN: string;
  branchOffice?: string;
  branchPhone?: string;

  // Consignor (Shipper)
  consignorName: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorPhone: string;
  consignorGSTIN?: string;

  // Consignee (Receiver)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone: string;

  // Shipment Details
  origin: string;
  destination: string;
  transportMode: "air" | "surface" | "express";
  paymentMode: "PREPAID" | "COD" | "TO PAY";
  pieces: number;
  actualWeight: number;
  chargeableWeight: number;
  ratePerKg: number;
  declaredValue?: number;
  contentDescription?: string;

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
  advancePaid: number;
  balanceDue: number;

  // Additional
  remarks?: string;
  specialInstructions?: string;

  // PDF URL (if already generated)
  pdfUrl?: string;
}

interface InvoicePreviewProps {
  data: InvoicePreviewData;
  onSendWhatsApp?: (id: string) => void;
  onSendEmail?: (id: string) => void;
  onDownloadPdf?: (id: string) => void;
  onPrint?: () => void;
  className?: string;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  partial: { label: "Partial", color: "bg-blue-100 text-blue-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground" },
};

export function InvoicePreview({
  data,
  onSendWhatsApp,
  onSendEmail,
  onDownloadPdf,
  onPrint,
  className,
}: InvoicePreviewProps) {
  const [activeTab, setActiveTab] = useState<"invoice" | "label">("invoice");
  const [copied, setCopied] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const status = statusConfig[data.status] || statusConfig.draft;

  // Transform data for InvoiceDocument component
  const invoiceDocData: InvoiceDocumentData = {
    companyName: data.companyName,
    companyAddress: data.companyAddress,
    companyPhone: data.companyPhone,
    companyGSTIN: data.companyGSTIN,
    branchOffice: data.branchOffice,
    branchPhone: data.branchPhone,
    invoiceNo: data.invoiceNo,
    consignmentNo: data.consignmentNo,
    invoiceDate: data.invoiceDate,
    dueDate: data.dueDate,
    awbNo: data.awbNo,
    consignorName: data.consignorName,
    consignorAddress: data.consignorAddress,
    consignorCity: data.consignorCity,
    consignorState: data.consignorState,
    consignorPincode: data.consignorPincode,
    consignorPhone: data.consignorPhone,
    consignorGSTIN: data.consignorGSTIN,
    consigneeName: data.consigneeName,
    consigneeAddress: data.consigneeAddress,
    consigneeCity: data.consigneeCity,
    consigneeState: data.consigneeState,
    consigneePincode: data.consigneePincode,
    consigneePhone: data.consigneePhone,
    origin: data.origin,
    destination: data.destination,
    transportMode: data.transportMode.toUpperCase(),
    pieces: data.pieces,
    actualWeight: data.actualWeight,
    chargeableWeight: data.chargeableWeight,
    ratePerKg: data.ratePerKg,
    declaredValue: data.declaredValue,
    natureOfQuantity: data.contentDescription,
    freightCharge: data.freightCharge,
    pickupCharge: data.pickupCharge,
    packingCharge: data.packingCharge,
    deliveryCharge: data.deliveryCharge,
    insuranceCharge: data.insuranceCharge,
    handlingCharge: data.handlingCharge,
    otherCharges: data.otherCharges,
    subtotal: data.subtotal,
    cgst: data.cgst,
    sgst: data.sgst,
    igst: data.igst,
    totalTax: data.totalTax,
    grandTotal: data.grandTotal,
    paymentMode: data.paymentMode,
    advancePaid: data.advancePaid,
    balanceDue: data.balanceDue,
    remarks: data.remarks,
  };

  // Transform data for AWBLabel component
  const awbLabelData: AWBLabelData = {
    awbNumber: data.awbNo,
    shipDate: data.invoiceDate,
    shipperName: data.consignorName,
    shipperAddress: data.consignorAddress,
    shipperCity: data.consignorCity,
    shipperState: data.consignorState,
    shipperPincode: data.consignorPincode,
    shipperPhone: data.consignorPhone,
    shipperGSTIN: data.consignorGSTIN,
    consigneeName: data.consigneeName,
    consigneeAddress: data.consigneeAddress,
    consigneeCity: data.consigneeCity,
    consigneeState: data.consigneeState,
    consigneePincode: data.consigneePincode,
    consigneePhone: data.consigneePhone,
    weight: data.actualWeight,
    volumetricWeight: data.chargeableWeight,
    pieces: data.pieces,
    transportMode: data.transportMode.toUpperCase() as "AIR" | "SURFACE" | "EXPRESS",
    paymentMode: data.paymentMode,
    declaredValue: data.declaredValue,
    contentDescription: data.contentDescription,
    specialInstructions: data.specialInstructions,
    invoiceNo: data.invoiceNo,
    invoiceDate: data.invoiceDate,
    originStation: data.origin.substring(0, 4).toUpperCase(),
    destinationStation: data.destination.substring(0, 4).toUpperCase(),
  };

  const handleCopyInvoiceNo = () => {
    navigator.clipboard.writeText(data.invoiceNo);
    setCopied(true);
    toast.success("Invoice number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const ref = activeTab === "invoice" ? invoiceRef : labelRef;
    if (ref.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${activeTab === "invoice" ? "Invoice" : "AWB Label"} - ${data.invoiceNo}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; }
                @media print {
                  @page { 
                    size: ${activeTab === "invoice" ? "A4" : "4in 6in"}; 
                    margin: ${activeTab === "invoice" ? "10mm" : "0"}; 
                  }
                }
              </style>
            </head>
            <body>
              ${ref.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
    onPrint?.();
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{data.invoiceNo}</h2>
              <button
                onClick={handleCopyInvoiceNo}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              AWB: {data.awbNo}
            </p>
          </div>
          <Badge className={cn("ml-2", status.color)}>{status.label}</Badge>
        </div>

        <div className="flex items-center gap-2">
          {onSendWhatsApp && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendWhatsApp(data.id)}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          )}
          {onSendEmail && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendEmail(data.id)}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          )}
          {onDownloadPdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadPdf(data.id)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "invoice" | "label")}
        className="flex-1 flex flex-col mt-4"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="invoice" className="gap-2">
            <FileText className="w-4 h-4" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="label" className="gap-2">
            <Tag className="w-4 h-4" />
            Shipping Label
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="flex-1 overflow-auto mt-4">
          <div className="bg-white rounded-lg border shadow-sm overflow-auto max-h-[60vh]">
            <InvoiceDocument ref={invoiceRef} data={invoiceDocData} showTerms />
          </div>
        </TabsContent>

        <TabsContent value="label" className="flex-1 overflow-auto mt-4">
          <div className="flex justify-center bg-muted/30 rounded-lg p-4 overflow-auto max-h-[60vh]">
            <div ref={labelRef}>
              <AWBLabel data={awbLabelData} showPrintButton={false} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
