'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  MailIcon,
  Trash2Icon,
  Loader2Icon
} from 'lucide-react'
import { customerSchema, type CustomerFormData } from '@/lib/schemas/shipment'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  gst_number: string | null
  credit_limit: number
  customer_type: 'regular' | 'corporate' | 'vip'
  created_at: string
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      reset({
        name: customer.name,
        gst_number: customer.gst_number || '',
        contact_person: customer.name,
        contact_email: customer.email || '',
        contact_phone: customer.phone,
        billing_address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
        credit_limit: customer.credit_limit,
      })
    } else {
      setEditingCustomer(null)
      reset({
        name: '',
        gst_number: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        billing_address: '',
        city: '',
        state: '',
        pincode: '',
        credit_limit: 0,
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    try {
      const url = editingCustomer ? '/api/customers' : '/api/customers'
      const method = editingCustomer ? 'PUT' : 'POST'
      const body = editingCustomer ? { ...data, id: editingCustomer.id } : data

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to save customer')

      toast.success(editingCustomer ? 'Customer updated' : 'Customer created')
      setIsDialogOpen(false)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to save customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCustomer) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/customers?id=${deletingCustomer.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete customer')
      toast.success('Customer deleted')
      setIsDeleteDialogOpen(false)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to delete customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <PageLayout
      title='Customers'
      description='Manage your customer database'
      actions={
        <Button onClick={() => handleOpenDialog()} className='btn-primary'>
          <PlusIcon className='mr-2 size-4' />
          Add Customer
        </Button>
      }
    >
      {loading ? (
        <Card className='p-12 flex items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-primary' />
        </Card>
      ) : (
      <Card className='p-0'>
        <div className='flex items-center gap-4 border-b border-border p-4'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search customers...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className='hidden md:table-cell'>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead className='hidden sm:table-cell'>Credit Limit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-9'>
                      <AvatarFallback className='bg-primary/10 text-primary text-xs'>
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{customer.name}</p>
                      <p className='text-sm text-muted-foreground'>{customer.gst_number || 'No GST'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <p className='text-sm'>{customer.email || 'No email'}</p>
                  <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                </TableCell>
                <TableCell>{customer.city || 'N/A'}</TableCell>
                <TableCell className='hidden sm:table-cell'>{formatCurrency(customer.credit_limit)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    customer.customer_type === 'vip'
                      ? 'bg-purple-500/10 text-purple-500'
                      : customer.customer_type === 'corporate'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
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
                      <DropdownMenuItem onClick={() => handleOpenDialog(customer)}>
                        <EditIcon className='mr-2 size-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setDeletingCustomer(customer); setIsDeleteDialogOpen(true); }} className='text-destructive focus:text-destructive'>
                        <Trash2Icon className='mr-2 size-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? 'Update customer information' : 'Create a new customer account'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Company Name *</Label>
                <Input id='name' {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className='text-xs text-destructive'>{errors.name.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='gst_number'>GST Number</Label>
                <Input id='gst_number' {...register('gst_number')} className={errors.gst_number ? 'border-destructive' : ''} />
                {errors.gst_number && <p className='text-xs text-destructive'>{errors.gst_number.message}</p>}
              </div>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='contact_person'>Contact Person *</Label>
                <Input id='contact_person' {...register('contact_person')} className={errors.contact_person ? 'border-destructive' : ''} />
                {errors.contact_person && <p className='text-xs text-destructive'>{errors.contact_person.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='contact_email'>Email *</Label>
                <Input id='contact_email' type='email' {...register('contact_email')} className={errors.contact_email ? 'border-destructive' : ''} />
                {errors.contact_email && <p className='text-xs text-destructive'>{errors.contact_email.message}</p>}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='contact_phone'>Phone *</Label>
              <Input id='contact_phone' placeholder='+919876543210' {...register('contact_phone')} className={errors.contact_phone ? 'border-destructive' : ''} />
              {errors.contact_phone && <p className='text-xs text-destructive'>{errors.contact_phone.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='billing_address'>Billing Address *</Label>
              <Textarea id='billing_address' rows={3} {...register('billing_address')} className={errors.billing_address ? 'border-destructive' : ''} />
              {errors.billing_address && <p className='text-xs text-destructive'>{errors.billing_address.message}</p>}
            </div>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='city'>City *</Label>
                <Input id='city' {...register('city')} className={errors.city ? 'border-destructive' : ''} />
                {errors.city && <p className='text-xs text-destructive'>{errors.city.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>State *</Label>
                <Input id='state' {...register('state')} className={errors.state ? 'border-destructive' : ''} />
                {errors.state && <p className='text-xs text-destructive'>{errors.state.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='pincode'>Pincode *</Label>
                <Input id='pincode' {...register('pincode')} className={errors.pincode ? 'border-destructive' : ''} />
                {errors.pincode && <p className='text-xs text-destructive'>{errors.pincode.message}</p>}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='credit_limit'>Credit Limit (₹)</Label>
              <Input id='credit_limit' type='number' step='0.01' {...register('credit_limit', { valueAsNumber: true })} className={errors.credit_limit ? 'border-destructive' : ''} />
              {errors.credit_limit && <p className='text-xs text-destructive'>{errors.credit_limit.message}</p>}
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type='submit' disabled={isSubmitting} className='btn-primary'>
                {isSubmitting ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Saving...</> : (editingCustomer ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingCustomer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2Icon className='mr-2 size-4 animate-spin' />Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
