"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CreditCard,
  Receipt,
  Copy,
  Check,
  MoreVertical,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { deletePayment, refundPayment } from "@/app/actions/payment-crud";
import type { PaymentStatus } from "@/types/database";

interface PaymentWithRelations {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string | null;
  payment_reference: string | null;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
  invoices?: {
    id: string;
    invoice_no: string;
    total_amount: number;
    balance_due: number;
    consignee_name: string | null;
  } | null;
}

interface PaymentDetailClientProps {
  payment: PaymentWithRelations;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  partial: { label: "Partial", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  refunded: { label: "Refunded", color: "bg-red-100 text-red-700" },
};

export function PaymentDetailClient({ payment }: PaymentDetailClientProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const status = statusConfig[payment.status] || statusConfig.pending;

  const handleCopyReference = () => {
    if (payment.payment_reference) {
      navigator.clipboard.writeText(payment.payment_reference);
      setCopied(true);
      toast.success("Reference copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePayment(payment.id);
      if (result.success) {
        toast.success("Payment deleted");
        router.push("/dashboard/payments");
      } else {
        toast.error(result.error || "Failed to delete payment");
      }
    } catch {
      toast.error("Failed to delete payment");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleRefund = async () => {
    setIsRefunding(true);
    try {
      const result = await refundPayment(payment.id);
      if (result.success) {
        toast.success("Payment refunded");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to refund payment");
      }
    } catch {
      toast.error("Failed to refund payment");
    } finally {
      setIsRefunding(false);
      setShowRefundDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/payments">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                ₹{payment.amount.toLocaleString("en-IN")}
              </h1>
              <Badge className={cn("ml-2", status.color)}>{status.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(payment.created_at), "dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isHydrated && payment.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRefundDialog(true)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refund
            </Button>
          )}
          
          {isHydrated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {payment.invoices && (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${payment.invoices.id}`}>
                      <Receipt className="w-4 h-4 mr-2" />
                      View Invoice
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Payment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="text-xl font-bold">₹{payment.amount.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Invoice Total</div>
                <div className="text-xl font-bold">
                  ₹{(payment.invoices?.total_amount || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Receipt className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Balance Due</div>
                <div className="text-xl font-bold">
                  ₹{(payment.invoices?.balance_due || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Payment Method</div>
            <div className="font-medium capitalize">{payment.payment_method || "Not specified"}</div>
          </div>
          {payment.payment_reference && (
            <div>
              <div className="text-sm text-muted-foreground">Reference Number</div>
              <div className="font-medium font-mono flex items-center gap-2">
                {payment.payment_reference}
                <button onClick={handleCopyReference} className="p-1 hover:bg-muted rounded">
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge className={cn(status.color)}>{status.label}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="font-medium">{format(new Date(payment.created_at), "dd MMM yyyy, HH:mm")}</div>
          </div>
        </CardContent>
      </Card>

      {/* Related Invoice */}
      {payment.invoices && (
        <Card>
          <CardHeader>
            <CardTitle>Related Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href={`/dashboard/invoices/${payment.invoices.id}`}
              className="block p-4 rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary">{payment.invoices.invoice_no}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.invoices.consignee_name || "No consignee"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium">
                    ₹{payment.invoices.total_amount.toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Balance: ₹{payment.invoices.balance_due.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {payment.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{payment.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment record. The invoice balance will be adjusted accordingly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the payment as refunded and restore the invoice balance. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund} disabled={isRefunding}>
              {isRefunding ? "Processing..." : "Refund Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
