'use client'

import { useState, useCallback, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ProductSalesDetail } from '@/components/Product-Sales-Detail'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader } from 'lucide-react'
import { fetchSalesData, TimeFrame, SalesData } from '@/app/api/actions/salesactions'
import { CgSpinner } from 'react-icons/cg'

function SkeletonLoader() {
    return (
        <div className="space-y-2 flex items-center justify-center h-screen">
            <CgSpinner className="animate-spin h-6 w-6" />
        </div>
    )
}

function useSalesData() {
    const [activeTab, setActiveTab] = useState<TimeFrame>('today')
    const [data, setData] = useState<SalesData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async (timeFrame: TimeFrame) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await fetchSalesData(timeFrame)
            setData(result.slice(0, 10)) // Limit to top 10 products
        } catch (err) {
            setError('Failed to fetch sales data. Please try again later.')
            console.error('Error fetching sales data:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData(activeTab)
    }, [activeTab, fetchData])

    const handleTabChange = (timeFrame: TimeFrame) => {
        setActiveTab(timeFrame)
    }

    return {
        activeTab,
        handleTabChange,
        data,
        isLoading,
        error,
    }
}

export default function SalesBarChart() {
    const { activeTab, handleTabChange, data, isLoading, error } = useSalesData()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

    const chartConfig = {
        count: {
            label: 'Sales Count',
            color: 'hsl(var(--primary))',
        },
    }

    const handleBarClick = (data: any) => {
        setSelectedProduct(data.product_name)
    }

    return (
        <div className="flex flex-col h-screen p-6">
            {selectedProduct ? (
                <ProductSalesDetail
                    productName={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            ) : (
                <>
                    <div className="mb-4 mt-4 text-center">
                        <CardTitle className='text-3xl text-[#483C32]'>Product Sales Analytics</CardTitle>
                        <CardDescription>Top 10 products purchased (by quantity)</CardDescription>
                    </div>

                    <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as TimeFrame)} className="flex-grow flex flex-col">
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="week">This Week</TabsTrigger>
                            <TabsTrigger value="month">This Month</TabsTrigger>
                            <TabsTrigger value="year">This Year</TabsTrigger>
                        </TabsList>
                        <div className="flex-grow overflow-hidden">
                            {isLoading ? (
                                <SkeletonLoader />
                            ) : error ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="h-full max-h-screen">
                                    <ChartContainer config={chartConfig} className="h-3/4 w-screen">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={data}
                                                layout="vertical"
                                                margin={{
                                                    top: 0,
                                                    right: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="product_name"
                                                    type="category"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={120}
                                                    fontSize={12}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="hsl(var(--primary))"
                                                    radius={[0, 4, 4, 0]}
                                                    onClick={handleBarClick}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            )}
                        </div>
                    </Tabs>
                </>
            )}
        </div>
    )
}