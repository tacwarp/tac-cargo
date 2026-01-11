import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PlusIcon, SearchIcon, MoreVerticalIcon, EyeIcon, EditIcon, PrinterIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

interface Shipment {
  id: string
  reference: string
  customer: string
  origin: string
  destination: string
  status: Extract<Status, 'pending' | 'scanned' | 'in-transit' | 'arrived' | 'delivered' | 'delayed' | 'cancelled'>
  weight: number
}

const shipments: Shipment[] = [
  { id: '1', reference: 'SHP-IMF-2512-0001', customer: 'ABC Corporation', origin: 'Imphal', destination: 'New Delhi', status: 'in-transit', weight: 25.5 },
  { id: '2', reference: 'SHP-IMF-2512-0002', customer: 'XYZ Logistics', origin: 'Imphal', destination: 'Mumbai', status: 'pending', weight: 15.2 },
  { id: '3', reference: 'SHP-IMF-2512-0003', customer: 'Metro Express', origin: 'Imphal', destination: 'Kolkata', status: 'delivered', weight: 8.7 },
  { id: '4', reference: 'SHP-IMF-2512-0004', customer: 'Quick Ship Co', origin: 'Imphal', destination: 'Chennai', status: 'in-transit', weight: 32.1 },
  { id: '5', reference: 'SHP-IMF-2512-0005', customer: 'Prime Cargo', origin: 'Imphal', destination: 'Bangalore', status: 'arrived', weight: 12.4 }
]

export default function ShipmentsPage() {
  return (
    <PageLayout
      title="Shipments"
      description="Manage and track all shipments"
      actions={
        <Button asChild>
          <Link href="/dashboard/shipments/new">
            <PlusIcon className="mr-2 size-4" />
            New Shipment
          </Link>
        </Button>
      }
    >
      <Card className="p-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search shipments..." className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Weight</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-sm">{s.reference}</TableCell>
                <TableCell className="font-medium">{s.customer}</TableCell>
                <TableCell className="hidden md:table-cell">{s.origin}</TableCell>
                <TableCell>{s.destination}</TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
                <TableCell className="hidden sm:table-cell">{s.weight} kg</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreVerticalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><EyeIcon className="mr-2 size-4" />View</DropdownMenuItem>
                      <DropdownMenuItem><EditIcon className="mr-2 size-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem><PrinterIcon className="mr-2 size-4" />Print</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2Icon className="mr-2 size-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Showing {shipments.length} shipments</p>
        </div>
      </Card>
    </PageLayout>
  )
}

