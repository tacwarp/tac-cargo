'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  PrinterIcon,
  Trash2Icon
} from 'lucide-react'
import Link from 'next/link'

type ShipmentStatus = 'pending' | 'scanned' | 'in-transit' | 'arrived' | 'delivered' | 'delayed' | 'cancelled'

interface Shipment {
  id: string
  reference: string
  customer: string
  origin: string
  destination: string
  status: ShipmentStatus
  weight: number
  createdAt: string
}

const shipments: Shipment[] = [
  { id: '1', reference: 'SHP-IMF-2512-0001', customer: 'ABC Corporation', origin: 'Imphal', destination: 'New Delhi', status: 'in-transit', weight: 25.5, createdAt: '2024-12-28' },
  { id: '2', reference: 'SHP-IMF-2512-0002', customer: 'XYZ Logistics', origin: 'Imphal', destination: 'Mumbai', status: 'pending', weight: 15.2, createdAt: '2024-12-28' },
  { id: '3', reference: 'SHP-IMF-2512-0003', customer: 'Metro Express', origin: 'Imphal', destination: 'Kolkata', status: 'delivered', weight: 8.7, createdAt: '2024-12-27' },
  { id: '4', reference: 'SHP-IMF-2512-0004', customer: 'Quick Ship Co', origin: 'Imphal', destination: 'Chennai', status: 'in-transit', weight: 32.1, createdAt: '2024-12-27' },
  { id: '5', reference: 'SHP-IMF-2512-0005', customer: 'Prime Cargo', origin: 'Imphal', destination: 'Bangalore', status: 'pending', weight: 12.4, createdAt: '2024-12-26' },
  { id: '6', reference: 'SHP-IMF-2512-0006', customer: 'Fast Freight', origin: 'Imphal', destination: 'Hyderabad', status: 'arrived', weight: 45.0, createdAt: '2024-12-26' },
  { id: '7', reference: 'SHP-IMF-2512-0007', customer: 'Swift Movers', origin: 'Imphal', destination: 'Pune', status: 'delayed', weight: 18.9, createdAt: '2024-12-25' },
  { id: '8', reference: 'SHP-IMF-2512-0008', customer: 'Rapid Transit', origin: 'Imphal', destination: 'Ahmedabad', status: 'scanned', weight: 22.3, createdAt: '2024-12-25' }
]

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PageLayout
      title='Shipments'
      description='Manage and track all your shipments'
      actions={
        <Button asChild>
          <Link href='/dashboard/shipments/new'>
            <PlusIcon className='mr-2 size-4' />
            New Shipment
          </Link>
        </Button>
      }
    >
      <Card className='p-0'>
        <div className='flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search by reference or customer...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='scanned'>Scanned</SelectItem>
              <SelectItem value='in-transit'>In Transit</SelectItem>
              <SelectItem value='arrived'>Arrived</SelectItem>
              <SelectItem value='delivered'>Delivered</SelectItem>
              <SelectItem value='delayed'>Delayed</SelectItem>
              <SelectItem value='cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className='hidden md:table-cell'>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='hidden sm:table-cell'>Weight</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map(shipment => (
              <TableRow key={shipment.id}>
                <TableCell className='font-mono text-sm'>{shipment.reference}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell className='hidden md:table-cell'>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} />
                </TableCell>
                <TableCell className='hidden sm:table-cell'>{shipment.weight} kg</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVerticalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <EyeIcon className='mr-2 size-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EditIcon className='mr-2 size-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PrinterIcon className='mr-2 size-4' />
                        Print Label
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive focus:text-destructive'>
                        <Trash2Icon className='mr-2 size-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='flex items-center justify-between border-t border-border p-4'>
          <p className='text-sm text-muted-foreground'>
            Showing {filteredShipments.length} of {shipments.length} shipments
          </p>
        </div>
      </Card>
    </PageLayout>
  )
}
