"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Product = {
    name: string
    price: number
    date: Date
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "PHP",
            }).format(price)
            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const price = row.original.date
            const formatted = price.toLocaleString()
            return <div className="text-right font-medium">{formatted}</div>
        },
    },

]

