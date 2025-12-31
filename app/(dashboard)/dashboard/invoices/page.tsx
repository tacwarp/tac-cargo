'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EyeIcon,
  DownloadIcon,
  SendIcon,
  Trash2Icon
} from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  createdAt: string
}

const invoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-0001', customer: 'ABC Corporation', amount: 15250.00, status: 'paid', dueDate: '2024-12-15', createdAt: '2024-12-01' },
  { id: '2', invoiceNumber: 'INV-2024-0002', customer: 'XYZ Logistics', amount: 8750.50, status: 'sent', dueDate: '2024-12-30', createdAt: '2024-12-15' },
  { id: '3', invoiceNumber: 'INV-2024-0003', customer: 'Metro Express', amount: 3200.00, status: 'overdue', dueDate: '2024-12-20', createdAt: '2024-12-05' },
  { id: '4', invoiceNumber: 'INV-2024-0004', customer: 'Quick Ship Co', amount: 12800.75, status: 'draft', dueDate: '2025-01-15', createdAt: '2024-12-28' },
  { id: '5', invoiceNumber: 'INV-2024-0005', customer: 'Prime Cargo', amount: 5600.00, status: 'paid', dueDate: '2024-12-10', createdAt: '2024-11-25' },
  { id: '6', invoiceNumber: 'INV-2024-0006', customer: 'Fast Freight', amount: 9450.25, status: 'sent', dueDate: '2025-01-05', createdAt: '2024-12-20' }
]

const statusStyles = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <PageLayout
      title='Invoices'
      description='Manage billing and invoices'
      actions={
        <Button asChild>
          <Link href='/dashboard/invoices/new'>
            <PlusIcon className='mr-2 size-4' />
            New Invoice
          </Link>
        </Button>
      }
    >
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Total Outstanding</p>
          <p className='text-2xl font-bold'>₹24,650.75</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Paid This Month</p>
          <p className='text-2xl font-bold'>₹20,850.00</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Overdue</p>
          <p className='text-2xl font-bold text-rose-500'>₹3,200.00</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Draft Invoices</p>
          <p className='text-2xl font-bold'>1</p>
        </Card>
      </div>

      <Card className='p-0'>
        <div className='flex items-center gap-4 border-b border-border p-4'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search invoices...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='hidden sm:table-cell'>Due Date</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className='font-mono text-sm'>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell className='font-medium'>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>
                  <Badge variant='outline' className={statusStyles[invoice.status]}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>{invoice.dueDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVerticalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <EyeIcon className='mr-2 size-4' />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DownloadIcon className='mr-2 size-4' />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SendIcon className='mr-2 size-4' />
                        Send to Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive focus:text-destructive'>
                        <Trash2Icon className='mr-2 size-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
