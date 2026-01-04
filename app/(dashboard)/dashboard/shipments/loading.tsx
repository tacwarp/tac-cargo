import { ShipmentsSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Shipments" description="Loading shipments...">
      <ShipmentsSkeleton />
    </PageLayout>
  )
}
