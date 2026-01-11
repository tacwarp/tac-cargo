"use client";

import React from "react";
import InvoiceGenerator from "@/components/invoice/amazon-style/invoice-generator";

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto">
          <InvoiceGenerator />
        </div>
      </div>
    </div>
  );
}
