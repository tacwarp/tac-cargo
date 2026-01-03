'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MailIcon, PhoneIcon, MessageSquareIcon, Loader2Icon } from 'lucide-react'

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.category || !formData.message) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Support ticket submitted successfully')
      setFormData({ subject: '', category: '', priority: 'medium', message: '' })
    } catch (error) {
      toast.error('Failed to submit support ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title='Support'
      description='Get help with your TAC Cargo account'
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Submit Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <Label htmlFor='subject'>Subject *</Label>
                  <Input
                    id='subject'
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder='Brief description of your issue'
                    required
                  />
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='category'>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={value => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='technical'>Technical Issue</SelectItem>
                        <SelectItem value='billing'>Billing</SelectItem>
                        <SelectItem value='shipment'>Shipment Inquiry</SelectItem>
                        <SelectItem value='account'>Account Management</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='priority'>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={value => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='low'>Low</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='urgent'>Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor='message'>Message *</Label>
                  <Textarea
                    id='message'
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder='Describe your issue in detail...'
                    rows={6}
                    required
                  />
                </div>

                <Button type='submit' disabled={loading} className='w-full'>
                  {loading ? (
                    <>
                      <Loader2Icon className='mr-2 size-4 animate-spin' />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquareIcon className='mr-2 size-4' />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-3'>
                <MailIcon className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='font-medium'>Email Support</p>
                  <p className='text-sm text-muted-foreground'>support@taccargo.com</p>
                  <p className='text-xs text-muted-foreground mt-1'>Response within 24 hours</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <PhoneIcon className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='font-medium'>Phone Support</p>
                  <p className='text-sm text-muted-foreground'>+91 1800 123 4567</p>
                  <p className='text-xs text-muted-foreground mt-1'>Mon-Fri, 9 AM - 6 PM IST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button variant='ghost' className='w-full justify-start' asChild>
                <a href='#'>Documentation</a>
              </Button>
              <Button variant='ghost' className='w-full justify-start' asChild>
                <a href='#'>FAQ</a>
              </Button>
              <Button variant='ghost' className='w-full justify-start' asChild>
                <a href='#'>Video Tutorials</a>
              </Button>
              <Button variant='ghost' className='w-full justify-start' asChild>
                <a href='#'>API Reference</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
