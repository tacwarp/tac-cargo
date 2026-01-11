import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const exceptions = [
  { id: '1', ref: 'SHP-IMF-2512-0007', issue: 'Damaged package', priority: 'priority-high' as Extract<Status, 'priority-high'>, status: 'exception-open' as Extract<Status, 'exception-open'> },
  { id: '2', ref: 'SHP-IMF-2512-0012', issue: 'Address incomplete', priority: 'priority-medium' as Extract<Status, 'priority-medium'>, status: 'exception-investigating' as Extract<Status, 'exception-investigating'> },
  { id: '3', ref: 'SHP-IMF-2512-0003', issue: 'Delayed pickup', priority: 'priority-low' as Extract<Status, 'priority-low'>, status: 'exception-resolved' as Extract<Status, 'exception-resolved'> }
]

export default function ExceptionsPage() {
  return (
    <PageLayout title="Exceptions" description="Manage shipment exceptions">
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-sm">{e.ref}</TableCell>
                <TableCell>{e.issue}</TableCell>
                <TableCell><StatusBadge status={e.priority} /></TableCell>
                <TableCell><StatusBadge status={e.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
