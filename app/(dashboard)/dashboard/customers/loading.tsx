import { TableSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Customers" description="Loading customers...">
      <TableSkeleton rows={8} columns={6} />
    </PageLayout>
  )
}
