import { PageLayout } from '@/components/layout/page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScanIcon } from 'lucide-react'

export default function ScanningPage() {
  return (
    <PageLayout title="Barcode Scanner" description="Scan packages for manifest">
      <Card className="p-8 text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-muted">
          <ScanIcon className="size-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Ready to Scan</h3>
        <p className="mt-2 text-sm text-muted-foreground">Click below or use a barcode scanner</p>
        <Button className="mt-6" size="lg">Start Scanning</Button>
      </Card>
    </PageLayout>
  )
}
