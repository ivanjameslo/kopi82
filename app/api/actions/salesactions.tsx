'use server'

import prisma from '@/lib/db'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfMonth, format } from 'date-fns'

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

interface ProductSalesDetail {
    date: string;
    quantity: number;
}

export async function fetchProductSalesDetail(
    productName: string,
    timeView: 'month' | 'monthly' | 'yearly',
    selectedMonth?: string
): Promise<ProductSalesDetail[]> {
    const product = await prisma.product.findFirst({
        where: { product_name: productName }
    })

    if (!product) return []

    const currentYear = new Date().getFullYear()

    switch (timeView) {
        case 'month': {
            const startDate = new Date(currentYear, parseInt(selectedMonth || '0'), 1)
            const endDate = endOfMonth(startDate)

            const dailyData = await prisma.order_details.groupBy({
                by: ['date'],
                where: {
                    product_id: product.product_id,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _sum: {
                    quantity: true
                },
            })

            return dailyData.map(item => ({
                date: format(item.date, 'yyyy-MM-dd'),
                quantity: item._sum.quantity || 0,
            }))
        }

        case 'monthly': {
            const startDate = startOfYear(new Date())
            const monthlyData = await prisma.order_details.findMany({
                where: {
                    product_id: product.product_id,
                    date: {
                        gte: startDate,
                    },
                },
                select: {
                    date: true,
                    quantity: true,
                },
            })

            // Aggregate by month
            const monthlyAggregated = monthlyData.reduce((acc, { date, quantity }) => {
                const monthKey = format(date, 'yyyy-MM')
                acc[monthKey] = (acc[monthKey] || 0) + quantity
                return acc
            }, {} as Record<string, number>)

            return Object.entries(monthlyAggregated)
                .map(([date, quantity]) => ({ date, quantity }))
                .sort((a, b) => a.date.localeCompare(b.date))
        }

        case 'yearly': {
            const yearlyData = await prisma.order_details.findMany({
                where: {
                    product_id: product.product_id,
                },
                select: {
                    date: true,
                    quantity: true,
                },
            })

            // Aggregate by year
            const yearlyAggregated = yearlyData.reduce((acc, { date, quantity }) => {
                const year = date.getFullYear().toString()
                acc[year] = (acc[year] || 0) + quantity
                return acc
            }, {} as Record<string, number>)

            return Object.entries(yearlyAggregated)
                .map(([date, quantity]) => ({ date, quantity }))
                .sort((a, b) => a.date.localeCompare(b.date))
        }
    }
}