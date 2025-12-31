'use client'

import { useState } from 'react'
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
  VolumeXIcon
} from 'lucide-react'

interface ScanEvent {
  id: string
  barcode: string
  status: 'success' | 'duplicate' | 'error'
  timestamp: string
  message: string
}

export default function ScanningPage() {
  const [barcode, setBarcode] = useState('')
  const [manifest, setManifest] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([
    { id: '1', barcode: 'AWB-IMF-2512-0045', status: 'success', timestamp: '14:32:15', message: 'Package added to manifest' },
    { id: '2', barcode: 'AWB-IMF-2512-0044', status: 'success', timestamp: '14:31:58', message: 'Package added to manifest' },
    { id: '3', barcode: 'AWB-IMF-2512-0043', status: 'duplicate', timestamp: '14:31:42', message: 'Already scanned' },
    { id: '4', barcode: 'AWB-IMF-2512-0042', status: 'success', timestamp: '14:31:25', message: 'Package added to manifest' },
    { id: '5', barcode: 'INVALID-CODE', status: 'error', timestamp: '14:30:58', message: 'Invalid barcode format' }
  ])

  const handleScan = () => {
    if (!barcode.trim()) return

    const newEvent: ScanEvent = {
      id: Date.now().toString(),
      barcode: barcode,
      status: barcode.startsWith('AWB') ? 'success' : 'error',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: barcode.startsWith('AWB') ? 'Package added to manifest' : 'Invalid barcode format'
    }

    setScanEvents([newEvent, ...scanEvents])
    setBarcode('')
  }

  const getStatusIcon = (status: ScanEvent['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className='size-5 text-emerald-500' />
      case 'duplicate':
        return <AlertCircleIcon className='size-5 text-amber-500' />
      case 'error':
        return <XCircleIcon className='size-5 text-rose-500' />
    }
  }

  const getStatusColor = (status: ScanEvent['status']) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'duplicate':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'error':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
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
                <label className='text-sm font-medium'>Target Manifest</label>
                <Select value={manifest} onValueChange={setManifest}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select manifest' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MFT-AIR-2512-003'>MFT-AIR-2512-003 → Mumbai</SelectItem>
                    <SelectItem value='MFT-SRF-2512-004'>MFT-SRF-2512-004 → Kolkata</SelectItem>
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
                  <Button onClick={handleScan}>Scan</Button>
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
                {scanEvents.map(event => (
                  <div
                    key={event.id}
                    className='flex items-center gap-3 rounded-lg border border-border p-3'
                  >
                    {getStatusIcon(event.status)}
                    <div className='flex-1'>
                      <p className='font-mono text-sm font-medium'>{event.barcode}</p>
                      <p className='text-sm text-muted-foreground'>{event.message}</p>
                    </div>
                    <div className='text-right'>
                      <Badge variant='outline' className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      <p className='mt-1 text-xs text-muted-foreground'>{event.timestamp}</p>
                    </div>
                  </div>
                ))}
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
                <span className='text-2xl font-bold'>47</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Successful</span>
                <span className='text-xl font-bold text-emerald-500'>43</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Duplicates</span>
                <span className='text-xl font-bold text-amber-500'>3</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Errors</span>
                <span className='text-xl font-bold text-rose-500'>1</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Manifest</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Manifest #</p>
                <p className='font-mono font-medium'>MFT-AIR-2512-003</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Destination</p>
                <p className='font-medium'>Mumbai</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Packages</p>
                <p className='font-medium'>28 / 50</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Weight</p>
                <p className='font-medium'>76.8 kg</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
