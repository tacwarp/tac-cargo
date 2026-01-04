'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { MessageSquareIcon, SendIcon, Loader2Icon, StarIcon } from 'lucide-react'

export default function FeedbackPage() {
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async () => {
    if (!formData.category || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: rating || null,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }
      
      toast.success('Feedback submitted successfully! Thank you for your input.')
      setFormData({ category: '', subject: '', message: '' })
      setRating(0)
    } catch {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout
      title='Feedback'
      description='Help us improve TAC Cargo with your valuable feedback'
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageSquareIcon className='size-5' />
                Submit Feedback
              </CardTitle>
              <CardDescription>
                Share your experience, report issues, or suggest improvements
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bug'>Bug Report</SelectItem>
                    <SelectItem value='feature'>Feature Request</SelectItem>
                    <SelectItem value='improvement'>Improvement</SelectItem>
                    <SelectItem value='general'>General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder='Brief description of your feedback'
                />
              </div>

              <div>
                <Label>Rating (Optional)</Label>
                <div className='flex gap-1 mt-2'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      className='p-1 hover:scale-110 transition-transform'
                    >
                      <StarIcon
                        className={`size-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder='Describe your feedback in detail...'
                  rows={6}
                />
              </div>

              <Button onClick={handleSubmit} disabled={submitting} className='w-full'>
                {submitting ? (
                  <>
                    <Loader2Icon className='mr-2 size-4 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon className='mr-2 size-4' />
                    Submit Feedback
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground space-y-3'>
              <p>For bug reports, please include:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>Steps to reproduce the issue</li>
                <li>Expected vs actual behavior</li>
                <li>Browser and device info</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground space-y-2'>
              <p>For urgent issues, contact us directly:</p>
              <p className='font-medium text-foreground'>support@taccargo.com</p>
              <p className='font-medium text-foreground'>+91 1800-XXX-XXXX</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
