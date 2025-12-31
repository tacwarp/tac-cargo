'use client'

import { PageLayout } from '@/components/dashboard/page-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  WarehouseIcon,
  PackageIcon,
  ClockIcon,
  AlertTriangleIcon
} from 'lucide-react'

const zones = [
  { name: 'Zone A - Inbound', packages: 45, capacity: 100, status: 'normal' },
  { name: 'Zone B - Processing', packages: 78, capacity: 80, status: 'high' },
  { name: 'Zone C - Outbound', packages: 32, capacity: 100, status: 'normal' },
  { name: 'Zone D - Hold', packages: 12, capacity: 50, status: 'low' }
]

const agingPackages = [
  { reference: 'SHP-IMF-2512-0089', customer: 'ABC Corp', days: 5, zone: 'Zone D' },
  { reference: 'SHP-IMF-2512-0076', customer: 'XYZ Logistics', days: 4, zone: 'Zone D' },
  { reference: 'SHP-IMF-2512-0092', customer: 'Metro Express', days: 3, zone: 'Zone B' }
]

export default function InventoryPage() {
  return (
    <PageLayout
      title='Inventory'
      description='Warehouse inventory and zone management'
    >
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Packages'
          value='167'
          icon={PackageIcon}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title='Warehouse Capacity'
          value='51%'
          icon={WarehouseIcon}
        />
        <StatCard
          title='Avg. Dwell Time'
          value='1.8 days'
          icon={ClockIcon}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title='Aging Packages'
          value='3'
          icon={AlertTriangleIcon}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Zone Capacity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {zones.map(zone => {
              const percentage = (zone.packages / zone.capacity) * 100
              const getColor = () => {
                if (percentage >= 90) return 'bg-rose-500'
                if (percentage >= 70) return 'bg-amber-500'
                return 'bg-emerald-500'
              }

              return (
                <div key={zone.name} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>{zone.name}</span>
                    <span className='text-sm text-muted-foreground'>
                      {zone.packages} / {zone.capacity}
                    </span>
                  </div>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
                    <div
                      className={`h-full rounded-full transition-all ${getColor()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aging Packages (&gt;48h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {agingPackages.map(pkg => (
                <div
                  key={pkg.reference}
                  className='flex items-center justify-between rounded-lg border border-border p-3'
                >
                  <div>
                    <p className='font-mono text-sm font-medium'>{pkg.reference}</p>
                    <p className='text-sm text-muted-foreground'>{pkg.customer}</p>
                  </div>
                  <div className='text-right'>
                    <Badge
                      variant='outline'
                      className={
                        pkg.days >= 5
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : pkg.days >= 3
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }
                    >
                      {pkg.days} days
                    </Badge>
                    <p className='mt-1 text-xs text-muted-foreground'>{pkg.zone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
