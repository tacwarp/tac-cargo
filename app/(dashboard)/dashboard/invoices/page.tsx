'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
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
  Trash2Icon,
  Loader2Icon
} from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  reference: string
  customer: { name: string; email: string | null } | null
  total: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string | null
  created_at: string
}

const statusStyles = {
  pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      if (!response.ok) throw new Error('Failed to fetch invoices')
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleDownloadPDF = async (invoiceId: string, reference: string) => {
    setDownloadingId(invoiceId)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${reference}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      toast.error('Failed to download PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invoice.customer?.name && invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
      {loading ? (
        <Card className='p-12 flex items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-primary' />
        </Card>
      ) : (
      <>
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Total Outstanding</p>
          <p className='text-2xl font-bold'>{formatCurrency(invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0))}</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Paid This Month</p>
          <p className='text-2xl font-bold'>{formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0))}</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Overdue</p>
          <p className='text-2xl font-bold text-rose-500'>{formatCurrency(invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0))}</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>Total Invoices</p>
          <p className='text-2xl font-bold'>{invoices.length}</p>
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
                <TableCell className='font-mono text-sm'>{invoice.reference}</TableCell>
                <TableCell>{invoice.customer?.name || 'N/A'}</TableCell>
                <TableCell className='font-medium'>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>
                  <Badge variant='outline' className={statusStyles[invoice.status]}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>{invoice.due_date || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVerticalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleDownloadPDF(invoice.id, invoice.reference)} disabled={downloadingId === invoice.id}>
                        {downloadingId === invoice.id ? (
                          <><Loader2Icon className='mr-2 size-4 animate-spin' />Generating...</>
                        ) : (
                          <><DownloadIcon className='mr-2 size-4' />Download PDF</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      </>
      )}
    </PageLayout>
  )
}
