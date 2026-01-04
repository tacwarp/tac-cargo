'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertTriangleIcon,
  MoreVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  ClockIcon,
  PlusIcon,
  Loader2Icon
} from 'lucide-react'

interface Exception {
  id: string
  shipment_id: string
  shipment?: { reference: string; consignee_name: string }
  exception_type: string
  description: string
  status: 'open' | 'investigating' | 'resolved'
  priority: 'high' | 'medium' | 'low'
  resolution_notes?: string | null
  created_at: string
  resolved_at?: string | null
}

const typeLabels = {
  delayed: 'Delayed',
  damaged: 'Damaged',
  lost: 'Lost',
  address_issue: 'Address Issue'
}

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-primary/10 text-primary border-primary/20'
}

const statusStyles = {
  open: 'bg-destructive/10 text-destructive border-destructive/20',
  investigating: 'bg-warning/10 text-warning border-warning/20',
  resolved: 'bg-success/10 text-success border-success/20'
}

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [resolveOpen, setResolveOpen] = useState(false)
  const [selectedException, setSelectedException] = useState<Exception | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    shipment_id: '',
    exception_type: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  const [resolveNotes, setResolveNotes] = useState('')

  const fetchExceptions = async () => {
    try {
      const response = await fetch('/api/exceptions')
      if (!response.ok) throw new Error('Failed to fetch exceptions')
      const data = await response.json()
      setExceptions(data.exceptions || [])
    } catch (error) {
      toast.error('Failed to load exceptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExceptions()
  }, [])

  const handleCreate = async () => {
    if (!formData.shipment_id || !formData.exception_type || !formData.description) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create exception')

      toast.success('Exception created successfully')
      setCreateOpen(false)
      setFormData({ shipment_id: '', exception_type: '', description: '', priority: 'medium' })
      fetchExceptions()
    } catch (error) {
      toast.error('Failed to create exception')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResolve = async () => {
    if (!selectedException) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/exceptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedException.id,
          status: 'resolved',
          resolution_notes: resolveNotes,
        }),
      })

      if (!response.ok) throw new Error('Failed to resolve exception')

      toast.success('Exception resolved successfully')
      setResolveOpen(false)
      setSelectedException(null)
      setResolveNotes('')
      fetchExceptions()
    } catch (error) {
      toast.error('Failed to resolve exception')
    } finally {
      setSubmitting(false)
    }
  }

  const stats = {
    open: exceptions.filter(e => e.status === 'open').length,
    investigating: exceptions.filter(e => e.status === 'investigating').length,
    resolved: exceptions.filter(e => e.status === 'resolved').length,
  }

  return (
    <PageLayout
      title='Exceptions'
      description='Manage shipment issues and exceptions'
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon className='mr-2 size-4' />
          Report Exception
        </Button>
      }
    >
      {loading ? (
        <Card className='p-12 flex items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-primary' />
        </Card>
      ) : (
      <>
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Open Issues</CardTitle>
            <AlertTriangleIcon className='size-4 text-destructive' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.open}</p>
            <p className='text-xs text-muted-foreground'>Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Investigating</CardTitle>
            <ClockIcon className='size-4 text-warning' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.investigating}</p>
            <p className='text-xs text-muted-foreground'>In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Resolved</CardTitle>
            <CheckCircleIcon className='size-4 text-success' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.resolved}</p>
            <p className='text-xs text-muted-foreground'>Closed successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total</CardTitle>
            <ClockIcon className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{exceptions.length}</p>
            <p className='text-xs text-muted-foreground'>All exceptions</p>
          </CardContent>
        </Card>
      </div>

      <Card className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className='hidden md:table-cell'>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                  No exceptions found
                </TableCell>
              </TableRow>
            ) : (
              exceptions.map(exception => (
                <TableRow key={exception.id}>
                  <TableCell className='font-mono text-sm'>
                    {exception.shipment?.reference || 'N/A'}
                  </TableCell>
                  <TableCell className='capitalize'>{exception.exception_type.replaceAll('_', ' ')}</TableCell>
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
                        {exception.status !== 'resolved' && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedException(exception)
                            setResolveOpen(true)
                          }}>
                            <CheckCircleIcon className='mr-2 size-4' />
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      </>
      )}

      {/* Create Exception Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Exception</DialogTitle>
            <DialogDescription>
              Create a new exception for a shipment issue
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='shipment_id'>Shipment ID</Label>
              <Input
                id='shipment_id'
                value={formData.shipment_id}
                onChange={e => setFormData({ ...formData, shipment_id: e.target.value })}
                placeholder='Enter shipment UUID'
              />
            </div>
            <div>
              <Label htmlFor='exception_type'>Exception Type</Label>
              <Select
                value={formData.exception_type}
                onValueChange={value => setFormData({ ...formData, exception_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='delayed'>Delayed</SelectItem>
                  <SelectItem value='damaged'>Damaged</SelectItem>
                  <SelectItem value='lost'>Lost</SelectItem>
                  <SelectItem value='address_issue'>Address Issue</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='low'>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder='Describe the issue...'
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Creating...</> : 'Create Exception'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Exception Dialog */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Exception</DialogTitle>
            <DialogDescription>
              Mark this exception as resolved and add resolution notes
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Shipment</Label>
              <p className='text-sm font-mono'>{selectedException?.shipment?.reference}</p>
            </div>
            <div>
              <Label>Exception Type</Label>
              <p className='text-sm capitalize'>{selectedException?.exception_type.replaceAll('_', ' ')}</p>
            </div>
            <div>
              <Label htmlFor='resolution_notes'>Resolution Notes</Label>
              <Textarea
                id='resolution_notes'
                value={resolveNotes}
                onChange={e => setResolveNotes(e.target.value)}
                placeholder='Describe how the issue was resolved...'
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setResolveOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={submitting}>
              {submitting ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Resolving...</> : 'Mark Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
