'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  SearchIcon,
  TruckIcon,
  ClockIcon,
  PackageIcon,
  MapPinIcon,
  Loader2Icon,
  AlertCircleIcon
} from 'lucide-react'

interface TrackingEvent {
  id: string
  status: string
  location: string
  scanned_at: string
  notes: string | null
  warehouse: {
    code: string
    name: string
    city: string
  } | null
}

interface ShipmentData {
  reference: string
  status: string
  transport_mode: string
  weight: number
  pieces: number
  description: string | null
  eta: string | null
  delivered_at: string | null
  created_at: string
  consignee_name: string | null
  consignee_address: string | null
  consignee_phone: string | null
  origin: {
    code: string
    name: string
    city: string
    state: string
  }
  destination: {
    code: string
    name: string
    city: string
    state: string
  }
  customer: {
    name: string
    phone: string
    email: string | null
  }
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const initialAwb = searchParams.get('awb') || ''
  
  const [trackingNumber, setTrackingNumber] = useState(initialAwb)
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return
    
    setLoading(true)
    setError(null)
    setSearched(true)
    
    try {
      const response = await fetch(`/api/track?awb=${encodeURIComponent(trackingNumber.trim())}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Shipment not found')
        setShipment(null)
        setEvents([])
      } else {
        setShipment(data.shipment)
        setEvents(data.events || [])
      }
    } catch {
      setError('Failed to fetch tracking data')
      setShipment(null)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialAwb) {
      handleTrack()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAwb])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'bg-warning/10 text-warning',
      'picked_up': 'bg-primary/10 text-primary',
      'in_transit': 'bg-primary/10 text-primary',
      'at_hub': 'bg-secondary/10 text-secondary',
      'out_for_delivery': 'bg-warning/10 text-warning',
      'delivered': 'bg-success/10 text-success',
      'cancelled': 'bg-destructive/10 text-destructive',
      'exception': 'bg-destructive/10 text-destructive'
    }
    return statusMap[status] || 'bg-muted text-muted-foreground'
  }

  const mapStatusToBadge = (status: string): 'pending' | 'delivered' | 'cancelled' | 'exception' | 'delayed' | 'scanned' | 'in-transit' | 'arrived' => {
    const mapping: Record<string, 'pending' | 'delivered' | 'cancelled' | 'exception' | 'delayed' | 'scanned' | 'in-transit' | 'arrived'> = {
      'pending': 'pending',
      'picked_up': 'scanned',
      'in_transit': 'in-transit',
      'at_hub': 'arrived',
      'out_for_delivery': 'in-transit',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'exception': 'exception'
    }
    return mapping[status] || 'pending'
  }

  return (
    <>
      <Card>
        <CardContent className='pt-6'>
          <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className='flex gap-4'>
            <div className='relative flex-1'>
              <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Enter AWB number (e.g., TAC-88291)'
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className='pl-9 font-mono uppercase'
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Track'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && searched && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircleIcon className="h-5 w-5" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm text-muted-foreground">Please check the AWB number and try again.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {shipment && (
        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Tracking History</CardTitle>
                <Badge className={getStatusColor(shipment.status || 'pending')}>
                  {shipment.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className='relative space-y-0'>
                  {events.map((event, index) => (
                    <div key={event.id} className='relative flex gap-4 pb-8 last:pb-0'>
                      {index !== events.length - 1 && (
                        <div className='absolute left-[11px] top-6 h-full w-0.5 bg-border' />
                      )}
                      <div className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {index === 0 ? (
                          <TruckIcon className='size-3' />
                        ) : (
                          <div className='size-2 rounded-full bg-muted-foreground' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium capitalize'>{event.status.replace('_', ' ')}</p>
                          <p className='text-xs text-muted-foreground'>{formatDate(event.scanned_at || '')}</p>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {event.warehouse ? `${event.warehouse.name}, ${event.warehouse.city}` : event.location}
                        </p>
                        {event.notes && <p className='mt-1 text-sm'>{event.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <PackageIcon className="h-12 w-12 mb-4 opacity-50" />
                  <p>No tracking events yet</p>
                  <p className="text-sm">Check back later for updates</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>AWB Number</p>
                  <p className='font-mono font-medium'>{shipment.reference}</p>
                </div>
                <Separator />
                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <StatusBadge status={mapStatusToBadge(shipment.status || 'pending')} className='mt-1' />
                </div>
                <Separator />
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Origin</p>
                    <p className='font-medium'>{shipment.origin?.city || 'N/A'}</p>
                    <p className='text-xs text-muted-foreground'>{shipment.origin?.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Destination</p>
                    <p className='font-medium'>{shipment.destination?.city || 'N/A'}</p>
                    <p className='text-xs text-muted-foreground'>{shipment.destination?.name}</p>
                  </div>
                </div>
                <Separator />
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Weight</p>
                    <p className='font-medium'>{shipment.weight} kg</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Pieces</p>
                    <p className='font-medium'>{shipment.pieces || 1}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className='text-sm text-muted-foreground'>Transport Mode</p>
                  <p className='font-medium capitalize'>{shipment.transport_mode || 'Surface'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Info</CardTitle>
              </CardHeader>
              <CardContent>
                {shipment.eta ? (
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-primary/10'>
                      <ClockIcon className='size-5 text-primary' />
                    </div>
                    <div>
                      <p className='font-medium'>ETA: {formatDate(shipment.eta)}</p>
                      <p className='text-sm text-muted-foreground'>Estimated delivery</p>
                    </div>
                  </div>
                ) : shipment.delivered_at ? (
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-success/10'>
                      <MapPinIcon className='size-5 text-success' />
                    </div>
                    <div>
                      <p className='font-medium text-success'>Delivered</p>
                      <p className='text-sm text-muted-foreground'>{formatDate(shipment.delivered_at)}</p>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-muted'>
                      <ClockIcon className='size-5 text-muted-foreground' />
                    </div>
                    <div>
                      <p className='font-medium'>Pending</p>
                      <p className='text-sm text-muted-foreground'>ETA not available</p>
                    </div>
                  </div>
                )}
                
                {shipment.consignee_name && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <p className='text-sm text-muted-foreground'>Consignee</p>
                      <p className='font-medium'>{shipment.consignee_name}</p>
                      {shipment.consignee_address && (
                        <p className='text-sm text-muted-foreground'>{shipment.consignee_address}</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

export default function TrackingPage() {
  return (
    <PageLayout
      title='Track Shipment'
      description='Real-time package tracking'
    >
      <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <TrackingContent />
      </Suspense>
    </PageLayout>
  )
}
