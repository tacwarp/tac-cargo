'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Trash2Icon
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  totalShipments: number
  totalSpent: number
  status: 'active' | 'inactive'
}

const customers: Customer[] = [
  { id: '1', name: 'Rajesh Kumar', company: 'ABC Corporation', email: 'rajesh@abc.com', phone: '+91 98765 43210', totalShipments: 156, totalSpent: 245000, status: 'active' },
  { id: '2', name: 'Priya Sharma', company: 'XYZ Logistics', email: 'priya@xyz.com', phone: '+91 87654 32109', totalShipments: 89, totalSpent: 125000, status: 'active' },
  { id: '3', name: 'Amit Singh', company: 'Metro Express', email: 'amit@metro.com', phone: '+91 76543 21098', totalShipments: 234, totalSpent: 380000, status: 'active' },
  { id: '4', name: 'Neha Patel', company: 'Quick Ship Co', email: 'neha@quickship.com', phone: '+91 65432 10987', totalShipments: 45, totalSpent: 68000, status: 'inactive' },
  { id: '5', name: 'Vikram Reddy', company: 'Prime Cargo', email: 'vikram@primecargo.com', phone: '+91 54321 09876', totalShipments: 178, totalSpent: 295000, status: 'active' },
  { id: '6', name: 'Anita Das', company: 'Fast Freight', email: 'anita@fastfreight.com', phone: '+91 43210 98765', totalShipments: 67, totalSpent: 98000, status: 'active' }
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <Button>
          <PlusIcon className='mr-2 size-4' />
          Add Customer
        </Button>
      }
    >
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
              <TableHead>Shipments</TableHead>
              <TableHead className='hidden sm:table-cell'>Total Spent</TableHead>
              <TableHead>Status</TableHead>
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
                      <p className='text-sm text-muted-foreground'>{customer.company}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <p className='text-sm'>{customer.email}</p>
                  <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                </TableCell>
                <TableCell>{customer.totalShipments}</TableCell>
                <TableCell className='hidden sm:table-cell'>{formatCurrency(customer.totalSpent)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    customer.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EditIcon className='mr-2 size-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MailIcon className='mr-2 size-4' />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive focus:text-destructive'>
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
    </PageLayout>
  )
}
