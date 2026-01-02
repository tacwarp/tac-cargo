import { PageLayout } from '@/components/dashboard/page-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
import SalesMetricsCard from '@/components/shadcn-studio/blocks/chart-sales-metrics'
import TransactionDatatable, { type Item } from '@/components/shadcn-studio/blocks/datatable-transaction'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  RiBox3Line,
  RiTruckLine,
  RiAddLine,
  RiPlaneLine,
  RiTimeLine,
  RiCheckboxCircleLine,
} from '@remixicon/react'
import Link from 'next/link'

const StatisticsCardData = [
  {
    icon: RiBox3Line,
    value: '1,247',
    title: 'Active Shipments',
    trend: { value: 12.5, isPositive: true },
    isActive: true
  },
  {
    icon: RiTruckLine,
    value: '342',
    title: 'In Transit',
    trend: { value: 5.2, isPositive: true }
  },
  {
    icon: RiTimeLine,
    value: '23',
    title: 'Pending Deliveries',
    trend: { value: 3.1, isPositive: false }
  },
  {
    icon: RiCheckboxCircleLine,
    value: '892',
    title: 'Delivered Today',
    trend: { value: 18.3, isPositive: true }
  }
]

const earningData = [
  {
    icon: <RiPlaneLine className='size-6 text-primary' />,
    platform: 'Air Cargo',
    technologies: 'International',
    earnings: '₹8,56,926',
    progressPercentage: 75
  },
  {
    icon: <RiTruckLine className='size-6 text-primary' />,
    platform: 'Surface',
    technologies: 'Domestic',
    earnings: '₹4,65,031',
    progressPercentage: 45
  }
]

const transactionData: Item[] = [
  {
    id: '1',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    avatarFallback: 'AC',
    name: 'ABC Corporation',
    amount: 31600.0,
    status: 'paid',
    email: 'finance@abc-corp.com',
    paidBy: 'mastercard'
  },
  {
    id: '2',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    avatarFallback: 'XL',
    name: 'XYZ Logistics',
    amount: 25340.0,
    status: 'pending',
    email: 'ops@xyz-logistics.com',
    paidBy: 'visa'
  },
  {
    id: '3',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    avatarFallback: 'ME',
    name: 'Metro Express',
    amount: 85200.0,
    status: 'paid',
    email: 'billing@metro-express.in',
    paidBy: 'mastercard'
  },
  {
    id: '4',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    avatarFallback: 'QS',
    name: 'Quick Ship Co',
    amount: 88900.0,
    status: 'pending',
    email: 'accounts@quickship.com',
    paidBy: 'visa'
  }
]

export default function DashboardPage() {
  return (
    <PageLayout
      title='Operations Control'
      description='Mission-critical overview of TAC Cargo logistics'
      actions={
        <Button asChild className="btn-primary">
          <Link href='/dashboard/shipments/new'>
            <RiAddLine className='mr-2 size-4' />
            Initialize Freight
          </Link>
        </Button>
      }
    >
      <div className='grid grid-cols-12 gap-6'>
        {/* Statistics Row - Bento Style High Density */}
        <div className='col-span-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {StatisticsCardData.map((card, index) => (
            <div key={index}>
              <StatCard
                icon={card.icon}
                title={card.title}
                value={card.value}
                trend={card.trend}
                isActive={card.isActive}
              />
            </div>
          ))}
        </div>

        {/* Major Widgets - Asymmetrical Priority */}
        <div className='col-span-full lg:col-span-4 grid gap-6'>
          <ProductInsightsCard className='depth-surface noise-overlay h-full justify-between gap-3 [&>[data-slot=card-content]]:space-y-5' />
        </div>

        <div className='col-span-full lg:col-span-8'>
          <SalesMetricsCard className='depth-surface noise-overlay [&>[data-slot=card-content]]:space-y-6 border-none' />
        </div>

        {/* Secondary Detailed Widgets */}
        <div className='col-span-full xl:col-span-4'>
          <TotalEarningCard
            title='Revenue Stream'
            earning={2465050}
            trend='up'
            percentage={10}
            comparisonText='Relative to FY24 Performance'
            earningData={earningData}
            className='depth-surface noise-overlay h-full justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7 border-none'
          />
        </div>

        <div className='col-span-full xl:col-span-8'>
          <Card className='depth-surface noise-overlay border-none overflow-hidden'>
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Operational Queue</h3>
              <Link href="/dashboard/shipments" className="text-[10px] font-bold uppercase tracking-tighter text-primary hover:underline">View Full Manifest</Link>
            </div>
            <TransactionDatatable data={transactionData} />
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
