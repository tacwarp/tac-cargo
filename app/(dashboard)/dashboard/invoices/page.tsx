import { PageLayout } from '@/components/layout/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PlusIcon, SearchIcon, MoreVerticalIcon, EyeIcon, DownloadIcon, SendIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  number: string
  customer: string
  amount: number
  status: Extract<Status, 'invoice-draft' | 'invoice-sent' | 'invoice-paid' | 'invoice-overdue'>
  dueDate: string
}

const invoices: Invoice[] = [
  { id: '1', number: 'INV-2024-0001', customer: 'ABC Corporation', amount: 15250, status: 'invoice-paid', dueDate: '2024-12-15' },
  { id: '2', number: 'INV-2024-0002', customer: 'XYZ Logistics', amount: 8750.5, status: 'invoice-sent', dueDate: '2024-12-30' },
  { id: '3', number: 'INV-2024-0003', customer: 'Metro Express', amount: 3200, status: 'invoice-overdue', dueDate: '2024-12-20' },
  { id: '4', number: 'INV-2024-0004', customer: 'Quick Ship Co', amount: 12800.75, status: 'invoice-draft', dueDate: '2025-01-15' }
]

export default function InvoicesPage() {
  return (
    <PageLayout
      title="Invoices"
      description="Manage billing and invoices"
      actions={
        <Button asChild>
          <Link href="/dashboard/invoices/new"><PlusIcon className="mr-2 size-4" />New Invoice</Link>
        </Button>
      }
    >
      <Card className="p-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm">{inv.number}</TableCell>
                <TableCell className="font-medium">{inv.customer}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right tabular-nums">₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8"><MoreVerticalIcon className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><EyeIcon className="mr-2 size-4" />View</DropdownMenuItem>
                      <DropdownMenuItem><DownloadIcon className="mr-2 size-4" />Download</DropdownMenuItem>
                      <DropdownMenuItem><SendIcon className="mr-2 size-4" />Send</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2Icon className="mr-2 size-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Showing {invoices.length} invoices</p>
        </div>
      </Card>
    </PageLayout>
  )
}

