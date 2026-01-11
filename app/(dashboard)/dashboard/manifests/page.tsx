import { PageLayout } from '@/components/layout/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusIcon, PackageIcon } from 'lucide-react'
import Link from 'next/link'

const manifests = [
  { id: '1', number: 'MAN-2024-0001', items: 12, status: 'manifest-open' as Extract<Status, 'manifest-open'>, date: '2024-12-28' },
  { id: '2', number: 'MAN-2024-0002', items: 25, status: 'manifest-locked' as Extract<Status, 'manifest-locked'>, date: '2024-12-27' },
  { id: '3', number: 'MAN-2024-0003', items: 18, status: 'manifest-dispatched' as Extract<Status, 'manifest-dispatched'>, date: '2024-12-26' }
]

export default function ManifestsPage() {
  return (
    <PageLayout title="Manifests" description="Manage shipment manifests" actions={<Button asChild><Link href="/dashboard/manifests/new"><PlusIcon className="mr-2 size-4" />New Manifest</Link></Button>}>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manifest #</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manifests.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-sm">{m.number}</TableCell>
                <TableCell><PackageIcon className="mr-2 inline size-4" />{m.items}</TableCell>
                <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge status={m.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
