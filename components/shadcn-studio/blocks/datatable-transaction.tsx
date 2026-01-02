'use client'

import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'

export type Item = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  amount: number
  status: 'pending' | 'processing' | 'paid' | 'failed'
  paidBy: 'mastercard' | 'visa'
}

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className="relative">
          <Avatar className='size-9 border border-white/10'>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback className='text-[10px] bg-secondary'>{row.original.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
            row.original.status === 'paid' ? "bg-success" : "bg-warning"
          )} />
        </div>
        <div className='flex flex-col'>
          <span className='text-xs font-bold text-foreground tracking-tight'>{row.getValue('name')}</span>
          <span className='text-[10px] text-muted-foreground uppercase tracking-widest opacity-60'>{row.original.email}</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount)

      return <span className="text-kpi text-sm">{formatted}</span>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusClass = {
        paid: 'status-delivered',
        processing: 'status-processing',
        pending: 'status-pending',
        failed: 'status-delayed'
      }[status] || 'status-pending';

      return (
        <Badge className={cn('rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none shadow-none', statusClass)}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'paidBy',
    header: () => <span className='text-[10px] uppercase tracking-widest'>Gateway</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 opacity-80">
        <img
          src={
            row.getValue('paidBy') === 'mastercard'
              ? 'https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png'
              : 'https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png'
          }
          alt='Payment platform'
          className='h-3.5 grayscale invert brightness-200'
        />
        <span className="text-[10px] font-medium text-muted-foreground uppercase">{row.getValue('paidBy')}</span>
      </div>
    )
  },
  {
    id: 'actions',
    header: () => '',
    cell: () => <RowActions />,
    size: 40,
    enableHiding: false
  }
]

const TransactionDatatable = ({ data }: { data: Item[] }) => {
  const pageSize = 5

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2
  })

  return (
    <div className='w-full'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader className="bg-muted/30 relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/10 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em] py-0">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-b border-border/5 hover:bg-primary/[0.02] transition-colors group cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      <div className="transition-transform duration-300 group-hover:translate-x-0.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-xs text-muted-foreground'>
                  NO SYSTEM RECORDS FOUND.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between gap-3 px-6 py-4 border-t border-border/10'>
        <p className='text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest' aria-live='polite'>
          SYSTEM_LOG: <span className="text-muted-foreground">
            {table.getRowCount() === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min(
              table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
              table.getState().pagination.pageSize,
              table.getRowCount()
            )}
          </span> / <span className="text-secondary-foreground">{table.getRowCount().toString()}</span>
        </p>

        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <Button
                size="sm"
                className='h-7 text-[10px] font-bold uppercase border-none hover:bg-primary/10 hover:text-primary transition-all'
                variant={'ghost'}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="size-3 mr-1" />
                PREV
              </Button>
            </PaginationItem>

            {pages.map(page => {
              const isActive = page === table.getState().pagination.pageIndex + 1

              return (
                <PaginationItem key={page}>
                  <Button
                    size='icon'
                    className={cn(
                      "size-7 text-[10px] font-bold border-none transition-all",
                      isActive ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-transparent text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page.toString().padStart(2, '0')}
                  </Button>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <Button
                size="sm"
                className='h-7 text-[10px] font-bold uppercase border-none hover:bg-primary/10 hover:text-primary transition-all'
                variant={'ghost'}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                NEXT
                <ChevronRightIcon className="size-3 ml-1" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default TransactionDatatable

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex'>
          <Button size='icon' variant='ghost' className='rounded-full p-2' aria-label='Edit item'>
            <EllipsisVerticalIcon className='size-5' aria-hidden='true' />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-destructive focus:text-destructive'>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
