import { ManifestSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Manifests" description="Loading manifests...">
      <ManifestSkeleton />
    </PageLayout>
  )
}
