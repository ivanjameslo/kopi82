'use server'

import prisma from '@/lib/db'
import { startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns'

export type TimeFrame = 'monthly' | 'yearly' | 'all-time'

interface SalesData {
    month: string
    sales: number
    expenses: number
    netTotal: number
}

interface TopSellingItem {
    name: string
    quantity: number
}

interface ProductSold {
    name: string
    price: number
}

export async function fetchYearlySalesData(year: number): Promise<SalesData[]> {
    const startDate = startOfYear(new Date(year, 0, 1))
    const endDate = endOfYear(new Date(year, 0, 1))

    const orders = await prisma.order.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            order_details: {
                include: {
                    product: true,
                },
            },
        },
    })

    const monthlyData: Record<string, SalesData> = {}

    // Initialize all months
    for (let i = 0; i < 12; i++) {
        const month = new Date(year, i).toLocaleString('default', { month: 'short' })
        monthlyData[month] = {
            month,
            sales: 0,
            expenses: 0,
            netTotal: 0,
        }
    }

    // Calculate sales and expenses
    orders.forEach((order) => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' })
        const sales = order.order_details.reduce(
            (acc, detail) => acc + detail.quantity * detail.product.singlePrice,
            0
        )
        const expenses = order.order_details.reduce(
            (acc, detail) => acc + detail.quantity * detail.product.hotPrice,
            0
        )

        monthlyData[month].sales += sales
        monthlyData[month].expenses += expenses
        monthlyData[month].netTotal = monthlyData[month].sales - monthlyData[month].expenses
    })

    return Object.values(monthlyData)
}

export async function fetchTopSellingItems(): Promise<TopSellingItem[]> {
    const items = await prisma.order_details.groupBy({
        by: ['product_id'],
        _sum: {
            quantity: true,
        },
        take: 5,
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
    })

    const topItems = await Promise.all(
        items.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { product_id: item.product_id },
            })
            return {
                name: product?.product_name || 'Unknown',
                quantity: item._sum.quantity || 0,
            }
        })
    )

    return topItems
}

export async function fetchProductsSold(
    timeFrame: TimeFrame,
    page: number = 1,
    limit: number = 10
): Promise<{ products: ProductSold[]; total: number }> {
    let dateFilter = {}

    switch (timeFrame) {
        case 'monthly':
            dateFilter = {
                date: {
                    gte: startOfMonth(new Date()),
                    lte: endOfMonth(new Date()),
                },
            }
            break
        case 'yearly':
            dateFilter = {
                date: {
                    gte: startOfYear(new Date()),
                    lte: endOfYear(new Date()),
                },
            }
            break
    }

    const [products, total] = await Promise.all([
        prisma.order_details.findMany({
            where: dateFilter,
            include: {
                product: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.order_details.count({
            where: dateFilter,
        }),
    ])

    return {
        products: products.map((item) => ({
            name: item.product.product_name,
            price: item.product.singlePrice,
        })),
        total,
    }
}

export async function fetchSalesOverviewData(year: number) {
    const salesData = await fetchYearlySalesData(year)
    const topItems = await fetchTopSellingItems()

    return { salesData, topItems }
}