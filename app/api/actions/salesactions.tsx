'use server'

import prisma from '@/lib/db'
import { startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns'

export type TimeFrame = 'today' | 'week' | 'month' | 'year'

export type SalesData = {
    product_name: string
    count: number
}

export async function fetchSalesData(timeFrame: TimeFrame): Promise<SalesData[]> {
    const now = new Date()
    let startDate: Date

    switch (timeFrame) {
        case 'today':
            startDate = startOfDay(now)
            break
        case 'week':
            startDate = startOfWeek(now)
            break
        case 'month':
            startDate = startOfMonth(now)
            break
        case 'year':
            startDate = startOfYear(now)
            break
    }

    const salesData = await prisma.order_details.findMany({
        where: {
            date: {
                gte: startDate,
            },
        },
        include: {
            product: true,
            order: true,
        },
    })

    const productSales = salesData.reduce((acc, detail) => {
        const productName = detail.product.product_name
        acc[productName] = (acc[productName] || 0) + detail.quantity
        return acc
    }, {} as Record<string, number>)

    return Object.entries(productSales)
        .map(([product_name, count]) => ({ product_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
}