'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ScanBarcodeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  Volume2Icon,
  VolumeXIcon,
  Loader2Icon
} from 'lucide-react'

interface ScanEvent {
  id: string
  shipment_id: string
  shipment?: { reference: string; consignee_name: string }
  warehouse?: { name: string; code: string }
  status: string
  notes: string | null
  scanned_at: string
  scanStatus?: 'success' | 'duplicate' | 'error'
}

export default function ScanningPage() {
  const [barcode, setBarcode] = useState('')
  const [scanStatus, setScanStatus] = useState<'picked_up' | 'in_transit' | 'at_hub' | 'out_for_delivery'>('picked_up')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [stats, setStats] = useState({ total: 0, success: 0, duplicate: 0, error: 0 })

  const fetchScanEvents = async () => {
    try {
      const response = await fetch('/api/scan?limit=20')
      if (!response.ok) throw new Error('Failed to fetch scan events')
      const data = await response.json()
      setScanEvents(data.scanEvents || [])
    } catch (error) {
      console.error('Failed to load scan events:', error)
    }
  }

  useEffect(() => {
    fetchScanEvents()
  }, [])

  const handleScan = async () => {
    if (!barcode.trim()) return
    
    setIsScanning(true)
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: barcode.trim(),
          status: scanStatus,
          notes: `Scanned via web interface - ${scanStatus}`,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Scan successful', {
          description: `${data.shipment.reference} - ${scanStatus}`,
        })
        // Audio feedback removed - files not available
        setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }))
        fetchScanEvents()
      } else if (response.status === 409) {
        toast.warning('Duplicate scan', {
          description: data.message,
        })
        // Audio feedback removed - files not available
        setStats(prev => ({ ...prev, total: prev.total + 1, duplicate: prev.duplicate + 1 }))
      } else {
        toast.error('Scan failed', {
          description: data.error || 'Invalid barcode',
        })
        // Audio feedback removed - files not available
        setStats(prev => ({ ...prev, total: prev.total + 1, error: prev.error + 1 }))
      }
    } catch (error) {
      toast.error('Scan failed', {
        description: 'Network error',
      })
      setStats(prev => ({ ...prev, total: prev.total + 1, error: prev.error + 1 }))
    } finally {
      setBarcode('')
      setIsScanning(false)
    }
  }

  const getStatusIcon = (scanStatus?: 'success' | 'duplicate' | 'error') => {
    switch (scanStatus) {
      case 'success':
        return <CheckCircleIcon className='size-5 text-emerald-500' />
      case 'duplicate':
        return <AlertCircleIcon className='size-5 text-amber-500' />
      case 'error':
        return <XCircleIcon className='size-5 text-rose-500' />
      default:
        return <CheckCircleIcon className='size-5 text-emerald-500' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'in_transit':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'at_hub':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'out_for_delivery':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <PageLayout
      title='Barcode Scanning'
      description='Scan packages for manifest processing'
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Scanner</CardTitle>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2Icon className='size-4' />
                  ) : (
                    <VolumeXIcon className='size-4' />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Scan Status</label>
                <Select value={scanStatus} onValueChange={(value: any) => setScanStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='picked_up'>Picked Up</SelectItem>
                    <SelectItem value='in_transit'>In Transit</SelectItem>
                    <SelectItem value='at_hub'>At Hub</SelectItem>
                    <SelectItem value='out_for_delivery'>Out for Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Barcode</label>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <ScanBarcodeIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder='Scan or enter barcode...'
                      value={barcode}
                      onChange={e => setBarcode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleScan()}
                      className='pl-9 font-mono'
                      autoFocus
                    />
                  </div>
                  <Button onClick={handleScan} disabled={isScanning}>
                    {isScanning ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Scanning...</> : 'Scan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {scanEvents.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>No scan events yet</p>
                ) : (
                  scanEvents.map(event => (
                    <div
                      key={event.id}
                      className='flex items-center gap-3 rounded-lg border border-border p-3'
                    >
                      {getStatusIcon(event.scanStatus)}
                      <div className='flex-1'>
                        <p className='font-mono text-sm font-medium'>{event.shipment?.reference || 'Unknown'}</p>
                        <p className='text-sm text-muted-foreground'>{event.notes || event.shipment?.consignee_name}</p>
                      </div>
                      <div className='text-right'>
                        <Badge variant='outline' className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {new Date(event.scanned_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Total Scans</span>
                <span className='text-2xl font-bold'>{stats.total}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Successful</span>
                <span className='text-xl font-bold text-emerald-500'>{stats.success}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Duplicates</span>
                <span className='text-xl font-bold text-amber-500'>{stats.duplicate}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Errors</span>
                <span className='text-xl font-bold text-rose-500'>{stats.error}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Recent Scans</p>
                <p className='font-medium text-2xl'>{scanEvents.length}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Success Rate</p>
                <p className='font-medium text-2xl'>
                  {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Current Status</p>
                <Badge variant='outline' className={getStatusColor(scanStatus)}>
                  {scanStatus.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
