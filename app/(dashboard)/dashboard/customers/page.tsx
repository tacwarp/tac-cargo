import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

const customers = [
  { id: '1', name: 'ABC Corporation', email: 'contact@abc.com', shipments: 45, status: 'customer-active' as Extract<Status, 'customer-active'> },
  { id: '2', name: 'XYZ Logistics', email: 'info@xyz.com', shipments: 32, status: 'customer-active' as Extract<Status, 'customer-active'> },
  { id: '3', name: 'Old Corp', email: 'old@corp.com', shipments: 0, status: 'customer-inactive' as Extract<Status, 'customer-inactive'> }
]

export default function CustomersPage() {
  return (
    <PageLayout title="Customers" description="Manage customer accounts" actions={<Button asChild><Link href="/dashboard/customers/new"><PlusIcon className="mr-2 size-4" />Add Customer</Link></Button>}>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right">Shipments</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="hidden md:table-cell">{c.email}</TableCell>
                <TableCell className="text-right tabular-nums">{c.shipments}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
