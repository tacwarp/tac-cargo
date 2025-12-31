'use client'

import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertTriangleIcon,
  MoreVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  ClockIcon
} from 'lucide-react'

interface Exception {
  id: string
  reference: string
  customer: string
  type: 'delayed' | 'damaged' | 'lost' | 'address_issue'
  description: string
  status: 'open' | 'investigating' | 'resolved'
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

const exceptions: Exception[] = [
  { id: '1', reference: 'SHP-IMF-2512-0007', customer: 'Swift Movers', type: 'delayed', description: 'Package delayed due to weather conditions', status: 'open', priority: 'high', createdAt: '2024-12-28' },
  { id: '2', reference: 'SHP-IMF-2512-0015', customer: 'ABC Corporation', type: 'address_issue', description: 'Incorrect delivery address provided', status: 'investigating', priority: 'medium', createdAt: '2024-12-27' },
  { id: '3', reference: 'SHP-IMF-2512-0023', customer: 'Metro Express', type: 'damaged', description: 'Package damaged during transit', status: 'open', priority: 'high', createdAt: '2024-12-27' }
]

const typeLabels = {
  delayed: 'Delayed',
  damaged: 'Damaged',
  lost: 'Lost',
  address_issue: 'Address Issue'
}

const priorityStyles = {
  high: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
}

const statusStyles = {
  open: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  investigating: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
}

export default function ExceptionsPage() {
  return (
    <PageLayout
      title='Exceptions'
      description='Manage shipment issues and exceptions'
    >
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Open Issues</CardTitle>
            <AlertTriangleIcon className='size-4 text-rose-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>3</p>
            <p className='text-xs text-muted-foreground'>Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Investigating</CardTitle>
            <ClockIcon className='size-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>1</p>
            <p className='text-xs text-muted-foreground'>In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Resolved Today</CardTitle>
            <CheckCircleIcon className='size-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>5</p>
            <p className='text-xs text-muted-foreground'>Closed successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Avg Resolution</CardTitle>
            <ClockIcon className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>4.2h</p>
            <p className='text-xs text-muted-foreground'>Response time</p>
          </CardContent>
        </Card>
      </div>

      <Card className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className='hidden md:table-cell'>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.map(exception => (
              <TableRow key={exception.id}>
                <TableCell className='font-mono text-sm'>{exception.reference}</TableCell>
                <TableCell>{exception.customer}</TableCell>
                <TableCell>{typeLabels[exception.type]}</TableCell>
                <TableCell className='hidden max-w-[200px] truncate md:table-cell'>
                  {exception.description}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyles[exception.priority]}`}>
                    {exception.priority.charAt(0).toUpperCase() + exception.priority.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[exception.status]}`}>
                    {exception.status.charAt(0).toUpperCase() + exception.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVerticalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <EyeIcon className='mr-2 size-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquareIcon className='mr-2 size-4' />
                        Add Note
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircleIcon className='mr-2 size-4' />
                        Mark Resolved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageLayout>
  )
}
