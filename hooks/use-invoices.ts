"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoice_no: string;
  awb_no: string;
  reference: string;
  status: string;
  consignee_name: string;
  total_amount: number;
  balance_due: number;
  invoice_date: string;
  due_date?: string;
  created_at: string;
}

interface InvoiceAnalytics {
  totalRevenue: number;
  outstanding: number;
  paidCount: number;
  overdueCount: number;
  monthlyData: Array<{ month: string; revenue: number }>;
}

interface CreateInvoiceData {
  customerId?: string;
  customerName: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  dueDate: Date;
  notes?: string;
}

export function useInvoices(options?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, status } = options ?? {};

  const invoicesQuery = useQuery({
    queryKey: ["invoices", { page, limit, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await fetch(`/api/invoices?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      return response.json() as Promise<{ invoices: Invoice[]; count: number }>;
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: CreateInvoiceData) => {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create invoice");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-analytics"] });
      toast.success("Invoice created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update invoice status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-analytics"] });
      toast.success("Invoice status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update invoice status");
    },
  });

  return {
    invoices: invoicesQuery.data?.invoices ?? [],
    total: invoicesQuery.data?.count ?? 0,
    isLoading: invoicesQuery.isLoading,
    isError: invoicesQuery.isError,
    createInvoice: createInvoiceMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
  };
}

export function useInvoiceAnalytics() {
  return useQuery({
    queryKey: ["invoice-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/invoices/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return response.json() as Promise<InvoiceAnalytics>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }
      return response.json() as Promise<Invoice>;
    },
    enabled: !!invoiceId,
  });
}
