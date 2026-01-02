'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ChevronRightIcon, PackageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RiPulseLine } from '@remixicon/react'

import { cn } from '@/lib/utils'

const ProductInsightsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("glass-card border-none shadow-none noise-overlay overflow-hidden relative", className)}>
      <CardHeader className='pb-2 border-b border-border/40'>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className='text-xs font-bold uppercase tracking-widest text-foreground'>Hub Performance</span>
            <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-tighter opacity-70'>Region: Imphal Hub • SYSLOG_MAY_25</span>
          </div>
          <RiPulseLine className="size-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-8 pt-6'>
        <div className="flex items-center justify-between">
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]'>Reliability Index</span>
            <span className='text-kpi text-4xl font-black tracking-tighter text-primary shadow-glow-primary/20'>98.5%</span>
          </div>
          <div className="p-3 bg-secondary dark:bg-card border border-primary/20 rounded-lg text-primary shadow-lg shadow-primary/10">
            <PackageIcon className="size-5" />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]'>System Throughput</span>
          <span className='text-kpi text-2xl font-bold'>2,123 <span className="text-[10px] font-medium tracking-normal text-muted-foreground/40 uppercase ml-1">Manifests</span></span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className='text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]'>Capacity Load</span>
            <span className="text-kpi text-sm font-bold text-foreground">87%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden border border-border/20" role="progressbar" aria-valuenow={87} aria-valuemin={0} aria-valuemax={100} aria-label="Capacity load">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary w-[87%]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant='outline' className='w-full h-9 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 border-border/40 transition-all'>
          Access Detailed Telemetry
          <ChevronRightIcon className='size-3 ml-2 opacity-60' />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductInsightsCard
