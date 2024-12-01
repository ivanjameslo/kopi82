'use client'

import { useProductOrderDetails } from '@/lib/hooks/useProducts'
import { DataTableTemplate } from './ui/data-table-template'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColumnDef } from '@tanstack/react-table'
import { ProductOrderDetail } from '@/app/api/actions/salesactions'
import { CgSpinnerAlt } from 'react-icons/cg'

const columns: ColumnDef<ProductOrderDetail>[] = [
    {
        accessorKey: 'product_name',
        header: 'Product Name',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
            }).format(price)
            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'))
            return <div>{date.toLocaleString()}</div>
        },
    },
]

export function ProductOrderDetailsTable() {
    const { data, isLoading, timeframe, setTimeframe } = useProductOrderDetails()

    return (
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as typeof timeframe)}>
            <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>
            <TabsContent value={timeframe}>
                {isLoading ? (
                    <div className='flex h-[300px] w-full items-center justify-center'>
                        <CgSpinnerAlt className="animate-spin h-10 w-10 text-center text-[#5C4033]" />
                    </div>
                ) : (
                    <DataTableTemplate searchName='Product' searchValue='product_name' columns={columns} data={data} />
                )}
            </TabsContent>
        </Tabs>
    )
}

