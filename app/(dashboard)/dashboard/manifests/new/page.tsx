'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeftIcon, Loader2Icon, PackageIcon } from 'lucide-react'
import Link from 'next/link'

interface Warehouse {
  id: string
  name: string
  code: string
}

export default function NewManifestPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [formData, setFormData] = useState({
    origin_warehouse_id: '',
    destination_warehouse_id: '',
    transport_mode: 'surface' as 'air' | 'surface' | 'express',
    carrier_name: '',
    vehicle_number: '',
    flight_number: '',
    notes: '',
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses')
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data.warehouses || [])
      }
    } catch {
      console.error('Failed to fetch warehouses')
    }
  }

  const handleSubmit = async () => {
    if (!formData.origin_warehouse_id || !formData.destination_warehouse_id) {
      toast.error('Please select origin and destination warehouses')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/manifests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create manifest')

      toast.success('Manifest created successfully')
      router.push('/dashboard/manifests')
    } catch {
      toast.error('Failed to create manifest')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout
      title='Create New Manifest'
      description='Create a new shipping manifest for bulk shipments'
      actions={
        <Button variant='outline' asChild>
          <Link href='/dashboard/manifests'>
            <ArrowLeftIcon className='mr-2 size-4' />
            Back to Manifests
          </Link>
        </Button>
      }
    >
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <PackageIcon className='size-5' />
            Manifest Details
          </CardTitle>
          <CardDescription>
            Fill in the details for the new manifest
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='origin'>Origin Warehouse</Label>
              <Select
                value={formData.origin_warehouse_id}
                onValueChange={value => setFormData({ ...formData, origin_warehouse_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select origin' />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='destination'>Destination Warehouse</Label>
              <Select
                value={formData.destination_warehouse_id}
                onValueChange={value => setFormData({ ...formData, destination_warehouse_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select destination' />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='transport_mode'>Transport Mode</Label>
            <Select
              value={formData.transport_mode}
              onValueChange={(value: 'air' | 'surface' | 'express') => setFormData({ ...formData, transport_mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='surface'>Surface</SelectItem>
                <SelectItem value='air'>Air</SelectItem>
                <SelectItem value='express'>Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='carrier_name'>Carrier Name</Label>
            <Input
              id='carrier_name'
              value={formData.carrier_name}
              onChange={e => setFormData({ ...formData, carrier_name: e.target.value })}
              placeholder='Enter carrier/transporter name'
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='vehicle_number'>Vehicle Number</Label>
              <Input
                id='vehicle_number'
                value={formData.vehicle_number}
                onChange={e => setFormData({ ...formData, vehicle_number: e.target.value })}
                placeholder='e.g., MH-12-AB-1234'
              />
            </div>
            <div>
              <Label htmlFor='flight_number'>Flight Number (if air)</Label>
              <Input
                id='flight_number'
                value={formData.flight_number}
                onChange={e => setFormData({ ...formData, flight_number: e.target.value })}
                placeholder='e.g., AI-101'
                disabled={formData.transport_mode !== 'air'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor='notes'>Notes</Label>
            <Textarea
              id='notes'
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder='Additional notes or instructions...'
              rows={3}
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <Button variant='outline' asChild className='flex-1'>
              <Link href='/dashboard/manifests'>Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className='flex-1'>
              {submitting ? (
                <>
                  <Loader2Icon className='mr-2 size-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Manifest'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
