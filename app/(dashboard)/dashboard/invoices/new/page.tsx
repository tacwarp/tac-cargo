'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    payment_terms: 'Net 30',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer_id || !formData.due_date) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create invoice')

      const data = await response.json()
      toast.success('Invoice created successfully')
      router.push(`/dashboard/invoices`)
    } catch (error) {
      toast.error('Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title='Create Invoice'
      description='Generate a new invoice for a customer'
      actions={
        <Button variant='outline' asChild>
          <Link href='/dashboard/invoices'>
            <ArrowLeftIcon className='mr-2 size-4' />
            Back to Invoices
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='customer_id'>Customer ID *</Label>
                <Input
                  id='customer_id'
                  value={formData.customer_id}
                  onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                  placeholder='Enter customer UUID'
                  required
                />
              </div>

              <div>
                <Label htmlFor='invoice_date'>Invoice Date *</Label>
                <Input
                  id='invoice_date'
                  type='date'
                  value={formData.invoice_date}
                  onChange={e => setFormData({ ...formData, invoice_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor='due_date'>Due Date *</Label>
                <Input
                  id='due_date'
                  type='date'
                  value={formData.due_date}
                  onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor='payment_terms'>Payment Terms</Label>
                <Input
                  id='payment_terms'
                  value={formData.payment_terms}
                  onChange={e => setFormData({ ...formData, payment_terms: e.target.value })}
                  placeholder='e.g., Net 30'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder='Add any additional notes...'
                rows={4}
              />
            </div>

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/invoices')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className='mr-2 size-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
