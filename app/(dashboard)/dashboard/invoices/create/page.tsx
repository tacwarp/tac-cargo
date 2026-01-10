"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InvoiceCreationForm } from "@/components/invoice";

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Create Invoice & AWB</h1>
              <p className="text-sm text-muted-foreground">
                Generate invoice with shipping label
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-hidden"
      >
        <InvoiceCreationForm />
      </motion.div>
    </div>
  );
}
