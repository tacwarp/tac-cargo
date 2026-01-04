'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { 
  ArrowLeftIcon, 
  Loader2Icon, 
  PackageIcon, 
  ScanBarcodeIcon,
  Trash2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlaneIcon,
  TruckIcon,
  ZapIcon
} from 'lucide-react'
import Link from 'next/link'
import { generateManifestNumber } from '@/lib/barcode/generator'
import { validateAWB } from '@/lib/barcode/generator'

interface Warehouse {
  id: string
  name: string
  code: string
}

interface ScannedShipment {
  id: string
  awb: string
  consigneeName: string
  destination: string
  weight: number
  pieces: number
  scannedAt: Date
}

export default function NewManifestPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [scannedShipments, setScannedShipments] = useState<ScannedShipment[]>([])
  const [scanInput, setScanInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const scanInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState(() => ({
    manifest_no: generateManifestNumber(),
    origin_warehouse_id: '',
    destination_warehouse_id: '',
    transport_mode: 'surface' as 'air' | 'surface' | 'express',
    carrier_name: '',
    vehicle_number: '',
    driver_name: '',
    driver_phone: '',
    flight_number: '',
    notes: '',
  }))

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

  // Calculate totals from scanned shipments
  const totals = {
    totalShipments: scannedShipments.length,
    totalPieces: scannedShipments.reduce((sum, s) => sum + s.pieces, 0),
    totalWeight: scannedShipments.reduce((sum, s) => sum + s.weight, 0)
  }

  // Handle barcode scan
  const handleScan = async () => {
    if (!scanInput.trim()) return
    
    const awb = scanInput.trim().toUpperCase()
    
    // Check if already scanned
    if (scannedShipments.some(s => s.awb === awb)) {
      toast.warning('Duplicate scan', { description: `${awb} is already in this manifest` })
      setScanInput('')
      scanInputRef.current?.focus()
      return
    }
    
    // Validate AWB format
    const validation = validateAWB(awb)
    if (!validation.valid) {
      toast.error('Invalid AWB', { description: validation.error })
      setScanInput('')
      scanInputRef.current?.focus()
      return
    }
    
    setIsScanning(true)
    try {
      // Fetch shipment details from API
      const response = await fetch(`/api/shipments/awb/${awb}`)
      
      if (!response.ok) {
        toast.error('Shipment not found', { description: `AWB ${awb} does not exist in the system` })
        return
      } else {
        const data = await response.json()
        const shipment: ScannedShipment = {
          id: data.id,
          awb: data.awb_no,
          consigneeName: data.consignee_name,
          destination: data.consignee_city,
          weight: data.chargeable_weight || 0,
          pieces: data.total_pieces || 1,
          scannedAt: new Date()
        }
        setScannedShipments(prev => [...prev, shipment])
        toast.success('Shipment added', { description: `${awb} added to manifest` })
      }
    } catch {
      toast.error('Failed to fetch shipment')
    } finally {
      setScanInput('')
      setIsScanning(false)
      scanInputRef.current?.focus()
    }
  }

  const removeShipment = (awb: string) => {
    setScannedShipments(prev => prev.filter(s => s.awb !== awb))
    toast.info('Shipment removed')
  }

  const handleSubmit = async () => {
    if (!formData.origin_warehouse_id || !formData.destination_warehouse_id) {
      toast.error('Please select origin and destination warehouses')
      return
    }
    
    if (scannedShipments.length === 0) {
      toast.error('Please scan at least one shipment')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        shipments: scannedShipments.map(s => s.id),
        total_shipments: totals.totalShipments,
        total_pieces: totals.totalPieces,
        total_weight: totals.totalWeight
      }
      
      const response = await fetch('/api/manifests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const getModeIcon = () => {
    switch (formData.transport_mode) {
      case 'air': return <PlaneIcon className='size-4 text-blue-500' />
      case 'express': return <ZapIcon className='size-4 text-amber-500' />
      default: return <TruckIcon className='size-4 text-emerald-500' />
    }
  }

  return (
    <PageLayout
      title='Create Manifest'
      description='Scan shipments to build manifest'
      badge={formData.manifest_no}
      actions={
        <Button variant='outline' asChild>
          <Link href='/dashboard/manifests'>
            <ArrowLeftIcon className='mr-2 size-4' />
            Back
          </Link>
        </Button>
      }
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column - Manifest Details & Scanner */}
        <div className='space-y-6'>
          {/* Manifest Info */}
          <Card className='depth-surface'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                  {getModeIcon()}
                </div>
                <div>
                  <CardTitle className='text-base'>Manifest Details</CardTitle>
                  <CardDescription className='font-mono text-xs'>{formData.manifest_no}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4'>
                <div>
                  <Label className='text-xs'>Transport Mode</Label>
                  <Select
                    value={formData.transport_mode}
                    onValueChange={(value: 'air' | 'surface' | 'express') => setFormData({ ...formData, transport_mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='surface'>
                        <div className='flex items-center gap-2'>
                          <TruckIcon className='size-4' />
                          Surface (Road)
                        </div>
                      </SelectItem>
                      <SelectItem value='air'>
                        <div className='flex items-center gap-2'>
                          <PlaneIcon className='size-4' />
                          Air Cargo
                        </div>
                      </SelectItem>
                      <SelectItem value='express'>
                        <div className='flex items-center gap-2'>
                          <ZapIcon className='size-4' />
                          Express
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className='text-xs'>Origin</Label>
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
                  <Label className='text-xs'>Destination</Label>
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
                
                {formData.transport_mode === 'air' ? (
                  <div>
                    <Label className='text-xs'>Flight Number</Label>
                    <Input
                      value={formData.flight_number}
                      onChange={e => setFormData({ ...formData, flight_number: e.target.value })}
                      placeholder='e.g., AI-101'
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className='text-xs'>Vehicle Number</Label>
                      <Input
                        value={formData.vehicle_number}
                        onChange={e => setFormData({ ...formData, vehicle_number: e.target.value })}
                        placeholder='e.g., MH-12-AB-1234'
                      />
                    </div>
                    <div>
                      <Label className='text-xs'>Driver Name</Label>
                      <Input
                        value={formData.driver_name}
                        onChange={e => setFormData({ ...formData, driver_name: e.target.value })}
                        placeholder='Driver name'
                      />
                    </div>
                    <div>
                      <Label className='text-xs'>Driver Phone</Label>
                      <Input
                        value={formData.driver_phone}
                        onChange={e => setFormData({ ...formData, driver_phone: e.target.value })}
                        placeholder='+91 XXXXXXXXXX'
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scanner */}
          <Card className='depth-surface border-primary/20'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                  <ScanBarcodeIcon className='size-4' />
                </div>
                <CardTitle className='text-base'>Scan to Add</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <ScanBarcodeIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    ref={scanInputRef}
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                    placeholder='Scan AWB barcode...'
                    className='pl-9 font-mono'
                    autoFocus
                  />
                </div>
                <Button onClick={handleScan} disabled={isScanning}>
                  {isScanning ? <Loader2Icon className='size-4 animate-spin' /> : 'Add'}
                </Button>
              </div>
              <p className='text-[10px] text-muted-foreground uppercase tracking-wide'>
                Scan package barcode or enter AWB number manually
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className='depth-surface'>
            <CardContent className='pt-6'>
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Shipments</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalShipments}</p>
                </div>
                <div>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Pieces</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalPieces}</p>
                </div>
                <div>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Weight</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalWeight.toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Scanned Shipments */}
        <div className='lg:col-span-2'>
          <Card className='depth-surface h-full'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                    <PackageIcon className='size-4' />
                  </div>
                  <div>
                    <CardTitle className='text-base'>Scanned Shipments</CardTitle>
                    <CardDescription>{scannedShipments.length} shipments in manifest</CardDescription>
                  </div>
                </div>
                {scannedShipments.length > 0 && (
                  <Badge variant='outline' className='font-mono'>
                    {totals.totalWeight.toFixed(1)} kg
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {scannedShipments.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <ScanBarcodeIcon className='size-12 text-muted-foreground/30 mb-4' />
                  <p className='text-sm text-muted-foreground'>No shipments scanned yet</p>
                  <p className='text-xs text-muted-foreground/60 mt-1'>Scan AWB barcodes to add shipments</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>AWB</TableHead>
                      <TableHead>Consignee</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className='text-right'>Pcs</TableHead>
                      <TableHead className='text-right'>Weight</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scannedShipments.map((shipment, index) => (
                      <TableRow key={shipment.awb}>
                        <TableCell className='font-mono text-sm'>
                          <div className='flex items-center gap-2'>
                            <CheckCircleIcon className='size-4 text-success' />
                            {shipment.awb}
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>{shipment.consigneeName}</TableCell>
                        <TableCell className='text-sm'>{shipment.destination}</TableCell>
                        <TableCell className='text-right font-mono'>{shipment.pieces}</TableCell>
                        <TableCell className='text-right font-mono'>{shipment.weight} kg</TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 text-destructive hover:text-destructive'
                            onClick={() => removeShipment(shipment.awb)}
                          >
                            <Trash2Icon className='size-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-4 mt-6'>
        <Button variant='outline' asChild>
          <Link href='/dashboard/manifests'>Cancel</Link>
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || scannedShipments.length === 0}
          className='min-w-[180px]'
        >
          {submitting ? (
            <>
              <Loader2Icon className='mr-2 size-4 animate-spin' />
              Creating...
            </>
          ) : (
            <>
              <CheckCircleIcon className='mr-2 size-4' />
              Finalize Manifest
            </>
          )}
        </Button>
      </div>
    </PageLayout>
  )
}
