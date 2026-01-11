import { Suspense } from "react";
import { CheckCircle, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>

          {/* Details Card */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Receipt className="w-4 h-4" />
              <span>Payment Details</span>
            </div>
            <p className="text-sm text-foreground">
              A confirmation has been sent to your registered email/phone. 
              You can track your shipment status from the tracking page.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/tracking">
                Track Your Shipment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Support */}
          <p className="text-xs text-muted-foreground mt-6">
            Need help? Contact us at{" "}
            <a href="tel:+919711011416" className="text-primary hover:underline">
              +91 9711011416
            </a>
          </p>
        </div>

        {/* Company Branding */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-primary">TAC Cargo</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
