import { PageLayout } from '@/components/dashboard/page-layout'
import StatisticsCard from '@/components/shadcn-studio/blocks/statistics-card-01'
import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
import SalesMetricsCard from '@/components/shadcn-studio/blocks/chart-sales-metrics'
import TransactionDatatable, { type Item } from '@/components/shadcn-studio/blocks/datatable-transaction'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PackageIcon,
  TruckIcon,
  FileTextIcon,
  UsersIcon,
  PlusIcon,
  PlaneIcon
} from 'lucide-react'
import Link from 'next/link'

const StatisticsCardData = [
  {
    icon: <PackageIcon className='size-4' />,
    value: '1,247',
    title: 'Active Shipments',
    changePercentage: '+12.5%'
  },
  {
    icon: <TruckIcon className='size-4' />,
    value: '342',
    title: 'In Transit',
    changePercentage: '+5.2%'
  },
  {
    icon: <FileTextIcon className='size-4' />,
    value: '23',
    title: 'Pending Invoices',
    changePercentage: '-3.1%'
  },
  {
    icon: <UsersIcon className='size-4' />,
    value: '156',
    title: 'Active Customers',
    changePercentage: '+8.7%'
  }
]

const earningData = [
  {
    icon: <PlaneIcon className='size-6 text-primary' />,
    platform: 'Air Cargo',
    technologies: 'International',
    earnings: '₹8,56,926',
    progressPercentage: 75
  },
  {
    icon: <TruckIcon className='size-6 text-primary' />,
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
  },
  {
    id: '5',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
    avatarFallback: 'PC',
    name: 'Prime Cargo',
    amount: 72316.0,
    status: 'paid',
    email: 'finance@primecargo.com',
    paidBy: 'mastercard'
  }
]

export default function DashboardPage() {
  return (
    <PageLayout
      title='Dashboard'
      description='Overview of your cargo operations'
      actions={
        <Button asChild>
          <Link href='/dashboard/shipments/new'>
            <PlusIcon className='mr-2 size-4' />
            New Shipment
          </Link>
        </Button>
      }
    >
      <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
        <div className='col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {StatisticsCardData.map((card, index) => (
            <StatisticsCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              changePercentage={card.changePercentage}
            />
          ))}
        </div>

        <div className='grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2'>
          <ProductInsightsCard className='justify-between gap-3 [&>[data-slot=card-content]]:space-y-5' />

          <TotalEarningCard
            title='Revenue Overview'
            earning={2465050}
            trend='up'
            percentage={10}
            comparisonText='Compare to last year (₹18,43,325)'
            earningData={earningData}
            className='justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7'
          />
        </div>

        <SalesMetricsCard className='col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6' />

        <Card className='col-span-full w-full py-0'>
          <TransactionDatatable data={transactionData} />
        </Card>
      </div>
    </PageLayout>
  )
}
