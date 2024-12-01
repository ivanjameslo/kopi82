'use client'

import { useState, useEffect } from 'react'

interface SalesData {
    month: string
    netTotal: number
}
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Legend, PieChart, Bar, BarChart } from 'recharts'

interface TopSellingItem {
    name: string
    quantity: number
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchYearlySalesData, fetchTopSellingItems, fetchProductsSold, TimeFrame } from '../app/api/actions/salesactions'
import { DataTableTemplate } from './ui/data-table-template'
import { columns } from './Columns-Products-Sold'
import { ProductOrderDetailsTable } from './Product-Order-Details-Table'
import { useSalesData } from '@/lib/hooks/useProducts'
import { CgSpinnerAlt } from 'react-icons/cg'

const COLORS = ['#2D2424', '#5C4033', '#967969', '#C4A484', '#DCD7C9']

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default function SalesOverview() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [salesData, setSalesData] = useState<SalesData[]>([])
    const [topItems, setTopItems] = useState<TopSellingItem[]>([])
    const { data, isLoading, error, year, setYear } = useSalesData()
    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

    const formattedData = data.map((item) => ({
        ...item,
        month: months[item.month - 1],
        total: Number(item.total)
    }))

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Sales Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-destructive">{error}</div>
                </CardContent>
            </Card>
        )
    }

    useEffect(() => {
        const loadTopItems = async () => {
            const items = await fetchTopSellingItems()
            setTopItems(items)
        }
        loadTopItems()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Sales Overview</h1>

            {/* Sales Total Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle>Sales Total</CardTitle>
                    <Select
                        value={year.toString()}
                        onValueChange={(value) => setYear(parseInt(value))}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        {isLoading ? (
                            <div className='flex h-full w-full items-center justify-center'>
                                <CgSpinnerAlt className="animate-spin h-10 w-10 text-center text-[#5C4033]" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={formattedData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs fill-muted-foreground"
                                    />
                                    <YAxis
                                        className="text-xs fill-muted-foreground"
                                        tickFormatter={(value) => `PHP ${value}`}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Month
                                                                </span>
                                                                <span className="font-bold text-muted-foreground">
                                                                    {payload[0].payload.month}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Sales
                                                                </span>
                                                                <span className="font-bold">
                                                                    PHP {payload[0].value}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill='#5C4033'
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                {/* Top Selling Items */}
                <Card className='h-[450px]'>
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topItems}
                                        dataKey="quantity"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                    >
                                        {topItems.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`Quantity: ${value}`, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Sold */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products Sold</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductOrderDetailsTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

