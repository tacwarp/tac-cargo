'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { shipmentSchema, type ShipmentFormData } from '@/lib/schemas/shipment'
import { ArrowLeftIcon, PackageIcon, TruckIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export default function NewShipmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      pieces: 1,
      weight_kg: 0,
      transport_mode: 'surface',
    },
  })

  const onSubmit = async (data: ShipmentFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create shipment')
      }

      const result = await response.json()
      toast.success('Shipment Created', {
        description: `Shipment ${result.reference} has been created successfully.`,
      })

      router.push('/dashboard/shipments')
      router.refresh()
    } catch (error) {
      toast.error('Creation Failed', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout
      title='Create New Shipment'
      description='Initialize a new freight shipment'
      actions={
        <Button variant='outline' asChild>
          <Link href='/dashboard/shipments'>
            <ArrowLeftIcon className='mr-2 size-4' />
            Back to Shipments
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='depth-surface noise-overlay border-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest'>
              <PackageIcon className='size-4' />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='reference' className='text-xs font-bold uppercase tracking-wider'>
                  Shipment Reference *
                </Label>
                <Input
                  id='reference'
                  placeholder='SHP-IMF-2601-0001'
                  {...register('reference')}
                  className={errors.reference ? 'border-destructive' : ''}
                />
                {errors.reference && (
                  <p className='text-xs text-destructive'>{errors.reference.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='customer_id' className='text-xs font-bold uppercase tracking-wider'>
                  Customer ID *
                </Label>
                <Input
                  id='customer_id'
                  placeholder='UUID of customer'
                  {...register('customer_id')}
                  className={errors.customer_id ? 'border-destructive' : ''}
                />
                {errors.customer_id && (
                  <p className='text-xs text-destructive'>{errors.customer_id.message}</p>
                )}
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='weight_kg' className='text-xs font-bold uppercase tracking-wider'>
                  Weight (kg) *
                </Label>
                <Input
                  id='weight_kg'
                  type='number'
                  step='0.01'
                  placeholder='25.5'
                  {...register('weight_kg', { valueAsNumber: true })}
                  className={errors.weight_kg ? 'border-destructive' : ''}
                />
                {errors.weight_kg && (
                  <p className='text-xs text-destructive'>{errors.weight_kg.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='pieces' className='text-xs font-bold uppercase tracking-wider'>
                  Number of Pieces *
                </Label>
                <Input
                  id='pieces'
                  type='number'
                  placeholder='1'
                  {...register('pieces', { valueAsNumber: true })}
                  className={errors.pieces ? 'border-destructive' : ''}
                />
                {errors.pieces && (
                  <p className='text-xs text-destructive'>{errors.pieces.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='depth-surface noise-overlay border-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest'>
              <TruckIcon className='size-4' />
              Transport Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='origin_warehouse_id' className='text-xs font-bold uppercase tracking-wider'>
                  Origin Warehouse *
                </Label>
                <Input
                  id='origin_warehouse_id'
                  placeholder='UUID of origin warehouse'
                  {...register('origin_warehouse_id')}
                  className={errors.origin_warehouse_id ? 'border-destructive' : ''}
                />
                {errors.origin_warehouse_id && (
                  <p className='text-xs text-destructive'>{errors.origin_warehouse_id.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='destination_warehouse_id' className='text-xs font-bold uppercase tracking-wider'>
                  Destination Warehouse *
                </Label>
                <Input
                  id='destination_warehouse_id'
                  placeholder='UUID of destination warehouse'
                  {...register('destination_warehouse_id')}
                  className={errors.destination_warehouse_id ? 'border-destructive' : ''}
                />
                {errors.destination_warehouse_id && (
                  <p className='text-xs text-destructive'>{errors.destination_warehouse_id.message}</p>
                )}
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='transport_mode' className='text-xs font-bold uppercase tracking-wider'>
                  Transport Mode *
                </Label>
                <Select
                  onValueChange={(value) => setValue('transport_mode', value as any)}
                  defaultValue='surface'
                >
                  <SelectTrigger className={errors.transport_mode ? 'border-destructive' : ''}>
                    <SelectValue placeholder='Select transport mode' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='air'>Air Cargo</SelectItem>
                    <SelectItem value='surface'>Surface Transport</SelectItem>
                    <SelectItem value='express'>Express Delivery</SelectItem>
                    <SelectItem value='economy'>Economy Service</SelectItem>
                  </SelectContent>
                </Select>
                {errors.transport_mode && (
                  <p className='text-xs text-destructive'>{errors.transport_mode.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='service_level_id' className='text-xs font-bold uppercase tracking-wider'>
                  Service Level ID *
                </Label>
                <Input
                  id='service_level_id'
                  placeholder='UUID of service level'
                  {...register('service_level_id')}
                  className={errors.service_level_id ? 'border-destructive' : ''}
                />
                {errors.service_level_id && (
                  <p className='text-xs text-destructive'>{errors.service_level_id.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='depth-surface noise-overlay border-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest'>
              <UserIcon className='size-4' />
              Consignee Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='consignee_name' className='text-xs font-bold uppercase tracking-wider'>
                  Consignee Name *
                </Label>
                <Input
                  id='consignee_name'
                  placeholder='John Doe'
                  {...register('consignee_name')}
                  className={errors.consignee_name ? 'border-destructive' : ''}
                />
                {errors.consignee_name && (
                  <p className='text-xs text-destructive'>{errors.consignee_name.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='consignee_phone' className='text-xs font-bold uppercase tracking-wider'>
                  Phone Number *
                </Label>
                <Input
                  id='consignee_phone'
                  placeholder='+919876543210'
                  {...register('consignee_phone')}
                  className={errors.consignee_phone ? 'border-destructive' : ''}
                />
                {errors.consignee_phone && (
                  <p className='text-xs text-destructive'>{errors.consignee_phone.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='consignee_email' className='text-xs font-bold uppercase tracking-wider'>
                Email Address
              </Label>
              <Input
                id='consignee_email'
                type='email'
                placeholder='john@example.com'
                {...register('consignee_email')}
                className={errors.consignee_email ? 'border-destructive' : ''}
              />
              {errors.consignee_email && (
                <p className='text-xs text-destructive'>{errors.consignee_email.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='consignee_address' className='text-xs font-bold uppercase tracking-wider'>
                Delivery Address *
              </Label>
              <Textarea
                id='consignee_address'
                placeholder='123 Main Street, Building A, Floor 2'
                rows={3}
                {...register('consignee_address')}
                className={errors.consignee_address ? 'border-destructive' : ''}
              />
              {errors.consignee_address && (
                <p className='text-xs text-destructive'>{errors.consignee_address.message}</p>
              )}
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='consignee_city' className='text-xs font-bold uppercase tracking-wider'>
                  City *
                </Label>
                <Input
                  id='consignee_city'
                  placeholder='Mumbai'
                  {...register('consignee_city')}
                  className={errors.consignee_city ? 'border-destructive' : ''}
                />
                {errors.consignee_city && (
                  <p className='text-xs text-destructive'>{errors.consignee_city.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='consignee_state' className='text-xs font-bold uppercase tracking-wider'>
                  State *
                </Label>
                <Input
                  id='consignee_state'
                  placeholder='Maharashtra'
                  {...register('consignee_state')}
                  className={errors.consignee_state ? 'border-destructive' : ''}
                />
                {errors.consignee_state && (
                  <p className='text-xs text-destructive'>{errors.consignee_state.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='consignee_pincode' className='text-xs font-bold uppercase tracking-wider'>
                  Pincode *
                </Label>
                <Input
                  id='consignee_pincode'
                  placeholder='400001'
                  {...register('consignee_pincode')}
                  className={errors.consignee_pincode ? 'border-destructive' : ''}
                />
                {errors.consignee_pincode && (
                  <p className='text-xs text-destructive'>{errors.consignee_pincode.message}</p>
                )}
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='declared_value' className='text-xs font-bold uppercase tracking-wider'>
                  Declared Value (₹)
                </Label>
                <Input
                  id='declared_value'
                  type='number'
                  step='0.01'
                  placeholder='50000'
                  {...register('declared_value', { valueAsNumber: true })}
                  className={errors.declared_value ? 'border-destructive' : ''}
                />
                {errors.declared_value && (
                  <p className='text-xs text-destructive'>{errors.declared_value.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes' className='text-xs font-bold uppercase tracking-wider'>
                Additional Notes
              </Label>
              <Textarea
                id='notes'
                placeholder='Special handling instructions, fragile items, etc.'
                rows={3}
                {...register('notes')}
                className={errors.notes ? 'border-destructive' : ''}
              />
              {errors.notes && (
                <p className='text-xs text-destructive'>{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='flex items-center justify-end gap-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting} className='btn-primary'>
            {isSubmitting ? (
              <>
                <div className='mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                Creating...
              </>
            ) : (
              'Create Shipment'
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  )
}
