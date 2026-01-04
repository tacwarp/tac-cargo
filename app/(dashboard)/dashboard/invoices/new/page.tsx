'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PhoneInput } from '@/components/ui/phone-input'
import { StateSelect } from '@/components/ui/state-select'
import { CitySelect } from '@/components/ui/city-select'
import { ShippingLabelPreview } from '@/components/dashboard/shipping-label-preview'
import {
  ArrowLeftIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  PackageIcon,
  BarcodeIcon,
  TruckIcon,
  UserIcon,
  MapPinIcon,
  CalculatorIcon,
  SendIcon,
  PrinterIcon,
  QrCodeIcon
} from 'lucide-react'
import Link from 'next/link'
import { 
  generateAWBNumber, 
  generateInvoiceNumber, 
  generateGS1BarcodeData,
  calculateVolumetricWeight,
  calculateChargeableWeight,
  generateTrackingURL
} from '@/lib/barcode/generator'
import type { TransportMode, PaymentMode } from '@/lib/supabase/database.types'

interface PackageItem {
  id: string
  length: number
  width: number
  height: number
  actualWeight: number
  volumetricWeight: number
  description: string
  declaredValue: number
  packagingType: string
  isFragile: boolean
}

interface FormData {
  // Auto-generated
  invoiceNo: string
  awbNo: string
  barcodeData: string
  trackingUrl: string
  
  // Shipper
  customerId: string
  shipperName: string
  shipperAddress: string
  shipperPhone: string
  shipperGstin: string
  
  // Consignee
  consigneeName: string
  consigneeAddress: string
  consigneeCity: string
  consigneeState: string
  consigneePincode: string
  consigneePhone: string
  consigneeEmail: string
  
  // Shipment
  originWarehouseId: string
  destinationWarehouseId: string
  transportMode: TransportMode
  paymentMode: PaymentMode
  contentDescription: string
  specialInstructions: string
  
  // Dates
  invoiceDate: string
  dueDate: string
  
  // Charges
  freightCharge: number
  pickupCharge: number
  deliveryCharge: number
  packingCharge: number
  insuranceCharge: number
  handlingCharge: number
  otherCharges: number
  
  // Options
  sendWhatsApp: boolean
  sendEmail: boolean
  printLabel: boolean
}

