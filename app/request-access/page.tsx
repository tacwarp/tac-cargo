'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiMailLine, RiUserLine, RiBuilding2Line, RiPhoneLine } from '@remixicon/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function RequestAccessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to actual API endpoint
      const response = await fetch('/api/access-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit request')
      }
      
      toast.success('Request Submitted', {
        description: 'Our team will contact you within 24 hours.',
      })

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      console.error('Access request error:', error)
      toast.error('Submission Failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group'
          >
            <RiArrowLeftLine className='size-4 group-hover:-translate-x-1 transition-transform' />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className='depth-surface noise-overlay border-none'>
            <CardHeader className='text-center pb-6'>
              <CardTitle className='text-3xl font-bold mb-2'>Request Access</CardTitle>
              <p className='text-muted-foreground'>
                Get started with TAC Cargo. Fill out the form below and our team will reach out to you.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='text-xs font-bold uppercase tracking-wider'>
                      Full Name *
                    </Label>
                    <div className='relative'>
                      <RiUserLine className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground' />
                      <Input
                        id='name'
                        name='name'
                        placeholder='John Doe'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='pl-10'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-xs font-bold uppercase tracking-wider'>
                      Email Address *
                    </Label>
                    <div className='relative'>
                      <RiMailLine className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground' />
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='john@company.com'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='pl-10'
                      />
                    </div>
                  </div>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='company' className='text-xs font-bold uppercase tracking-wider'>
                      Company Name *
                    </Label>
                    <div className='relative'>
                      <RiBuilding2Line className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground' />
                      <Input
                        id='company'
                        name='company'
                        placeholder='Acme Corporation'
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className='pl-10'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='text-xs font-bold uppercase tracking-wider'>
                      Phone Number *
                    </Label>
                    <div className='relative'>
                      <RiPhoneLine className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground' />
                      <Input
                        id='phone'
                        name='phone'
                        type='tel'
                        placeholder='+91 98765 43210'
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className='pl-10'
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message' className='text-xs font-bold uppercase tracking-wider'>
                    Tell us about your needs
                  </Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='What are your logistics requirements? How many shipments per month? Any specific features you need?'
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className='resize-none'
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full btn-primary h-12'
                >
                  {isSubmitting ? (
                    <>
                      <div className='mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                      Submitting Request...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>

                <p className='text-xs text-center text-muted-foreground'>
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  Our team typically responds within 24 hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
