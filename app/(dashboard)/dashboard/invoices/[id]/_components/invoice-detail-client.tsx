"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Printer,
  Download,
  MessageCircle,
  Mail,
  FileText,
  Tag,
  Copy,
  Check,
  MoreVertical,
  RefreshCw,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { InvoiceDocument, AWBLabel, type InvoiceDocumentData, type AWBLabelData } from "@/components/invoice";
import { cancelInvoice } from "@/app/actions/invoice-crud";
import { sendInvoiceViaWhatsApp, getWhatsAppLink } from "@/app/actions/whatsapp";
import type { InvoiceStatus } from "@/types/database";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  declared_value?: number;
  line_total: number;
}

interface InvoiceWithRelations {
  id: string;
  invoice_no: string;
  awb_no: string | null;
  reference?: string;
  type: string;
  status: InvoiceStatus;
  invoice_date: string;
  due_date: string | null;

  // Shipper
  shipper_name?: string;
  shipper_phone?: string;
  shipper_address?: string;
  shipper_gstin?: string;

  // Consignee
  consignee_name: string | null;
  consignee_phone?: string;
  consignee_email?: string;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;

  // Shipment details
  transport_mode?: string;
  payment_mode?: string;
  content_description?: string;
  special_instructions?: string;

  // Weight
  total_pieces?: number;
  total_weight?: number;
  total_volumetric_weight?: number;
  chargeable_weight?: number;
  declared_value?: number;

  // Charges
  freight_charge?: number;
  pickup_charge?: number;
  delivery_charge?: number;
  packing_charge?: number;
  insurance_charge?: number;
  handling_charge?: number;
  other_charges?: number;

  // Tax
  subtotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total_tax: number;
  total_amount: number;
  balance_due: number;

  // URLs
  pdf_url: string | null;
  invoice_pdf_url?: string;
  label_pdf_url?: string;
  sent_via_whatsapp_at: string | null;

  // Metadata
  notes?: string;
  created_at: string;
  updated_at?: string;

  // Relations
  customers?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    gst_number: string | null;
  } | null;
  shipments?: {
    id: string;
    reference: string;
    status: string;
    pieces: number | null;
    weight_kg: number | null;
  } | null;
  invoice_items?: InvoiceItem[];
}

interface InvoiceDetailClientProps {
  invoice: InvoiceWithRelations;
}

