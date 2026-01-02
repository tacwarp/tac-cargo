import { ChevronDownIcon, ChevronUpIcon, EllipsisVerticalIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const listItems = ['Share', 'Update', 'Refresh']

type Props = {
  title: string
  earning: number
  trend: 'up' | 'down'
  percentage: number
  comparisonText: string
  earningData: {
    img?: string
    icon?: ReactNode
    platform: string
    technologies: string
    earnings: string
    progressPercentage: number
  }[]
  className?: string
}

const TotalEarningCard = ({ earningData, title, earning, trend, percentage, comparisonText, className }: Props) => {
  return (
    <Card className={cn("glass-card border-none shadow-none noise-overlay relative overflow-hidden", className)}>
      <CardHeader className='flex flex-row items-center justify-between pb-4 border-b border-border/10'>
        <div className="flex flex-col gap-0.5">
          <span className='text-xs font-bold uppercase tracking-widest text-foreground'>{title}</span>
          <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60'>Revenue Overview</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='text-muted-foreground size-8 rounded-md hover:bg-primary/10'>
              <EllipsisVerticalIcon className="size-4" />
              <span className='sr-only'>Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className="glass-intense border-white/10 noise-overlay">
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem key={index} className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10 transition-colors">{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-8 pt-6'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <span className='text-kpi text-4xl font-black tracking-tighter text-foreground'>₹{earning.toLocaleString()}</span>
            <span className={cn(
              'flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border border-white/10',
              trend === 'up'
                ? 'text-success bg-success/10'
                : 'text-destructive bg-destructive/10'
            )}>
              {trend === 'up' ? <ChevronUpIcon className='size-3' /> : <ChevronDownIcon className='size-3' />}
              <span>{percentage}%</span>
            </span>
          </div>
          <span className='text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest'>{comparisonText}</span>
        </div>
        <div className='flex flex-1 flex-col justify-evenly gap-3'>
          {earningData.map((earning, index) => (
            <div key={index} className='flex items-center justify-between gap-4 p-3 rounded border border-transparent hover:border-border/10 hover:bg-primary/[0.02] transition-all group'>
              <div className='flex items-center gap-4'>
                <Avatar className='size-10 rounded-md border border-white/10'>
                  <AvatarFallback className='bg-secondary dark:bg-card shrink-0 rounded-md text-primary shadow-sm transition-transform group-hover:scale-105'>
                    {earning.icon ? (
                      earning.icon
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={earning.img} alt={earning.platform} className='size-5 grayscale invert brightness-200' />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1'>
                  <span className='font-bold text-xs tracking-tight text-foreground uppercase'>{earning.platform}</span>
                  <span className='text-muted-foreground/50 text-[9px] font-bold uppercase tracking-[0.15em]'>{earning.technologies}</span>
                </div>
              </div>
              <div className='space-y-2 flex-1 max-w-[120px] text-right'>
                <p className='text-kpi text-xs font-bold text-foreground'>{earning.earnings}</p>
                <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                  <Progress value={earning.progressPercentage} className='h-full bg-primary shadow-glow-primary/20 transition-all' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalEarningCard
