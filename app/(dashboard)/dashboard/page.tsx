import { PageLayout } from '@/components/dashboard/page-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { ShipmentTrendsChart } from '@/components/dashboard/charts/shipment-trends-chart'
import { ActivityFeed } from '@/components/dashboard/widgets/activity-feed'
import { QuickActions } from '@/components/dashboard/widgets/quick-actions'
import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
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
  RiFlashlightLine,
} from '@remixicon/react'
import Link from 'next/link'

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
      badge='Live'
      actions={
        <Button asChild className="btn-primary h-9 px-4">
          <Link href='/dashboard/shipments/new'>
            <RiAddLine className='mr-2 size-4' />
            <span className='text-[11px] font-bold uppercase tracking-wide'>New Shipment</span>
          </Link>
        </Button>
      }
    >
      {/* ============================================
          BENTO GRID - Asymmetric Premium Layout
          ============================================ */}
      <div className='grid grid-cols-12 gap-5 auto-rows-min'>
        
        {/* ----------------------------------------
            ROW 1: Hero KPI + Secondary Stats
            Asymmetric focal point
            ---------------------------------------- */}
        <div className='col-span-12 lg:col-span-5 xl:col-span-4'>
          <StatCard
            icon={RiBox3Line}
            title='Active Shipments'
            value='1,247'
            trend={{ value: 12.5, isPositive: true }}
            isActive
            variant='hero'
            subtitle='Across 14 active hubs'
          />
        </div>
        
        <div className='col-span-12 lg:col-span-7 xl:col-span-8'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 h-full'>
            <StatCard
              icon={RiTruckLine}
              title='In Transit'
              value='342'
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatCard
              icon={RiTimeLine}
              title='Pending'
              value='23'
              trend={{ value: 3.1, isPositive: false }}
            />
            <StatCard
              icon={RiCheckboxCircleLine}
              title='Delivered Today'
              value='892'
              trend={{ value: 18.3, isPositive: true }}
            />
          </div>
        </div>

        {/* ----------------------------------------
            ROW 2: Main Chart + Sidebar Widgets
            8:4 ratio for visual balance
            ---------------------------------------- */}
        <div className='col-span-12 xl:col-span-8'>
          <ShipmentTrendsChart />
        </div>
        
        <div className='col-span-12 xl:col-span-4 grid gap-5'>
          <QuickActions />
          <ActivityFeed />
        </div>

        {/* ----------------------------------------
            ROW 3: Insights + Revenue
            Balanced 2-column layout
            ---------------------------------------- */}
        <div className='col-span-12 lg:col-span-5'>
          <ProductInsightsCard className='h-full' />
        </div>
        
        <div className='col-span-12 lg:col-span-7'>
          <TotalEarningCard
            title='Revenue Stream'
            earning={2465050}
            trend='up'
            percentage={10}
            comparisonText='Relative to FY24 Performance'
            earningData={earningData}
            className='h-full'
          />
        </div>

        {/* ----------------------------------------
            ROW 4: Transaction Queue (Full Width)
            Data-dense operational view
            ---------------------------------------- */}
        <div className='col-span-12'>
          <Card className='depth-surface noise-overlay border-none overflow-hidden'>
            <div className='px-6 py-4 border-b border-border/30 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                  <RiFlashlightLine className='size-4' />
                </div>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-foreground'>Operational Queue</h3>
                  <p className='text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wide'>Recent transactions & pending actions</p>
                </div>
              </div>
              <Link 
                href='/dashboard/shipments' 
                className='text-[10px] font-bold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-primary/5'
              >
                View All
              </Link>
            </div>
            <TransactionDatatable data={transactionData} />
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