const statusConfig: Record<InvoiceStatus, { label: string; bgColor: string; dotColor: string }> = {
  draft: { label: "Draft Protocol", bgColor: "bg-slate-100 text-slate-600 border-slate-200", dotColor: "bg-slate-400" },
  pending: { label: "Awaiting Settlement", bgColor: "bg-amber-50 text-amber-700 border-amber-100", dotColor: "bg-amber-500" },
  paid: { label: "Settlement Confirmed", bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100", dotColor: "bg-emerald-500" },
  partial: { label: "Partial Settlement", bgColor: "bg-blue-50 text-blue-700 border-blue-100", dotColor: "bg-blue-500" },
  overdue: { label: "Overdue Alert", bgColor: "bg-red-50 text-red-700 border-red-100", dotColor: "bg-red-500" },
  cancelled: { label: "Protocol Aborted", bgColor: "bg-slate-100 text-slate-400 border-slate-200", dotColor: "bg-slate-300" },
};

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "invoice" | "label">("details");
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const status = statusConfig[invoice.status] || statusConfig.draft;

  const handleCopyInvoiceNo = () => {
    navigator.clipboard.writeText(invoice.invoice_no);
    setCopied(true);
    toast.success("Invoice number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = async () => {
    setIsSending(true);
    try {
      const linkResult = await getWhatsAppLink(invoice.id);
      if (linkResult.success) {
        window.open(linkResult.data.url, "_blank");
        await sendInvoiceViaWhatsApp(invoice.id);
        toast.success("WhatsApp message opened");
        router.refresh();
      } else {
        toast.error(linkResult.error || "Failed to generate WhatsApp link");
      }
    } catch {
      toast.error("Failed to send via WhatsApp");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = async () => {
    setIsDeleting(true);
    try {
      const result = await cancelInvoice(invoice.id);
      if (result.success) {
        toast.success("Invoice cancelled");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel invoice");
      }
    } catch {
      toast.error("Failed to cancel invoice");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Transform data for InvoiceDocument
  const invoiceDocData: InvoiceDocumentData = {
    companyName: "TAPAN ASSOCIATE COURIER AND CARGO SERVICE",
    companyAddress: "1498 Ground Floor Street No 3 Wazir Nagar Nagar Kotla Mubarakpur, Central Delhi DL 110003",
    companyPhone: "+91 98765 43210",
    companyGSTIN: "07AAMFT6165B1Z3",
    branchOffice: "Singjamei Oinam Thingel, Imphal West, Manipur 795008",
    branchPhone: "+91 98765 43211",
    invoiceNo: invoice.invoice_no,
    consignmentNo: invoice.reference || invoice.invoice_no,
    invoiceDate: new Date(invoice.invoice_date),
    dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
    awbNo: invoice.awb_no || undefined,
    consignorName: invoice.shipper_name || invoice.customers?.name || "TAC Cargo",
    consignorAddress: invoice.shipper_address || invoice.customers?.address || "",
    consignorCity: invoice.customers?.city || "Delhi",
    consignorState: invoice.customers?.state || "Delhi",
    consignorPincode: invoice.customers?.pincode || "110003",
    consignorPhone: invoice.shipper_phone || invoice.customers?.phone || "",
    consignorGSTIN: invoice.shipper_gstin || invoice.customers?.gst_number || undefined,
    consigneeName: invoice.consignee_name || "",
    consigneeAddress: invoice.consignee_address || "",
    consigneeCity: invoice.consignee_city || "",
    consigneeState: invoice.consignee_state || "",
    consigneePincode: invoice.consignee_pincode || "",
    consigneePhone: invoice.consignee_phone || "",
    origin: invoice.customers?.city || "Delhi",
    destination: invoice.consignee_city || "",
    transportMode: (invoice.transport_mode || "air").toUpperCase(),
    pieces: invoice.total_pieces || 1,
    actualWeight: invoice.total_weight || 0,
    chargeableWeight: invoice.chargeable_weight || invoice.total_weight || 0,
    ratePerKg: invoice.freight_charge && invoice.chargeable_weight
      ? invoice.freight_charge / invoice.chargeable_weight
      : 0,
    declaredValue: invoice.declared_value,
    natureOfQuantity: invoice.content_description,
    freightCharge: invoice.freight_charge || 0,
    pickupCharge: invoice.pickup_charge || 0,
    packingCharge: invoice.packing_charge || 0,
    deliveryCharge: invoice.delivery_charge || 0,
    insuranceCharge: invoice.insurance_charge || 0,
    handlingCharge: invoice.handling_charge,
    otherCharges: invoice.other_charges,
    subtotal: invoice.subtotal,
    cgst: invoice.cgst || 0,
    sgst: invoice.sgst || 0,
    igst: invoice.igst || 0,
    totalTax: invoice.total_tax,
    grandTotal: invoice.total_amount,
    paymentMode: (invoice.payment_mode?.toUpperCase() || "PREPAID") as "PREPAID" | "COD" | "TO PAY",
    advancePaid: invoice.total_amount - invoice.balance_due,
    balanceDue: invoice.balance_due,
    remarks: invoice.notes,
  };

  // Transform data for AWBLabel
  const awbLabelData: AWBLabelData = {
    awbNumber: invoice.awb_no || invoice.invoice_no,
    shipDate: new Date(invoice.invoice_date),
    shipperName: invoice.shipper_name || invoice.customers?.name || "TAC Cargo",
    shipperAddress: invoice.shipper_address || invoice.customers?.address || "",
    shipperCity: invoice.customers?.city || "Delhi",
    shipperState: invoice.customers?.state || "Delhi",
    shipperPincode: invoice.customers?.pincode || "110003",
    shipperPhone: invoice.shipper_phone || invoice.customers?.phone,
    shipperGSTIN: invoice.shipper_gstin || invoice.customers?.gst_number || undefined,
    consigneeName: invoice.consignee_name || "",
    consigneeAddress: invoice.consignee_address || "",
    consigneeCity: invoice.consignee_city || "",
    consigneeState: invoice.consignee_state || "",
    consigneePincode: invoice.consignee_pincode || "",
    consigneePhone: invoice.consignee_phone,
    weight: invoice.total_weight || 0,
    volumetricWeight: invoice.total_volumetric_weight,
    pieces: invoice.total_pieces || 1,
    transportMode: (invoice.transport_mode?.toUpperCase() || "AIR") as "AIR" | "SURFACE" | "EXPRESS",
    paymentMode: (invoice.payment_mode?.toUpperCase() || "PREPAID") as "PREPAID" | "COD" | "TO PAY",
    declaredValue: invoice.declared_value,
    contentDescription: invoice.content_description,
    specialInstructions: invoice.special_instructions,
    invoiceNo: invoice.invoice_no,
    invoiceDate: new Date(invoice.invoice_date),
    originStation: "DEL",
    destinationStation: invoice.consignee_city?.substring(0, 4).toUpperCase() || "GAUA",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="flex items-center gap-6 relative">
          <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
            <Link href="/dashboard/invoices">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{invoice.invoice_no}</h1>
              <button
                onClick={handleCopyInvoiceNo}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-primary border border-transparent hover:border-slate-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("h-7 rounded-full uppercase text-[9px] font-black tracking-[0.1em] px-3 flex items-center justify-center gap-1.5 border shadow-sm", status.bgColor)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)} />
                {status.label}
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                AWB PROTOCOL: <span className="text-slate-900">{invoice.awb_no || "N/A"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendWhatsApp}
            disabled={isSending || invoice.status === "cancelled"}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>

          {isHydrated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Invoice
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={invoice.status === "cancelled" || invoice.status === "paid"}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Cancel Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="invoice" className="gap-2">
            <FileText className="w-4 h-4" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="label" className="gap-2">
            <Tag className="w-4 h-4" />
            Shipping Label
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard label="Total Protocol Value" value={`₹${invoice.total_amount.toLocaleString("en-IN")}`} color="text-slate-900" />
            <SummaryCard
              label="Outstanding Liability"
              value={`₹${invoice.balance_due.toLocaleString("en-IN")}`}
              color={invoice.balance_due > 0 ? "text-red-500" : "text-emerald-500"}
              subValue={invoice.balance_due > 0 ? "Settlement Req." : "Clear Protocol"}
            />
            <SummaryCard label="Package Count" value={invoice.total_pieces?.toString() || "1"} />
            <SummaryCard label="Verified Weight" value={`${invoice.total_weight || 0} KG`} />
          </div>

          {/* Consignor & Consignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-8">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Origin Protocol (Shipper)</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div>
                  <div className="text-xl font-black text-slate-900 leading-tight">{invoice.shipper_name || invoice.customers?.name || "TAC Cargo"}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Logistics Entity</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Location</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase">
                    {invoice.shipper_address || invoice.customers?.address}
                    <br />
                    {invoice.customers?.city} // {invoice.customers?.state} // {invoice.customers?.pincode}
                  </p>
                </div>
                {(invoice.shipper_phone || invoice.customers?.phone) && (
                  <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mobile Link</p>
                      <p className="text-sm font-black text-slate-900">{invoice.shipper_phone || invoice.customers?.phone}</p>
                    </div>
                    {invoice.customers?.gst_number && (
                      <div className="space-y-0.5 ml-auto text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tax Identity</p>
                        <p className="text-sm font-black text-blue-500 uppercase">{invoice.customers.gst_number}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-4 px-8">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Destination Protocol (Consignee)</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div>
                  <div className="text-xl font-black text-slate-900 leading-tight">{invoice.consignee_name}</div>
                  <div className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-1">Target End-Point</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Drop-off Infrastructure</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase">
                    {invoice.consignee_address}
                    <br />
                    {invoice.consignee_city} // {invoice.consignee_state} // {invoice.consignee_pincode}
                  </p>
                </div>
                {invoice.consignee_phone && (
                  <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contact Vector</p>
                      <p className="text-sm font-black text-slate-900">{invoice.consignee_phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charges Breakdown */}
          <Card className="rounded-[2.5rem] border-0 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mb-48 blur-3xl" />
            <CardHeader className="border-b border-white/5 py-6 px-10">
              <CardTitle className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-400">Financial Ledger Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-10 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <ChargeItem label="Logistics Freight" amount={invoice.freight_charge} />
                  {invoice.pickup_charge ? <ChargeItem label="Origin Pickup" amount={invoice.pickup_charge} /> : null}
                  {invoice.delivery_charge ? <ChargeItem label="Final Mile Delivery" amount={invoice.delivery_charge} /> : null}
                  {invoice.packing_charge ? <ChargeItem label="Secure Containment" amount={invoice.packing_charge} /> : null}
                  {invoice.insurance_charge ? <ChargeItem label="SLA Protection" amount={invoice.insurance_charge} /> : null}
                  {invoice.handling_charge ? <ChargeItem label="Protocol Handling" amount={invoice.handling_charge} /> : null}
                  {invoice.other_charges ? <ChargeItem label="Ancillary Levies" amount={invoice.other_charges} /> : null}
                </div>
                <div className="flex flex-col justify-end space-y-6">
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Base Valuation</span>
                      <span className="font-mono text-sm">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-400">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Taxation</span>
                      <span className="font-mono text-sm">₹{invoice.total_tax.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="pt-8 border-t-2 border-white/20 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 leading-none">Net Payable</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol Settlement Total</p>
                    </div>
                    <div className="text-5xl font-black tracking-tighter text-white">₹{invoice.total_amount.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="invoice" className="mt-6">
          <Card className="p-6 bg-white">
            <InvoiceDocument data={invoiceDocData} showTerms />
          </Card>
        </TabsContent>

        <TabsContent value="label" className="mt-6">
          <div className="flex justify-center bg-muted/30 rounded-lg p-6">
            <AWBLabel data={awbLabelData} showPrintButton />
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the invoice as cancelled. This action cannot be undone.
              The invoice will remain in records but will be marked as void.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invoice</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Cancelling..." : "Cancel Invoice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SummaryCard({ label, value, color, subValue }: { label: string; value: string; color?: string; subValue?: string }) {
  return (
    <div className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-center gap-1">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={cn("text-3xl font-black tracking-tighter leading-none", color || "text-slate-900")}>{value}</p>
      {subValue && (
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subValue}</p>
      )}
    </div>
  );
}

function ChargeItem({ label, amount }: { label: string; amount?: number }) {
  if (!amount) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="font-mono text-sm font-semibold text-white">₹{amount.toLocaleString("en-IN")}</span>
    </div>
  );
}
