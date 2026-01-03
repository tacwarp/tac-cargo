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
  invoice?: { reference: string; total: number; customer: { name: string } }
  amount: number
  payment_mode: 'cash' | 'upi' | 'neft' | 'cheque' | 'credit'
  transaction_ref?: string
  notes?: string
  paid_at?: string
  created_at: string
}

const methodLabels: Record<string, string> = {
  cash: 'Cash',
  upi: 'UPI',
  neft: 'NEFT',
  cheque: 'Cheque',
  credit: 'Credit'
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
    payment_mode: 'cash' as 'cash' | 'upi' | 'neft' | 'cheque' | 'credit',
    transaction_ref: '',
    notes: '',
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
    if (!formData.invoice_id || !formData.amount || !formData.payment_mode) {
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
      setFormData({ invoice_id: '', amount: '', payment_mode: 'cash', transaction_ref: '', notes: '' })
      fetchPayments()
    } catch (error) {
      toast.error('Failed to record payment')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.transaction_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <p className='text-2xl font-bold'>{formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}</p>
            <p className='text-xs text-muted-foreground'>Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Pending</CardTitle>
            <ClockIcon className='size-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{payments.length}</p>
            <p className='text-xs text-muted-foreground'>Total payments</p>
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
                  <TableCell className='font-mono text-sm'>{payment.transaction_ref || payment.id.slice(0, 8)}</TableCell>
                  <TableCell>{payment.invoice?.customer?.name || 'N/A'}</TableCell>
                  <TableCell className='font-mono text-sm hidden sm:table-cell'>{payment.invoice?.reference || 'N/A'}</TableCell>
                  <TableCell className='font-medium'>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell className='capitalize hidden md:table-cell'>{methodLabels[payment.payment_mode] || payment.payment_mode}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='bg-emerald-500/10 text-emerald-500 border-emerald-500/20'>
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : new Date(payment.created_at).toLocaleDateString()}</TableCell>
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
              <Label htmlFor='payment_mode'>Payment Mode</Label>
              <Select
                value={formData.payment_mode}
                onValueChange={(value: 'cash' | 'upi' | 'neft' | 'cheque' | 'credit') => setFormData({ ...formData, payment_mode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select mode' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='cash'>Cash</SelectItem>
                  <SelectItem value='upi'>UPI</SelectItem>
                  <SelectItem value='neft'>NEFT</SelectItem>
                  <SelectItem value='cheque'>Cheque</SelectItem>
                  <SelectItem value='credit'>Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='transaction_ref'>Transaction Reference</Label>
              <Input
                id='transaction_ref'
                value={formData.transaction_ref}
                onChange={e => setFormData({ ...formData, transaction_ref: e.target.value })}
                placeholder='Transaction ID or reference number'
              />
            </div>
            <div>
              <Label htmlFor='notes'>Notes</Label>
              <Input
                id='notes'
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder='Additional notes (optional)'
              />
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
