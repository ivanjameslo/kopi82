"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type SalesData = {
    product_name: string
    count: number
}

type TimeFrame = "today" | "week" | "month" | "year"

type Product = {
    product_id: number
    product_name: string
}

type OrderDetail = {
    order_id: number
    product_id: number
    quantity: number
}

type Order = {
    order_id: number
    date: string
}

export default function ProductSalesChart() {
    const [chartData, setChartData] = useState<Record<TimeFrame, SalesData[]>>({
        today: [],
        week: [],
        month: [],
        year: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<TimeFrame>("today")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderDetailsResponse, productsResponse, ordersResponse] = await Promise.all([
                    fetch('/api/order_details'),
                    fetch('/api/product'),
                    fetch('/api/order')
                ])

                const orderDetails: OrderDetail[] = await orderDetailsResponse.json()
                const products: Product[] = await productsResponse.json()
                const orders: Order[] = await ordersResponse.json()

                console.log("API Responses:", { orderDetails, products, orders })

                if (orderDetails.length === 0) {
                    setError("No order data available. The chart cannot be displayed.")
                    setIsLoading(false)
                    return
                }

                if (products.length === 0 || orders.length === 0) {
                    throw new Error("Product or order data is missing")
                }

                // Create a map of product_id to product_name
                const productNames = products.reduce((acc: Record<number, string>, product: Product) => {
                    acc[product.product_id] = product.product_name
                    return acc
                }, {})

                // Process data for each time frame
                const now = new Date()
                const timeFrames: TimeFrame[] = ["today", "week", "month", "year"]
                const processedData: Record<TimeFrame, Record<string, number>> = {
                    today: {},
                    week: {},
                    month: {},
                    year: {},
                }

                orderDetails.forEach((detail: OrderDetail) => {
                    const order = orders.find(o => o.order_id === detail.order_id)
                    if (!order) {
                        console.warn("No matching order found for order_id: ${detail.order_id}")
                        return
                    }

                    const productName = productNames[detail.product_id]
                    if (!productName) {
                        console.warn("No product name found for product_id: ${detail.product_id}")
                        return
                    }

                    timeFrames.forEach((timeFrame) => {
                        let startDate: Date
                        switch (timeFrame) {
                            case "today":
                                startDate = new Date(now.setHours(0, 0, 0, 0))
                                break
                            case "week":
                                startDate = startOfWeek(now)
                                break
                            case "month":
                                startDate = startOfMonth(now)
                                break
                            case "year":
                                startDate = startOfYear(now)
                                break
                        }
                        if (new Date(order.date) >= startDate) {
                            processedData[timeFrame][productName] = (processedData[timeFrame][productName] || 0) + detail.quantity
                        }
                    })
                })

                // Convert to array format for the chart and sort by count
                const chartData: Record<TimeFrame, SalesData[]> = {} as Record<TimeFrame, SalesData[]>
                timeFrames.forEach((timeFrame) => {
                    chartData[timeFrame] = Object.entries(processedData[timeFrame])
                        .map(([product_name, count]) => ({ product_name, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 10) // Limit to top 10 products for better visibility
                })

                setChartData(chartData)
                setIsLoading(false)
            } catch (err) {
                console.error("Error fetching or processing data:", err)
                setError("Failed to load data. Please try again later.")
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) return <div>Loading...</div>
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    const chartConfig = {
        count: {
            label: "Sales Count",
            color: "hsl(var(--chart-1))",
        },
    }

    return (
        <Card className="w-fill ">
            <CardHeader>
                <CardTitle>Product Sales Analytics</CardTitle>
                <CardDescription>Top 10 products purchased (by quantity)</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="today" onValueChange={(value) => setActiveTab(value as TimeFrame)}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="week">This Week</TabsTrigger>
                        <TabsTrigger value="month">This Month</TabsTrigger>
                        <TabsTrigger value="year">This Year</TabsTrigger>
                    </TabsList>
                    <div className="mt-4">
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData[activeTab]}
                                    layout="vertical"
                                    margin={{
                                        left: -20,
                                    }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="product_name" type="category" tickLine={false} axisLine={false} width={120} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={5} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    )
}