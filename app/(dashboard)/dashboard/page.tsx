import { PageLayout } from '@/components/layout/page-layout'
import { KPICard, KPICardGrid } from '@/components/dashboard/kpi-card'
import { TruckIcon, PackageIcon, FileTextIcon, IndianRupeeIcon } from 'lucide-react'

export default function DashboardPage() {
  return (
    <PageLayout title="Dashboard" description="Overview of your logistics operations">
      <KPICardGrid>
        <KPICard label="Active Shipments" value="1,247" icon={<TruckIcon className="size-4" />} trend="up" delta="+12.5%" />
        <KPICard label="Pending Invoices" value="23" icon={<FileTextIcon className="size-4" />} trend="down" delta="-3.1%" />
        <KPICard label="Total Revenue" value="₹24,65,050" icon={<IndianRupeeIcon className="size-4" />} trend="up" delta="+8.2%" />
        <KPICard label="Packages Scanned" value="3,891" icon={<PackageIcon className="size-4" />} trend="neutral" delta="0.0%" />
      </KPICardGrid>
    </PageLayout>
  )
}
