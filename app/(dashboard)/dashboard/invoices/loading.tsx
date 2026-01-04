import { InvoiceSkeleton } from '@/components/dashboard/skeletons'
import { PageLayout } from '@/components/dashboard/page-layout'

export default function Loading() {
  return (
    <PageLayout title="Invoices" description="Loading invoices...">
      <InvoiceSkeleton />
    </PageLayout>
  )
}
