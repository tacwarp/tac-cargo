import { DashboardSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Dashboard" description="Loading overview...">
      <DashboardSkeleton />
    </PageLayout>
  )
}
