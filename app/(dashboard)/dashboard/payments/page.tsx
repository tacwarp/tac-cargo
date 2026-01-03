'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PlusIcon,
  SearchIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  Loader2Icon
} from 'lucide-react'

interface Payment {
  id: string
  invoice_id?: string
  shipment_id?: string
  invoice?: { reference: string; total: number; customer: { name: string } }
  amount: number
  payment_method: string
  payment_reference?: string
  status: 'pending' | 'completed' | 'failed'
  payment_date?: string
  created_at: string
}

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
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    payment_method: '',
    payment_reference: '',
    status: 'completed' as 'pending' | 'completed' | 'failed',
  })

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      if (!response.ok) throw new Error('Failed to fetch payments')
      const data = await response.json()
      setPayments(data.payments || [])
    } catch (error) {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleCreate = async () => {
    if (!formData.invoice_id || !formData.amount || !formData.payment_method) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!response.ok) throw new Error('Failed to record payment')

      toast.success('Payment recorded successfully')
      setCreateOpen(false)
      setFormData({ invoice_id: '', amount: '', payment_method: '', payment_reference: '', status: 'completed' })
      fetchPayments()
    } catch (error) {
      toast.error('Failed to record payment')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.invoice?.customer?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon className='mr-2 size-4' />
          Record Payment
        </Button>
      }
    >
      {loading ? (
        <Card className='p-12 flex items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-primary' />
        </Card>
      ) : (
      <>
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Received</CardTitle>
            <DollarSignIcon className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}</p>
            <p className='text-xs text-muted-foreground'>Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Pending</CardTitle>
            <ClockIcon className='size-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}</p>
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
              <TableHead className='hidden sm:table-cell'>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className='font-mono text-sm'>{payment.payment_reference || 'N/A'}</TableCell>
                  <TableCell>{payment.invoice?.customer?.name || 'N/A'}</TableCell>
                  <TableCell className='font-mono text-sm'>{payment.invoice?.reference || 'N/A'}</TableCell>
                  <TableCell className='font-medium'>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell className='capitalize'>{payment.payment_method.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className={statusStyles[payment.status]}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>{payment.payment_date || new Date(payment.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      </>
      )}

      {/* Record Payment Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a new payment transaction
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='invoice_id'>Invoice ID</Label>
              <Input
                id='invoice_id'
                value={formData.invoice_id}
                onChange={e => setFormData({ ...formData, invoice_id: e.target.value })}
                placeholder='Enter invoice UUID'
              />
            </div>
            <div>
              <Label htmlFor='amount'>Amount (₹)</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder='0.00'
              />
            </div>
            <div>
              <Label htmlFor='payment_method'>Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={value => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select method' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                  <SelectItem value='upi'>UPI</SelectItem>
                  <SelectItem value='cheque'>Cheque</SelectItem>
                  <SelectItem value='cash'>Cash</SelectItem>
                  <SelectItem value='card'>Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='payment_reference'>Payment Reference</Label>
              <Input
                id='payment_reference'
                value={formData.payment_reference}
                onChange={e => setFormData({ ...formData, payment_reference: e.target.value })}
                placeholder='Transaction ID or reference number'
              />
            </div>
            <div>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'pending' | 'completed' | 'failed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Recording...</> : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
