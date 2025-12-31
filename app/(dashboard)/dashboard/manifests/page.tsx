'use client'

import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  MoreVerticalIcon,
  EyeIcon,
  PrinterIcon,
  LockIcon,
  Trash2Icon,
  PlaneIcon,
  TruckIcon
} from 'lucide-react'

interface Manifest {
  id: string
  manifestNumber: string
  type: 'air' | 'surface'
  destination: string
  packages: number
  weight: number
  status: 'open' | 'locked' | 'dispatched'
  createdAt: string
}

const manifests: Manifest[] = [
  { id: '1', manifestNumber: 'MFT-AIR-2512-001', type: 'air', destination: 'New Delhi', packages: 45, weight: 125.5, status: 'dispatched', createdAt: '2024-12-28' },
  { id: '2', manifestNumber: 'MFT-SRF-2512-002', type: 'surface', destination: 'Guwahati', packages: 32, weight: 89.2, status: 'locked', createdAt: '2024-12-28' },
  { id: '3', manifestNumber: 'MFT-AIR-2512-003', type: 'air', destination: 'Mumbai', packages: 28, weight: 76.8, status: 'open', createdAt: '2024-12-28' },
  { id: '4', manifestNumber: 'MFT-SRF-2512-004', type: 'surface', destination: 'Kolkata', packages: 56, weight: 145.3, status: 'open', createdAt: '2024-12-28' },
  { id: '5', manifestNumber: 'MFT-AIR-2512-005', type: 'air', destination: 'Chennai', packages: 18, weight: 52.1, status: 'dispatched', createdAt: '2024-12-27' }
]

const statusStyles = {
  open: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  locked: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  dispatched: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
}

export default function ManifestsPage() {
  return (
    <PageLayout
      title='Manifests'
      description='Manage cargo manifests for dispatch'
      actions={
        <Button>
          <PlusIcon className='mr-2 size-4' />
          New Manifest
        </Button>
      }
    >
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Open Manifests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>2</p>
            <p className='text-xs text-muted-foreground'>Ready for packages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Locked Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>1</p>
            <p className='text-xs text-muted-foreground'>Awaiting dispatch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Dispatched Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>2</p>
            <p className='text-xs text-muted-foreground'>In transit</p>
          </CardContent>
        </Card>
      </div>

      <Card className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manifest #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className='hidden sm:table-cell'>Packages</TableHead>
              <TableHead className='hidden md:table-cell'>Weight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manifests.map(manifest => (
              <TableRow key={manifest.id}>
                <TableCell className='font-mono text-sm'>{manifest.manifestNumber}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {manifest.type === 'air' ? (
                      <PlaneIcon className='size-4 text-blue-500' />
                    ) : (
                      <TruckIcon className='size-4 text-amber-500' />
                    )}
                    <span className='capitalize'>{manifest.type}</span>
                  </div>
                </TableCell>
                <TableCell>{manifest.destination}</TableCell>
                <TableCell className='hidden sm:table-cell'>{manifest.packages}</TableCell>
                <TableCell className='hidden md:table-cell'>{manifest.weight} kg</TableCell>
                <TableCell>
                  <Badge variant='outline' className={statusStyles[manifest.status]}>
                    {manifest.status.charAt(0).toUpperCase() + manifest.status.slice(1)}
                  </Badge>
                </TableCell>
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
                      {manifest.status === 'open' && (
                        <DropdownMenuItem>
                          <LockIcon className='mr-2 size-4' />
                          Lock Manifest
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <PrinterIcon className='mr-2 size-4' />
                        Print Manifest
                      </DropdownMenuItem>
                      {manifest.status === 'open' && (
                        <DropdownMenuItem className='text-destructive focus:text-destructive'>
                          <Trash2Icon className='mr-2 size-4' />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
