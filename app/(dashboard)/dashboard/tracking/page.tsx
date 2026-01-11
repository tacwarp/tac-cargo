import { PageLayout } from '@/components/layout/page-layout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'

export default function TrackingPage() {
  return (
    <PageLayout title="Tracking" description="Track shipment status in real-time">
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Enter AWB or reference number..." className="pl-9" />
          </div>
          <Button>Track</Button>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          <p>Enter a tracking number to view shipment timeline</p>
        </div>
      </Card>
    </PageLayout>
  )
}
