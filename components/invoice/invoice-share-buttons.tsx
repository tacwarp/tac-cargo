"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MessageCircle,
  Mail,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Share2,
} from "lucide-react";
import { sendInvoiceWhatsApp } from "@/app/actions/invoice-enhanced";

interface InvoiceShareButtonsProps {
  invoiceId: string;
  invoiceNo: string;
  awbNo: string;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName?: string;
  totalAmount: number;
  variant?: "default" | "compact";
}

export function InvoiceShareButtons({
  invoiceId,
  invoiceNo,
  awbNo,
  recipientPhone,
  recipientEmail,
  recipientName,
  totalAmount,
  variant = "default",
}: InvoiceShareButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState(recipientEmail || "");

  const trackingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track/${awbNo}`;

  const handleWhatsAppShare = async () => {
    setIsLoading(true);
    try {
      const result = await sendInvoiceWhatsApp(invoiceId);
      if (result.success && result.data?.shareLink) {
        window.open(result.data.shareLink, "_blank");
        toast.success("Opening WhatsApp...");
      } else if (!result.success) {
        toast.error("error" in result ? result.error : "Failed to generate WhatsApp link");
      }
    } catch {
      toast.error("Failed to share via WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Invoice ${invoiceNo} - TAC Cargo Service`);
    const body = encodeURIComponent(`
Dear ${recipientName || "Customer"},

Your shipment invoice is ready!

Invoice: ${invoiceNo}
AWB/Tracking: ${awbNo}
Amount: ₹${totalAmount.toFixed(2)}

Track your shipment: ${trackingUrl}

Thank you for choosing TAC Cargo Service!

Best regards,
TAC Cargo Service
    `.trim());

    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening email client...");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      toast.success("Tracking link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyDetails = async () => {
    const details = `
TAC Cargo Service
Invoice: ${invoiceNo}
AWB: ${awbNo}
Amount: ₹${totalAmount.toFixed(2)}
Track: ${trackingUrl}
    `.trim();

    try {
      await navigator.clipboard.writeText(details);
      toast.success("Invoice details copied!");
    } catch {
      toast.error("Failed to copy details");
    }
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleWhatsAppShare}>
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            <Mail className="w-4 h-4 mr-2 text-blue-500" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Tracking Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyDetails}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Invoice Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          disabled={isLoading || !recipientPhone}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MessageCircle className="w-4 h-4 mr-2" />
          )}
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEmailDialog(true)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          Copy Link
        </Button>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice via Email</DialogTitle>
            <DialogDescription>
              Send invoice {invoiceNo} to customer via email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium mb-2">Invoice Details:</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Invoice No:</span>
                <span className="font-mono">{invoiceNo}</span>
                <span>AWB No:</span>
                <span className="font-mono">{awbNo}</span>
                <span>Amount:</span>
                <span className="font-medium text-primary">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEmailShare();
                setShowEmailDialog(false);
              }}
              disabled={!emailAddress}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Email Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InvoiceShareButtons;
