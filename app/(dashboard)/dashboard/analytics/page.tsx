import { PageLayout } from '@/components/layout/page-layout'
import { KPICard, KPICardGrid } from '@/components/dashboard/kpi-card'
import { Card } from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <PageLayout title="Analytics" description="Performance metrics and insights">
      <KPICardGrid>
        <KPICard label="Delivery Rate" value="94.2%" icon={<TrendingUpIcon className="size-4" />} trend="up" delta="+2.1%" description="Last 30 days" />
        <KPICard label="Avg Delivery Time" value="2.3 days" icon={<ActivityIcon className="size-4" />} trend="down" delta="-0.4 days" />
        <KPICard label="Customer Satisfaction" value="4.8/5" icon={<TrendingUpIcon className="size-4" />} trend="up" delta="+0.2" />
        <KPICard label="Exception Rate" value="1.8%" icon={<TrendingDownIcon className="size-4" />} trend="down" delta="-0.5%" />
      </KPICardGrid>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-6"><div className="text-center text-muted-foreground">Chart: Shipment Volume Trend</div></Card>
        <Card className="p-6"><div className="text-center text-muted-foreground">Chart: Revenue Growth</div></Card>
      </div>
    </PageLayout>
  )
}
