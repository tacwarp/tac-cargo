/**
 * Invoice Service
 * Handles invoice creation, PDF generation, and management
 * Leverages existing Supabase infrastructure
 */

import { createClient } from "@/lib/supabase/server";
import Currency from "currency.js";
import { format } from "date-fns";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discount?: number;
  packageType?: string;
  weight?: number;
  lineTotal?: number;
}

export interface CreateInvoiceData {
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  items: InvoiceItem[];
  dueDate: Date;
  notes?: string;
  terms?: string;
  shipmentId?: string;
  trackingNumber?: string;
  currency?: string;
}

export interface Invoice {
  id: string;
  invoice_no: string;
  awb_no: string;
  reference: string;
  status: string;
  customer_id?: string;
  consignee_name: string;
  consignee_address?: string;
  consignee_city?: string;
  consignee_state?: string;
  consignee_pincode?: string;
  subtotal: number;
  total_tax: number;
  total_amount: number;
  balance_due: number;
  invoice_date: string;
  due_date?: string;
  created_at: string;
  items?: InvoiceItem[];
}

/**
 * Invoice Service Class
 * Provides methods for invoice management
 */
export class InvoiceService {
  /**
   * Generate unique invoice number
   */
  static generateInvoiceNumber(prefix = "INV"): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${year}${month}-${timestamp}`;
  }

  /**
   * Generate unique AWB number
   */
  static generateAWBNumber(): string {
    const prefix = "TAC";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = typeof crypto !== "undefined"
      ? Array.from(crypto.getRandomValues(new Uint8Array(3))).map(b => b.toString(36)).join("").substring(0, 4).toUpperCase()
      : Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Calculate invoice totals
   */
  static calculateTotals(
    items: InvoiceItem[],
    taxRate = 18,
  ): {
    subtotal: number;
    taxAmount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => {
      const lineTotal = Currency(item.quantity).multiply(item.unitPrice);
      const discount = item.discount
        ? lineTotal.multiply(item.discount / 100)
        : Currency(0);
      return Currency(sum).add(lineTotal.subtract(discount)).value;
    }, 0);

    const taxAmount = Currency(subtotal).multiply(taxRate / 100).value;
    const total = Currency(subtotal).add(taxAmount).value;

    return { subtotal, taxAmount, total };
  }

  /**
   * Create invoice via stored procedure
   */
  static async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    const supabase = await createClient();

    const invoiceNo = this.generateInvoiceNumber();
    const awbNo = this.generateAWBNumber();
    const { subtotal, taxAmount, total } = this.calculateTotals(data.items);

    const invoiceData = {
      invoice_no: invoiceNo,
      awb_no: awbNo,
      customer_id: data.customerId || null,
      consignee_name: data.customerName,
      consignee_address: data.customerAddress?.street,
      consignee_city: data.customerAddress?.city,
      consignee_state: data.customerAddress?.state,
      consignee_pincode: data.customerAddress?.pincode,
      payment_mode: "prepaid",
      invoice_date: format(new Date(), "yyyy-MM-dd"),
      due_date: format(data.dueDate, "yyyy-MM-dd"),
      subtotal,
      total_tax: taxAmount,
      total_amount: total,
      balance_due: total,
      status: "pending",
    };

    const { data: invoice, error } = await supabase.rpc(
      "create_invoice_direct",
      {
        invoice_data: invoiceData,
      },
    );

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }

    return invoice as Invoice;
  }

  /**
   * Get invoice by ID
   */
  static async getInvoice(invoiceId: string): Promise<Invoice | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers(name, contact_email),
        packages(*)
      `,
      )
      .eq("id", invoiceId)
      .single();

    if (error) {
      console.error("Error fetching invoice:", error);
      return null;
    }

    return data as Invoice;
  }

  /**
   * List invoices with pagination
   */
  static async listInvoices(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ): Promise<{ invoices: Invoice[]; total: number }> {
    const supabase = await createClient();
    const { page = 1, limit = 10, status, search } = options;

    let query = supabase
      .from("invoices")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `invoice_no.ilike.%${search}%,awb_no.ilike.%${search}%,consignee_name.ilike.%${search}%`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list invoices: ${error.message}`);
    }

    return {
      invoices: data as Invoice[],
      total: count ?? 0,
    };
  }

  /**
   * Update invoice status
   */
  static async updateStatus(invoiceId: string, status: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("invoices")
      .update({
        status,
        ...(status === "paid" ? { paid_at: new Date().toISOString() } : {}),
      })
      .eq("id", invoiceId);

    if (error) {
      throw new Error(`Failed to update invoice status: ${error.message}`);
    }
  }

  /**
   * Get invoice analytics
   */
  static async getAnalytics(): Promise<{
    totalRevenue: number;
    outstanding: number;
    paidCount: number;
    overdueCount: number;
    monthlyData: Array<{ month: string; revenue: number }>;
  }> {
    const supabase = await createClient();

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("status, total_amount, created_at");

    if (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }

    const totalRevenue =
      invoices?.reduce(
        (sum, inv) => Currency(sum).add(inv.total_amount || 0).value,
        0,
      ) ?? 0;

    const outstanding =
      invoices
        ?.filter((inv) => inv.status === "pending")
        .reduce(
          (sum, inv) => Currency(sum).add(inv.total_amount || 0).value,
          0,
        ) ?? 0;

    const paidCount =
      invoices?.filter((inv) => inv.status === "paid").length ?? 0;
    const overdueCount =
      invoices?.filter((inv) => inv.status === "overdue").length ?? 0;

    // Monthly revenue aggregation
    const monthlyMap =
      invoices?.reduce(
        (acc, inv) => {
          const month = format(new Date(inv.created_at), "MMM yyyy");
          acc[month] = Currency(acc[month] || 0).add(
            inv.total_amount || 0,
          ).value;
          return acc;
        },
        {} as Record<string, number>,
      ) ?? {};

    const monthlyData = Object.entries(monthlyMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    return {
      totalRevenue,
      outstanding,
      paidCount,
      overdueCount,
      monthlyData,
    };
  }
}

export default InvoiceService;
