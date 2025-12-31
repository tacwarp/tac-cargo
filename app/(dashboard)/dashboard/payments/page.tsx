'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  PlusIcon,
  SearchIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from 'lucide-react'

interface Payment {
  id: string
  paymentId: string
  customer: string
  invoiceNumber: string
  amount: number
  method: 'bank_transfer' | 'upi' | 'cheque' | 'cash'
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const payments: Payment[] = [
  { id: '1', paymentId: 'PAY-2024-0001', customer: 'ABC Corporation', invoiceNumber: 'INV-2024-0001', amount: 15250.00, method: 'bank_transfer', status: 'completed', date: '2024-12-28' },
  { id: '2', paymentId: 'PAY-2024-0002', customer: 'Prime Cargo', invoiceNumber: 'INV-2024-0005', amount: 5600.00, method: 'upi', status: 'completed', date: '2024-12-27' },
  { id: '3', paymentId: 'PAY-2024-0003', customer: 'Metro Express', invoiceNumber: 'INV-2024-0003', amount: 3200.00, method: 'cheque', status: 'pending', date: '2024-12-27' },
  { id: '4', paymentId: 'PAY-2024-0004', customer: 'XYZ Logistics', invoiceNumber: 'INV-2024-0002', amount: 8750.50, method: 'bank_transfer', status: 'completed', date: '2024-12-26' }
]

const methodLabels = {
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  cheque: 'Cheque',
  cash: 'Cash'
}

const statusStyles = {
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPayments = payments.filter(payment =>
    payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <PageLayout
      title='Payments'
      description='Track and manage payment transactions'
      actions={
        <Button>
          <PlusIcon className='mr-2 size-4' />
          Record Payment
        </Button>
      }
    >
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Received</CardTitle>
            <DollarSignIcon className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>₹32,800.50</p>
            <p className='text-xs text-muted-foreground'>This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Pending</CardTitle>
            <ClockIcon className='size-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>₹3,200.00</p>
            <p className='text-xs text-muted-foreground'>1 transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Completed</CardTitle>
            <CheckCircleIcon className='size-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>₹29,600.50</p>
            <p className='text-xs text-muted-foreground'>3 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Growth</CardTitle>
            <TrendingUpIcon className='size-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-emerald-500'>+18.5%</p>
            <p className='text-xs text-muted-foreground'>vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className='p-0'>
        <div className='flex items-center gap-4 border-b border-border p-4'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search payments...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className='hidden sm:table-cell'>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className='hidden md:table-cell'>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell className='font-mono text-sm'>{payment.paymentId}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell className='hidden font-mono text-sm sm:table-cell'>{payment.invoiceNumber}</TableCell>
                <TableCell className='font-medium'>{formatCurrency(payment.amount)}</TableCell>
                <TableCell className='hidden md:table-cell'>{methodLabels[payment.method]}</TableCell>
                <TableCell>
                  <Badge variant='outline' className={statusStyles[payment.status]}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
