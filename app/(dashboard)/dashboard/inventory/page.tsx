import { PageLayout } from '@/components/layout/page-layout'
import { StatusBadge, type Status } from '@/components/dashboard/status-badge'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const inventory = [
  { id: '1', sku: 'BOX-SM-001', name: 'Small Box', quantity: 150, status: 'stock-optimal' as Extract<Status, 'stock-optimal'> },
  { id: '2', sku: 'BOX-MD-001', name: 'Medium Box', quantity: 25, status: 'stock-low' as Extract<Status, 'stock-low'> },
  { id: '3', sku: 'TAPE-001', name: 'Packing Tape', quantity: 5, status: 'stock-critical' as Extract<Status, 'stock-critical'> }
]

export default function InventoryPage() {
  return (
    <PageLayout title="Inventory" description="Manage warehouse inventory">
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-sm">{i.sku}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell className="text-right tabular-nums">{i.quantity}</TableCell>
                <TableCell><StatusBadge status={i.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
