import { PageLayout } from '@/components/dashboard/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const payments = [
  { id: '1', txn: 'TXN-2024-0001', amount: 15250, status: 'payment-completed' as Extract<Status, 'payment-completed'>, date: '2024-12-28' },
  { id: '2', txn: 'TXN-2024-0002', amount: 8750, status: 'payment-pending' as Extract<Status, 'payment-pending'>, date: '2024-12-27' },
  { id: '3', txn: 'TXN-2024-0003', amount: 3200, status: 'payment-failed' as Extract<Status, 'payment-failed'>, date: '2024-12-26' }
]

export default function PaymentsPage() {
  return (
    <PageLayout title="Payments" description="Track payment transactions">
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.txn}</TableCell>
                <TableCell className="text-right tabular-nums">₹{p.amount.toLocaleString('en-IN')}</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
