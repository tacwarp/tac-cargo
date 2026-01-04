'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { PlaneIcon, TruckIcon, PackageIcon } from 'lucide-react'

interface ShippingLabelProps {
  awb: string
  shipTo: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
  }
  shipFrom: {
    name: string
    address?: string
  }
  shipDate: string
  weight: number
  pieces: number
  transportMode: 'air' | 'surface' | 'express'
  paymentMode: 'prepaid' | 'to_pay' | 'credit'
  invoiceNo?: string
  gstNo?: string
  contentDescription?: string
  className?: string
}

export function ShippingLabelPreview({
  awb,
  shipTo,
  shipFrom,
  shipDate,
  weight,
  pieces,
  transportMode,
  paymentMode,
  invoiceNo,
  gstNo,
  contentDescription,
  className
}: ShippingLabelProps) {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + (transportMode === 'air' ? 2 : transportMode === 'express' ? 1 : 5))

  const TransportIcon = transportMode === 'air' ? PlaneIcon : TruckIcon

  return (
    <div className={cn(
      'w-full max-w-[300px] bg-white text-black font-sans text-xs',
      'border-2 border-black rounded-none overflow-hidden',
      className
    )}>
      {/* Header with AWB and Mode */}
      <div className='flex items-stretch border-b-2 border-black'>
        <div className='flex-1 p-2 border-r-2 border-black'>
          <div className='text-[8px] text-gray-600 uppercase tracking-wider'>AWB</div>
          <div className='font-mono font-bold text-sm tracking-wide'>{awb || 'TAC0000000'}</div>
        </div>
        <div className='flex flex-col items-center justify-center gap-1 p-2 min-w-[70px]'>
          <div className='text-[10px] font-bold uppercase'>{transportMode.toUpperCase()}</div>
          <div className='text-[10px] font-mono'>{weight.toFixed(2)} kgs</div>
          <div className='text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5'>
            {pieces > 1 ? 'LARGE' : 'SMALL'}
          </div>
        </div>
        <div className='flex items-center justify-center p-2 border-l-2 border-black'>
          <TransportIcon className='size-8' />
        </div>
      </div>

      {/* Ship To Section */}
      <div className='p-2 border-b border-black'>
        <div className='text-[8px] text-gray-600 font-bold uppercase'>Ship To:</div>
        <div className='font-bold text-sm mt-0.5'>{shipTo.name || 'Consignee Name'}</div>
        <div className='text-[10px] leading-tight mt-1'>
          {shipTo.address || 'Address Line 1'}<br />
          {shipTo.city || 'City'}, {shipTo.state || 'State'}<br />
          {shipTo.pincode || '000000'}
        </div>
      </div>

      {/* Delivery Date & Payment */}
      <div className='flex border-b border-black'>
        <div className='flex-1 p-2 border-r border-black text-center'>
          <div className='text-[8px] text-gray-600 uppercase'>Delivery</div>
          <div className='font-bold text-lg font-mono'>
            {deliveryDate.getDate()}/{deliveryDate.getMonth() + 1}
          </div>
        </div>
        <div className='flex-1 p-2 text-center'>
          <div className='text-[8px] text-gray-600 uppercase'>Payment</div>
          <div className='font-bold text-sm uppercase bg-black text-white inline-block px-2 py-0.5 mt-0.5'>
            {paymentMode.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Zone Info */}
      <div className='flex border-b border-black text-center'>
        <div className='flex-1 p-1 border-r border-black'>
          <div className='text-[7px] text-gray-600 uppercase'>Delivery Station</div>
          <div className='font-bold text-sm'>{shipTo.city?.substring(0, 4).toUpperCase() || 'CITY'}</div>
        </div>
        <div className='flex-1 p-1 border-r border-black'>
          <div className='text-[7px] text-gray-600 uppercase'>Sector</div>
          <div className='font-bold text-sm'>S—{shipTo.pincode?.charAt(0) || '0'}</div>
        </div>
        <div className='flex-1 p-1'>
          <div className='text-[7px] text-gray-600 uppercase'>Sortzone</div>
          <div className='font-bold text-sm'>{shipTo.state?.substring(0, 4).toUpperCase() || 'ZONE'}</div>
        </div>
      </div>

      {/* Ship Date & GST */}
      <div className='flex border-b border-black text-[9px]'>
        <div className='flex-1 p-1.5'>
          <span className='font-bold'>Ship Date:</span> {shipDate || new Date().toLocaleDateString('en-IN')}
        </div>
        {gstNo && (
          <div className='flex-1 p-1.5 border-l border-black'>
            <span className='font-bold'>GST#</span> {gstNo}
          </div>
        )}
      </div>

      {/* Invoice Info */}
      <div className='flex border-b border-black text-[9px]'>
        <div className='flex-1 p-1.5 border-r border-black'>
          <span className='font-bold'>Invoice ID:</span> {invoiceNo || 'INV-XXXX'}
        </div>
        <div className='flex-1 p-1.5'>
          <span className='font-bold'>Date:</span> {new Date().toLocaleDateString('en-IN')}
        </div>
      </div>

      {/* Ship From */}
      <div className='p-2 border-b border-black'>
        <div className='text-[8px] text-gray-600 font-bold uppercase'>Ordered From:</div>
        <div className='font-bold text-sm'>{shipFrom.name || 'TAC CARGO SERVICE'}</div>
      </div>

      {/* Barcode Placeholder */}
      <div className='p-3 flex justify-center bg-white'>
        <div className='text-center'>
          <div className='font-mono text-3xl tracking-[0.3em] font-bold'>
            |||||||||||||||
          </div>
          <div className='text-[8px] mt-1 font-mono'>{awb || 'TAC0000000'}</div>
        </div>
      </div>

      {/* Return Address */}
      <div className='p-1.5 border-t border-black text-[8px] bg-gray-50'>
        <span className='font-bold'>Ship From:</span> {shipFrom.name || 'TAC CARGO SERVICE'}<br />
        <span className='font-bold'>Return Address:</span> {shipFrom.address || 'Main Office, Imphal, Manipur'}
      </div>

      {/* Item Description */}
      {contentDescription && (
        <div className='border-t-2 border-black'>
          <table className='w-full text-[9px]'>
            <thead>
              <tr className='border-b border-black'>
                <th className='p-1 text-left border-r border-black w-6'>#</th>
                <th className='p-1 text-left'>Item description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='p-1 border-r border-black'>1</td>
                <td className='p-1 uppercase'>{contentDescription}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer with Route Codes */}
      <div className='flex border-t-2 border-black'>
        <div className='flex-1 p-1.5 border-r-2 border-black text-center'>
          <div className='text-[7px] text-gray-600'>DLIN</div>
          <div className='font-mono font-bold text-sm bg-black text-white inline-block px-1'>
            {shipTo.pincode?.charAt(0) || '1'}
          </div>
          <span className='font-mono font-bold ml-0.5'>
            {transportMode === 'air' ? 'AIR' : 'SUR'}
          </span>
        </div>
        <div className='flex-1 p-1.5 border-r-2 border-black text-center'>
          <div className='text-[7px] text-gray-600'>ROUTE</div>
          <div className='font-mono font-bold'>
            {shipTo.city?.substring(0, 4).toUpperCase() || 'CITY'}
          </div>
        </div>
        <div className='flex-1 p-1.5 text-center'>
          <div className='text-[7px] text-gray-600'>ZONE</div>
          <div className='font-mono font-bold'>
            {shipTo.state?.substring(0, 4).toUpperCase() || 'ZONE'}
          </div>
        </div>
      </div>

      {/* Brand Footer */}
      <div className='p-2 border-t-2 border-black text-right'>
        <span className='font-bold text-lg tracking-tight'>tac</span>
        <span className='font-light text-lg'> cargo</span>
      </div>
    </div>
  )
}
