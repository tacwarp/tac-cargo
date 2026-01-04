import { TableSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Exceptions" description="Loading exceptions...">
      <TableSkeleton rows={6} columns={5} />
    </PageLayout>
  )
}
