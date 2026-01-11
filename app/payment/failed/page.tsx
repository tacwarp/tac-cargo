import { Suspense } from "react";
import { XCircle, ArrowLeft, RefreshCw, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function PaymentFailedContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
          {/* Failed Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Failed
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t process your payment. Please try again or use a different payment method.
          </p>

          {/* Reasons Card */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-foreground mb-2">
              Common reasons for payment failure:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card declined by your bank</li>
              <li>• Incorrect card details entered</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/invoices">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
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
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              Need assistance with your payment?
            </p>
            <a 
              href="tel:+919711011416" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Phone className="w-4 h-4" />
              +91 9711011416
            </a>
          </div>
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
