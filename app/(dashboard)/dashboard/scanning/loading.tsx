import { PageSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Barcode Scanning" description="Loading scanner...">
      <PageSkeleton />
    </PageLayout>
  )
}
