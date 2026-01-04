import { TrackingSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Track Shipment" description="Loading tracking...">
      <TrackingSkeleton />
    </PageLayout>
  )
}