const defaultPackage: PackageItem = {
  id: crypto.randomUUID(),
  length: 0,
  width: 0,
  height: 0,
  actualWeight: 0,
  volumetricWeight: 0,
  description: '',
  declaredValue: 0,
  packagingType: 'box',
  isFragile: false
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [packages, setPackages] = useState<PackageItem[]>([{ ...defaultPackage }])
  const [manualEntry, setManualEntry] = useState(false)
  
  const [formData, setFormData] = useState<FormData>(() => {
    const invoiceNo = generateInvoiceNumber()
    const awbNo = generateAWBNumber()
    const barcodeData = generateGS1BarcodeData({ awb: awbNo })
    const trackingUrl = generateTrackingURL(awbNo)
    
    return {
      invoiceNo,
      awbNo,
      barcodeData,
      trackingUrl,
      customerId: '',
      shipperName: '',
      shipperAddress: '',
      shipperPhone: '',
      shipperGstin: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeCity: '',
      consigneeState: '',
      consigneePincode: '',
      consigneePhone: '',
      consigneeEmail: '',
      originWarehouseId: '',
      destinationWarehouseId: '',
      transportMode: 'surface',
      paymentMode: 'prepaid',
      contentDescription: '',
      specialInstructions: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      freightCharge: 0,
      pickupCharge: 0,
      deliveryCharge: 0,
      packingCharge: 0,
      insuranceCharge: 0,
      handlingCharge: 0,
      otherCharges: 0,
      sendWhatsApp: true,
      sendEmail: true,
      printLabel: true
    }
  })

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const totalPieces = packages.length
    const totalActualWeight = packages.reduce((sum, pkg) => sum + pkg.actualWeight, 0)
    const totalVolumetricWeight = packages.reduce((sum, pkg) => sum + pkg.volumetricWeight, 0)
    const chargeableWeight = calculateChargeableWeight(totalActualWeight, totalVolumetricWeight)
    const totalDeclaredValue = packages.reduce((sum, pkg) => sum + pkg.declaredValue, 0)
    
    const subtotal = 
      formData.freightCharge +
      formData.pickupCharge +
      formData.deliveryCharge +
      formData.packingCharge +
      formData.insuranceCharge +
      formData.handlingCharge +
      formData.otherCharges
    
    const gstRate = 0.18 // 18% GST
    const totalTax = Math.round(subtotal * gstRate * 100) / 100
    const totalAmount = subtotal + totalTax
    
    return {
      totalPieces,
      totalActualWeight,
      totalVolumetricWeight,
      chargeableWeight,
      totalDeclaredValue,
      subtotal,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0,
      totalTax,
      totalAmount
    }
  }, [packages, formData])

  const totals = calculateTotals()

  // Update package volumetric weight when dimensions change
  const updatePackage = (id: string, updates: Partial<PackageItem>) => {
    setPackages(prev => prev.map(pkg => {
      if (pkg.id !== id) return pkg
      
      const updated = { ...pkg, ...updates }
      
      // Recalculate volumetric weight if dimensions changed
      if ('length' in updates || 'width' in updates || 'height' in updates) {
        updated.volumetricWeight = calculateVolumetricWeight(
          updated.length,
          updated.width,
          updated.height,
          formData.transportMode === 'air' ? 'air' : 'surface'
        )
      }
      
      return updated
    }))
  }

  const addPackage = () => {
    setPackages(prev => [...prev, { ...defaultPackage, id: crypto.randomUUID() }])
  }

  const removePackage = (id: string) => {
    if (packages.length === 1) return
    setPackages(prev => prev.filter(pkg => pkg.id !== id))
  }

  const regenerateAWB = () => {
    const newAwbNo = generateAWBNumber()
    const newInvoiceNo = generateInvoiceNumber()
    setFormData(prev => ({
      ...prev,
      awbNo: newAwbNo,
      invoiceNo: newInvoiceNo,
      barcodeData: generateGS1BarcodeData({ awb: newAwbNo }),
      trackingUrl: generateTrackingURL(newAwbNo)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.consigneeName || !formData.consigneeAddress) {
      toast.error('Please fill all required consignee details')
      return
    }

    if (packages.some(pkg => pkg.actualWeight === 0)) {
      toast.error('Please enter weight for all packages')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        packages,
        ...totals
      }
      
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to create invoice')

      const data = await response.json()
      toast.success('Invoice & AWB created successfully!')
      
      // Handle post-creation actions
      if (formData.printLabel) {
        window.open(`/api/invoices/${data.id}/label`, '_blank')
      }
      
      router.push(`/dashboard/invoices`)
    } catch (error) {
      toast.error('Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <PageLayout
      title='Create Shipment'
      description='Generate invoice & AWB with tracking barcode'
      badge='New'
      actions={
        <Button variant='outline' asChild>
          <Link href='/dashboard/invoices'>
            <ArrowLeftIcon className='mr-2 size-4' />
            Back
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* AWB & Invoice Preview */}
        <Card className='depth-surface border-primary/20 bg-gradient-to-r from-primary/5 to-transparent'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                  <BarcodeIcon className='size-5' />
                </div>
                <div>
                  <CardTitle className='text-lg'>Auto-Generated Identifiers</CardTitle>
                  <CardDescription>AWB & Invoice numbers with GS1 barcode</CardDescription>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Label htmlFor='manual-entry' className='text-xs text-muted-foreground'>Manual Entry</Label>
                <Switch
                  id='manual-entry'
                  checked={manualEntry}
                  onCheckedChange={setManualEntry}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-3'>
              <div className='space-y-2'>
                <Label className='text-[10px] uppercase tracking-widest text-muted-foreground'>AWB Number</Label>
                <div className='flex gap-2'>
                  <Input
                    value={formData.awbNo}
                    onChange={e => manualEntry && setFormData({ ...formData, awbNo: e.target.value })}
                    readOnly={!manualEntry}
                    className='font-mono text-lg font-bold tracking-wide'
                  />
                  {!manualEntry && (
                    <Button type='button' variant='outline' size='icon' onClick={regenerateAWB}>
                      <QrCodeIcon className='size-4' />
                    </Button>
                  )}
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-[10px] uppercase tracking-widest text-muted-foreground'>Invoice Number</Label>
                <Input
                  value={formData.invoiceNo}
                  onChange={e => manualEntry && setFormData({ ...formData, invoiceNo: e.target.value })}
                  readOnly={!manualEntry}
                  className='font-mono'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-[10px] uppercase tracking-widest text-muted-foreground'>Tracking URL</Label>
                <Input
                  value={formData.trackingUrl}
                  readOnly
                  className='font-mono text-xs text-muted-foreground'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Shipper Details */}
          <Card className='depth-surface'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                  <UserIcon className='size-4' />
                </div>
                <CardTitle className='text-base'>Shipper Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <Label>Shipper Name *</Label>
                  <Input
                    value={formData.shipperName}
                    onChange={e => setFormData({ ...formData, shipperName: e.target.value })}
                    placeholder='Company or individual name'
                    required
                  />
                </div>
                <div className='sm:col-span-2'>
                  <Label>Address</Label>
                  <Textarea
                    value={formData.shipperAddress}
                    onChange={e => setFormData({ ...formData, shipperAddress: e.target.value })}
                    placeholder='Full address'
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <PhoneInput
                    value={formData.shipperPhone}
                    onChange={value => setFormData({ ...formData, shipperPhone: value })}
                  />
                </div>
                <div>
                  <Label>GSTIN</Label>
                  <Input
                    value={formData.shipperGstin}
                    onChange={e => setFormData({ ...formData, shipperGstin: e.target.value })}
                    placeholder='22AAAAA0000A1Z5'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consignee Details */}
          <Card className='depth-surface'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                  <MapPinIcon className='size-4' />
                </div>
                <CardTitle className='text-base'>Consignee Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <Label>Consignee Name *</Label>
                  <Input
                    value={formData.consigneeName}
                    onChange={e => setFormData({ ...formData, consigneeName: e.target.value })}
                    placeholder='Receiver name'
                    required
                  />
                </div>
                <div className='sm:col-span-2'>
                  <Label>Address *</Label>
                  <Textarea
                    value={formData.consigneeAddress}
                    onChange={e => setFormData({ ...formData, consigneeAddress: e.target.value })}
                    placeholder='Full delivery address'
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <StateSelect
                    value={formData.consigneeState}
                    onValueChange={value => setFormData({ ...formData, consigneeState: value, consigneeCity: '' })}
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <CitySelect
                    value={formData.consigneeCity}
                    onValueChange={value => setFormData({ ...formData, consigneeCity: value })}
                    state={formData.consigneeState}
                  />
                </div>
                <div>
                  <Label>Pincode *</Label>
                  <Input
                    value={formData.consigneePincode}
                    onChange={e => setFormData({ ...formData, consigneePincode: e.target.value })}
                    placeholder='6 digits'
                    required
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <PhoneInput
                    value={formData.consigneePhone}
                    onChange={value => setFormData({ ...formData, consigneePhone: value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package Details */}
        <Card className='depth-surface'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                  <PackageIcon className='size-4' />
                </div>
                <div>
                  <CardTitle className='text-base'>Package Details</CardTitle>
                  <CardDescription>Add dimensions & weight for accurate pricing</CardDescription>
                </div>
              </div>
              <Button type='button' variant='outline' size='sm' onClick={addPackage}>
                <PlusIcon className='mr-2 size-4' />
                Add Package
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {packages.map((pkg, index) => (
              <div key={pkg.id} className='p-4 rounded-lg border border-border/50 bg-muted/20 space-y-4'>
                <div className='flex items-center justify-between'>
                  <Badge variant='outline' className='font-mono'>Package #{index + 1}</Badge>
                  {packages.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='size-8 text-destructive'
                      onClick={() => removePackage(pkg.id)}
                    >
                      <Trash2Icon className='size-4' />
                    </Button>
                  )}
                </div>
                
                <div className='grid gap-4 sm:grid-cols-4'>
                  <div>
                    <Label className='text-xs'>Length (cm)</Label>
                    <Input
                      type='number'
                      value={pkg.length || ''}
                      onChange={e => updatePackage(pkg.id, { length: parseFloat(e.target.value) || 0 })}
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>Width (cm)</Label>
                    <Input
                      type='number'
                      value={pkg.width || ''}
                      onChange={e => updatePackage(pkg.id, { width: parseFloat(e.target.value) || 0 })}
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>Height (cm)</Label>
                    <Input
                      type='number'
                      value={pkg.height || ''}
                      onChange={e => updatePackage(pkg.id, { height: parseFloat(e.target.value) || 0 })}
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>Actual Weight (kg)</Label>
                    <Input
                      type='number'
                      value={pkg.actualWeight || ''}
                      onChange={e => updatePackage(pkg.id, { actualWeight: parseFloat(e.target.value) || 0 })}
                      placeholder='0.0'
                      step='0.1'
                    />
                  </div>
                </div>
                
                <div className='grid gap-4 sm:grid-cols-3'>
                  <div>
                    <Label className='text-xs'>Volumetric Weight</Label>
                    <Input
                      value={`${pkg.volumetricWeight.toFixed(2)} kg`}
                      readOnly
                      className='bg-muted/50 font-mono'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>Declared Value (₹)</Label>
                    <Input
                      type='number'
                      value={pkg.declaredValue || ''}
                      onChange={e => updatePackage(pkg.id, { declaredValue: parseFloat(e.target.value) || 0 })}
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>Packaging Type</Label>
                    <Select
                      value={pkg.packagingType}
                      onValueChange={value => updatePackage(pkg.id, { packagingType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='box'>Box</SelectItem>
                        <SelectItem value='envelope'>Envelope</SelectItem>
                        <SelectItem value='pallet'>Pallet</SelectItem>
                        <SelectItem value='crate'>Crate</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <Switch
                      id={`fragile-${pkg.id}`}
                      checked={pkg.isFragile}
                      onCheckedChange={(checked: boolean) => updatePackage(pkg.id, { isFragile: checked })}
                    />
                    <Label htmlFor={`fragile-${pkg.id}`} className='text-xs'>Fragile</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Shipment Options */}
          <Card className='depth-surface'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                  <TruckIcon className='size-4' />
                </div>
                <CardTitle className='text-base'>Shipment Options</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <Label>Transport Mode</Label>
                  <Select
                    value={formData.transportMode}
                    onValueChange={value => setFormData({ ...formData, transportMode: value as TransportMode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='surface'>Surface (Road)</SelectItem>
                      <SelectItem value='air'>Air Cargo</SelectItem>
                      <SelectItem value='express'>Express</SelectItem>
                      <SelectItem value='economy'>Economy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Mode</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={value => setFormData({ ...formData, paymentMode: value as PaymentMode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='prepaid'>Prepaid</SelectItem>
                      <SelectItem value='to_pay'>To Pay (COD)</SelectItem>
                      <SelectItem value='credit'>Credit Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Content Description</Label>
                <Textarea
                  value={formData.contentDescription}
                  onChange={e => setFormData({ ...formData, contentDescription: e.target.value })}
                  placeholder='Describe package contents'
                  rows={2}
                />
              </div>
              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={e => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder='Handling or delivery instructions'
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Charges */}
          <Card className='depth-surface'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-muted text-muted-foreground'>
                  <CalculatorIcon className='size-4' />
                </div>
                <CardTitle className='text-base'>Charges</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <Label className='text-xs'>Freight (₹)</Label>
                  <Input
                    type='number'
                    value={formData.freightCharge || ''}
                    onChange={e => setFormData({ ...formData, freightCharge: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
                <div>
                  <Label className='text-xs'>Pickup (₹)</Label>
                  <Input
                    type='number'
                    value={formData.pickupCharge || ''}
                    onChange={e => setFormData({ ...formData, pickupCharge: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
                <div>
                  <Label className='text-xs'>Delivery (₹)</Label>
                  <Input
                    type='number'
                    value={formData.deliveryCharge || ''}
                    onChange={e => setFormData({ ...formData, deliveryCharge: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
                <div>
                  <Label className='text-xs'>Packing (₹)</Label>
                  <Input
                    type='number'
                    value={formData.packingCharge || ''}
                    onChange={e => setFormData({ ...formData, packingCharge: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
                <div>
                  <Label className='text-xs'>Insurance (₹)</Label>
                  <Input
                    type='number'
                    value={formData.insuranceCharge || ''}
                    onChange={e => setFormData({ ...formData, insuranceCharge: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
                <div>
                  <Label className='text-xs'>Other (₹)</Label>
                  <Input
                    type='number'
                    value={formData.otherCharges || ''}
                    onChange={e => setFormData({ ...formData, otherCharges: parseFloat(e.target.value) || 0 })}
                    placeholder='0'
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-mono'>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>CGST (9%)</span>
                  <span className='font-mono'>{formatCurrency(totals.cgst)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>SGST (9%)</span>
                  <span className='font-mono'>{formatCurrency(totals.sgst)}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-base font-bold'>
                  <span>Total Amount</span>
                  <span className='font-mono text-primary'>{formatCurrency(totals.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Label Preview - Mobile/Tablet */}
        <Card className='depth-surface xl:hidden'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm flex items-center gap-2'>
              <PrinterIcon className='size-4' />
              Shipping Label Preview
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center pb-4'>
            <ShippingLabelPreview
              awb={formData.awbNo}
              shipTo={{
                name: formData.consigneeName,
                address: formData.consigneeAddress,
                city: formData.consigneeCity,
                state: formData.consigneeState,
                pincode: formData.consigneePincode
              }}
              shipFrom={{
                name: formData.shipperName || 'TAC CARGO SERVICE',
                address: formData.shipperAddress
              }}
              shipDate={formData.invoiceDate}
              weight={totals.chargeableWeight}
              pieces={totals.totalPieces}
              transportMode={formData.transportMode as 'air' | 'surface' | 'express'}
              paymentMode={formData.paymentMode as 'prepaid' | 'to_pay' | 'credit'}
              invoiceNo={formData.invoiceNo}
              gstNo={formData.shipperGstin}
              contentDescription={formData.contentDescription}
            />
          </CardContent>
        </Card>

        {/* Summary & Actions */}
        <Card className='depth-surface'>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div className='grid gap-4 sm:grid-cols-4'>
                <div className='text-center p-3 rounded-lg bg-muted/50'>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Pieces</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalPieces}</p>
                </div>
                <div className='text-center p-3 rounded-lg bg-muted/50'>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Actual Wt</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalActualWeight.toFixed(1)} kg</p>
                </div>
                <div className='text-center p-3 rounded-lg bg-muted/50'>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Vol. Wt</p>
                  <p className='text-2xl font-bold font-mono'>{totals.totalVolumetricWeight.toFixed(1)} kg</p>
                </div>
                <div className='text-center p-3 rounded-lg bg-primary/10 border border-primary/20'>
                  <p className='text-[10px] uppercase tracking-widest text-muted-foreground mb-1'>Chargeable</p>
                  <p className='text-2xl font-bold font-mono text-primary'>{totals.chargeableWeight.toFixed(1)} kg</p>
                </div>
              </div>
              
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Switch
                    id='send-whatsapp'
                    checked={formData.sendWhatsApp}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, sendWhatsApp: checked })}
                  />
                  <Label htmlFor='send-whatsapp' className='text-xs'>WhatsApp</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Switch
                    id='send-email'
                    checked={formData.sendEmail}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, sendEmail: checked })}
                  />
                  <Label htmlFor='send-email' className='text-xs'>Email</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Switch
                    id='print-label'
                    checked={formData.printLabel}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, printLabel: checked })}
                  />
                  <Label htmlFor='print-label' className='text-xs'>Print Label</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/dashboard/invoices')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={loading} className='min-w-[200px]'>
            {loading ? (
              <>
                <Loader2Icon className='mr-2 size-4 animate-spin' />
                Creating...
              </>
            ) : (
              <>
                <SendIcon className='mr-2 size-4' />
                Generate Invoice & AWB
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  )
}
